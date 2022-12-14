import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const itemRouter = router({
  addItem: publicProcedure
    .input(
      z.object({
        name: z.string().nullish(),
      })
    )
    .mutation(({ input, ctx }) => {
      //   const { name } = input;
      const name: string = input.name ?? "";
      const item = ctx.prisma.shoppingItem.create({
        data: {
          name,
          checked: false,
        },
      });
      return item;
    }),
  getAllItems: publicProcedure.query(({ ctx }) => {
    const items = ctx.prisma.shoppingItem.findMany();
    return items;
  }),

  deleteItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { id } = input;
      const item = ctx.prisma.shoppingItem.delete({
        where: {
          id,
        },
      });

      return item;
    }),

  toggleCheck: publicProcedure
    .input(
      z.object({
        id: z.string(),
        checked: z.boolean(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { id, checked } = input;
      const item = ctx.prisma.shoppingItem.update({
        where: {
          id,
        },
        data: {
          checked,
        },
      });
      return item;
    }),
});

export type ItemRouter = typeof itemRouter;
