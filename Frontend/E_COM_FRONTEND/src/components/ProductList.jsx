import { useEffect, useState } from "react";
import "../components/Card.css";
export default function ProductList() {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    fetch("http://localhost:3000/api/products") 
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []); 

  return (
  <div>
    <h2>Product List</h2>
    {products.length === 0 ? (
      <p>No products found.</p>
    ) : (
      <div className="card-container">
        {products.map((product) => (
          <div key={product.id} className="card">
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p>Price: ₹{product.price}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
