import { z } from "zod";

export const noteSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200),
  content: z.string().max(20000),
  projectId: z.string().cuid().nullable(),
  tags: z.array(z.string().min(1).max(40)),
  pinned: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Note = z.infer<typeof noteSchema>;

export const createNoteSchema = noteSchema
  .pick({
    title: true,
    content: true,
    projectId: true,
    tags: true,
  })
  .extend({
    pinned: z.boolean().optional(),
  });

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = createNoteSchema.partial();

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
