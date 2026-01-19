import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { WishlistProvider } from "./components/context/WishlistContext";
import { CartProvider } from "./components/context/CartContext";
import { SlideProvider } from "./components/context/SlideContext";
import { UserProvider } from "./components/context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <React.StrictMode>


    <WishlistProvider>
      <UserProvider>
        <CartProvider>
          <SlideProvider>
            <App />
            <ToastContainer
              position="top-center"
              autoClose={1800}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
            />
          </SlideProvider>
        </CartProvider>
      </UserProvider>
    </WishlistProvider>
  </React.StrictMode>
);
