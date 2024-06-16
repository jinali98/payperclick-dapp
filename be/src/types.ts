import z from "zod";

export const createTaskInputType = z.object({
  title: z.string(),
  options: z.array(z.object({ imageUrl: z.string() })),
  signature: z.string(),
});
