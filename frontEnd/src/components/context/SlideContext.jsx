import { createContext, useContext, useState } from "react";

const SlideContext = createContext();

export const SlideProvider = ({ children }) => {
  const [viewProduct, setViewProduct] = useState(null);

  const openView = (product) => {
    setViewProduct(product);
  };

  const closeView = () => {
    setViewProduct(null);
  };

  return (
    <SlideContext.Provider value={{ viewProduct, openView, closeView }}>
      {children}
    </SlideContext.Provider>
  );
};

export const useSlide = () => useContext(SlideContext);
