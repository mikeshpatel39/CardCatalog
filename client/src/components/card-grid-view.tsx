import { Card } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface CardGridViewProps {
  cards: Card[];
  selectedCards: Set<string>;
  onSelectCard: (cardId: string, selected: boolean) => void;
  onEditCard?: (card: Card) => void;
  onDeleteCard?: (cardId: string) => void;
}

export function CardGridView({ cards, selectedCards, onSelectCard, onEditCard, onDeleteCard }: CardGridViewProps) {
  if (cards.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="text-muted-foreground">No cards found. Try adjusting your filters or add a new card.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.id} className="flex flex-col" data-testid={`grid-card-${card.id}`}>
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              checked={selectedCards.has(card.id)}
              onCheckedChange={(checked) => onSelectCard(card.id, !!checked)}
              data-testid={`checkbox-grid-${card.id}`}
            />
            <h3 className="text-sm font-semibold text-foreground truncate flex-1" data-testid={`grid-name-${card.id}`}>
              {card.name}
            </h3>
            <div className="flex gap-1">
              {onEditCard && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditCard(card)}
                  className="h-6 w-6 p-0 text-primary hover:text-primary/80"
                  data-testid={`button-edit-grid-${card.id}`}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {onDeleteCard && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteCard(card.id)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
                  data-testid={`button-delete-grid-${card.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div 
            className={`aspect-square border border-border rounded-lg p-4 flex flex-col overflow-hidden hover:border-primary/50 transition-colors relative ${
              card.type === 'resistance' ? 'bg-green-50 dark:bg-green-950/20' : 'bg-blue-50 dark:bg-blue-950/20'
            }`}
          >
            {card.imageUrl && (
              <div 
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${card.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}
            <div className="relative z-10 flex flex-col h-full">
              <p 
                className={`text-sm leading-relaxed overflow-y-auto flex-1 ${card.imageUrl ? 'text-white font-medium' : 'text-muted-foreground'}`}
                data-testid={`grid-text-${card.id}`}
              >
                {card.text}
              </p>
              <div className={`mt-2 pt-2 border-t ${card.imageUrl ? 'border-white/30 text-white/90' : 'border-border text-muted-foreground'} text-xs`}>
                <div>{card.region} • {card.sector}</div>
                <div>{card.author} • {card.cardDate || 'No date'}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
