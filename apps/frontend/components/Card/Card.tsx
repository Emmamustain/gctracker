import { HeartIcon } from "lucide-react";
import React from "react";
import { TGiftcard, TUpdateCard } from "@shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CardProps = Pick<TGiftcard, "favorite" | "id"> & { logo?: string };

function Card({ favorite, id, logo }: CardProps) {
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
      // If you're invalidating a single query
      await queryClient.invalidateQueries({ queryKey: ["getGiftcards"] });
    },
  });

  return (
    <a key={id} href={`/card/${id}`}>
      <div className="flex h-[200px] w-[350px] justify-center rounded-lg border-1 border-gray-200 bg-gray-100 shadow-md">
        <img
          src={`${logo}`}
          alt={`${logo} Logo Card`}
          className="max-w-64 rounded-lg object-contain"
        />
        <button
          className="mt-2 h-fit w-fit cursor-pointer rounded-4xl bg-gray-200 p-1"
          onClick={(e) => {
            updateFavorite.mutate({
              favorite: !favorite,
            });
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <HeartIcon
            size={23}
            fill={favorite ? "red" : "transparent"}
            color={favorite ? "red" : "black"}
          />
        </button>
      </div>
    </a>
  );
}

export default Card;
