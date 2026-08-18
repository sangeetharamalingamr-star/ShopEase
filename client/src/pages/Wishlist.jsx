function Wishlist({ wishlistItems }) {
  return (
    <div style={{ padding: "30px" }}>
      <h1>❤️ My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p>No products in wishlist.</p>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                width: "220px",
                textAlign: "center",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                width="150"
              />

              <h3>{item.name}</h3>

              <p>₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;