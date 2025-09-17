import { HeartIcon } from "lucide-react";
import React from "react";
import useCardsStore from "@/hook/useCardsStore";

function Card({ logo, id, favorite }) {
  const { updateFavorite } = useCardsStore();
  return (
    <a key={id} href={`card/${id}`}>
      <div className="flex h-[200px] w-[350px] justify-center rounded-lg border-1 border-gray-200 bg-gray-100 shadow-md">
        <img
          src={`${logo}`}
          alt={`${logo} Logo Card`}
          className="max-w-64 rounded-lg object-contain"
        />
        <button
          className="mt-2 h-fit w-fit cursor-pointer rounded-4xl bg-gray-200 p-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateFavorite(id);
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
