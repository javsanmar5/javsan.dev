import  { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    link: z.string().url(),
  }),
});

export const collections = {
    projects,
}

