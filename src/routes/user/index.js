const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user.controller');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../verifyToken');

router.post('/register-user', UserController.registerUser)
router.post('/login-user', UserController.loginUser)
router.post('/update-user', verifyTokenAndAuthorization, UserController.updateUser)
router.post('/block-user/:id', verifyTokenAndAdmin, UserController.blockUser)
router.post('/unblock-user/:id', verifyTokenAndAdmin, UserController.unBlockUser)
router.delete('/delete-user/:id',verifyTokenAndAdmin, UserController.deleteUser)

// router.put('/update-user/:id', verifyTokenAndAuthorization, UserController.updateUser)
// router.delete('delete-user/:id', verifyTokenAndAuthorization, UserController.deleteUser)
// router.get('/findUser/:id', verifyTokenAndAdmin, UserController.getUser)
// router.get('/findAllUser', verifyTokenAndAdmin, UserController.getAllUser)
  //vd: trả về 10 users đã đăng ký trong tháng 10
// router.get('/userStats', verifyTokenAndAdmin, UserController.getUserStats)

module.exports = router;
