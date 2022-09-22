const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
  .then(result =>{
    // console.log(result);
    res.redirect('/admin/products')
  })
  .catch(err =>{
    console.log(err);
  })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
   return res.redirect('/');
  }
  const prodId = req.params.productId; // getting id from url
  Product.findByPk(prodId)
  .then(product =>{
    if(!product)
      {
        return res.redirect('/');
      }
     res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product
  });
  })
  .catch(err => {
    console.log(err);
  })
 
};

exports.postEditProduct = (req,res,next) =>{
// construct a new product and replace the existing one with this product
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedprice = req.body.price;
  const updatedImagmeUrl = req.body.imageUrl;
  const updatedDesc = req.body.description; 
  Product.findByPk(prodId)
  .then(product =>{
    product.title = updatedTitle;
    product.price = updatedprice;
    product.description = updatedDesc;
    product.imageUrl = updatedImagmeUrl;
    return product.save(); // inbuilt function of sequlaize
    // that saves it back to the database
  }).then(result =>{
    console.log('UPDATED PRODUCT!');
    res.redirect('/admin/products');
  })
  .catch(err => {
    // this catch box will catch error for both the promises
    console.log(err);
  })
                         
}

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => {
    console.log(err);
  })
    
  
};

exports.postDeleteProduct = (req,res,next) =>{
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then(product => {
    return product.destroy();
  })
  .then(resutl =>{
    console.log('DESTROYED PRODUCT');
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  })
  
}