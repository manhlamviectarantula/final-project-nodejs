const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/cart.controller');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyTokenAddCart} = require('../verifyToken');

// router.post("/add-cart", verifyToken, CartController.addCart)
router.post("/add-cart", verifyTokenAddCart, CartController.addCart)


// router.get("/get-cart", verifyToken, CartController.getCartUser)
// router.put("/update-cart/:id", verifyTokenAndAuthorization, CartController.updateCart)
// router.delete("/delete-cart/:id", verifyTokenAndAuthorization, CartController.deleteCart)
// router.delete("/find-cart/:userId", verifyTokenAndAuthorization, CartController.findCart)
//see all carts of all users
// router.get("/all-cart", verifyTokenAndAdmin, CartController.allCart)

module.exports = router;