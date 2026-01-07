import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { CardsTable } from "@/components/cards-table";
import { CardGridView } from "@/components/card-grid-view";
import { TimelineView } from "@/components/timeline-view";
import { CardFormDialog } from "@/components/card-form-dialog";
import { PrintLayout } from "@/components/print-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Printer, Search, X, Table, LayoutGrid, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

type ViewType = "table" | "grid" | "timeline";

const REGIONS = [
  "National",
  "Northland",
  "Auckland",
  "Waikato",
  "Bay of Plenty",
  "Gisborne",
  "Hawke's Bay",
  "Taranaki",
  "Manawatu-Wanganui",
  "Wellington",
  "Tasman",
  "Nelson",
  "Marlborough",
  "West Coast",
  "Canterbury",
  "Otago",
  "Southland",
  "Te Tai Tokerau",
  "Te Moana-a-Toi",
  "Te Whanganui-a-Tara",
  "Whakatū"
];

const SECTORS = [
  "Technology",
  "Healthcare", 
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Environment",
  "Land",
  "Economy",
  "Social Services",
  "Health",
  "Justice",
  "Local Government",
  "Other"
];

const LANGUAGES = [
  "English",
  "Spanish",
  "Arabic",
  "Burmese",
  "Urdu"
];

export default function Cards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("English");
  const [typeFilter, setTypeFilter] = useState("");
  const [coreFilter, setCoreFilter] = useState<boolean | null>(null);
  const [easyLanguageFilter, setEasyLanguageFilter] = useState<boolean>(false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | undefined>();
  const [showPrintLayout, setShowPrintLayout] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("table");
  const { toast } = useToast();

  const handleSelectCard = (cardId: string, selected: boolean) => {
    const newSelected = new Set(selectedCards);
    if (selected) {
      newSelected.add(cardId);
    } else {
      newSelected.delete(cardId);
    }
    setSelectedCards(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedCards(new Set(filteredCards.map(card => card.id)));
    } else {
      setSelectedCards(new Set());
    }
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      deleteCardMutation.mutate(cardId);
    }
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };

  const handleAddCard = () => {
    setEditingCard(undefined);
    setIsFormOpen(true);
  };

  const handlePrintSelected = () => {
    if (selectedCards.size === 0) {
      toast({ title: "Please select cards to print", variant: "destructive" });
      return;
    }
    setShowPrintLayout(true);
  };

  const { data: cards = [], isLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({ title: "Card deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete card", variant: "destructive" });
    },
  });

  const filteredCards = cards.filter(card => {
    const matchesSearch = !searchQuery || 
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = !regionFilter || card.region === regionFilter;
    const matchesSector = !sectorFilter || card.sector === sectorFilter;
    const matchesCore = coreFilter === null || card.isCore === coreFilter;
    const matchesType = !typeFilter || card.type === typeFilter;
    
    return matchesSearch && matchesRegion && matchesSector && matchesType && matchesCore;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setRegionFilter("");
    setSectorFilter("");
    setLanguageFilter("English");
    setTypeFilter("");
    setCoreFilter(null);
    setEasyLanguageFilter(false);
  };

  const selectedCardsData = cards.filter(card => selectedCards.has(card.id));

  if (showPrintLayout) {
    return (
      <PrintLayout 
        cards={selectedCardsData} 
        onClose={() => setShowPrintLayout(false)} 
        isEasyLanguage={easyLanguageFilter}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">Card Database</h1>
              <span className="ml-3 text-sm text-muted-foreground">Manage and print your card collection</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleAddCard}
                className="inline-flex items-center"
                data-testid="button-add-card"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
              <Button
                onClick={handlePrintSelected}
                variant="secondary"
                disabled={selectedCards.size === 0}
                className="inline-flex items-center"
                data-testid="button-print-selected"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Selected ({selectedCards.size})
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <Label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
                Search Cards
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name, text, author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
            
            <div className="min-w-48">
              <Label className="block text-sm font-medium text-foreground mb-2">
                Filter by Region
              </Label>
              <Select value={regionFilter} onValueChange={(value) => setRegionFilter(value === "all" ? "" : value)}>
                <SelectTrigger data-testid="select-region">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-48">
              <Label className="block text-sm font-medium text-foreground mb-2">
                Filter by Sector
              </Label>
              <Select value={sectorFilter} onValueChange={(value) => setSectorFilter(value === "all" ? "" : value)}>
                <SelectTrigger data-testid="select-sector">
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {SECTORS.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-48">
              <Label className="block text-sm font-medium text-foreground mb-2">
                Language
              </Label>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger data-testid="select-language">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-48">
              <Label className="block text-sm font-medium text-foreground mb-2">
                Filter by Type
              </Label>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
                <SelectTrigger data-testid="select-type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="colonisation">Colonisation (Blue)</SelectItem>
                  <SelectItem value="resistance">Resistance (Green)</SelectItem>
                  <SelectItem value="solidarity">Solidarity (Yellow)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2 mb-1">
              <Label className="text-sm font-medium text-foreground">Core Only</Label>
              <div className="flex items-center h-10">
                <Switch 
                  checked={coreFilter === true} 
                  onCheckedChange={(checked) => setCoreFilter(checked ? true : null)}
                  data-testid="switch-core-filter"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2 mb-1">
              <Label className="text-sm font-medium text-foreground">Easy Language</Label>
              <div className="flex items-center h-10">
                <Switch 
                  checked={easyLanguageFilter} 
                  onCheckedChange={(checked) => setEasyLanguageFilter(checked)}
                  data-testid="switch-easy-language-content"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                data-testid="button-clear-filters"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div className="mb-6">
          <Tabs value={viewType} onValueChange={(value) => setViewType(value as ViewType)}>
            <TabsList>
              <TabsTrigger value="table" data-testid="tab-table-view">
                <Table className="h-4 w-4 mr-2" />
                Table
              </TabsTrigger>
              <TabsTrigger value="grid" data-testid="tab-grid-view">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Card View
              </TabsTrigger>
              <TabsTrigger value="timeline" data-testid="tab-timeline-view">
                <Clock className="h-4 w-4 mr-2" />
                Timeline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* View Content */}
        {isLoading ? (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <div className="text-muted-foreground">Loading cards...</div>
          </div>
        ) : viewType === "table" ? (
          <CardsTable
            cards={filteredCards}
            selectedCards={selectedCards}
            onSelectCard={handleSelectCard}
            onSelectAll={handleSelectAll}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            isLoading={isLoading}
            isEasyLanguage={easyLanguageFilter}
          />
        ) : viewType === "grid" ? (
          <CardGridView
            cards={filteredCards}
            selectedCards={selectedCards}
            onSelectCard={handleSelectCard}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            isEasyLanguage={easyLanguageFilter}
          />
        ) : (
          <TimelineView
            cards={filteredCards}
            selectedCards={selectedCards}
            onSelectCard={handleSelectCard}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            isEasyLanguage={easyLanguageFilter}
          />
        )}
      </main>

      <CardFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingCard={editingCard}
      />
    </div>
  );
}
