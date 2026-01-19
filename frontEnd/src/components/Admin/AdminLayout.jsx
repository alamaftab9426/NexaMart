import { useState, useContext } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { UserContext } from "../context/UserContext";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useContext(UserContext);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    toast.success("Logout Successful!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      style: { backgroundColor: "#000", color: "#fff" },
      transition: Slide,
    });

    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const menus = [
    { label: "Dashboard", icon: "ri-dashboard-3-line", link: "/admin/dashboard" },
    {
      label: "Master",
      icon: "ri-stack-line",
      subMenu: [
        { label: "Categories", link: "/admin/categories" },
        { label: "Subcategories", link: "/admin/subCategories" },
        { label: "Brands", link: "/admin/brandslist" },
        { label: "Create Tags", link: "/admin/tags" },
        { label: "Create Color", link: "/admin/color" },
        { label: "Create Size", link: "/admin/size" },
      ],
    },
    {
      label: "Products",
      icon: "ri-t-shirt-line",
      subMenu: [{ label: "Product List", link: "/admin/items" }],
    },
    { label: "Orders", icon: "ri-shopping-bag-2-line", link: "/admin/orders" },
    { label: "Blogs", icon: "ri-news-line", link: "/admin/blogs" },
    { label: "FAQs", icon: "ri-question-fill", link: "/admin/faqs" },
    { label: "Contacts", icon: "ri-contacts-book-2-fill", link: "/admin/contactus" },
    { label: "Users", icon: "ri-user-3-line", link: "/admin/users" },
    { label: "Settings", icon: "ri-settings-3-line", link: "/admin/settings" },
  ];

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <aside
        className={`bg-[#1A1C23] text-white h-screen fixed top-0 left-0 transition-all duration-300 overflow-y-auto
          ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold whitespace-nowrap">
            {sidebarOpen && (
              <>
                Admin<span className="text-blue-500">Panel</span>
              </>
            )}
          </h2>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white text-xl"
          >
            <i className="ri-menu-fold-line"></i>
          </button>
        </div>

        <div className="flex flex-col gap-2 p-2">
          {menus.map((menu, index) => {
            const isActive = location.pathname === menu.link;

            return (
              <div key={index}>
                <button
                  onClick={() =>
                    menu.subMenu ? toggleDropdown(index) : navigate(menu.link)
                  }
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-md transition-all
                    ${isActive || openDropdown === index
                      ? "bg-rose-600 text-white"
                      : "text-gray-300 hover:bg-rose-500 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <i className={`${menu.icon} text-lg`} />
                    {sidebarOpen && menu.label}
                  </div>

                  {menu.subMenu && sidebarOpen && (
                    <i
                      className={`ri-arrow-down-s-line transition-transform duration-300
                        ${openDropdown === index ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {menu.subMenu && sidebarOpen && (
                  <div
                    className={`ml-10 overflow-hidden transition-[max-height,opacity] duration-300
                      ${openDropdown === index
                        ? "max-h-screen opacity-100 mt-2"
                        : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div className="flex flex-col gap-1">
                      {menu.subMenu.map((sub, subIndex) => (
                        <Link
                          key={subIndex}
                          to={sub.link}
                          className={`px-3 py-1 rounded-md text-sm transition-all
                            ${location.pathname === sub.link
                              ? "bg-rose-500 text-white"
                              : "text-gray-300 hover:bg-rose-500 hover:text-white"
                            }
                          `}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="mt-4 flex gap-3 px-4 py-2 rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-all"
          >
            <i className="ri-logout-circle-r-line"></i>
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div
        className={`min-h-screen w-full flex flex-col transition-all duration-300
          ${sidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* HEADER */}
        <header
          className="h-16 bg-white shadow flex items-center justify-between px-6 fixed left-0 right-0 z-20"
          style={{ marginLeft: sidebarOpen ? "16rem" : "5rem" }}
        >
          <h1 className="text-xl font-semibold">
            <span className="text-[#3B82F6]">Hi, Welcome</span> Back!
          </h1>

          <div className="flex items-center gap-2 justify-center">
            <button
              className="px-4 py-2 border text-white bg-[#3CB4B6] rounded-md text-sm"
              onClick={handleLogout}
            >
              Log Out
            </button>
            <img
              src="https://i.pravatar.cc/40"
              className="w-10 h-10 rounded-full"
              alt="profile"
            />
          </div>
        </header>

        {/* CONTENT */}
        <div className="mt-20 px-6 pb-16 flex-1">
          <Outlet />
        </div>

        {/* FOOTER */}
        <footer
          className="h-14 bg-white flex items-center justify-center pl-36 fixed bottom-0"
          style={{ marginLeft: sidebarOpen ? "16rem" : "5rem" }}
        >
          <p className="text-sm text-gray-600">
            © 2025 EvalueWeb Admin Panel Created by ❤️ Aftab Alam
          </p>
        </footer>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
