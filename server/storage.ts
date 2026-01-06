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
      },
      {
        cardDate: "1841",
        text: "Governor Hobson moves the capital to Auckland and introduces rules and taxes that hurt Māori trade in the Bay of Islands. These and other actions lead to a war in the North in 1844 – 1845.",
        type: "colonisation",
        region: "Te Tai Tokerau",
        sector: "Economy",
        isPlainEnglish: false,
        isBase: false,
        name: "Hobson moves capital to Auckland",
        author: "System",
        imageUrl: "",
        versions: ["Hobson moves capital to Auckland"]
      },
      {
        cardDate: "1841",
        text: "Early land sales are investigated by the Spain Commission. About half of the sales are allowed. But even when sales are not allowed, the land is often not returned to its Māori owners but taken into Crown ownership instead.",
        type: "colonisation",
        region: "National",
        sector: "Land",
        isPlainEnglish: false,
        isBase: false,
        name: "Spain Commission investigations",
        author: "System",
        imageUrl: "",
        versions: ["Spain Commission investigations"]
      },
      {
        cardDate: "1844",
        text: "A rangatira from the North called Hone Heke cuts down the British flagpole four times. He does this because the British governor is making decisions that he and other Māori do not agree with.",
        type: "resistance",
        region: "Te Tai Tokerau",
        sector: "Other",
        isPlainEnglish: false,
        isBase: false,
        name: "Hone Heke cuts down flagpole",
        author: "System",
        imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        versions: ["Hone Heke cuts down flagpole"]
      },
      {
        cardDate: "1844-1864",
        text: "Between 1844 and 1864 the government buys much of the South Island from Ngai Tahu. It promises that Ngai Tahu will keep 10% of the land and be able to access their food gathering areas for ever. The government takes the land but does not keep the promise.",
        type: "colonisation",
        region: "National",
        sector: "Land",
        isPlainEnglish: false,
        isBase: false,
        name: "South Island land purchases",
        author: "System",
        imageUrl: "",
        versions: ["South Island land purchases"]
      },
      {
        cardDate: "1844",
        text: "William Spain is made Land Claims Commissioner in order to investigate the dodgy “purchase” of land to build Port Nicholson (Wellington) by the New Zealand Company. He finds that the sale was illegitimate - but cuts a private deal with the New Zealand Company to get them the land anyway. Overnight, Māori lose 67,000 acres of land.",
        type: "colonisation",
        region: "Te Whanganui-a-Tara",
        sector: "Land",
        isPlainEnglish: false,
        isBase: false,
        name: "Port Nicholson land deal",
        author: "System",
        imageUrl: "",
        versions: ["Port Nicholson land deal"]
      },
      {
        cardDate: "1846",
        text: "Ngāti Rangatahi and Ngāti Tama occupy fertile land in the Hutt Valley. Newly arriving settlers also want that land. In 1846, the hapū are pressured into leaving under threat of attack, and without compensation for the land.",
        type: "colonisation",
        region: "Te Whanganui-a-Tara",
        sector: "Land",
        isPlainEnglish: false,
        isBase: false,
        name: "Hutt Valley occupation",
        author: "System",
        imageUrl: "",
        versions: ["Hutt Valley occupation"]
      },
      {
        cardDate: "1848",
        text: "The Māori economy continues to be strong. 53 Māori owned ships of more than 14 tons are registered in Auckland. Māori hapū own horses, cattle, pigs and grow acres of wheat and other crops.",
        type: "resistance",
        region: "National",
        sector: "Economy",
        isPlainEnglish: false,
        isBase: true,
        name: "Māori shipping trade",
        author: "System",
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        versions: ["Māori shipping trade"]
      },
      {
        cardDate: "1848",
        text: "In 1848 Ngati Toa Rangatira gifted 500 acres of land at Whitireia to the Crown to establish a college. When no school was established, Ngāti Toa Rangātira sought to have the land returned. The Crown refused.",
        type: "colonisation",
        region: "Te Whanganui-a-Tara",
        sector: "Education",
        isPlainEnglish: false,
        isBase: false,
        name: "Whitireia land gift",
        author: "System",
        imageUrl: "",
        versions: ["Whitireia land gift"]
      },
      {
        cardDate: "1852",
        text: "New Zealand Constitution Act 1852: The British Government passes a law to create the New Zealand Parliament. To be able to vote: 1. You must be male. 2. You must be 21 years old or older. 3. You must own land in individual title. Because Māori people own land collectively, they cannot vote.",
        type: "colonisation",
        region: "National",
        sector: "Other",
        isPlainEnglish: false,
        isBase: true,
        name: "NZ Constitution Act 1852",
        author: "System",
        imageUrl: "",
        versions: ["NZ Constitution Act 1852"]
      },
      {
        cardDate: "1853",
        text: "In 1853 Governor Grey takes 371 hectares of Motueka Native Reserve lands for the Anglican Church’s Whakarewa School, without offering compensation. This removes the best of the Nelson tribes’ productive lands, leaving them bereft of income; they are later evicted from their homes and cultivations.",
        type: "colonisation",
        region: "Whakatū",
        sector: "Education",
        isPlainEnglish: false,
        isBase: false,
        name: "Motueka Native Reserve taken",
        author: "System",
        imageUrl: "",
        versions: ["Motueka Native Reserve taken"]
      },
      {
        cardDate: "1858",
        text: "Many Māori tribes from around the country choose a Māori King, Pōtatau Te Wherowhero, and put their land under his protection to stop it being sold. In the 1870s the Kingitanga, does not support government schools for Māori children. The Kingitanga has its own Minister of Education.",
        type: "resistance",
        region: "Manawatu-Wanganui",
        sector: "Education",
        isPlainEnglish: false,
        isBase: true,
        name: "Māori King chosen",
        author: "System",
        imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        versions: ["Māori King chosen"]
      },
      {
        cardDate: "1863",
        text: "In order to punish “certain aboriginal tribes of the colony”, the government passes the Suppression of Rebellion Act. This removes the right to trial before imprisonment. Many Māori are held without trial, imprisoned, and sent into forced labour.",
        type: "colonisation",
        region: "National",
        sector: "Justice",
        isPlainEnglish: false,
        isBase: false,
        name: "Suppression of Rebellion Act",
        author: "System",
        imageUrl: "",
        versions: ["Suppression of Rebellion Act"]
      },
      {
        cardDate: "1863",
        text: "The settler Government is under pressure to make land available for the new Pākehā settlers. Most Māori hapū don’t want to sell their land so the Government attacks some Māori areas including Taranaki and Waikato. This act allows for the confiscation of land – without compensation from Māori considered to be “in rebellion” (i.e. defending their land). More than 3 million acres are taken in the North Island. Later, about half of the land is given back.",
        type: "colonisation",
        region: "National",
        sector: "Land",
        isPlainEnglish: false,
        isBase: true,
        name: "NZ Settlements Act 1863",
        author: "System",
        imageUrl: "",
        versions: ["NZ Settlements Act 1863"]
      },
      {
        cardDate: "1864",
        text: "Public Works Lands Act. Māori land can now be taken for government projects such as roads, and later, railways and airports. The Crown often favoured Māori land over general land since it could pay the owners less compensation, or none at all. Land not used, needs to be offered back to the original owners. The Crown often fails to apply this section.",
        type: "colonisation",
        region: "National",
        sector: "Land",
        isPlainEnglish: false,
        isBase: true,
        name: "Public Works Lands Act 1864",
        author: "System",
        imageUrl: "",
        versions: ["Public Works Lands Act 1864"]
      },
      {
        cardDate: "1865",
        text: "The Government creates the Native Land Court. Māori must go to court to get a title (certificate) for land they already own. Māori people own land together with the other members of their hapū, but when they get the certificate it only has the names of ten owners. The Court is very expensive and often Māori have to sell land to pay the bills when they are awarded their land title.",
        type: "colonisation",
        region: "National",
        sector: "Land",
        isPlainEnglish: false,
        isBase: true,
        name: "Native Land Court 1865",
        author: "System",
        imageUrl: "",
        versions: ["Native Land Court 1865"]
      },
      {
        cardDate: "1866",
        text: "Fisheries Laws: This is the year that the Government passes the ﬁrst ﬁsheries laws in Aotearoa/New Zealand. Some of the laws protect ﬁshing areas. Some of the laws control who is allowed to catch ﬁsh to sell and when and where they are allowed to catch it. All of the laws show that the Government believes it owns the ﬁshing areas and has the right to control them.",
        type: "colonisation",
        region: "National",
        sector: "Other",
        isPlainEnglish: false,
        isBase: false,
        name: "First Fisheries Laws 1866",
        author: "System",
        imageUrl: "",
        versions: ["First Fisheries Laws 1866"]
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
