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
    try {
      const allCards = await db.select().from(cards).orderBy(desc(cards.createdAt));
      if (allCards.length === 0) {
        await this.seed();
        return await db.select().from(cards).orderBy(desc(cards.createdAt));
      }
      return allCards;
    } catch (error) {
      console.error("Error in getCards:", error);
      throw error;
    }
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

  private async seed() {
    try {
      const sampleCards: InsertCard[] = [
        {
          cardDate: "Late 1700s, early 1800s",
          text: "Voyaging waka explore the Pacific, with Aotearoa being discovered over a thousand years ago. Oral histories describe two-way voyages between Aotearoa and other Islands in the Pacific followed by a period of migration to Aotearoa. Tāmaki Makaurau has been home to many hapū who enjoyed the rich volcanic land for growing food and enjoyed the abundance of the harbours and waterways. During the late 1700s and early 1800s Māori were travelling to places such as Europe, India and South America.",
          type: "colonisation",
          region: "Auckland",
          sector: "Education",
          isCore: false,
          isPlainEnglish: false,
          name: "Voyaging waka explore the Pacific",
          author: "System",
          imageUrl: "",
          versions: ["Voyaging waka explore the Pacific"]
        },
        {
          cardDate: "1829",
          text: "Te Arawa tribes reunify in response to European diseases and weapons.",
          type: "resistance",
          region: "Bay of Plenty",
          sector: "Environment",
          isPlainEnglish: false,
          isCore: true,
          name: "Te Arawa tribes reunify",
          author: "System",
          imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          versions: ["Te Arawa tribes reunify"]
        },
        {
          cardDate: "1835",
          text: "Northern Māori sign a Declaration of Independence.",
          type: "colonisation",
          region: "National",
          sector: "Health",
          isPlainEnglish: false,
          isCore: true,
          name: "Northern Māori sign Declaration of Independence",
          author: "System",
          imageUrl: "",
          versions: ["Northern Māori sign Declaration of Independence"]
        }
      ];

      for (const card of sampleCards) {
        await db.insert(cards).values(card);
      }
    } catch (error) {
      console.error("Error in seed:", error);
    }
  }
}

export const storage = new DatabaseStorage();
