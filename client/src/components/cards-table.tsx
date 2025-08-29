import { useState } from "react";
import { Card } from "@shared/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowUpDown, Edit, Trash2, Check } from "lucide-react";
import { format } from "date-fns";

interface CardsTableProps {
  cards: Card[];
  selectedCards: Set<string>;
  onSelectCard: (cardId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (cardId: string) => void;
  isLoading: boolean;
}

export function CardsTable({
  cards,
  selectedCards,
  onSelectCard,
  onSelectAll,
  onEditCard,
  onDeleteCard,
  isLoading
}: CardsTableProps) {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Base</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Plain English</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Versions</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCards.map((card) => (
              <TableRow 
                key={card.id} 
                className="hover:bg-muted/50 transition-colors"
                data-testid={`row-card-${card.id}`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedCards.has(card.id)}
                    onCheckedChange={(checked) => onSelectCard(card.id, !!checked)}
                    data-testid={`checkbox-card-${card.id}`}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-foreground">
                  {format(new Date(card.createdAt), 'yyyy-MM-dd')}
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
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate" data-testid={`text-content-${card.id}`}>
                  {card.text}
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
                  {card.isBase && (
                    <Check className="h-4 w-4 text-green-600" data-testid={`icon-base-${card.id}`} />
                  )}
                </TableCell>
                <TableCell>
                  {card.isPlainEnglish && (
                    <Check className="h-4 w-4 text-green-600" data-testid={`icon-plain-english-${card.id}`} />
                  )}
                </TableCell>
                <TableCell>
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
    </div>
  );
}
