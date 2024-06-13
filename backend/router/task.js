const express = require('express');
const router = express.Router();

const {getCart,getOrder,deleteBanner,updateBanner,fetchBanners,postBanner,returnProduct,getAdminDetails,cancelOrder,uploadSingleimg,updateProductDetails,decrementCart,getSingleProductDetails,getProductDetails,getDashboard,postOrder,getSingleUserOrders,getUser,getSingleOrder,updateStatus,comparePassword,postAddAddress,changePassword,getAddress,deleteAddress,updateUserDetails,getUserDetails,searchProducts,getAllUsers,unblockUser,blockUser,toggleAvailability, postAddToCart,removeFromCart, getPopularInWomen, postLogin, getNewCollection, createtask, postSignup, removeProduct, getAllProducts, uploadImg, postImage } = require('../controller/task');
const upload = require('../middleware/multer');
const fetchuser = require('../middleware/fetchuser');

router.route('/').get(createtask);
router.route('/upload').post(upload.array('product', 10), uploadImg); // Handle multiple files
router.route('/uploadbannerimage').post(upload.single('image'),uploadSingleimg)


router.route('/addproduct').post(postImage);
router.route('/removeproduct').post(removeProduct);
router.route('/allproducts').get(getAllProducts);
router.route('/signup').post(postSignup);
router.route('/login').post(postLogin);
router.route('/newCollections').get(getNewCollection);
router.route('/popularinwomen').get(getPopularInWomen);

// Apply fetchuser middleware to the /addtocart route
router.route('/addtocart').post(fetchuser, postAddToCart);
router.route('/removefromcart').post(fetchuser,removeFromCart)
router.route('/getcart').post(fetchuser,getCart)
router.route('/allusers').get(getAllUsers)
router.route('/unblockuser').post(unblockUser)
router.route('/blockuser').post(blockUser)
router.route('/toggleavailability').post(toggleAvailability)
router.route('/search').get(searchProducts)
router.route('/details').get(fetchuser,getUserDetails);
router.route('/update-details').put(fetchuser, updateUserDetails);
router.route('/add-address').post(fetchuser, postAddAddress)
router.route('/delete-address/:index').delete(fetchuser , deleteAddress)
router.route('/get-addresses').get(fetchuser,getAddress)
router.route('/verify-password').post(fetchuser,comparePassword)
router.route('/change-password').post(fetchuser,changePassword)
router.route('/users').get(getUser)
router.route('/create-order').post(fetchuser,postOrder)
router.route('/orders').get(fetchuser,getOrder)
router.route('/orders/:orderId').get(fetchuser,getSingleOrder)
router.route('/orders/:orderId/products/:productId/status').put(updateStatus)
router.route('/dashboard').get(getDashboard)
router.route('/userorders/:userId').get(getSingleUserOrders)
router.route('/updateproduct').post(updateProductDetails)
router.route('/products/:id').get(getProductDetails)
router.route('/productdetails/:productId').get(getSingleProductDetails)
router.route('/decrementcart').post(fetchuser,decrementCart)
router.route('/cancel-order').post(fetchuser,cancelOrder)
router.route('/return-product').post(fetchuser,returnProduct)
router.route('/adminlogin').post(getAdminDetails)
router.route('/banner').post(postBanner)
router.route('/fetchbanners').get(fetchBanners)
router.route('/delete-banner/:id').delete(deleteBanner)
router.route('/update-banner/:id').put(updateBanner)
module.exports = router;
