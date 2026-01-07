import { cards, type Card, type InsertCard } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getCards(): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, card: Partial<InsertCard>): Promise<Card | undefined>;
  deleteCard(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getCards(): Promise<Card[]> {
    return await db.select().from(cards).orderBy(desc(cards.createdAt));
  }

  async getCard(id: string): Promise<Card | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    return card;
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const [card] = await db.insert(cards).values(insertCard).returning();
    return card;
  }

  async updateCard(id: string, updateCard: Partial<InsertCard>): Promise<Card | undefined> {
    const [card] = await db
      .update(cards)
      .set(updateCard)
      .where(eq(cards.id, id))
      .returning();
    return card;
  }

  async deleteCard(id: string): Promise<boolean> {
    const [deleted] = await db.delete(cards).where(eq(cards.id, id)).returning();
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();
