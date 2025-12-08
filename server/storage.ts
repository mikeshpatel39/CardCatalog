import { type Card, type InsertCard } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCards(): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, card: Partial<InsertCard>): Promise<Card | undefined>;
  deleteCard(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private cards: Map<string, Card>;

  constructor() {
    this.cards = new Map();
    this.initializeSampleCards();
  }

  private initializeSampleCards() {
    const sampleCards: InsertCard[] = [
      {
        name: "Digital Innovation Strategy",
        text: "Comprehensive framework for implementing digital transformation initiatives across enterprise organizations with focus on scalability and ROI measurement.",
        region: "North America",
        sector: "Technology",
        author: "Sarah Chen",
        imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        isBase: true,
        isPlainEnglish: true,
        versions: ["Digital Innovation Strategy", "Enterprise Digital Framework", "Innovation Implementation Guide"],
        cardDate: "Mar 2019"
      },
      {
        name: "Patient Care Protocol",
        text: "Evidence-based guidelines for optimal patient outcomes in clinical settings with focus on safety protocols and quality care standards.",
        region: "Europe",
        sector: "Healthcare",
        author: "Dr. Michael Roberts",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        isBase: true,
        isPlainEnglish: false,
        versions: ["Patient Care Protocol"],
        cardDate: "1892"
      },
      {
        name: "Investment Risk Analysis",
        text: "Comprehensive methodology for evaluating financial risk profiles and investment opportunities in volatile markets with predictive modeling.",
        region: "Asia Pacific",
        sector: "Finance",
        author: "Jennifer Liu",
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        isBase: false,
        isPlainEnglish: true,
        versions: ["Investment Risk Analysis", "Market Risk Assessment Framework"],
        cardDate: "Sep 1923"
      },
      {
        name: "Learning Assessment Framework",
        text: "Innovative approach to measuring student progress and educational outcomes through data-driven methodologies and performance analytics.",
        region: "Latin America",
        sector: "Education",
        author: "Carlos Martinez",
        imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        isBase: true,
        isPlainEnglish: true,
        versions: ["Learning Assessment Framework", "Student Progress Evaluation", "Educational Outcome Metrics", "Data-Driven Assessment Model"],
        cardDate: "Jan 1840"
      },
      {
        name: "Quality Control Standards",
        text: "ISO-compliant procedures for maintaining product quality and manufacturing excellence in industrial environments with continuous improvement protocols.",
        region: "Middle East & Africa",
        sector: "Manufacturing",
        author: "Ahmed Hassan",
        imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        isBase: false,
        isPlainEnglish: false,
        versions: ["Quality Control Standards"],
        cardDate: "2012"
      }
    ];

    sampleCards.forEach(card => {
      this.createCard(card);
    });
  }

  async getCards(): Promise<Card[]> {
    return Array.from(this.cards.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const card: Card = {
      ...insertCard,
      id,
      imageUrl: insertCard.imageUrl || "",
      isBase: insertCard.isBase || false,
      isPlainEnglish: insertCard.isPlainEnglish || false,
      versions: insertCard.versions || [],
      cardDate: insertCard.cardDate || "",
      createdAt: new Date(),
    };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: string, updateCard: Partial<InsertCard>): Promise<Card | undefined> {
    const existingCard = this.cards.get(id);
    if (!existingCard) return undefined;

    const updatedCard: Card = {
      ...existingCard,
      ...updateCard,
    };
    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  async deleteCard(id: string): Promise<boolean> {
    return this.cards.delete(id);
  }
}

export const storage = new MemStorage();
