import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUid = query({
  args: {
    uid: v.id("cards"),
  },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.uid);
    return card;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const cards = await ctx.db.query("cards").collect();
    return cards;
  },
});

export const updateCardByUid = mutation({
  args: {
    uid: v.id("cards"),
    card: v.object({
      id: v.string(),
      text: v.string(),
      gridPosition: v.object({
        x: v.number(),
        y: v.number(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.uid, args.card);
    return args.card;
  },
});

export const insertCard = mutation({
  args: {
    card: v.object({
      id: v.string(),
      text: v.string(),
      gridPosition: v.object({
        x: v.number(),
        y: v.number(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const cardUid = await ctx.db.insert("cards", args.card);
    return cardUid;
  },
});

export const upsertCardById = mutation({
  args: {
    card: v.object({
      id: v.string(),
      text: v.string(),
      gridPosition: v.object({
        x: v.number(),
        y: v.number(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    // first find the card by id
    const card = await ctx.db
      .query("cards")
      .withIndex("my_id", (q) => q.eq("id", args.card.id)).unique();
    if (!card) {
      // insert it
      return await ctx.db.insert("cards", args.card);
    } else {
      // update it
      await ctx.db.patch(card._id, args.card);
      return card._id;
    }
  },
});