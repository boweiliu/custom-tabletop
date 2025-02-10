import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    return tasks.map((task) => ({ ...task, assigner: "tom" }));
  },
});

export const testUpdate = mutation({
  args: {
  },
  handler: async (ctx, args) => {
    // first, query all the tasks
    const tasks = await ctx.db.query("tasks").collect();

    // now append "x" to the text of each task
    await Promise.all(tasks.map((task) => {
      return ctx.db.patch(task._id, { text: task.text + "x" });
    }))
  },
});