import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

// Images from assets folder
const imageModules = import.meta.glob(
  "../assets/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

function Products({
  addToCart,
  toggleWishlist,
  wishlistItems,
}) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // Get products from MongoDB
  useEffect(() => {
  fetch("https://shopease-backend-hdgf.onrender.com/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })

      .then((data) => {

        // Add actual React image URL
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


  // Copy filtered products for sorting
  const sortedProducts = [...filteredProducts];


  // Price Low → High
  if (sortBy === "low") {

    sortedProducts.sort(
      (a, b) => a.price - b.price
    );

  }


  // Price High → Low
  if (sortBy === "high") {

    sortedProducts.sort(
      (a, b) => b.price - a.price
    );

  }


  // A → Z
  if (sortBy === "az") {

    sortedProducts.sort(
      (a, b) =>
        a.name.localeCompare(b.name)
    );

  }


  // Z → A
  if (sortBy === "za") {

    sortedProducts.sort(
      (a, b) =>
        b.name.localeCompare(a.name)
    );

  }


  return (
    <div style={{ padding: "40px" }}>

      <h1>All Products</h1>


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


      {/* Sorting */}

      <select
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value)
        }
      >

        <option value="">
          Sort Products
        </option>

        <option value="low">
          Price Low → High
        </option>

        <option value="high">
          Price High → Low
        </option>

        <option value="az">
          A-Z
        </option>

        <option value="za">
          Z-A
        </option>

      </select>


      <br />
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

        <div className="products">

          {sortedProducts.length > 0 ? (

            sortedProducts.map((product) => (

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

      )}

    </div>
  );
}

export default Products;