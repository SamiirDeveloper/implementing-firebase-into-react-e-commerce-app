import { Routes, Route } from "react-router-dom";
import OrderDetails from "./pages/OrderDetails";
import OrderHistory from "./pages/OrderHistory";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import ProductManagement from "./pages/ProductManagement";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <AuthProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/logout" element={<Logout />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/products/manage" element={<ProductManagement />} />

        <Route path="/orders" element={<OrderHistory />} />

        <Route path="/orders/:orderId" element={<OrderDetails />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
