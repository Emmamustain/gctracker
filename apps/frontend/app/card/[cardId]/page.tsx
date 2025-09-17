"use client";

import SearchBar from "@/components/SearchBar/SearchBar.jsx";
import { Trash2Icon, HistoryIcon } from "lucide-react";
import useCardStore from "@/hook/useCardsStore.jsx";
import DeleteCardModal from "@/components/DeleteCardModal/DeleteCardModal.jsx";
import UpdateCardModal from "@/components/UpdateCardModal/UpdateCardModal.jsx";
import { useParams } from "next/navigation";

function CardPage() {
  const params = useParams();
  const cardId = params.cardId;
  const { getCardById } = useCardStore();
  const selectedCard = getCardById(cardId);

  if (!selectedCard) {
    return <div>Card not found</div>;
  }

  const codeCopied = selectedCard.code;

  async function copyToClipBoard(copyCode: string) {
    try {
      await navigator.clipboard.writeText(copyCode);
      alert("code bar copied successfully!");
    } catch (error) {
      console.error("Failed to copy text", error);
    }
  }

  return (
    <>
      <div className="w-full max-w-[800px] justify-self-center p-2">
        <div className="block md:hidden">
          <SearchBar />
        </div>

        <UpdateCardModal cardId={selectedCard} />

        <div className="mt-6 flex h-[350px] w-full flex-col justify-between overflow-hidden rounded-2xl bg-gray-200 p-4">
          <div className="flex justify-between">
            <div className="flex h-fit w-[100px] items-center justify-between gap-2">
              <div className="h-10 w-fit">
                <img
                  src={selectedCard.image}
                  alt=""
                  className="h-full w-full bg-gray-50 object-contain"
                />
              </div>
              <div className="font-semibold">{selectedCard.brand}</div>
            </div>
            <div className="text-2xl font-bold text-violet-600">
              {selectedCard.name}
            </div>
            <div className="flex w-[100px] justify-end font-mono font-semibold text-gray-900">
              {selectedCard.balance}€
            </div>
          </div>

          <div className="libre-barcode-39-regular flex h-[100px] w-full scale-y-200 items-center justify-center text-[60px]">
            {selectedCard.code}
          </div>

          <button
            onClick={() => copyToClipBoard(codeCopied)}
            className="flex cursor-pointer items-center justify-center rounded-xl bg-gray-900 px-4 py-3 font-mono text-lg text-amber-50 hover:bg-gray-700"
          >
            {selectedCard.code}
          </button>
        </div>

        <div className="mt-4 flex h-fit w-full justify-between px-4 font-medium text-gray-600">
          <div className="flex cursor-pointer items-center hover:text-gray-500">
            <HistoryIcon size={18} className="mr-2" />
            Card History
          </div>

          <DeleteCardModal
            nameCard={selectedCard.name}
            idCard={selectedCard.id}
          />
        </div>
      </div>
    </>
  );
}

export default CardPage;
