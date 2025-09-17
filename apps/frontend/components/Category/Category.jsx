import React from "react";

function Category({ category }) {
  return (
    <div className="w-fit h-10 bg-gray-300 rounded-lg flex items-center px-2">
      {category}
    </div>
  );
}

export default Category;
