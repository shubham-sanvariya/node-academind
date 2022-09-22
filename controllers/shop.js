const Order = require('../models/order');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });

};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail',
        {
          product: product,
          pageTitle: product.title,
          path: '/products'
        });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });

};

exports.getCart = (req, res, next) => {

  req.user.getCart()
    .then(cart => {
      // console.log(cart);
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
};

//step 1 add async keyword to function
exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    let fetchCart;
    let newQuantity = 1;
    fetchCart = await req.user.getCart();
    console.log(fetchCart);
    const products = await fetchCart.getProducts({ where: { id: prodId } });
    const product = products.length > 0 ? products[0] : products;
    console.log(product, products);
    if (product && product.cartItem) {
      newQuantity = product.cartItem.quantity + 1;
      res.redirect('/cart');
      return fetchCart.addProduct(product,
        { through: { quantity: newQuantity } })
    } 
    else{
      const p = await Product.findByPk(prodId);
      return fetchCart.addProduct(p,
        { through: { quantity: newQuantity } })
    }
  } catch (error) {
    console.log(error); 
  }
 
};
// exports.postCart = (req,res,next) =>{
//   const prodId = req.body.productId;
//   let fetchCart;
//   let newQuantity = 1;
//   req.user.getCart()
//   .then(cart => {
//     fetchCart = cart;
//     return cart.getProducts({where: {id: prodId}});   
//   })
//   .then(products => {
//     let product;
//     if(products.length > 0){
//       product = products[0];
//     }
//     if(product){
//       const oldQuantity = product.cartItem.quantity;
//       newQuantity = oldQuantity+1;
//       console.log();
//       return product;
//     }
//     return Product.findByPk(prodId)
//     .then(product => {
//       return fetchCart.addProduct(product,
//          { through: { quantity: newQuantity}})
//     })
//    .then(() =>{
//     res.redirect('/cart');
//    })
//   })
//   .catch(err => {
//     console.log(err);
//   })
// };

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where: { id: prodId} });
  })
  .then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(result =>{
    res.redirect('/cart');
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postOrder = (req,res,next) =>{
  let fetchCart;
  req.user.getCart()
  .then(cart => {
    fetchCart = cart;
    return cart.getProducts();
  })
  .then(products =>{
    req.user.createOrder()
    .then(order => {
      order.addProduct(products.map(product =>{
        product.orderItem = { quantity: product.cartItem.quantity};
        return product;
      }))
    })
    .catch(err => console.log(err))    
  })
  .then(result =>{
    return fetchCart.setProducts(null);
  })
  .then(result =>{
    res.redirect('orders');
  })
  .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => console.log(err));
  
};

