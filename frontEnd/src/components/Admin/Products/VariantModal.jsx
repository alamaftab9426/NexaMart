import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const VariantModal = ({ product,  onClose, selectcolor, selectedSizes }) => {
  if (!product) return null;

  return (

    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white w-[95%] max-w-4xl rounded-xl shadow-xl relative"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">
              Variants – <span className="text-gray-600">{product.name}</span>
            </h2>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition font-bold"
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {product.variants.map((v, idx) => {
              const totalQty = v.sizes.reduce((sum, s) => sum + Number(s.quantity || 0), 0);
              const colorName = selectcolor?.find(c => c._id === v.color._id)?.name || v.color.name;

              return (
                <div key={v._id || idx} className="border rounded-lg overflow-hidden">
                
                  <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
                    <h3 className="font-semibold">
                      #{idx + 1} Color: <span className="text-blue-600 ml-1">{colorName}</span>
                    </h3>
                    <span className="text-sm text-gray-600">Qty: {totalQty}</span>
                  </div>

            
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
                    {v.images.length ? (
                      v.images.map((img, i) => (
                        <img
                          key={i}
                          src={img} 
                          className="w-full h-28 object-cover rounded-md border"
                          alt={`variant-${idx}-${i}`}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-400 py-4">
                        No images
                      </div>
                    )}
                  </div>


                  {/* TABLE */}
                  <div className="px-4 pb-4">
                    <table className="w-full text-sm border rounded-md overflow-hidden">
                      <thead className="bg-zinc-100">
                        <tr>
                          <th className="border px-2 py-2">Size</th>
                          <th className="border px-2 py-2">Price</th>
                          <th className="border px-2 py-2">Old</th>
                          <th className="border px-2 py-2">Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {v.sizes.map((s) => {
                          const sizeName = selectedSizes?.find(sz => sz._id === s.size._id)?.name || s.size.name;
                          return (
                            <tr key={s._id || sizeName} className="text-center">
                              <td className="border px-2 py-2">{sizeName}</td>
                              <td className="border px-2 py-2 text-green-600">₹{s.price}</td>
                              <td className="border px-2 py-2 text-gray-500">₹{s.oldPrice}</td>
                              <td className={`border px-2 py-2 font-medium ${s.quantity === 0 ? "text-red-600" : ""}`}>
                                {s.quantity}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VariantModal;
