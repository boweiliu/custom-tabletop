import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cards: defineTable({
    id: v.string(),
    text: v.string(),
    gridPosition: v.object({
      x: v.number(),
      y: v.number(),
    }),
  }),
});