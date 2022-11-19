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
});

export type ItemRouter = typeof itemRouter;
