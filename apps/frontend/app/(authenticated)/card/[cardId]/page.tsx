"use client";

import SearchBar from "@/components/SearchBar/SearchBar.jsx";
import {
  HistoryIcon,
  Copy,
  ArrowLeft,
  Trash2,
  Edit3,
  CreditCard,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { TBrand, TGiftcard } from "@shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import UpdateCardModal from "@/components/UpdateCardModal/UpdateCardModal";
import Barcode from "react-barcode";

function CardPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const cardId = params.cardId as string;

  async function getCard(): Promise<TGiftcard> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftcards/${cardId}`,
    );
    return response.json();
  }
  const { data: giftcard } = useQuery<TGiftcard>({
    queryKey: ["getGiftcard", cardId],
    queryFn: getCard,
    enabled: Boolean(cardId),
  });

  const deleteCard = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftcards/${cardId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete card");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGiftcards"] });
      toast.success("Card deleted successfully");
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to delete card");
    },
  });

  async function getBrands(): Promise<TBrand[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/brands`,
    );
    return response.json();
  }
  const { data: brands } = useQuery<TBrand[]>({
    queryKey: ["getBrands"],
    queryFn: getBrands,
  });

  const selectedBrand = brands?.find((v: TBrand) => v.id === giftcard?.brand);

  async function copyToClipBoard(copyCode: string) {
    try {
      await navigator.clipboard.writeText(copyCode);
      toast.success("Code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy code");
    }
  }

  if (!giftcard) return null;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="flex gap-2">
          <UpdateCardModal giftcard={giftcard} />
          <Button
            variant="destructive"
            size="icon"
            className="h-9 w-9"
            onClick={() => {
              if (
                confirm(`Are you sure you want to delete ${giftcard.name}?`)
              ) {
                deleteCard.mutate();
              }
            }}
            disabled={deleteCard.isPending}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="bg-card text-card-foreground overflow-hidden rounded-3xl border shadow-xl">
        {/* Card Header/Brand */}
        <div className="bg-muted/50 relative flex h-32 w-full items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="bg-background h-16 w-16 overflow-hidden rounded-2xl border p-2 shadow-sm">
              <img
                src={selectedBrand?.imageUrl ?? ""}
                alt={giftcard.name ?? ""}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="syne text-2xl font-bold tracking-tight">
                {giftcard.name}
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                {selectedBrand?.name || giftcard.brand}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Balance
            </p>
            <p className="text-primary text-3xl font-bold">
              {giftcard.balance}€
            </p>
          </div>
        </div>

        <Separator />

        {/* Barcode & Pin Section */}
        <div className="bg-background flex flex-col items-center justify-center space-y-8 p-10">
          <div className="border-muted-foreground/20 hover:border-primary/20 flex w-full flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed p-8 transition-colors overflow-hidden relative">
            {giftcard.pin && (
              <div className="absolute top-4 right-4 flex flex-col items-end">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">PIN Code</p>
                <p className="font-mono text-lg font-bold text-primary tracking-widest">{giftcard.pin}</p>
              </div>
            )}
            <div className="bg-white p-4 rounded-lg">
              <Barcode 
                value={giftcard.code} 
                format="CODE128"
                width={2}
                height={80}
                displayValue={false}
                background="transparent"
                lineColor="#000000"
              />
            </div>
            <p className="text-muted-foreground font-mono text-sm tracking-[0.2em] uppercase">
              {giftcard.code}
            </p>
          </div>

          <Button
            className="hover:shadow-primary/20 h-14 w-full rounded-2xl text-lg font-semibold shadow-lg transition-all active:scale-[0.98]"
            onClick={() => copyToClipBoard(giftcard.code)}
          >
            <Copy className="mr-2 h-5 w-5" />
            Copy Card Number
          </Button>
        </div>

        {/* Footer info */}
        <div className="bg-muted/30 flex items-center justify-between border-t px-8 py-4">
          <div className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors">
            <HistoryIcon size={16} />
            Transaction History
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <CreditCard size={14} />
            Gift Card
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardPage;
