
import Footer from "./Footer";
import TopBar from "./ManuBars/TopBar";
import MiddleBar from "./ManuBars/MiddleBar";
import MainMenu from "./ManuBars/MainMenuBar";
const Layout = ({ children }) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#FFFFFF] ">
      {/* Main Content */}
      <TopBar/>
      <MiddleBar />
      <MainMenu/>
      <main className="flex-1 w-full">{children}</main>



      {/* -------------------- FOOTER -------------------- */}
      <Footer/>

    </div>
  );
};

export default Layout;
