const CartModel = require('../models/cart.model');
const ProductController = require('./product.controller');
const path = require('path');

class CartController {
  async addCart(req, res) {
    const userId = req.user.id;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    const user = req.cookies.accessToken;
    const productReload = req.body.productId;

    const detail_productView = path.join(
      __dirname,
      '../views/detail_product.ejs',
    );

    try {
      let cart = await CartModel.findOne({ userId: userId });

      if (cart) {
        //tìm sp liệu có trong giỏ hàng hay ko (có: 1, ko: -1)
        const productIndex = cart.products.findIndex(
          (p) => p.productId === productId,
        );

        if (productIndex > -1) {
          const quantityToAdd = parseInt(quantity, 10) || 0;
          cart.products[productIndex].quantity += quantityToAdd;
        } else {
          cart.products.push({ productId: productId, quantity: quantity });
        }
        const updatedCart = await cart.save();
      } else {
        const newCart = new CartModel({
          userId: userId,
          products: [{ productId: productId, quantity: quantity }],
        });
        const savedCart = await newCart.save();
      }

      const mess = 1;
      const product = await ProductController.getProduct(productReload);
      res.render(detail_productView, { product, user, mess });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // async updateCart(req, res) {
  //   try {
  //     const updatedCart = await CartModel.findByIdAndUpdate(
  //       req.params.id,
  //       {
  //         $set: req.body,
  //       },
  //       { new: true },
  //     );
  //     res.status(200).json(updatedCart);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  // async deleteCart(req, res) {
  //   try {
  //     await CartModel.findByIdAndDelete(req.params.id);
  //     res.status(200).json('Đã được xóa');
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  // async findCart(req, res) {
  //   try {
  //     const cart = await CartModel.findOne({ userId: req.params.userId });
  //     res.status(200).json(cart);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  //see all cartsof all users
  // async allCart(req, res) {
  //   try {
  //     const carts = await CartModel.find();
  //     res.status(200).json(carts);
  //   } catch {
  //     res.status(500).json(err);
  //   }
  // }

  // async getCartUser(req, res) {
  //   try {
  //     const userId = req.user.id;

  //     const userCart = await CartModel.find({ userId: userId });

  //     if (userCart) {
  //       res.status(200).json(userCart);
  //     } else {
  //       res.status(404).json({ message: 'Cart not found' });
  //     }
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // }
}

module.exports = new CartController();
