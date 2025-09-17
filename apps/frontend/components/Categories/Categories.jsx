import React from "react";
import Category from "@/components/Category/Category";
import { categories } from "@/data/categories";

function Categories() {
  return (
    <div className="mt-2 flex w-full flex-wrap items-center gap-4">
      {categories.map((category) => (
        <Category key={category.id} category={category.category} />
      ))}
    </div>
  );
}

export default Categories;
