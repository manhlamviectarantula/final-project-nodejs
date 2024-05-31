const OrderModel = require('../models/order.model');
const User = require('../models/user.model');
const CartModel = require('../models/cart.model');
const path = require('path');

class OrderController {
  // async getOrder(id) {
  //   try {
  //     const order = await OrderModel.findById(id);
  //     return order;
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  async addOrder(req, res) {
    try {
      const userId = req.cookies.userId;
      const Uaddress = await User.findById(userId);
      const cartData = JSON.parse(req.body['cart-data']);
      // const userCart = await CartModel.findOne({ userId: userId });

      // const products = userCart.products.map((product) => ({
      //   productId: product.productId,
      //   quantity: product.quantity,
      // }));

      const products = cartData.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
      }));

      const addFields = {
        userId: userId,
        products: products,
        amount: req.body['total-bill-send'], 
        address: Uaddress.address,
      };

      const newOrder = await OrderModel.create(addFields);

      await CartModel.findOneAndDelete({ userId: userId });

      const successOrder = path.join(__dirname, '../views/successOrder.ejs');
      return res.render(successOrder, { user: userId });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async updateOrder(req, res) {
    const editOrderReload = req.body.orderID;
    const editOrderView = path.join(__dirname, '../views/editOrder-admin.ejs');
    const updateFields = {
      address: req.body.address,
      status: req.body.status,
    };
    try {
      const updateOrder = await OrderModel.findByIdAndUpdate(
        req.body.orderID,
        updateFields,
      );
      const mes = 1;
      const order = await OrderModel.findById(editOrderReload);
      const userId = order.userId;
      const emailU = await User.findById(userId);
      res.render(editOrderView, { order, mes, emailU });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async deleteOrder(req, res) {
    try {
      const orderId = req.params.id;
      const result = await OrderModel.findByIdAndDelete(orderId);

      if (!result) {
        return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
      }

      res.status(200).json({ message: 'Đơn hàng đã được xóa thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi xóa đơn hàng' });
    }
  }

  // async updateOrder(req, res) {
  //   try {
  //     const updatedOrder = await OrderModel.findByIdAndUpdate(
  //       req.params.id,
  //       {
  //         $set: req.body,
  //       },
  //       { new: true },
  //     );
  //     res.status(200).json(updatedOrder);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  // async deleteOrder(req, res) {
  //   try {
  //     await OrderModel.findByIdAndDelete(req.params.id);
  //     res.status(200).json('Đã được xóa');
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  // //tìm tất cả đơn hàng của user nào đó
  // async findOrder(req, res) {
  //   try {
  //     const orders = await OrderModel.find({ userId: req.params.userId });
  //     res.status(200).json(orders);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  // //see all cartsof all users
  // async allOrder(req, res) {
  //   try {
  //     const orders = await OrderModel.find();
  //     res.status(200).json(orders);
  //   } catch {
  //     res.status(500).json(err);
  //   }
  // }

  // //GET MONTHLY INCOME
  // async monthlyIncome(req, res) {
  //   const date = new Date();
  //   const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  //   const previousMonth = new Date(
  //     new Date().setMonth(lastMonth.getMonth() - 1),
  //   );

  //   try {
  //     const income = await OrderModel.aggregate([
  //       { $match: { created_at: { $gte: previousMonth } } },
  //       {
  //         $project: {
  //           month: { $month: '$created_at' },
  //           sales: '$amount',
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: '$month',
  //           total: { $sum: '$sales' },
  //         },
  //       },
  //     ]);
  //     res.status(200).json(income);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }
}

module.exports = new OrderController();
