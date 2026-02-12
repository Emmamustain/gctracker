import { HeartIcon } from "lucide-react";
import React from "react";
import { TGiftcard, TUpdateCard } from "@shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/utils/clsx";

type CardProps = Pick<TGiftcard, "favorite" | "id" | "discarded"> & {
  logo?: string;
};

function Card({ favorite, id, logo, discarded = false }: CardProps) {
  const queryClient = useQueryClient();

  const updateFavorite = useMutation({
    mutationFn: ({ favorite }: TUpdateCard) => {
      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/giftcards/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorite }),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getGiftcards"] });
    },
  });

  return (
    <a
      key={id}
      href={`/card/${id}`}
      className={cn(
        "group bg-card text-card-foreground hover:ring-ring/20 relative flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md hover:ring-1",
        discarded && "opacity-75 grayscale",
      )}
    >
      <div className="bg-muted/30 flex aspect-[1.6/1] items-center justify-center p-6">
        <img
          src={`${logo}`}
          alt={`${logo} Logo Card`}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <button
        className={cn(
          "bg-background/80 absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all hover:scale-110",
          favorite
            ? "text-red-500"
            : "text-muted-foreground hover:text-foreground",
        )}
        onClick={(e) => {
          updateFavorite.mutate({
            favorite: !favorite,
          });
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <HeartIcon
          size={18}
          fill={favorite ? "currentColor" : "none"}
          className="transition-colors"
        />
      </button>
    </a>
  );
}

export default Card;
