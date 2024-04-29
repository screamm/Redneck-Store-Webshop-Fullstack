import React, { useState } from "react";

const EditProduct = ({ product, saveEdit, cancelEdit }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = () => {
    saveEdit(product._id, formData); // Call the function passed via props to save the edited data
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className=" border-2 rounded-md border-lime-600 mt-2"
      />
      <br />
      <input
        type="number"
        placeholder="Price"
        name="price"
        value={formData.price}
        onChange={handleChange}
        className=" border-2 rounded-md border-lime-600 mt-2"
      />
      <br />
      <input
        type="text"
        placeholder="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        className=" border-2 rounded-md border-lime-600 mt-2"
      />
      <br />
      <input
        type="text"
        placeholder="Image URL"
        name="image"
        value={formData.image}
        onChange={handleChange}
        className=" border-2 rounded-md border-lime-600 mt-2"
      />
      <br />
      <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16 ml-4">Save</button>
      <button onClick={() => cancelEdit()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16 ml-4">Cancel</button>
    </div>
  );
};

export default EditProduct;
