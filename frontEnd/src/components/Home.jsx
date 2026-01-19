

import Layout from "./Layout"
import SwiperHeader from "./SwiperHeader"
import Categories from "./Categories"
import AboutUs from "./AboutUs"
import FeatureProduct from "./FeatureProduct"
import FeturesCollection from "./FeturesCollection"
import TopVendor from "./TopVendor"
import Bestproducts from "./Bestproducts"
import ViewSidebar from "./ViewSideBars/ViewSidebar"
import { SlideProvider } from "./context/SlideContext"







const Home = () => {


  return (

    <Layout>


      {/* Menubars End */}
      <SwiperHeader/>
      <Categories/>
      <AboutUs/>
      <FeatureProduct/>
      <FeturesCollection/>
      <TopVendor/>
      <Bestproducts/>
      <ViewSidebar/>

      

    </Layout>
  )
}

export default Home
