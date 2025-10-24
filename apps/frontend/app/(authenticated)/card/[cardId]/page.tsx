"use client";

import SearchBar from "@/components/SearchBar/SearchBar.jsx";
import { HistoryIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { TBrand, TGiftcard } from "@shared/types";
import { useQuery } from "@tanstack/react-query";

function CardPage() {
  const params = useParams();
  const cardId = params.cardId;

  async function getCard(): Promise<TGiftcard> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftcards/${cardId}`,
    );
    return response.json();
  }
  const { data: giftcard } = useQuery({
    queryKey: ["getGiftcard"],
    queryFn: getCard,
    enabled: Boolean(cardId),
  });

  console.log({ giftcard });

  async function getBrands(): Promise<TBrand[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/brands`,
    );
    return response.json();
  }
  const { data: brands } = useQuery({
    queryKey: ["getBrands"],
    queryFn: getBrands,
  });

  const selectedBrand = brands?.find((v) => v.id === giftcard?.brand);
  const codeCopied = giftcard?.code;

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

        {/* <UpdateCardModal cardId={giftcard?.id} /> */}

        <div className="mt-6 flex h-[350px] w-full flex-col justify-between overflow-hidden rounded-2xl bg-gray-200 p-4">
          <div className="flex justify-between">
            <div className="flex h-fit w-[100px] items-center justify-between gap-2">
              <div className="h-10 w-fit">
                <img
                  src={selectedBrand?.imageUrl ?? ""}
                  alt=""
                  className="h-full w-full bg-gray-50 object-contain"
                />
              </div>
              <div className="font-semibold">{giftcard?.brand}</div>
            </div>
            <div className="text-2xl font-bold text-violet-600">
              {giftcard?.name}
            </div>
            <div className="flex w-[100px] justify-end font-mono font-semibold text-gray-900">
              {giftcard?.balance}€
            </div>
          </div>

          <div className="libre-barcode-39-regular flex h-[100px] w-full scale-y-200 items-center justify-center text-[60px]">
            {giftcard?.code}
          </div>

          <button
            onClick={() => copyToClipBoard(codeCopied ?? "")}
            className="flex cursor-pointer items-center justify-center rounded-xl bg-gray-900 px-4 py-3 font-mono text-lg text-amber-50 hover:bg-gray-700"
          >
            {giftcard?.code}
          </button>
        </div>

        <div className="mt-4 flex h-fit w-full justify-between px-4 font-medium text-gray-600">
          <div className="flex cursor-pointer items-center hover:text-gray-500">
            <HistoryIcon size={18} className="mr-2" />
            Card History
          </div>

          {/* <DeleteCardModal nameCard={giftcard?.name} idCard={giftcard?.id} /> */}
        </div>
      </div>
    </>
  );
}

export default CardPage;
