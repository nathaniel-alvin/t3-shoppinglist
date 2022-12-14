import type { ShoppingItem } from "@prisma/client";
import { motion } from "framer-motion";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import ItemModal from "../components/ItemModal";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<ShoppingItem[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // const {} = trpc.item.addItem.useMutation({
  //   onSuccess: (item) => {
  //     setItems((prev) => [...prev, item]);
  //   },
  // });

  // First argument is the input
  const { data: itemData, isLoading } = trpc.item.getAllItems.useQuery(
    undefined,
    {
      onSuccess: (shoppingItems) => {
        setItems(shoppingItems);
        const checked = shoppingItems.filter((item) => item.checked);
        setCheckedItems(checked);
      }
    }
  );

  const { mutate: deleteItem } = trpc.item.deleteItem.useMutation({
    onSuccess(shoppingItem) {
      setItems((prev) => prev.filter((item) => item.id !== shoppingItem.id));
    }
  });

  const { mutate: toggleCheck } = trpc.item.toggleCheck.useMutation({
    onSuccess(shoppingItem) {
      // check if item is already checked
      if (checkedItems.some((item) => item.id === shoppingItem.id)) {
        // remove it from the current items
        setCheckedItems((prev) =>
          prev.filter((item) => item.id !== shoppingItem.id)
        );
      } else {
        // add it to the checked items
        setCheckedItems((prev) => [...prev, shoppingItem]);
      }
    }
  });

  if (!itemData || isLoading) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Shopping List </title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {modalOpen && (
        <ItemModal setModalOpen={setModalOpen} setItems={setItems} />
      )}
      <main className='mx-auto my-12 max-w-3xl'>
        <div className='flex justify-between'>
          <h2 className='text-2xl font-semibold'>Shopping List</h2>
          <button
            type='button'
            onClick={() => setModalOpen(true)}
            className='ml-2 rounded bg-blue-500 p-2 text-sm font-bold text-white hover:bg-blue-600'
          >
            Add list
          </button>
        </div>
        <ul className='mt-4'>
          {items.map((item) => {
            const { id, name } = item;
            return (
              <li key={id} className='flex w-full items-center justify-between'>
                <div className='relative'>
                  <div className='pointer-events-none absolute inset-0 flex origin-left items-center justify-center'>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: checkedItems.some((item) => item.id === id)
                          ? "100%"
                          : 0
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className='h-[2px] w-full translate-y-px bg-red-500'
                    />
                  </div>
                  <span
                    onClick={() =>
                      toggleCheck({
                        id,
                        checked: checkedItems.some((item) => item.id === id)
                          ? false
                          : true
                      })
                    }
                  >
                    {name}
                  </span>
                </div>
                <HiX
                  onClick={() => deleteItem({ id })}
                  className='cursor-pointer text-lg text-red-500'
                ></HiX>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
};

export default Home;
