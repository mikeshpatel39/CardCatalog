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
        cardDate: "Late 1700s, early 1800s",
        text: "Voyaging waka explore the Pacific, with Aotearoa being discovered over a thousand years ago. Oral histories describe two-way voyages between Aotearoa and other Islands in the Pacific followed by a period of migration to Aotearoa. Tāmaki Makaurau has been home to many hapū who enjoyed the rich volcanic land for growing food and enjoyed the abundance of the harbours and waterways. During the late 1700s and early 1800s Māori were travelling to places such as Europe, India and South America.",
        type: "colonisation",
        region: "Auckland",
        sector: "Education",
        isPlainEnglish: false,
        isBase: false,
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
        isBase: true,
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
        isBase: true,
        name: "Northern Māori sign Declaration of Independence",
        author: "System",
        imageUrl: "",
        versions: ["Northern Māori sign Declaration of Independence"]
      },
      {
        cardDate: "1839",
        text: "The New Zealand Company claims to have bought 160,000 acres of land around Wellington and the Hutt Valley, with a Deed of Purchase that was not translated in Māori or explained to the sellers. This Deed is later found to not be valid. Based on this so-called Deed, the Company brings several thousand settlers to Wellington, who proceed to occupy the district.",
        type: "colonisation",
        region: "Wellington",
        sector: "Social Services",
        isPlainEnglish: true,
        isBase: false,
        name: "NZ Company claims Wellington land",
        author: "System",
        imageUrl: "",
        versions: ["NZ Company claims Wellington land"]
      },
      {
        cardDate: "1839",
        text: "When purchasing land in Wellington, the New Zealand Company promised one tenth of the lands would be held in trust for the future benefit of hapū. These ‘tenths’ reserves’ and rental income earned from them were managed by government-appointed administrators without consultation with local Māori.",
        type: "colonisation",
        region: "Wellington",
        sector: "Land",
        isPlainEnglish: false,
        isBase: false,
        name: "Wellington Tenths reserves",
        author: "System",
        imageUrl: "",
        versions: ["Wellington Tenths reserves"]
      },
      {
        cardDate: "1840",
        text: "Te Arawa oppose the Treaty of Waitangi. They are confident that their prestige and authority over lands, people, fisheries and resources do not require any additional protection. It is likely that they supported the Declaration of Independence, which asserted Maori authority and control.",
        type: "resistance",
        region: "Bay of Plenty",
        sector: "Other",
        isPlainEnglish: false,
        isBase: false,
        name: "Te Arawa oppose Treaty",
        author: "System",
        imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        versions: ["Te Arawa oppose Treaty"]
      },
      {
        cardDate: "1840",
        text: "This is the year the Treaty of Waitangi is signed. Māori hapū still have control of their own natural resources, law, language and customs. At this time, the Māori population is around 150 000 or more and the Pākehā population is about 2000 (about 1%).",
        type: "colonisation",
        region: "National",
        sector: "Other",
        isPlainEnglish: false,
        isBase: false,
        name: "Treaty of Waitangi signed",
        author: "System",
        imageUrl: "",
        versions: ["Treaty of Waitangi signed"]
      },
      {
        cardDate: "1840",
        text: "In 1840, the first Governor – William Hobson, accepted 3,000 acres of central Auckland land from Ngāti Whātua chief, Apihai Te Kawau. A further 8,000 acres was gifted when the Governor moved his capital to Auckland in March 1841. The Whau portage was the western boundary of this second gift and the land was quickly on-sold by the Crown to settlers at a huge profit.",
        type: "colonisation",
        region: "Auckland",
        sector: "Land",
        isPlainEnglish: false,
        isBase: false,
        name: "Auckland land gift",
        author: "System",
        imageUrl: "",
        versions: ["Auckland land gift"]
      },
      {
        cardDate: "1841",
        text: "The Crown takes 1500 acres of land for the Wellington Town Belt. It does not consult with Māori about this, or make any payment for the land.",
        type: "colonisation",
        region: "Wellington",
        sector: "Land",
        isPlainEnglish: false,
        isBase: false,
        name: "Wellington Town Belt taken",
        author: "System",
        imageUrl: "",
        versions: ["Wellington Town Belt taken"]
      },
      {
        cardDate: "1841",
        text: "Māori produce about half of the country’s exports and control most of the shipping trade around the coast of New Zealand. Māori grow and sell most of the food eaten in the new towns. In the Waikato area Māori tribes own many flour mills to supply flour to the Pākehā settlers in Auckland. They also ship to Australia and California.",
        type: "colonisation",
        region: "Waikato",
        sector: "Economy",
        isPlainEnglish: false,
        isBase: false,
        name: "Māori economy strength",
        author: "System",
        imageUrl: "",
        versions: ["Māori economy strength"]
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
      type: insertCard.type || "colonisation",
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
