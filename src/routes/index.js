const express = require('express');
const router = express.Router();
const path = require('path');
const ProductController = require('../controllers/product.controller');
const UserController = require('../controllers/user.controller');
const OrderController = require('../controllers/order.controller');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ProductModel = require('../models/product.model');
const CartModel = require('../models/cart.model');
const OrderModel = require('../models/order.model');

router.use('/api/v1/product', require('./product'));
router.use('/api/v2/user', require('./user'));
router.use('/api/v3/cart', require('./cart'));
router.use('/api/v4/order', require('./order'));

router.get('/', async (req, res) => {
  const user = req.cookies.accessToken;
  const homeView = path.join(__dirname, '../views/home.ejs');
  res.render(homeView, { user });
});

//tìm( sp mới nhất, theo màu)
// router.get('/allProducts', async (req, res) => {

//   const allProductsView = path.join(__dirname, '../views/allProduct.ejs');
//   const products = await ProductController.getAllProduct(req, res);
//   // res.render(allProductsView, { product: products });
//   // res.status(200).json(products);
// });

router.get('/products', async (req, res) => {
  const user = req.cookies.accessToken;
  const productsView = path.join(__dirname, '../views/products.ejs');
  res.render(productsView, { user });
});

router.get('/detail_product/:id', async (req, res) => {
  const user = req.cookies.accessToken;
  const id = req.params.id;
  const mess = 0;
  const detail_productView = path.join(
    __dirname,
    '../views/detail_product.ejs',
  );
  const product = await ProductController.getProduct(id);
  res.render(detail_productView, { product, user, mess });
});

router.get('/login', async (req, res) => {
  const user = req.cookies.accessToken;
  const mes = 1;
  const loginView = path.join(__dirname, '../views/login.ejs');
  res.render(loginView, { user, mes });
});

router.get('/register', async (req, res) => {
  const user = req.cookies.accessToken;
  const dif_pass = 0;
  const registerView = path.join(__dirname, '../views/register.ejs');
  res.render(registerView, { user, dif_pass });
});

router.get('/logout', async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('userId');
  res.redirect('/');
});

router.get('/cart', async (req, res) => {
  const user = req.cookies.accessToken;
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      const cartView = path.join(__dirname, '../views/cart0.ejs');
      const nocart = 0;
      return res.render(cartView, { user, nocart }); // Sử dụng return để thoát sau khi gửi phản hồi
    }

    const userCart = await CartModel.findOne({ userId: userId });

    if (userCart) {
      const products = await Promise.all(
        userCart.products.map(async (product) => {
          const productInfo = await ProductModel.findOne({
            _id: product.productId,
          });
          return {
            productId: product.productId,
            quantity: product.quantity,
            productName: productInfo ? productInfo.name : ' ',
            productThumnail: productInfo ? productInfo.thumbnail : ' ',
            productPrice: productInfo ? productInfo.price : ' ',
          };
        }),
      );

      const cartView = path.join(__dirname, '../views/cart.ejs');
      return res.render(cartView, { user, products: products }); // Sử dụng return để thoát sau khi gửi phản hồi
    } else {
      const cartView = path.join(__dirname, '../views/cart0.ejs');
      const nocart = 1;
      return res.render(cartView, { user, nocart }); // Sử dụng return để thoát sau khi gửi phản hồi
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/delete-cart/:id', async (req, res) => {
  const userId = req.cookies.userId;

  const cart = await CartModel.findOne({ userId: userId });
  const productId = req.params.id;
  const productIndex = cart.products.findIndex(
    (product) => product.productId === productId,
  );

  if (productIndex !== -1) {
    cart.products.splice(productIndex, 1);
    if (cart.products.length === 0) {
      // Nếu không còn sản phẩm nào trong giỏ hàng, xóa luôn giỏ hàng
      await CartModel.findOneAndDelete({ userId: userId });
    } else {
      // Lưu lại giỏ hàng nếu vẫn còn sản phẩm
      await cart.save();
    }
  }

  res.redirect('/cart');
});

router.get('/admin', async (req, res) => {
  const countUser = await User.countDocuments();
  const countProduct = await ProductModel.countDocuments();
  const countOrder = await OrderModel.countDocuments();

  const totalAmountAggregate = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" }
      }
    }
  ]);

  function formatCurrency(number) {
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  const totalAmount = totalAmountAggregate.length > 0 ? totalAmountAggregate[0].totalAmount : 0;

  // Định dạng số tiền thành tiền tệ
  const totalAmountFormatted = formatCurrency(totalAmount);

  const indexView = path.join(__dirname, '../views/admin.ejs');
  res.render(indexView, { countUser, countProduct, countOrder, totalAmountFormatted });
});

router.get('/users-admin', async (req, res) => {
  var search = '';
  if (req.query.search) {
    search = req.query.search;
  }

  const AllUser = await User.find({
    isAdmin: false,
    $or: [
      { email: { $regex: '.*' + search + '.*', $options: 'i' } },
      { phone: { $regex: '.*' + search + '.*', $options: 'i' } },
    ],
  });

  // const AllUser = await User.find({isAdmin:false});
  const userListView = path.join(__dirname, '../views/users-admin.ejs');
  res.render(userListView, { user: AllUser });
});

router.get('/products-admin', async (req, res) => {
  var search = '';
  if (req.query.search) {
    search = req.query.search;
  }

  const allproduct = await ProductModel.find({
    $or: [
      { name: { $regex: new RegExp(search, 'i') } },
      { sku: { $regex: new RegExp(`^${search}$`, 'i') } },
    ],
  });
  const productsView = path.join(__dirname, '../views/products-admin.ejs');
  res.render(productsView, { product: allproduct });
});

router.get('/orders-admin', async (req, res) => {
  const allOrder = await OrderModel.find();
  const ordersView = path.join(__dirname, '../views/orders-admin.ejs');
  res.render(ordersView, { order: allOrder });
});

router.get('/editOrder-admin/:id', async (req, res) => {
  const mes = 0;
  const id = req.params.id;

  // const order = await OrderController.getOrder(id);

  // const ordersView = path.join(__dirname, '../views/editOrder-admin.ejs');
  // res.render(ordersView, { order, mes });
  const order = await OrderModel.findById(id);
  const userId = order.userId;
  const emailU = await User.findById(userId);

  const ordersView = path.join(__dirname, '../views/editOrder-admin.ejs');
  res.render(ordersView, { order, mes, emailU });
});

router.get('/editUser-admin/:id', async (req, res) => {
  const mess = 0;
  const id = req.params.id;

  const user = await UserController.getUser(id);

  const editUserView = path.join(__dirname, '../views/editUser-admin.ejs');
  res.render(editUserView, { user, mess });
});

router.get('/editProduct-admin/:id', async (req, res) => {
  const editok = 0
  const id = req.params.id;

  const product = await ProductController.getProduct(id);

  const editProductView = path.join(
    __dirname,
    '../views/editProduct-admin.ejs',
  );
  res.render(editProductView, { product, editok });
});

router.get('/addProduct-admin', async (req, res) => {
  const addok = 0
  const addProductView = path.join(__dirname, '../views/addProduct-admin.ejs');
  res.render(addProductView, { addok });
});

module.exports = router;
