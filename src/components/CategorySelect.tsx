import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface CategorySelectProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const fetchCategories = async (): Promise<string[]> => {
  const productsRef = collection(db, "products");

  const snapshot = await getDocs(productsRef);

  const categories = snapshot.docs
    .map((doc) => doc.data().category)
    .filter((category): category is string => Boolean(category));

  // Remove duplicate categories
  return [...new Set(categories)];
};

export default function CategorySelect({
  selectedCategory,
  onSelectCategory,
}: CategorySelectProps) {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <p>Loading categories...</p>;

  if (isError) {
    return <p>{(error as Error).message}</p>;
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="category">
        Filter by Category:{" "}
      </label>

      <select
        id="category"
        value={selectedCategory}
        onChange={(e) =>
          onSelectCategory(e.target.value)
        }
      >
        <option value="">
          All Categories
        </option>

        {categories?.map((category) => (
          <option
            key={category}
            value={category}
          >
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}