const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');
const multer = require('multer');
const ProductModel = require('../../models/product.model');
const path = require('path');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('../verifyToken');

router.get('/list-product', ProductController.getListProduct);
// router.get('/list-product/search', ProductController.searchProduct)
router.get('/get-product/:_id', ProductController.getProduct);
router.delete(
  '/delete-product/:id',
  verifyTokenAndAdmin,
  ProductController.deleteProduct,
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  '/add-product',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 2 },
  ]),
  async (req, res) => {
    const {
      name,
      sku,
      price,
      brand,
      country,
      sex,
      color,
      description,
      created_by,
    } = req.body;

    const thumbnail = req.files['thumbnail']
      ? req.files['thumbnail'][0].filename
      : '';
    const images = req.files['images']
      ? req.files['images'].map((file) => file.filename)
      : [];

    const product = new ProductModel({
      name,
      sku,
      price,
      thumbnail,
      images,
      brand,
      country,
      sex,
      color: color.split(',').map((color) => color.trim()),
      description,
      created_by,
    });
    try {
      await product.save();
      const addok = 1;
      const productAdmin = path.join(
        __dirname,
        '../../views/addproduct-admin.ejs',
      );
      res.render(productAdmin, { addok });
    } catch (error) {
      res.status(500).send('Đã xảy ra lỗi: ' + error.message);
    }
  },
);

router.post(
  '/edit-product/:id',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 2 },
  ]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const product = await ProductModel.findById(id);

      const {
        name,
        sku,
        price,
        brand,
        country,
        sex,
        color,
        description,
        updated_by,
      } = req.body;

      product.name = name || product.name;
      product.sku = sku || product.sku;
      product.price = price || product.price;
      product.brand = brand || product.brand;
      product.country = country || product.country;
      product.sex = sex || product.sex;
      product.color = color
        ? color.split(',').map((color) => color.trim())
        : product.color;
      product.description = description || product.description;
      product.updated_by = updated_by || product.updated_by;
  
      if (req.files['thumbnail']) {
        product.thumbnail = req.files['thumbnail'][0].filename;
      }

      if (req.files['images']) {
        product.images = req.files['images'].map((file) => file.filename);
      }

      product.updated_at = Date.now();
      await product.save();
      const editok = 1;

      const productAdmin = path.join(__dirname, ('../../views/editproduct-admin.ejs'));
      res.render(productAdmin, { product, editok });

    } catch (error) {
      res.status(500).send('Đã xảy ra lỗi: ' + error.message);
    }
  },
);

// router.get('/search-product', ProductController.searchProduct);
//tìm( sp mới nhất, theo màu)
// router.get('/all-product', ProductController.getAllProduct)
// router.post('/create-product',verifyTokenAndAdmin, ProductController.createProduct)
// router.put('/update-product/:_id',verifyTokenAndAdmin, ProductController.updateProduct)
// router.delete('/delete-product/:_id',verifyTokenAndAdmin, ProductController.deleteProduct)

module.exports = router;
