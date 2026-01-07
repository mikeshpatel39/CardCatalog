import { useEffect } from "react";
import { Card } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { X, Printer } from "lucide-react";
import { format } from "date-fns";

interface PrintLayoutProps {
  cards: Card[];
  onClose: () => void;
  isEasyLanguage?: boolean;
}

export function PrintLayout({ cards, onClose, isEasyLanguage }: PrintLayoutProps) {
  useEffect(() => {
    // Add print styles to document head
    const printStyles = document.createElement("style");
    printStyles.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        .print-area, .print-area * { visibility: visible; }
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .card-print-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 20px;
          height: 297mm;
          width: 210mm;
          padding: 10mm;
          page-break-after: always;
        }
        .print-card {
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 8px;
          background: white;
          box-sizing: border-box;
        }
        @page {
          size: A4;
          margin: 0;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(printStyles);

    return () => {
      document.head.removeChild(printStyles);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Split cards into groups of 4 for each page
  const cardPages = [];
  for (let i = 0; i < cards.length; i += 4) {
    cardPages.push(cards.slice(i, i + 4));
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Control Bar */}
      <div className="no-print bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Print Preview</h2>
            <p className="text-sm text-muted-foreground">
              {cards.length} cards selected • {cardPages.length} page{cardPages.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handlePrint} data-testid="button-print">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={onClose} data-testid="button-close-print">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Print Area */}
      <div className="print-area">
        {cardPages.map((pageCards, pageIndex) => (
          <div key={pageIndex} className="card-print-layout">
            {pageCards.map((card) => (
              <div 
                key={card.id} 
                className={`print-card ${card.type === 'resistance' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`} 
                data-testid={`print-card-${card.id}`}
              >
                <div className="flex items-center mb-3">
                  {card.imageUrl && (
                    <img 
                      src={card.imageUrl} 
                      alt={card.name}
                      className="h-10 w-15 object-cover rounded mr-3"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{card.name}</h3>
                    <p className="text-xs text-gray-600">{card.author} - {card.sector}</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed mb-2">
                  {(isEasyLanguage && card.isPlainEnglish) ? (card.versions[1] || card.text) : card.text}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {card.region} | {card.cardDate || format(new Date(card.createdAt), 'yyyy-MM-dd')}
                </div>
                <div className="mt-1 text-xs text-gray-500 flex space-x-2">
                  {card.isCore && <span>Core</span>}
                  {card.isPlainEnglish && <span>Easy Language</span>}
                </div>
              </div>
            ))}
            
            {/* Fill empty slots if less than 4 cards on this page */}
            {Array.from({ length: 4 - pageCards.length }).map((_, index) => (
              <div key={`empty-${index}`} className="print-card opacity-0">
                <div className="h-full"></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Preview for screen (non-print) */}
      <div className="no-print max-w-4xl mx-auto p-8">
        <div className="space-y-8">
          {cardPages.map((pageCards, pageIndex) => (
            <div key={pageIndex} className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <div className="text-sm text-muted-foreground mb-4">Page {pageIndex + 1}</div>
              <div className="grid grid-cols-2 gap-4">
                {pageCards.map((card) => (
                  <div key={card.id} className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-center mb-3">
                      {card.imageUrl && (
                        <img 
                          src={card.imageUrl} 
                          alt={card.name}
                          className="h-8 w-12 object-cover rounded mr-2"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-xs">{card.name}</h4>
                        <p className="text-xs text-muted-foreground">{card.author} - {card.sector}</p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed mb-2 text-muted-foreground">
                      {(isEasyLanguage && card.isPlainEnglish) ? (card.versions[1] || card.text) : card.text}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {card.region} | {card.cardDate || format(new Date(card.createdAt), 'yyyy-MM-dd')}
                    </div>
                  </div>
                ))}
                
                {/* Show empty slots in preview */}
                {Array.from({ length: 4 - pageCards.length }).map((_, index) => (
                  <div key={`preview-empty-${index}`} className="border border-dashed border-border rounded-lg p-4 bg-muted/20">
                    <div className="h-20 flex items-center justify-center text-xs text-muted-foreground">
                      Empty slot
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
