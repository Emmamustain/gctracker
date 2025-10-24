"use client";

import { TGiftspace } from "@shared/types";
import { useUserStore } from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoaderCircleIcon } from "lucide-react";

function Home() {
  const { user } = useUserStore();
  const router = useRouter();
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

  const primaryGiftspace = giftspaces?.[0];
  useEffect(() => {
    if (primaryGiftspace) {
      router.push(`/giftspace/${primaryGiftspace.id}`);
    }
  }, [primaryGiftspace]);
  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center">
        <LoaderCircleIcon size={40} color="gray" />
      </div>
    </>
  );
}

export default Home;
