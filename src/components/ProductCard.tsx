import { useDispatch } from "react-redux";
import { addToCart } from "../app/cartSlice";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;

  rating?: {
    rate: number;
  };
}

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );

    alert("Your item has been added to cart!");
  };

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "1rem",
        margin: "1rem",
      }}
    >
      <img
        src={product.image}
        alt={product.title}
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/150";
        }}
        width="150"
      />

      <h3>{product.title}</h3>

      <p>${product.price.toFixed(2)}</p>

      <p>{product.category}</p>

      <p>{product.description}</p>

      {product.rating && (
        <p>
          Rating: {product.rating.rate}
        </p>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}