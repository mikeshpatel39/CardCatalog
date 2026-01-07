import { useState } from "react";
import { Card, InsertCard } from "@shared/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowUpDown, Edit, Trash2, Check, Plus } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface CardsTableProps {
  cards: Card[];
  selectedCards: Set<string>;
  onSelectCard: (cardId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (cardId: string) => void;
  isLoading: boolean;
  isPlainEnglish?: boolean;
}

export function CardsTable({
  cards,
  selectedCards,
  onSelectCard,
  onSelectAll,
  onEditCard,
  onDeleteCard,
  isLoading,
  isPlainEnglish
}: CardsTableProps) {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [addVersionCard, setAddVersionCard] = useState<Card | null>(null);
  const [newVersionText, setNewVersionText] = useState("");
  const { toast } = useToast();

  const addVersionMutation = useMutation({
    mutationFn: async ({ id, versions }: { id: string; versions: string[] }) => {
      const res = await apiRequest("PUT", `/api/cards/${id}`, { versions });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({ title: "Version added successfully" });
      setAddVersionCard(null);
      setNewVersionText("");
    },
    onError: () => {
      toast({ title: "Failed to add version", variant: "destructive" });
    }
  });

  const handleAddVersion = () => {
    if (!addVersionCard || !newVersionText.trim()) return;
    const updatedVersions = [...addVersionCard.versions, newVersionText.trim()];
    addVersionMutation.mutate({ id: addVersionCard.id, versions: updatedVersions });
  };

  const sortedCards = [...cards].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const handleSortByDate = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const allSelected = cards.length > 0 && cards.every(card => selectedCards.has(card.id));
  const someSelected = cards.some(card => selectedCards.has(card.id));

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="text-muted-foreground">Loading cards...</div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="text-muted-foreground">No cards found. Try adjusting your filters or add a new card.</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                  data-testid="checkbox-select-all"
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSortByDate}
                  className="h-auto p-0 hover:bg-muted/80 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  data-testid="button-sort-date"
                >
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </Button>
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Image</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Card Name</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Text</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sector</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Author</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Core</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Plain English</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Versions</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCards.map((card) => (
              <TableRow 
                key={card.id} 
                className={`hover:bg-muted/50 transition-colors ${
                  card.type === 'resistance' ? 'bg-green-100/50 dark:bg-green-900/20' : 'bg-blue-100/50 dark:bg-blue-900/20'
                }`}
                data-testid={`row-card-${card.id}`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedCards.has(card.id)}
                    onCheckedChange={(checked) => onSelectCard(card.id, !!checked)}
                    data-testid={`checkbox-card-${card.id}`}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-foreground" data-testid={`text-date-${card.id}`}>
                  {card.cardDate || format(new Date(card.createdAt), 'yyyy-MM-dd')}
                </TableCell>
                <TableCell>
                  {card.imageUrl ? (
                    <img 
                      src={card.imageUrl} 
                      alt={card.name}
                      className="h-12 w-16 object-cover rounded border"
                      data-testid={`img-card-${card.id}`}
                    />
                  ) : (
                    <div className="h-12 w-16 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground" data-testid={`text-name-${card.id}`}>
                  {card.name}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs" data-testid={`text-content-${card.id}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="truncate cursor-help">
                        {(isPlainEnglish && card.isPlainEnglish) ? (card.versions[1] || card.text) : card.text}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <p className="text-sm leading-relaxed">
                        {(isPlainEnglish && card.isPlainEnglish) ? (card.versions[1] || card.text) : card.text}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-sm text-foreground" data-testid={`text-region-${card.id}`}>
                  {card.region}
                </TableCell>
                <TableCell className="text-sm text-foreground" data-testid={`text-sector-${card.id}`}>
                  {card.sector}
                </TableCell>
                <TableCell className="text-sm text-foreground" data-testid={`text-author-${card.id}`}>
                  {card.author}
                </TableCell>
                <TableCell>
                  {card.isCore && (
                    <Check className="h-4 w-4 text-green-600" data-testid={`icon-core-${card.id}`} />
                  )}
                </TableCell>
                <TableCell>
                  {card.isPlainEnglish && (
                    <Check className="h-4 w-4 text-green-600" data-testid={`icon-plain-english-${card.id}`} />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span 
                          className="text-sm text-primary cursor-pointer underline" 
                          data-testid={`text-versions-${card.id}`}
                        >
                          {card.versions.length} version{card.versions.length !== 1 ? 's' : ''}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          {card.versions.map((version, index) => (
                            <div key={index}>Version {index + 1}: {version}</div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAddVersionCard(card);
                        setNewVersionText("");
                      }}
                      className="h-7 px-2 text-[10px] text-muted-foreground hover:text-primary"
                      data-testid={`button-add-version-${card.id}`}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Version
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditCard(card)}
                      className="text-primary hover:text-primary/80 h-8 w-8 p-0"
                      data-testid={`button-edit-${card.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteCard(card.id)}
                      className="text-destructive hover:text-destructive/80 h-8 w-8 p-0"
                      data-testid={`button-delete-${card.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!addVersionCard} onOpenChange={(open) => !open && setAddVersionCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Version</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter the new version text..."
              value={newVersionText}
              onChange={(e) => setNewVersionText(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-new-version"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddVersionCard(null)}>Cancel</Button>
            <Button 
              onClick={handleAddVersion} 
              disabled={addVersionMutation.isPending || !newVersionText.trim()}
              data-testid="button-confirm-add-version"
            >
              {addVersionMutation.isPending ? "Adding..." : "Add Version"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
