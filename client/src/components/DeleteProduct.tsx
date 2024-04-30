// import React from 'react';

export const DeleteProduct = ({ productId, fetchProducts }) => {
  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3000/products/${productId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete the product");

      alert("Product deleted successfully!");
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product: " + error.message);
    }
  };

  return (
    <button onClick={handleDeleteProduct} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16 ml-4">
      Delete
    </button>
  );
};
export default DeleteProduct;