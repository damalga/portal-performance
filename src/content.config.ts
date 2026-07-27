import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const preguntaSchema = z.object({
  pregunta: z.string(),
  opciones: z.array(z.string()).length(5),
  correcta: z.number().int().min(0).max(4),
});

const ejercicios = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/ejercicios" }),
  schema: z.object({
    titulo: z.string(),
    orden: z.number().int().positive(),
    categoria: z.enum(["dom", "eventos", "datos", "metricas"]),
    resumen: z.string(),
    conceptos: z.array(z.string()).min(1),
    dificultad: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    minutos: z.number().int().positive(),
    quiz: z.array(preguntaSchema).length(5),
  }),
});

export const collections = { ejercicios };
