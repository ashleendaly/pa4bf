import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { groupMembership, groupOwnership, group } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  join: publicProcedure
    .input(
        z.object({
            userId: z.string(),
            groupId: z.number().int(),
            inviteCode: z.string()
        })
    )
    .mutation(async ({ ctx, input: { userId, groupId, inviteCode } }) =>{
        const alreadyIn = await ctx.db.select().from(groupMembership).where(and(eq(groupMembership.userId, userId), eq(groupMembership.groupId, groupId)))
        if(alreadyIn.length !== 0){
            return
        }
        const validCode = await ctx.db.select().from(group).where(eq(group.inviteCode, inviteCode))
        if(validCode.length === 0){
            return
        }
        await ctx.db.insert(groupMembership).values({ groupId, userId })
    }),

  leave: publicProcedure
    .input(
        z.object({
            userId: z.string(),
            groupId: z.number().int()
        })
    )
    .mutation(async ({ ctx, input: { userId, groupId } }) =>{
        const isMember = await ctx.db.select().from(groupMembership).where(and(eq(groupMembership.userId, userId), eq(groupMembership.groupId, groupId)))
        const isOwner = await ctx.db.select().from(groupOwnership).where(and(eq(groupOwnership.userId, userId), eq(groupOwnership.groupId, groupId)))
        if((isMember.length !== 0) && (isOwner.length === 0)){
            return
        }
        await ctx.db.delete(groupMembership).where(and(eq(groupMembership.userId, userId), eq(groupMembership.groupId, groupId)))
    }),

  view: publicProcedure
    .input(
        z.object({
            userId: z.string(),
            groupId: z.number().int()
        })
    )
    .mutation(async ({ ctx, input: { userId, groupId } }) =>{
        const isMember = await ctx.db.select().from(groupMembership).where(and(eq(groupMembership.userId, userId), eq(groupMembership.groupId, groupId)))
        if(isMember.length === 0){
            return false
        }
        return true
    })

    //join group
    //leave group
    //view group
});