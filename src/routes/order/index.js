const express = require('express');
const router = express.Router();
const OrderController = require('../../controllers/order.controller');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../verifyToken');

router.post('/add-order', verifyToken, OrderController.addOrder)
router.post('/update-order', verifyTokenAndAdmin, OrderController.updateOrder)
router.delete('/delete-order/:id',verifyTokenAndAdmin, OrderController.deleteOrder)


// router.put("/update-order/:id", verifyTokenAndAdmin, OrderController.updateOrder)
// router.delete("/delete-order/:id", verifyTokenAndAdmin, OrderController.deleteOrder)
// //tìm tất cả đơn hàng của user nào đó
// router.delete("/find-order/:userId", verifyTokenAndAuthorization, OrderController.findOrder)
// //see all Orders 
// router.get("/all-order", verifyTokenAndAdmin, OrderController.allOrder)
// //GET MONTHLY INCOME
// router.get("/income", verifyTokenAndAdmin, OrderController.monthlyIncome)

module.exports = router;