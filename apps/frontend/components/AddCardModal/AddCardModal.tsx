"use client";

import React, { useEffect } from "react";
import { PlusCircle, CreditCard, Plus } from "lucide-react";
import { useState } from "react";
import BarCodeScanner from "@/components/BarCodeScanner/BarCodeScanner";
import { TBrand, TCreateGiftcard, TGiftspace } from "@shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores/user.store";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const resetForm = () => {
    setBalance("");
    setBarCode("");
    setName("");
    setPin("");
    setBrand("none");
    setGiftspace("none");
  };

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

  const selectedBrand = brands?.find((v: TBrand) => v.id === brand);

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
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (giftspaces && giftspaces.length > 0 && giftspace === "none") {
      setGiftspace(giftspaces[0].id);
    }
  }, [giftspaces]);

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
      await queryClient.invalidateQueries({ queryKey: ["getGiftcards"] });
      setIsOpen(false);
      resetForm();
      toast.success("Giftcard Created", {
        description: "Your giftcard has been created successfully!",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="rounded-full">
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <CreditCard className="text-primary h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl">
            Add New Card
          </DialogTitle>
          <DialogDescription className="text-center">
            Add your gift card details here and track your balance.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="bg-muted flex h-[160px] w-full items-center justify-center overflow-hidden rounded-lg">
            {barCode === "" && <BarCodeScanner setBarCode={setBarCode} />}
            {selectedBrand && barCode !== "" ? (
              <img
                src={selectedBrand.imageUrl ?? ""}
                alt=""
                className="h-full w-full object-contain p-4"
              />
            ) : null}
          </div>

          <div className="flex w-full items-end gap-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="brand">Brand</Label>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands?.map((b: TBrand) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid flex-1 gap-2">
              <Label htmlFor="giftspace">Giftspace</Label>
              <Select value={giftspace} onValueChange={setGiftspace}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Giftspace" />
                </SelectTrigger>
                <SelectContent>
                  {giftspaces?.map((gs: TGiftspace) => (
                    <SelectItem key={gs.id} value={gs.id}>
                      {gs.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Card Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: My HEMA Card"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Card Code</Label>
              <Input
                id="code"
                value={barCode}
                onChange={(e) => setBarCode(e.target.value)}
                placeholder="12345678"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="****"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
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
            }}
            disabled={
              createGiftcard.isPending ||
              brand === "none" ||
              giftspace === "none"
            }
          >
            {createGiftcard.isPending ? "Adding..." : "Add Card"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddCardModal;
