import React, { useState } from 'react';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        image: '',
        amountInStock: 0,
        category: ''
    });
    const [showForm, setShowForm] = useState(false); 


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value  

            

        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(formData.price) || 0,  
            amountInStock: parseInt(formData.amountInStock, 10) || 0 
        };
    
        try {
            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)  
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create product');
            alert('Product added successfully!');
            
            setFormData({
                name: '',
                description: '',
                price: 0,
                image: '',
                amountInStock: 0,
                category: ''
            });
            setShowForm(false);
        } catch (error) {
            console.error('Failed to add product:', error);
            alert('Failed to add product: ' + error.message);
        }
    };
        

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    return (
        <div>
            <button onClick={toggleFormVisibility} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {showForm ? "Hide Form" : "Add Product"}
            </button>
            {showForm && (
                
                <div className=' pt-6'>
                <form onSubmit={handleSubmit} className="mt-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className=" border-2 rounded-md border-lime-600 mt-2"/>
             <br />
                    <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className=" border-2 rounded-md border-lime-600 mt-2"/>
               <br />
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required className=" border-2 rounded-md border-lime-600 mt-2"/>
               <br />
                    <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className=" border-2 rounded-md border-lime-600 mt-2"/>
               <br />
                    <input type="number" name="amountInStock" value={formData.amountInStock} onChange={handleChange} placeholder="Amount in Stock" required className=" border-2 rounded-md border-lime-600 mt-2"/>
               <br />
               
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">Add Product</button>
                </form>
                </div>
            )}
        </div>
    );
};

export default AddProduct;