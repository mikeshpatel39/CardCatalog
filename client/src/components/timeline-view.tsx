import { Card } from "@shared/schema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface TimelineViewProps {
  cards: Card[];
  selectedCards: Set<string>;
  onSelectCard: (cardId: string, selected: boolean) => void;
  onEditCard?: (card: Card) => void;
  onDeleteCard?: (cardId: string) => void;
}

const START_YEAR = 1840;
const END_YEAR = new Date().getFullYear();
const YEAR_RANGE = END_YEAR - START_YEAR;

function getDecades(): number[] {
  const decades: number[] = [];
  for (let year = START_YEAR; year <= END_YEAR; year += 20) {
    decades.push(year);
  }
  return decades;
}

function getCardYear(card: Card): number {
  if (!card.createdAt) {
    return END_YEAR;
  }
  const cardDate = new Date(card.createdAt);
  const year = cardDate.getFullYear();
  if (isNaN(year) || year < START_YEAR) {
    return END_YEAR;
  }
  return year;
}

function getPositionPercentage(year: number): number {
  const clampedYear = Math.max(START_YEAR, Math.min(END_YEAR, year));
  return ((clampedYear - START_YEAR) / YEAR_RANGE) * 100;
}

export function TimelineView({ cards, selectedCards, onSelectCard, onEditCard, onDeleteCard }: TimelineViewProps) {
  const decades = getDecades();
  
  const cardsByYear = cards.reduce((acc, card) => {
    const year = getCardYear(card);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(card);
    return acc;
  }, {} as Record<number, Card[]>);

  if (cards.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="text-muted-foreground">No cards found. Try adjusting your filters or add a new card.</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="relative">
        <div className="h-2 bg-muted rounded-full mb-8 relative">
          {decades.map((decade) => (
            <div
              key={decade}
              className="absolute top-0 transform -translate-x-1/2"
              style={{ left: `${getPositionPercentage(decade)}%` }}
            >
              <div className="w-0.5 h-4 bg-border -mt-1"></div>
              <div className="text-xs text-muted-foreground mt-1 -ml-4 w-8 text-center">
                {decade}
              </div>
            </div>
          ))}
        </div>

        <div className="relative h-64 mt-12">
          {Object.entries(cardsByYear).map(([year, yearCards]) => {
            const position = getPositionPercentage(parseInt(year));
            
            return (
              <div
                key={year}
                className="absolute transform -translate-x-1/2"
                style={{ 
                  left: `${position}%`,
                  top: '0',
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  {yearCards.map((card, index) => (
                    <Tooltip key={card.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`relative group cursor-pointer transition-all hover:scale-110 ${
                            selectedCards.has(card.id) ? 'ring-2 ring-primary' : ''
                          }`}
                          style={{ marginTop: index * 4 }}
                          data-testid={`timeline-card-${card.id}`}
                        >
                          <div
                            className="w-10 h-10 rounded-md border-2 border-border bg-card overflow-hidden"
                            style={{
                              backgroundImage: card.imageUrl ? `url(${card.imageUrl})` : undefined,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundColor: !card.imageUrl ? 'var(--primary)' : undefined,
                            }}
                          >
                            {!card.imageUrl && (
                              <div className="w-full h-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                                {card.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Checkbox
                              checked={selectedCards.has(card.id)}
                              onCheckedChange={(checked) => onSelectCard(card.id, !!checked)}
                              className="bg-background"
                              data-testid={`checkbox-timeline-${card.id}`}
                            />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-2">
                          <div className="font-semibold">{card.name}</div>
                          <div className="text-xs text-muted-foreground">{card.text}</div>
                          <div className="text-xs">
                            {card.author} • {card.region} • {card.sector}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getCardYear(card)}
                          </div>
                          <div className="flex gap-2 pt-1 border-t border-border">
                            {onEditCard && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditCard(card);
                                }}
                                className="h-6 px-2 text-xs"
                                data-testid={`button-edit-timeline-${card.id}`}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            )}
                            {onDeleteCard && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteCard(card.id);
                                }}
                                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                                data-testid={`button-delete-timeline-${card.id}`}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Hover over cards to see details. Click checkbox to select for printing.
        </div>
      </div>
    </div>
  );
}
