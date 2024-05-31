const jwt = require('jsonwebtoken');
const path = require('path')

//sửa
const verifyToken = (req, res, next) => {
  const authHeader = req.cookies.accessToken;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json('hết phiên đăng nhập');
      req.user = user;
      next();
    });
  } else {
    return res.status(403).json('không có quyền');
  }
};

const verifyTokenAddCart = (req, res, next) => {
  const authHeader = req.cookies.accessToken;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json('hết phiên đăng nhập');
      req.user = user;
      next();
    });
  } else {
      const nocart = 0
      const user = ``
      const cart0 = path.join(__dirname, '../../views/cart0.ejs')
      return res.render(cart0, { user, nocart  })
  }
};

//cũ dùng trong postman
// const verifyToken = (req, res, next) => {
//       const authHeader = req.body.token;
//     console.log(authHeader)
//     if (authHeader) {
//       const token = authHeader.split(' ')[1];
//       jwt.verify(token, process.env.JWT_SEC, (err, user) => {
//         if (err) res.status(403).json('hết phiên đăng nhập');
//         req.user = user;
//         next();
//       });
//     } else {
//       return res.status(403).json('không có quyền');
//     }
//   };

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('không có quyền');
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('bạn không phải Admin, không có quyền');
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAddCart
};
