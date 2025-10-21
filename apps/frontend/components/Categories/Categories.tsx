"use client";
import React from "react";
import Category from "@/components/Category/Category";
import { useQuery } from "@tanstack/react-query";
import { TCategory } from "@shared/types";

function Categories() {
  async function getCategories(): Promise<TCategory[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`,
    );
    return response.json();
  }

  // Queries
  const { data: categories } = useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategories,
  });
  return (
    <div className="mt-2 flex w-full flex-wrap items-center gap-4">
      {categories?.map((category) => (
        <Category key={category.id} category={category.name} />
      ))}
    </div>
  );
}

export default Categories;
