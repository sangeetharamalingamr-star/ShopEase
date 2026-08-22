import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Images from assets
const imageModules = import.meta.glob(
  "../assets/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // Get single product from MongoDB
  useEffect(() => {
  fetch(`https://shopease-backend-hdgf.onrender.com/api/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }

        return response.json();
      })
      .then((data) => {

        const imagePath = `../assets/${data.image}`;

        const productWithImage = {
          ...data,
          image: imageModules[imagePath],
        };

        setProduct(productWithImage);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Product Error:", error);

        setError("Product Not Found");
        setLoading(false);
      });
  }, [id]);


  // Loading
  if (loading) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Loading Product...
      </h2>
    );
  }


  // Error
  if (error || !product) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Product Not Found
      </h2>
    );
  }


  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
      }}
    >

      <img
        src={product.image}
        alt={product.name}
        width="250"
      />


      <h1>{product.name}</h1>


      <h2>₹{product.price}</h2>


      <p>
        {product.description ||
          "No description available"}
      </p>


      <p>
        <strong>Category:</strong>{" "}
        {product.category}
      </p>

    </div>
  );
}

export default ProductDetails;