"use client";

import React from "react";
import { useState } from "react";
import useCardsStore from "@/hook/useCardsStore";
import { Trash2Icon } from "lucide-react";

function DeleteCardModal({ nameCard, idCard }) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteCard } = useCardsStore();
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        className="flex cursor-pointer items-center hover:text-gray-500"
        onClick={toggleModal}
      >
        {" "}
        <Trash2Icon size={18} className="mr-2" />
        Delete Card
      </div>
      {isOpen && (
        <div className="absolute top-32 left-1/2 flex h-fit min-h-[260px] w-[600px] -translate-x-1/2 flex-col items-center justify-between rounded-2xl bg-gray-50 p-6">
          <div className="text-2xl font-bold text-gray-900">Delete Card</div>
          <div className="flex h-[50px] w-fit items-center rounded-lg border-1 border-violet-200 bg-violet-100 p-4 font-light text-gray-600">
            {`Are you sure you want to delete the ' ${nameCard} ' card ?`}
          </div>
          <div className="flex h-fit w-full justify-between gap-2 rounded-lg p-2">
            <button
              className="flex h-10 w-fit cursor-pointer items-center rounded-lg border-1 border-gray-400 px-3 py-2 font-medium text-gray-600 hover:bg-gray-200"
              onClick={toggleModal}
            >
              Cancel
            </button>
            <button
              className="flex cursor-pointer items-center rounded-lg border-1 border-violet-300 bg-violet-200 px-3 py-2 font-medium text-violet-500 hover:border-violet-300 hover:bg-violet-300 hover:text-violet-800"
              onClick={() => {
                console.log(idCard);
                deleteCard(idCard);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteCardModal;
