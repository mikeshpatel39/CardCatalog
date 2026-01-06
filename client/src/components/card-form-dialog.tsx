import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertCardSchema, type Card, type InsertCard } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

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

interface CardFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCard?: Card;
}

export function CardFormDialog({ open, onOpenChange, editingCard }: CardFormDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertCard>({
    resolver: zodResolver(insertCardSchema),
    defaultValues: {
      name: "",
      text: "",
      region: "",
      sector: "",
      author: "",
      imageUrl: "",
      isBase: false,
      isPlainEnglish: false,
      versions: [],
      cardDate: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCard) => {
      const response = await apiRequest("POST", "/api/cards", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({ title: "Card created successfully" });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to create card", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertCard) => {
      const response = await apiRequest("PUT", `/api/cards/${editingCard!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({ title: "Card updated successfully" });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to update card", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (editingCard && open) {
      form.reset({
        name: editingCard.name,
        text: editingCard.text,
        region: editingCard.region,
        sector: editingCard.sector,
        author: editingCard.author,
        imageUrl: editingCard.imageUrl || "",
        isBase: editingCard.isBase,
        isPlainEnglish: editingCard.isPlainEnglish,
        type: editingCard.type || "colonisation",
        versions: editingCard.versions,
        cardDate: editingCard.cardDate || "",
      });
    } else if (!editingCard && open) {
      form.reset({
        name: "",
        text: "",
        region: "",
        sector: "",
        author: "",
        imageUrl: "",
        isBase: false,
        isPlainEnglish: false,
        type: "colonisation",
        versions: [],
        cardDate: "",
      });
    }
  }, [editingCard, open, form]);

  const onSubmit = (data: InsertCard) => {
    // Enforcement: Only resistance cards can have images
    const validatedData = {
      ...data,
      imageUrl: data.type === 'resistance' ? data.imageUrl : "",
    };

    // Add the card name as the first version if versions array is empty
    const finalData = {
      ...validatedData,
      versions: (validatedData.versions && validatedData.versions.length > 0) ? validatedData.versions : [validatedData.name],
    };

    if (editingCard) {
      updateMutation.mutate(finalData);
    } else {
      createMutation.mutate(finalData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="text-dialog-title">
            {editingCard ? "Edit Card" : "Add New Card"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter card name" 
                        {...field} 
                        data-testid="input-card-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter author name" 
                        {...field} 
                        data-testid="input-author"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cardDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Jan 1840, 1892, Sep 2023" 
                        {...field} 
                        data-testid="input-card-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Text</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter card description" 
                      className="min-h-[100px]" 
                      {...field} 
                      data-testid="textarea-card-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-form-region">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {REGIONS.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-form-sector">
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SECTORS.map(sector => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-form-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="colonisation">Colonisation (Blue)</SelectItem>
                        <SelectItem value="resistance">Resistance (Green)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className={form.watch("type") !== 'resistance' ? "opacity-50 pointer-events-none" : ""}>
                  <FormLabel>Image URL {form.watch("type") !== 'resistance' && "(Resistance cards only)"}</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder={form.watch("type") === 'resistance' ? "Enter image URL" : "N/A - Resistance cards only"} 
                        {...field}
                        value={field.value || ""}
                        disabled={form.watch("type") !== 'resistance'}
                        data-testid="input-image-url"
                      />
                      <div className="border-2 border-dashed border-input rounded-md p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          {form.watch("type") === 'resistance' 
                            ? "Upload functionality coming soon. For now, please use image URLs." 
                            : "Images can only be added to Resistance cards."}
                        </p>
                        {form.watch("type") === 'resistance' && (
                          <p className="text-xs text-muted-foreground">
                            Try: https://images.unsplash.com/photo-{"{photo-id}"}?auto=format&fit=crop&w=300&h=200
                          </p>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center space-x-6">
              <FormField
                control={form.control}
                name="isBase"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-is-base"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Base</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isPlainEnglish"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-is-plain-english"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Plain English</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                data-testid="button-save"
              >
                {isLoading ? "Saving..." : editingCard ? "Update Card" : "Save Card"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
