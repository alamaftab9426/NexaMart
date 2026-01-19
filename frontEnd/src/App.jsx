import { BrowserRouter, Routes, Route } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

// Main Pages
import Home from "./components/Home";
import CategoryMainPage from "./components/CategoryPages/CategoryMainPage";
import MainBlogs from "./components/MainBlogs";
import NotFound from "./components/NotFound";
import CartPage from "./components/CartPage";
import Wishlist from "./components/Wishlist";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import BlogPage from "./components/BlogPage";
import ContactPage from "./components/ContactPage";
import ProfilePage from "./components/ProfilePages/ProfilePage";
import FullProductDetails from "./components/FullProductDetails";

// Admin Pages
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './components/Admin/Dashboard ';
import BrandList from "./components/Admin/Master/BrandsList";
import Categories from './components/Admin/Master/Categories';
import Subcategory from "./components/Admin/Master/Subcategory";
import Tags from "./components/Admin/Master/Tags";
import Color from "./components/Admin/Master/Color";
import Size from "./components/Admin/Master/Size";
import Items from "./components/Admin/Products/Items";
import AddItem from "./components/Admin/Products/AddItem";
import Orders from './components/Admin/Order'
import ContactUs from "./components/Admin/Contactus";
import FAQs from "./components/Admin/FAQs";
import Blogs from "./components/Admin/AdminBlogs";


import PrivateRoute from "./components/Guard/PrivateRoute";

import ViewSidebar from './components/ViewSideBars/ViewSidebar';
import CartSidebar from "./components/ViewSideBars/CartSidebar";
import PlaceOrder from "./components/PlaceOrder";
import AfterPlacedOrderPage from "./components/AfterPlacedOrderPage";





function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />
        <Route path="Signup" element={<Signup />} />
        <Route path="Login" element={<Login />} />
        <Route path="ForgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/category" element={<CategoryMainPage />} />
        <Route path="/mainBlogs" element={<MainBlogs />} />
        <Route path="/cartpage" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <PlaceOrder />
            </PrivateRoute>
          }
        />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="/product" element={<FullProductDetails />} />
        <Route
          path="/myorders"
          element={
            <PrivateRoute>
              <AfterPlacedOrderPage />
            </PrivateRoute>
          }
        />
        {/* Auth Pages */}
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminLayout />
            </PrivateRoute>
          }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={< Dashboard />} />
          <Route path="brandslist" element={< BrandList />} />
          <Route path="categories" element={< Categories />} />
          <Route path="subcategories" element={< Subcategory />} />
          <Route path="tags" element={< Tags />} />
          <Route path="color" element={< Color />} />
          <Route path="size" element={< Size />} />
          <Route path="items" element={<Items />} />
          <Route path="items/add" element={<AddItem />} />
          <Route path="items/edit/:id" element={<AddItem />} />
          <Route path="adminblogs" element={<Blogs />} />
          <Route path="Contactus" element={<ContactUs />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="orders" element={< Orders />} />

        </Route>



        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>



      <ViewSidebar />
      <CartSidebar />

    </BrowserRouter>
  );
}

export default App;
