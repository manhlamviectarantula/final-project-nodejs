const UserModel = require('../models/user.model');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const path = require('path');

class UserController {
  async registerUser(req, res) {
    try {
      const { name, email, phone, password, confirm_password, address } = req.body;
      const registerErrView = path.join(__dirname, '../views/register.ejs');
  
      const emailEx = await UserModel.findOne({ email });
      if (emailEx) {
        return res.render(registerErrView, { user: '', dif_pass: 2 });
      }
  
      const phoneEx = await UserModel.findOne({ phone });
      if (phoneEx) {
        return res.render(registerErrView, { user: '', dif_pass: 3 });
      }
  
      if (password !== confirm_password) {
        return res.render(registerErrView, { user: '', dif_pass: 1 });
      }
  
      const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();
  
      const newUser = new UserModel({
        name,
        email,
        phone,
        password: encryptedPassword,
        address
      });
  
      await newUser.save();
  
      const loginView = path.join(__dirname, '../views/login.ejs');
      return res.render(loginView, { user: '', mes: 4 });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async loginUser(req, res) {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        // return res.status(404).json('Email chưa được đăng ký');
        const user = ``;
        const mes = 2;

        const loginView = path.join(__dirname, '../views/login.ejs');
        return res.render(loginView, { mes, user });
      }

      const hashPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC,
      );
      const password = hashPassword.toString(CryptoJS.enc.Utf8);
      if (password !== req.body.password) {
        const user = ``;
        const mes = 3;

        const loginView = path.join(__dirname, '../views/login.ejs');
        return res.render(loginView, { mes, user });
      }

      if (user.status === 0) {
        const user = ``;
        const mes = 0;

        const loginView = path.join(__dirname, '../views/login.ejs');
        return res.render(loginView, { mes, user });
      } else if (user && password) {
        const accessToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SEC,
          { expiresIn: '3d' },
        );

        const { password, ...others } = user._doc;

        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });

        res.cookie('userId', user._id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });

        if (user.isAdmin === false) {
          res.redirect('/');
        } else {
          res.redirect('/admin');
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async updateUser(req, res) {
    // if (req.body.password) {
    //   req.body.password = CryptoJS.AES.encrypt(
    //     req.body.password,
    //     process.env.PASS_SEC,
    //   ).toString();
    // }

    const editUserReload = req.body.userID;

    const editUserView = path.join(__dirname, '../views/editUser-admin.ejs');

    const updateFields = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
    };

    try {
      const updateUser = await UserModel.findByIdAndUpdate(
        req.body.userID,
        updateFields,
      );

      const mess = 1;

      const user = await UserModel.findById(editUserReload);

      res.render(editUserView, { user, mess });

      // const updateUser = await UserModel.findByIdAndUpdate(
      //   req.params.id,
      //   {
      //     $set: req.body,
      //   },
      //   { new: true },
      // );
      // res.status(200).json(updateUser);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getUser(id) {
    try {
      const user = await UserModel.findById(id);

      const { password, ...others } = user._doc;
      // res.status(200).json(others);
      return others;
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async blockUser(req, res) {
    try {
      const userId = req.params.id;

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.status = 0;
      await user.save();

      res.redirect('/users-admin');
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async unBlockUser(req, res) {
    try {
      const userId = req.params.id;

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.status = 1;
      await user.save();

      res.redirect('/users-admin');
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const result = await UserModel.findByIdAndDelete(userId);

      if (!result) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      res.status(200).json({ message: 'Người dùng đã được xóa thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi xóa người dùng' });
    }
  }

  // async deleteUser(req, res) {
  //   try {
  //     await UserModel.findByIdAndDelete(req.params.id);
  //     res.status(200).json('Người dùng đã được xóa');
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  // async getAllUser(req, res) {
  //   const query = req.query.new;
  //   try {
  //     const users = query
  //       ? await UserModel.find().sort({ _id: -1 }).limit(5)
  //       : await UserModel.find();
  //     res.status(200).json(users);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  // //vd: trả về 10 users đã đăng ký trong tháng 10
  // async getUserStats(req, res) {
  //   const date = new Date();
  //   const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  //   try {
  //     const data = await UserModel.aggregate([
  //       { $match: { created_at: { $gte: lastYear } } },
  //       { $project: { month: { $month: '$created_at' } } },
  //       { $group: { _id: '$month', total: { $sum: 1 } } },
  //     ]);
  //     res.status(200).json(data);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }
}

module.exports = new UserController();
