import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cards = pgTable("cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  text: text("text").notNull(),
  region: text("region").notNull(),
  sector: text("sector").notNull(),
  author: text("author").notNull(),
  imageUrl: text("image_url").default(""),
  isBase: boolean("is_base").notNull().default(false),
  isPlainEnglish: boolean("is_plain_english").notNull().default(false),
  versions: text("versions").array().notNull().default([]),
  cardDate: text("card_date").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
  createdAt: true,
});

export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;
