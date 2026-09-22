import { useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { db } from "../firebase";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const ProductManagement = () => {
  const queryClient = useQueryClient();

  // FORM STATE
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  // Stores the ID of the product currently being edited.
  // null means we are creating a new product.
  const [editingProductId, setEditingProductId] =
    useState<string | null>(null);

  // --------------------------------
  // READ PRODUCTS
  // --------------------------------

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products"],

    queryFn: async () => {
      const snapshot = await getDocs(
        collection(db, "products")
      );

      return snapshot.docs.map((productDoc) => ({
        id: productDoc.id,
        ...(productDoc.data() as Omit<Product, "id">),
      }));
    },
  });

  // --------------------------------
  // CLEAR FORM
  // --------------------------------

  const clearForm = () => {
    setTitle("");
    setPrice("");
    setDescription("");
    setCategory("");
    setImage("");
    setEditingProductId(null);
  };

  // --------------------------------
  // REFRESH PRODUCT DATA
  // --------------------------------

  const refreshProducts = () => {
    queryClient.invalidateQueries({
      queryKey: ["products"],
    });

    queryClient.invalidateQueries({
      queryKey: ["categories"],
    });
  };

  // --------------------------------
  // CREATE PRODUCT
  // --------------------------------

  const createProduct = useMutation({
    mutationFn: async () => {
      await addDoc(
        collection(db, "products"),
        {
          title,
          price: Number(price),
          description,
          category,
          image,
          createdAt: serverTimestamp(),
        }
      );
    },

    onSuccess: () => {
      refreshProducts();
      clearForm();
    },
  });

  // --------------------------------
  // UPDATE PRODUCT
  // --------------------------------

  const updateProduct = useMutation({
    mutationFn: async () => {
      if (!editingProductId) {
        throw new Error(
          "No product selected for editing."
        );
      }

      const productRef = doc(
        db,
        "products",
        editingProductId
      );

      await updateDoc(productRef, {
        title,
        price: Number(price),
        description,
        category,
        image,
        updatedAt: serverTimestamp(),
      });
    },

    onSuccess: () => {
      refreshProducts();
      clearForm();
    },
  });

  // --------------------------------
  // DELETE PRODUCT
  // --------------------------------

  const deleteProduct = useMutation({
    mutationFn: async (
      productId: string
    ) => {
      await deleteDoc(
        doc(db, "products", productId)
      );
    },

    onSuccess: () => {
      refreshProducts();
    },
  });

  // --------------------------------
  // START EDITING
  // --------------------------------

  const handleEdit = (
    product: Product
  ) => {
    setEditingProductId(product.id);

    setTitle(product.title);
    setPrice(product.price.toString());
    setDescription(product.description);
    setCategory(product.category);
    setImage(product.image);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------
  // FORM SUBMIT
  // --------------------------------

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (editingProductId) {
      updateProduct.mutate();
    } else {
      createProduct.mutate();
    }
  };

  const isSaving =
    createProduct.isPending ||
    updateProduct.isPending;

  return (
    <div className="container py-5">

      <h1 className="fw-bold mb-4">
        Product Management
      </h1>

      {/* PRODUCT FORM */}
      <div className="card border-0 shadow-sm mb-5">

        <div className="card-body p-4">

          <h3 className="h5 fw-bold mb-4">
            {editingProductId
              ? "Edit Product"
              : "Add Product"}
          </h3>

          <form onSubmit={handleSubmit}>

            {/* TITLE */}
            <div className="mb-3">

              <label className="form-label">
                Product Title
              </label>

              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />

            </div>

            {/* PRICE */}
            <div className="mb-3">

              <label className="form-label">
                Price
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                required
              />

            </div>

            {/* CATEGORY */}
            <div className="mb-3">

              <label className="form-label">
                Category
              </label>

              <input
                type="text"
                className="form-control"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                required
              />

            </div>

            {/* IMAGE */}
            <div className="mb-3">

              <label className="form-label">
                Image URL
              </label>

              <input
                type="url"
                className="form-control"
                value={image}
                onChange={(e) =>
                  setImage(e.target.value)
                }
                required
              />

            </div>

            {/* DESCRIPTION */}
            <div className="mb-3">

              <label className="form-label">
                Description
              </label>

              <textarea
                className="form-control"
                rows={4}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
              />

            </div>

            {/* FORM BUTTONS */}
            <div className="d-flex gap-2">

              <button
                type="submit"
                className={
                  editingProductId
                    ? "btn btn-warning"
                    : "btn btn-primary"
                }
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : editingProductId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingProductId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={clearForm}
                  disabled={isSaving}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

        </div>
      </div>

      {/* EXISTING PRODUCTS */}

      <h2 className="h4 fw-bold mb-3">
        Existing Products
      </h2>

      {isLoading && (
        <p>
          Loading products...
        </p>
      )}

      {isError && (
        <div className="alert alert-danger">
          Unable to load products.
        </div>
      )}

      {!isLoading &&
        !isError &&
        products.length === 0 && (
          <div className="alert alert-info">
            No products yet. Add your first
            product above.
          </div>
        )}

      <div className="row g-4">

        {products.map((product) => (

          <div
            key={product.id}
            className="col-md-6 col-lg-4"
          >

            <div className="card h-100 shadow-sm border-0">

              {/* IMAGE */}

              <img
                src={product.image}
                alt={product.title}
                className="card-img-top p-3"
                style={{
                  height: "200px",
                  objectFit: "contain",
                }}
              />

              <div className="card-body d-flex flex-column">

                {/* CATEGORY */}

                <span className="badge bg-light text-dark align-self-start mb-2">
                  {product.category}
                </span>

                {/* TITLE */}

                <h5>
                  {product.title}
                </h5>

                {/* DESCRIPTION */}

                <p className="text-muted small">
                  {product.description}
                </p>

                {/* PRICE */}

                <p className="fw-bold text-success">
                  ${product.price.toFixed(2)}
                </p>

                {/* EDIT / DELETE */}

                <div className="d-flex gap-2 mt-auto">

                  <button
                    type="button"
                    className="btn btn-outline-primary flex-grow-1"
                    onClick={() =>
                      handleEdit(product)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger flex-grow-1"
                    disabled={
                      deleteProduct.isPending
                    }
                    onClick={() => {
                      const confirmed =
                        window.confirm(
                          `Delete "${product.title}"?`
                        );

                      if (confirmed) {
                        deleteProduct.mutate(
                          product.id
                        );
                      }
                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ProductManagement;