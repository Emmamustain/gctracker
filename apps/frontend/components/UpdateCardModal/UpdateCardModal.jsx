"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import useCardsStore from "@/hook/useCardsStore";
import { useState } from "react";

function UpdateCardModal({ cardId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputName, setInputName] = useState(cardId.name);
  const [inputBalance, setInputBalance] = useState(cardId.balance);
  const { updateName } = useCardsStore();
  const { updateBalance } = useCardsStore();
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div>
        <button
          onClick={toggleModal}
          className="mt-10 h-fit w-fit cursor-pointer rounded-2xl bg-violet-300 px-4 py-2 font-medium text-gray-800 hover:bg-violet-400"
        >
          Update Card
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-1/2 left-1/2 flex h-fit min-h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between rounded-2xl bg-gray-50 p-6">
          <div className="flex h-fit w-full flex-col items-center gap-1 rounded-lg">
            <div className="flex h-fit w-fit justify-center rounded-4xl bg-black p-2">
              <CreditCard color="white" size={20} />{" "}
            </div>
            <h1 className="pt-1 font-semibold text-gray-800"> Add New Card</h1>
            <p className="px-10 text-sm font-light text-gray-500">
              Update your gift card details here to easily track your balance
              <br />
              <span className="block text-center">
                and keep your digital funds organized
              </span>
            </p>
          </div>
          <div className="mt-2 h-[200px] w-full rounded-lg bg-gray-200">
            <img
              src={cardId.image}
              alt=""
              className="h-full w-full bg-gray-50 object-contain"
            />
          </div>
          <div className="mt-4 flex h-fit w-full flex-col gap-2 rounded-lg">
            <label className="pl-2 font-normal text-gray-600">
              Your gift Card Brand
            </label>
            <div className="cursor-not-allowed rounded-xl border-1 border-gray-300 bg-gray-200 px-3 py-2">
              {cardId.brand}
            </div>
            <label className="pl-2 font-normal text-gray-600">
              Enter the name of your card
            </label>
            <input
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
              }}
              type="text"
              className="h-10 w-full rounded-xl border-1 border-gray-300 pl-3"
            />
            <label className="pl-2 font-normal text-gray-600">
              The card code
            </label>
            <div className="flex h-10 w-full cursor-not-allowed items-center rounded-xl border-1 border-gray-300 bg-gray-200 pl-3">
              {cardId.code}
            </div>
            <label className="pl-2 font-normal text-gray-600">
              The card Pin
            </label>
            <div className="flex h-10 w-full cursor-not-allowed items-center rounded-xl border-1 border-gray-300 bg-gray-200 pl-3">
              {cardId.pin}
            </div>
            <label className="pl-2 font-normal text-gray-600">
              Enter the Balance
            </label>
            <input
              value={inputBalance}
              onChange={(e) => setInputBalance(e.target.value)}
              type="number"
              className="h-10 w-full rounded-xl border-1 border-gray-300 pl-3"
            />
          </div>

          <div className="mt-6 flex h-fit w-full justify-between gap-2 rounded-lg p-2">
            <button
              className="flex h-10 w-fit cursor-pointer items-center rounded-lg border-1 border-gray-400 px-3 py-2 font-medium text-gray-600 hover:cursor-pointer hover:bg-gray-200"
              onClick={toggleModal}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                updateName(cardId.id, inputName);
                updateBalance(cardId.id, inputBalance);
                toggleModal();
              }}
              className="flex h-10 w-fit items-center rounded-lg border-1 border-blue-700 bg-blue-600 px-3 py-2 font-medium text-amber-50 hover:cursor-pointer hover:border-blue-500 hover:bg-blue-500"
            >
              Update card
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdateCardModal;
