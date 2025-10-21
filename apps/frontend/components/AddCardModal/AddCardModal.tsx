"use client";

import React from "react";
import { PlusCircle, CreditCard } from "lucide-react";
import { useState } from "react";
import BarCodeScanner from "@/components/BarCodeScanner/BarCodeScanner";
import { TBrand, TCreateGiftcard, TGiftspace } from "@shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores/user.store";

function AddCardModal() {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState("");
  const [brand, setBrand] = useState("none");
  const [giftspace, setGiftspace] = useState("none");
  const [isOpen, setIsOpen] = useState(false);
  const [barCode, setBarCode] = useState("");
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  console.log({ brand });

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

  const selectedBrand = brands?.find((v) => v.id === brand);
  console.log({ selectedBrand });

  async function getGiftspaces(): Promise<TGiftspace[]> {
    if (!user) return [];
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftspaces/${user?.id}`,
    );
    return response.json();
  }

  const { data: giftspaces } = useQuery({
    queryKey: ["getGiftspaces"],
    queryFn: getGiftspaces,
  });

  const createGiftcard = useMutation({
    mutationFn: ({
      brand,
      code,
      name,
      pin,
      balance,
      giftspace,
    }: TCreateGiftcard) => {
      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/giftcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brand, code, name, pin, balance, giftspace }),
      });
    },
    onSuccess: async () => {
      // If you're invalidating a single query
      await queryClient.invalidateQueries({ queryKey: ["getGiftcards"] });
    },
  });

  return (
    <div>
      <div className="flex justify-self-end px-6" onClick={toggleModal}>
        <button className="flex cursor-pointer items-center rounded-lg bg-black px-3 py-2 font-medium text-amber-50 hover:bg-gray-700">
          <PlusCircle size={21} />
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-1/2 left-1/2 z-50 flex h-fit min-h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between rounded-2xl bg-gray-50 p-6">
          <div className="flex h-fit w-full flex-col items-center gap-1 rounded-lg">
            <div className="flex h-fit w-fit justify-center rounded-4xl bg-black p-2">
              <CreditCard color="white" size={20} />{" "}
            </div>
            <h1 className="pt-1 font-semibold text-gray-800"> Add New Card</h1>
            <p className="px-10 text-sm font-light text-gray-500">
              Add your gift card details here and
              <br />
              <span className="block text-center">track your balance</span>
            </p>
          </div>
          <div className="mt-2 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200">
            {barCode === "" && <BarCodeScanner setBarCode={setBarCode} />}
            {selectedBrand && barCode !== "" ? (
              <img
                src={selectedBrand.imageUrl ?? ""}
                alt=""
                className="h-full w-full bg-gray-50 object-contain"
              />
            ) : null}
          </div>
          <div className="mt-4 flex h-fit w-full flex-col gap-2 rounded-lg">
            <label className="pl-2 font-normal text-gray-600">
              Select your gift Card brand
            </label>
            <select
              className="rounded-xl border-1 border-gray-300 px-3 py-2"
              name="Selectedbrand"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
              }}
            >
              <option value="none" disabled>
                Select a brand
              </option>

              {brands?.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <label className="pl-2 font-normal text-gray-600">
              Select your giftspace
            </label>
            <select
              className="rounded-xl border-1 border-gray-300 px-3 py-2"
              name="SelectedCard"
              value={giftspace}
              onChange={(e) => {
                setGiftspace(e.target.value);
              }}
            >
              <option value="none" disabled>
                Select a giftspace
              </option>

              {giftspaces?.map((giftspace) => (
                <option key={giftspace.id} value={giftspace.id}>
                  {giftspace.name}
                </option>
              ))}
            </select>
            <label className="pl-2 font-normal text-gray-600">
              Enter the name of your card
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
              className="h-10 w-full rounded-xl border-1 border-gray-300 pl-3"
              placeholder="ex : HEMA"
            />
            <label className="pl-2 font-normal text-gray-600">
              Enter the code
            </label>
            <input
              value={barCode}
              onChange={(e) => {
                setBarCode(e.target.value);
              }}
              type="text"
              className="h-10 w-full rounded-xl border-1 border-gray-300 pl-3"
              placeholder="ex: 12345678"
            />
            <label className="pl-2 font-normal text-gray-600">
              Enter the PIN
            </label>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type="number"
              className="h-10 w-full rounded-xl border-1 border-gray-300 pl-3"
              placeholder="ex : 1234"
            />
            <label className="pl-2 font-normal text-gray-600">
              Enter the Balance
            </label>
            <input
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              type="number"
              className="h-10 w-full rounded-xl border-1 border-gray-300 pl-3"
              placeholder="ex : 30.7$"
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
                createGiftcard.mutate({
                  brand,
                  code: barCode,
                  pin,
                  balance: balance.trim() === "" ? "-1" : balance,
                  giftspace,
                  name,
                  favorite: false,
                });
                toggleModal();
              }}
              className="flex h-10 w-fit items-center rounded-lg border-1 border-blue-700 bg-blue-600 px-3 py-2 font-medium text-amber-50 hover:cursor-pointer hover:border-blue-500 hover:bg-blue-500"
            >
              Add card
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCardModal;
