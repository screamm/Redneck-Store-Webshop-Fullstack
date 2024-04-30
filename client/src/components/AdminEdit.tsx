import React, { useState } from "react";
import DeleteProduct from './DeleteProduct';

const AdminEdit = () => {
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editProductId, setEditProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  const toggleFetchProducts = async () => {
    if (!showProducts) {
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
    } else {
      setProducts([]); // Clear products when hiding them
    }
    setShowProducts(!showProducts); // Toggle the showProducts state
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
      toggleFetchProducts(); // Refresh the list
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
      <h1 className=" font-bold text-3xl">Product Administration</h1>
      <button onClick={toggleFetchProducts} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {showProducts ? "Hide Products" : "Fetch Products"}
      </button>
      {showProducts && products.map((product) => (
        <div key={product._id} className="product-item mt-4">
          {editProductId === product._id ? (
            <div>
              <input type="text" name="name" value={editFormData.name} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
             <br />
              <input type="number" name="price" value={editFormData.price} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
             <br />
              <input type="text" name="description" value={editFormData.description} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
             <br />
              <input type="text" name="image" value={editFormData.image} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
             <br />
              <button onClick={handleEditProduct} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">Save</button>
            </div>
          ) : (
            <div>
              <h3>{product.name} - ${product.price}</h3>
              <p>{product.description}</p>
              <img src={product.image} alt={product.name} style={{ width: '100px' }}/>
              <button onClick={() => handleEditClick(product)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
              <DeleteProduct productId={product._id} fetchProducts={toggleFetchProducts} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminEdit;













































// import React, { useState } from "react";
// import DeleteProduct from './DeleteProduct';

// const AdminEdit = () => {
//   const [products, setProducts] = useState([]);
//   const [showProducts, setShowProducts] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [editProductId, setEditProductId] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     name: '',
//     price: '',
//     description: '',
//     image: ''
//   });

// //   const fetchProducts = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await fetch("http://localhost:3000/products");
// //       const data = await response.json();
// //       if (!response.ok) throw new Error(data.message || "Failed to fetch products");
// //       setProducts(data);
// //     } catch (error) {
// //       setError("Failed to fetch products: " + error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// const toggleFetchProducts = async () => {
//     if (!showProducts) {
//       setLoading(true);
//       try {
//         const response = await fetch("http://localhost:3000/products");
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to fetch products");
//         setProducts(data);
//       } catch (error) {
//         setError("Failed to fetch products: " + error.message);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setProducts([]); // Clear products when hiding them
//     }
//     setShowProducts(!showProducts); // Toggle the showProducts state
//   };



//   const handleEditClick = (product) => {
//     setEditProductId(product._id);
//     setEditFormData({
//       name: product.name,
//       price: product.price,
//       description: product.description,
//       image: product.image
//     });
//   };

//   const handleEditProduct = async () => {
//     if (!editProductId) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3000/products/${editProductId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editFormData),
//       });
//       if (!response.ok) throw new Error("Failed to update the product");
//       await response.json();
//       setEditProductId(null); // Hide the input fields again
//       fetchProducts(); // Refresh the list
//     } catch (error) {
//       console.error("Failed to update product:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData(prev => ({
//       ...prev,
//       [name]: name === 'price' ? parseFloat(value) || 0 : value
//     }));
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h1>Product Administration</h1>
//       <button onClick={fetchProducts} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Fetch Products</button>
//       {products.length > 0 && products.map((product) => (
//         <div key={product._id} className="product-item mt-4">
//           {editProductId === product._id ? (
//             <>
//               <input type="text" name="name" value={editFormData.name} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
//               <br />
//               <input type="number" name="price" value={editFormData.price} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
//               <br />
//               <input type="text" name="description" value={editFormData.description} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
//               <br />
//               <input type="text" name="image" value={editFormData.image} onChange={handleChange} className=" border-2 rounded-md border-lime-600 mt-2"/>
//               <br />
//               <button onClick={handleEditProduct} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 mb-10">Save</button>
//             </>
//           ) : (
//             <>
//             <div >
//               <h3>{product.name} - ${product.price}</h3>
//                 <p>{product.description}</p>
//                 <img src={product.image} alt={product.name} className="w-1/6"/>
//               <button onClick={() => handleEditClick(product)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
//               <DeleteProduct productId={product._id} fetchProducts={fetchProducts} />
//               </div>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminEdit;