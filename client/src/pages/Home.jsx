import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

// Images from assets
const imageModules = import.meta.glob(
  "../assets/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

function Home({
  addToCart,
  toggleWishlist,
  wishlistItems,
}) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // Get products from MongoDB
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        const productsWithImages = data.map((product) => {
          const imagePath = `../assets/${product.image}`;

          return {
            ...product,
            image: imageModules[imagePath],
          };
        });

        setProducts(productsWithImages);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Product Fetch Error:", error);

        setError("Unable to load products");
        setLoading(false);
      });
  }, []);


  // Search + Category Filter
  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      category === "All" ||
      product.category === category;

    return searchMatch && categoryMatch;
  });


  // Only 6 products on Home
  const homeProducts = filteredProducts.slice(0, 6);


  return (
    <section className="hero">

      <h1>Discover Amazing Products</h1>

      <p>Best Deals at Best Prices</p>


      <button onClick={() => navigate("/products")}>
        Shop Now
      </button>


      <br />
      <br />


      {/* Search */}
      <SearchBar
        search={search}
        setSearch={setSearch}
      />


      <br />


      {/* Category Buttons */}

      <div className="category-buttons">

        <button
          onClick={() => setCategory("All")}
        >
          All
        </button>


        <button
          onClick={() =>
            setCategory("Electronics")
          }
        >
          Electronics
        </button>


        <button
          onClick={() =>
            setCategory("Watches")
          }
        >
          Watches
        </button>


        <button
          onClick={() =>
            setCategory("Footwear")
          }
        >
          Footwear
        </button>

      </div>


      <br />


      {/* Loading */}

      {loading && (
        <h3>Loading Products...</h3>
      )}


      {/* Error */}

      {error && (
        <h3>{error}</h3>
      )}


      {/* Products */}

      {!loading && !error && (

        <>
          <div className="products">

            {homeProducts.length > 0 ? (

              homeProducts.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  wishlistItems={wishlistItems}
                />

              ))

            ) : (

              <h3>No Products Found</h3>

            )}

          </div>


          {/* View More */}

          {filteredProducts.length > 6 && (

            <button
              onClick={() => navigate("/products")}
              style={{
                marginTop: "30px",
                padding: "12px 25px",
                cursor: "pointer",
              }}
            >
              View More Products
            </button>

          )}

        </>

      )}

    </section>
  );
}

export default Home;