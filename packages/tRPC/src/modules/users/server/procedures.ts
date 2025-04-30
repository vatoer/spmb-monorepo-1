import { baseProcedure, createTRPCRouter } from "@repo/trpc/init";

export const usersRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ()=>{
        return [{"hello": "world"}]
    }),
})