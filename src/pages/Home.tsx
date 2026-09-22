// src/pages/Home.tsx

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useDispatch } from "react-redux";

import { db } from "../firebase";
import { addToCart } from "../app/cartSlice";

// TypeScript interface for product
export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;

  rating?: {
    rate: number;
    count: number;
  };
}

const Home: React.FC = () => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");

  // Fetch categories from Firestore products
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery<string[]>({
    queryKey: ["categories"],

    queryFn: async () => {
      const productsRef = collection(db, "products");

      const snapshot = await getDocs(productsRef);

      const categories = snapshot.docs
        .map((document) => document.data().category)
        .filter(
          (category): category is string =>
            typeof category === "string"
        );

      // Remove duplicate categories
      return [...new Set(categories)];
    },
  });

  // Fetch products from Firestore
  const {
    data: products = [],
    isLoading: productsLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products", selectedCategory],

    queryFn: async () => {
      const productsRef = collection(db, "products");

      // If "all" is selected, get every product.
      // Otherwise, query Firestore by category.
      const productsQuery =
        selectedCategory === "all"
          ? productsRef
          : query(
              productsRef,
              where(
                "category",
                "==",
                selectedCategory
              )
            );

      const snapshot = await getDocs(productsQuery);

      return snapshot.docs.map((document) => {
        const data = document.data();

        return {
          id: document.id,
          title: data.title,
          price: Number(data.price),
          description: data.description,
          category: data.category,
          image: data.image,

          rating: data.rating
            ? {
                rate: Number(data.rating.rate),
                count: Number(data.rating.count),
              }
            : undefined,
        };
      });
    },
  });

  // Fallback for broken images
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src =
      "https://via.placeholder.com/300x250";
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">

        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-dark">
            Product Catalog
          </h1>

          <p className="lead text-muted mb-0">
            Browse our products and find something you love.
          </p>
        </div>

        {/* Category Filter */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="row align-items-center">

              <div className="col-md-5 mb-3 mb-md-0">
                <h5 className="fw-bold mb-1">
                  Browse Categories
                </h5>

                <p className="text-muted mb-0 small">
                  Filter products by category
                </p>
              </div>

              <div className="col-md-7">
                <select
                  className="form-select"
                  value={selectedCategory}
                  disabled={categoriesLoading}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value)
                  }
                >
                  <option value="all">
                    All Categories
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Product Count */}
        {!productsLoading &&
          !isError &&
          products.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mb-3">

              <h4 className="fw-bold mb-0">
                {selectedCategory === "all"
                  ? "All Products"
                  : selectedCategory}
              </h4>

              <span className="badge bg-primary rounded-pill px-3 py-2">
                {products.length} Products
              </span>

            </div>
          )}

        {/* Loading */}
        {productsLoading && (
          <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="col-sm-6 col-lg-4"
              >
                <div className="card border-0 shadow-sm h-100">

                  <div
                    className="placeholder-glow"
                    style={{ height: "250px" }}
                  >
                    <div className="placeholder w-100 h-100 bg-secondary" />
                  </div>

                  <div className="card-body">

                    <p className="placeholder-glow">
                      <span className="placeholder col-8" />
                    </p>

                    <p className="placeholder-glow">
                      <span className="placeholder col-12" />
                      <span className="placeholder col-9" />
                    </p>

                    <p className="placeholder-glow">
                      <span className="placeholder col-4" />
                    </p>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="alert alert-danger text-center shadow-sm">

            <h5 className="alert-heading">
              Unable to load products
            </h5>

            <p className="mb-0">
              Something went wrong while fetching the products.
              Please try again later.
            </p>

          </div>
        )}

        {/* Products Grid */}
        {!productsLoading && !isError && (
          <div className="row g-4">

            {products.map((product) => (
              <div
                key={product.id}
                className="col-sm-6 col-lg-4"
              >
                <div className="card h-100 border-0 shadow-sm product-card">

                  {/* Product Image */}
                  <div
                    className="bg-white d-flex align-items-center justify-content-center"
                    style={{ height: "250px" }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      onError={handleImageError}
                      className="card-img-top p-4"
                      style={{
                        height: "250px",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <div className="card-body d-flex flex-column p-4">

                    {/* Category */}
                    <div className="mb-2">
                      <span className="badge bg-light text-primary border">
                        {product.category}
                      </span>
                    </div>

                    {/* Product Title */}
                    <h5
                      className="card-title fw-bold"
                      style={{
                        minHeight: "48px",
                      }}
                    >
                      {product.title}
                    </h5>

                    {/* Description */}
                    <p
                      className="card-text text-muted small"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "60px",
                      }}
                    >
                      {product.description}
                    </p>

                    {/* Rating */}
                    {product.rating && (
                      <div className="d-flex align-items-center mb-3">

                        <span className="text-warning me-2">
                          {"★".repeat(
                            Math.round(
                              product.rating.rate
                            )
                          )}

                          {"☆".repeat(
                            5 -
                              Math.round(
                                product.rating.rate
                              )
                          )}
                        </span>

                        <span className="small text-muted">
                          {product.rating.rate} (
                          {product.rating.count})
                        </span>

                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-3">
                      <span className="fs-4 fw-bold text-success">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Add to Cart */}
                    <button
                      className="btn btn-primary w-100 mt-auto fw-semibold"
                      onClick={() =>
                        dispatch(
                          addToCart({
                            ...product,
                            quantity: 1,
                          })
                        )
                      }
                    >
                      <span className="me-2">
                        🛒
                      </span>
                      Add to Cart
                    </button>

                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {products.length === 0 && (
              <div className="col-12">
                <div className="card border-0 shadow-sm">

                  <div className="card-body text-center py-5">

                    <div className="display-4 mb-3">
                      🔍
                    </div>

                    <h4 className="fw-bold">
                      No products found
                    </h4>

                    <p className="text-muted mb-0">
                      No products are available for this
                      category.
                    </p>

                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Home;