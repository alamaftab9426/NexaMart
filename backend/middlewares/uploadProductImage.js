// middleware/uploadProductImage.js
import multer from "multer";


// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products");   
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// EXPORT UPLOAD
const uploadProductImage = multer({ storage });

export default uploadProductImage;
