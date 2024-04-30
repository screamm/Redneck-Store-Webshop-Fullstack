// import React, { useEffect, useState } from "react";
// import EditProduct from "./EditProduct";
// import {DeleteProduct} from "./DeleteProduct";

// const AdminEdit = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [editProductId, setEditProductId] = useState(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:3000/products");
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch products");
//       setProducts(data);
//     } catch (error) {
//       setError("Failed to fetch products: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveEdit = async (productId, updatedData) => {
//     try {
//       const response = await fetch(`http://localhost:3000/products/${productId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedData),
//       });
//       await response.json();
//       fetchProducts(); // Refresh the list
//       setEditProductId(null); // Reset edit mode
//     } catch (error) {
//       console.error("Failed to update product:", error);
//     }
//   };

//   const cancelEdit = () => {
//     setEditProductId(null);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h1 className=" text-white font-bold py-2 px-4 rounded mt-4 mb-16 ml-4 text-3xl">Product Administration</h1>
//       <button onClick={fetchProducts} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16 ml-4">Fetch Products</button>
//       {products.map((product) => (
//         <div key={product._id} className="product-item">
//           {editProductId === product._id ? (
//             <EditProduct product={product} saveEdit={handleSaveEdit} cancelEdit={cancelEdit} />
//           ) : (
//             <>
//               <h3>{product.name} - ${product.price}</h3>
//               <button onClick={() => setEditProductId(product._id)}>Edit</button>
//               <EditProduct product={product} saveEdit={handleSaveEdit} cancelEdit={cancelEdit} />
//               {/* <button onClick={() => handleDeleteProduct(product._id)}>Delete</button> */}
//               <DeleteProduct productId={product._id} fetchProducts={fetchProducts} />
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };
import React, { useState } from "react";
import DeleteProduct from './DeleteProduct';

const AdminEdit = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editProductId, setEditProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch products");
      setProducts(data);
    } catch (error) {
      setError("Failed to fetch products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditProductId(product._id);
    setEditFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image
    });
  };

  const handleEditProduct = async () => {
    if (!editProductId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/products/${editProductId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) throw new Error("Failed to update the product");
      await response.json();
      setEditProductId(null); // Hide the input fields again
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Product Administration</h1>
      <button onClick={fetchProducts} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Fetch Products</button>
      {products.length > 0 && products.map((product) => (
        <div key={product._id} className="product-item mt-4">
          {editProductId === product._id ? (
            <>
              <input type="text" name="name" value={editFormData.name} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
              <br />
              <input type="number" name="price" value={editFormData.price} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
              <br />
              <input type="text" name="description" value={editFormData.description} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
              <br />
              <input type="text" name="image" value={editFormData.image} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
              <br />
              <button onClick={handleEditProduct} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 mb-10">Save</button>
            </>
          ) : (
            <>
            <div >
              <h3>{product.name} - ${product.price}</h3>
                <p>{product.description}</p>
                <img src={product.image} alt={product.name} className="w-1/6"/>
              <button onClick={() => handleEditClick(product)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
              <DeleteProduct productId={product._id} fetchProducts={fetchProducts} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminEdit;

// export default AdminEdit;


//********************************************************************************************************************************************************************** */
// import React, { useEffect, useState } from "react";

// const AdminEdit = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [editProductId, setEditProductId] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     name: '',
//     price: '',
//     description: ''
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:3000/products");
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch products");
//       setProducts(data);
//     } catch (error) {
//       setError("Failed to fetch products: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddProduct = async () => {
//     // Example product data - Adjust according to your product structure
//     const newProduct = {
//       name: "New Product",
//       description: "Description of new product",
//       price: 100,
//       category: "New Category",
//       image: "url_to_image",
//       amountInStock: 50
//     };

//     try {
//       const response = await fetch("http://localhost:3000/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newProduct),
//       });
//       await response.json();
//       fetchProducts(); // Refresh the list
//     } catch (error) {
//       console.error("Failed to add product:", error);
//     }
//   };

//   const handleEditProduct = async (productId) => {
//     if (editProductId && editProductId === productId) {
//       // Submit updated data
//       try {
//         const response = await fetch(`http://localhost:3000/products/${productId}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(editFormData),
//         });
//         await response.json();
//         fetchProducts(); // Refresh the list
//         setEditProductId(null);
//       } catch (error) {
//         console.error("Failed to update product:", error);
//       }
//     } else {
//       setEditProductId(productId);
//       const product = products.find(p => p._id === productId);
//       setEditFormData({
//         name: product.name,
//         price: product.price,
//         description: product.description
//       });
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/products/${productId}`, {
//         method: "DELETE",
//       });
//       await response.json();
//       fetchProducts(); // Refresh the list
//     } catch (error) {
//       console.error("Failed to delete product:", error);
//     }
//   };



// const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'price') {
//       setEditFormData({
//         ...editFormData,
//         [name]: parseFloat(value) || 0 // Converts string to a float, default to 0 if conversion fails
//       });
//     } else {
//       setEditFormData({
//         ...editFormData,
//         [name]: value
//       });
//     }
//   };



//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h1>Product Administration</h1>
//       <button onClick={fetchProducts} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16 ml-4">Fetch Products</button>
//       <button onClick={handleAddProduct} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16 ml-4">Add New Product</button>
//       {products.map((product) => (
//         <div key={product._id} className="product-item">
//           {editProductId === product._id ? (
//             <>
//               <input type="text" placeholder="Name" name="name" value={editFormData.name} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2" />
//               <br />
//               <input type="number" placeholder="Price" name="price" value={editFormData.price} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2" />
//               <br />
//               <input type="text" placeholder="Description" name="description" value={editFormData.description} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2" />
//               <br />
//               <button onClick={() => handleEditProduct(product._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16 ml-4">Save</button>
//             </>
//           ) : (
//             <>
//               <h3>{product.name} - ${product.price}</h3>
//               <button onClick={() => setEditProductId(product._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16 ml-4">Edit</button>
//               <button onClick={() => handleDeleteProduct(product._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-16 ml-4">Delete</button>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminEdit;