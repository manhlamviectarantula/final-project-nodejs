const ProductModel = require('../models/product.model');
const PAGE_SIZE = 9;

class ProductController {
  async getListProduct(req, res) {
    var page = req.query.page;
    var search = req.query.search;
    var query = {};

    if (search) {
        query.name = new RegExp(search, 'i'); 
    }

    if (page) {
        page = parseInt(page);
        if (page < 1) {
            page = 1;
        }
        var soLuongBoQua = (page - 1) * PAGE_SIZE;
        ProductModel.find(query)
            .skip(soLuongBoQua)
            .limit(PAGE_SIZE)
            .then((data) => {
                ProductModel.countDocuments(query).then((total) => {
                    var tongSoPage = Math.ceil(total / PAGE_SIZE);
                    res.json({
                        total: total,
                        tongSoPage: tongSoPage,
                        data: data,
                    });
                });
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    } else {
        ProductModel.find(query)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    }

    //phân trang chưa làm search
    // var page = req.query.page;
    // if (page) {
    //   page = parseInt(page);
    //   if (page < 1) {
    //     page = 1;
    //   }
    //   var soLuongBoQua = (page - 1) * PAGE_SIZE;
    //   ProductModel.find({})
    //     .skip(soLuongBoQua)
    //     .limit(PAGE_SIZE)
    //     .then((data) => {
    //       ProductModel.countDocuments({}).then((total) => {
    //         var tongSoPage = Math.ceil(total / PAGE_SIZE);
    //         res.json({
    //           total: total,
    //           tongSoPage: tongSoPage,
    //           data: data,
    //         });
    //       });
    //     });
    // } else {
    //   ProductModel.find({}).then((data) => {
    //     res.json(data);
    //   });
    // }
  }
  
  async getProduct(id) {
    try {
      const product = await ProductModel.findById(id);
      return product;
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async addProduct(req, res) {
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (
          file.mimetype === 'image/jpg' ||
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png'
        ) {
          cb(null, 'public/images');
        } else {
          cb(new Error('not image'), false);
        }
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
        // cb(null, Date.now()+'jpg')
      },
    });

    var upload = multer({ storage: storage });

    const item = new ProductModel({
      name: req.body.name,
      sku: req.body.sku,
      price: req.body.price,
      thumbnail: req.file ? req.file.filename : null,
      //hình 1
      //hình 2
      brand: req.body.brand,
      country: req.body.counry,
      sex: req.body.sex,
      color: req.body.color,
      description: req.body.description,
    });

    item.save();
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const result = await ProductModel.findByIdAndDelete(productId);

      if (!result) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }

      res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi xóa sản phẩm' });
    }
  }

  // async getAllProduct(req, res) {
  //   const qNew = req.query.new; //tìm sản phẩm mới nhất
  //   const qColor = req.query.color; //tìm sản phẩm theo màu

  //   try {
  //     let products;

  //     if (qNew) {
  //       products = await ProductModel.find().sort({ created_at: -1 }).limit(1);
  //     } else if (qColor) {
  //       products = await ProductModel.find({
  //         color: {
  //           $in: [qColor],
  //         },
  //       });
  //     } else {
  //       products = await ProductModel.find();
  //     }

  //     res.status(200).json(products);
  //     // return products
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  // async createProduct(req, res) {
  //   const newProduct = new ProductModel(req.body);
  //   try {
  //     const savedProduct = await newProduct.save();
  //     res.status(200).json(savedProduct);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  // async updateProduct(req, res) {
  //   try {
  //     const updatedProduct = await ProductModel.findByIdAndUpdate(
  //       req.params.id,
  //       {
  //         $set: req.body,
  //       },
  //       { new: true },
  //     );
  //     res.status(200).json(updatedProduct);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  // async deleteProduct(req, res) {
  //   try {
  //     await ProductModel.findByIdAndDelete(req.params.id);
  //     res.status(200).json('Đã xóa sản phẩm');
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }
}

module.exports = new ProductController();
