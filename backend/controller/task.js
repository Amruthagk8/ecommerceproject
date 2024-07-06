const Product = require('../models/task');
const Users = require('../models/userSchema');
const Order = require('../models/orderSchema')
const Banner = require('../models/Banner')
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminschema')
require('dotenv').config();

const createtask = (req, res) => {
    res.send("welcome");
};

const uploadImg = (req, res) => {
  if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: 0, message: "No files uploaded" });
  }

  const imageUrls = req.files.map(file => `http://localhost:5000/images/${file.filename}`);
  
  res.json({
      success: 1,
      image_urls: imageUrls
  });
};

const uploadSingleimg = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const imageUrl = `http://localhost:5000/images/${req.file.filename}`;
  
  console.log(imageUrl)
  
  res.json({ success: true, image_url: imageUrl });
};


const postImage = async (req, res) => {
  try {
      const products = await Product.find({});
      console.log("products", products);
      let id;
      if (products.length > 0) {
          const last_product = products[products.length - 1];
          id = last_product.id + 1;
      } else {
          id = 1;
      }

      const productData = {
          id: id,
          name: req.body.name,
          images: req.body.images,
          category: req.body.category,
          new_price: req.body.new_price,
          old_price: req.body.old_price,
          quantity: req.body.quantity
      };
      console.log(productData);

      const product = await Product.create(productData);
      console.log("product saved");
      res.json({
          success: true,
          data: product
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Error saving product",
          error: err.message
      });
  }
};


const removeProduct = async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
       
        res.json({ success: true, name: req.body.name });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error removing product",
            error: err.message
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        
        
        res.json({ success: true, products: products });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: err.message
        });
    }
};
const postSignup = async (req, res) => {
  try {
    console.log("req.body:", req.body);

    // Check for existing user with the same email
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Existing user found with the same email id" });
    }

    // Find the user with the highest ID to assign a new unique ID
    let highestIdUser = await Users.findOne().sort({ id: -1 });
    let newId = highestIdUser ? highestIdUser.id + 1 : 1;

    // Initialize cart data
    let cart = Array(300).fill(0);
    console.log("newId", newId);
    console.log("highestIdUser", highestIdUser);
    console.log("cart", cart);

    // Create a new user
    const user = {
      id: newId,
      name: req.body.username,
      email: req.body.email,
      phone:req.body.phone,
      password: req.body.password,
      cartData: cart,
    };
    console.log("user before save", user);

    // Save the user to the database
    const savedUser = await Users.create(user);
    console.log("user saved", savedUser);

    // Generate a JWT token
    const data = {
      user: {
        id: savedUser.id
      }
    };
    const token = jwt.sign(data, 'secret_ecom');

    // Respond with the token
    res.json({ success: true, token });

  } catch (error) {
    console.error("Error saving user:", error.message);
    res.status(500).json({
      success: false,
      message: "Error saving user",
      error: error.message
    });
  }
};


const postLogin = async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            if (user.blocked) {
                return res.status(403).json({ success: false, errors: "Login Failed ,Please contact Support Team" });
            }
            const passCompair = req.body.password === user.password;
            if (passCompair) {
                const data = {
                    user: {
                        id: user.id
                    }
                }

                const token = jwt.sign(data, 'secret_ecom');
                res.json({ success: true, token });
            } else {
                res.status(400).json({ success: false, errors: "Wrong password" });
            }
        } else {
            res.status(400).json({ success: false, errors: "Wrong email" });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error during login",
            error: error.message
        });
    }
}

const getNewCollection = async (req, res) => {
    let product = await Product.find({});
    let newCollection = product.slice(1).slice(-8);
    
    res.send(newCollection);
}

const getPopularInWomen = async (req, res) => {
    try {
        const products = await Product.find({ category: 'women' });
        const popular_in_women = products.slice(0,4);
       
        res.json({ success: true, products: popular_in_women });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching popular products in women category",
            error: error.message
        });
    }
}
const postAddToCart = async (req, res) => {
    try {
   

        // Find the user by ID
        let userdata = await Users.findOne({ id: req.user.id });

        if (!userdata) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Initialize the cartData object if it doesn't exist
        if (!userdata.cartData) {
            userdata.cartData = {};
        }

        // Ensure itemId is treated as a string for consistency in the cartData object
        const itemId = req.body.itemId.toString();

        // Increment the item count or initialize it
        if (userdata.cartData[itemId]) {
            userdata.cartData[itemId] += 1;
        } else {
            userdata.cartData[itemId] = 1;
        }

        // Update the user's cartData
        await Users.findOneAndUpdate({ id: req.user.id }, { cartData: userdata.cartData });

        res.json({ success: true, message: "Item added to cart" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

     

const removeFromCart = async (req, res) => {
  try {
      // Find the user by ID
      let userdata = await Users.findOne({ id: req.user.id });

      if (!userdata) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      // Check if cartData is initialized
      if (!userdata.cartData) {
          return res.status(400).json({ success: false, message: "No items in the cart" });
      }

      // Decrement the item count or remove it if count is 0
      if (userdata.cartData[req.body.itemId]) {
          delete userdata.cartData[req.body.itemId];
      } else {
          return res.status(400).json({ success: false, message: "Item not in cart" });
      }

      // Update the user's cartData
      await Users.findOneAndUpdate({ id: req.user.id }, { cartData: userdata.cartData });

      res.json({ success: true, message: "Item removed from cart" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};


const getCart = async (req, res) => {
    try {
       

        let userData = await Users.findOne({ id: req.user.id });
     
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: userData.cartData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({});
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
    }
};


const blockUser = async (req, res) => {
    try {
        const { id } = req.body;
        
        const user = await Users.findOneAndUpdate({ id: parseInt(id) }, { blocked: true }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User blocked successfully', user });
    } catch (error) {
        console.error(`Error blocking user: ${error.message}`); // Add this line
        res.status(500).json({ success: false, message: 'Error blocking user', error: error.message });
    }
};

const unblockUser = async (req, res) => {
    try {
        const { id } = req.body;
        
        const user = await Users.findOneAndUpdate({ id: parseInt(id) }, { blocked: false }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User unblocked successfully', user });
    } catch (error) {
        console.error(`Error unblocking user: ${error.message}`); // Add this line
        res.status(500).json({ success: false, message: 'Error unblocking user', error: error.message });
    }
};


const toggleAvailability = async (req, res) => {
    try {
        const { id, available } = req.body;
        const product = await Product.findOneAndUpdate(
            { id: id },
            { available: available },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product availability updated', product });
    } catch (error) {
        console.error(`Error updating product availability: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error updating product availability', error: error.message });
    }
};


    const searchProducts = async (req, res) => {
      try {
        const query = req.query.query;
        console.log(query)
        const regex = new RegExp(query, 'i'); // Create a case-insensitive regex from the search query
        const products = await Product.find({
          $or: [
            { name: regex },
           
            // Add other fields if needed
          ]
        });

        console.log(products)
        res.json({ success: true, products });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Error fetching search results",
          error: error.message
        });
      }
    }

      const getUserDetails = async (req, res) => {
        try {
            
          const user = await Users.findOne({ id: req.user.id }); // Assuming req.user.id contains the user's ID
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
          
          res.json({ success: true, user });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: 'Error fetching user details',
            error: error.message
          });
        }
      };



      const updateUserDetails = async (req, res) => {
        try {
          
          const { name, email, phone } = req.body;
      
          // Ensure userId is a string before passing it to findByIdAndUpdate
          const userId = req.user.id.toString(); // Convert to string if it's a number
      
          // Update the user document with the new data
          const updatedUser = await Users.findOneAndUpdate(
            {id:userId},
            { $set: { name, email, phone } },
            { new: true } // This option returns the updated document instead of the original
          );
      
          // Check if the user was successfully updated
          if (updatedUser) {
            return res.status(200).json({
              success: true,
              message: 'User details updated successfully',
              user: updatedUser,
            });
          } else {
            return res.status(404).json({
              success: false,
              message: 'User not found',
            });
          }
        } catch (error) {
          console.error('Error updating user details:', error);
          return res.status(500).json({
            success: false,
            message: 'An error occurred while updating user details',
            error: error.message,
          });
        }
      };
   


      const postAddAddress = async (req, res) => {
        try {
          
          const newAddress = req.body;
    
          const updatedUser = await Users.findOneAndUpdate(
            {id:req.user.id},
            { $push: { addresses: newAddress } },
            { new: true }
          );
      
          if (!updatedUser) {
            return res.status(400).send({ error: 'Failed to add address' });
          }
      
          res.status(200).send({ success: true, address: updatedUser.addresses[updatedUser.addresses.length - 1] }); // Assuming the newly added address is the last element
        } catch (error) {
          console.error(error);
          res.status(500).send({ error: 'Internal server error' });
        }
      };
      
   
      const deleteAddress = async (req, res) => {
        try {
          const addressId = req.params.index; // Get the address ID from the URL parameter
          
      
          const userId = req.user.id; // Assuming user ID is stored in req.user
          
      
          // Find the user document
          const user = await Users.findOne({ id: userId });
         
          
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          // Check if the address ID exists in the user's addresses array
          if (addressId < 0 || addressId >= user.addresses.length) {
            return res.status(404).json({ message: 'Address not found for this user' });
          }
      
          // Remove the address from the user's addresses array
          user.addresses.splice(addressId, 1);
      
          // Save the updated user document with the deleted address
          await user.save();
      
          res.json({ success: true, message: 'Address deleted successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: 'Internal server error' });
        }
      };
      
      const getAddress = async (req, res) => {
        try {
          const userId = req.user.id.toString(); // Assuming user data is accessible through req.user
      
          // Example using a hypothetical `Users` model
          const user = await Users.findOne({ id: userId });
      
          if (user) {
            res.json({ success: true, address: user.addresses });
          } else {
            res.status(404).json({ success: false, message: 'User not found' });
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
          res.status(500).json({ success: false, error: 'Internal server error' });
        }
      };
      

      const comparePassword = async (req, res) => {
       
        const { oldPassword } = req.body;
      
        try {
          // Find user by ID
          const user = await Users.findOne({ id: req.user.id });
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          console.log(oldPassword  ,  user.password)
      
          // Compare provided old password with the stored password
          const isMatch = oldPassword === user.password;
      
          if (isMatch) {
            console.log("password match")
            return res.status(200).json({success:true, message: 'Password match' });
          } else {
            console.log("password mismatch")
            return res.status(401).json({success:false, message: 'Password does not match' });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error' });
        }
      };
      

      const changePassword = async (req, res) => {
        
        const { oldPassword, newPassword } = req.body;
      
        try {
          // Find user by ID
          const user = await Users.findOne({ id: req.user.id });
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          
          user.password = newPassword;
          await user.save();
      
          return res.status(200).json({ message: 'Password changed successfully', success: true });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error', success: false });
        }
      };


      const getUser = async (req, res) => {
        try {
          console.log("started")
          const order = await Order.find({})
          console.log("order",order)
          const usernames = order.map(order => order.username);
        console.log("usernames", usernames);
        const users = await Users.find({ name: { $in: usernames } });
        console.log("userlist", users);
        
          res.status(200).json(users);
        } catch (error) {
          res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
      };


      const postOrder = async (req, res) => {
        console.log('Request body:', req.body);
        const { address, paymentMethod, products, totalAmount } = req.body;
        const userId = req.user.id;
        console.log("Products:", products);
      
        try {
          const user = await Users.findOne({ id: userId });
          if (!user) {
            throw new Error('User not found');
          }
          console.log('User:', user);
      
          let highestIdOrder = await Order.findOne().sort({ id: -1 });
          console.log('Highest ID Order:', highestIdOrder);
      
          let newId = highestIdOrder ? highestIdOrder.id + 1 : 1;
          if (isNaN(newId)) {
            throw new Error('New ID is not a number');
          }
          console.log('New ID:', newId);
      
          const username = user.name;
          const orderProducts = products.map(product => ({
            ...product,
            status: paymentMethod === 'online' ? 'Shipped' : 'on the way'
          }));
      
          const newOrder = new Order({
            id: newId,
            username,
            address,
            paymentMethod,
            products: orderProducts,
            totalAmount
          });
      
          await newOrder.save();
      
          // Remove ordered products from user's cart and decrement product quantity in the inventory
          for (const product of products) {
            if (user.cartData && user.cartData[product.id]) {
              await Users.updateOne(
                { id: userId },
                { $unset: { [`cartData.${product.id}`]: "" } }
              );
              console.log("Deleted product from cart:", product.id);
            }
      
            const inventoryProduct = await Product.findOne({ id: product.id });
            if (inventoryProduct) {
              inventoryProduct.quantity -= product.quantity;
              if (inventoryProduct.quantity < 0) {
                inventoryProduct.quantity = 0; // Prevent negative quantity
              }
              await inventoryProduct.save();
              console.log("Updated product quantity:", inventoryProduct.id, inventoryProduct.quantity);
            } else {
              console.log("Product not found in inventory:", product.id);
            }
          }
      
          await user.save();
      
          res.status(201).json({ success: true, message: 'Order created successfully', order: newOrder });
        } catch (error) {
          console.error('Error creating order:', error.message);
          res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
        }
      };
      



const getOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user.id` is set by the `fetchuser` middleware
   
   
    const user = await Users.findOne({id:userId});
   
    const username = user.name;

    const orders = await Order.find({username:username})
    



    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};

const getSingleOrder =async (req, res) => {
  try {
    console.log("params",req.params.orderId)
    const orderId= req.params.orderId;
const userId= req.user.id;



    const user= await Users.find({id:userId});
  console.log("user",user[0].name)
     const username = user[0].name;
    
    const order= await Order.find({ username:username });
    console.log(order)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

const updateStatus = async (req, res) => {
  const { orderId, productId } = req.params;
  const { status } = req.body;

  try {
    // Find the order
    const order = await Order.findOne({ id: orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Find the product in the order
    const product = order.products.find(product => product.id == productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the status of the product
    product.status = status;
    await order.save();

    return res.json({ success: true, message: 'Product status updated successfully' });
  } catch (error) {
    console.error('Error updating product status:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};


const getDashboard = async (req, res) => {
  try {
    console.log("start");

    const totalOrders = await Order.countDocuments({});

    // Summing up the total amount from all orders
    const totalAmountResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);
    const totalAmount = totalAmountResult[0] ? totalAmountResult[0].totalAmount : 0;

    // Counting total users (assuming a Users collection exists)
    const totalUsers = await Users.countDocuments({});

    // Counting total products (assuming a Products collection exists)
    const totalProducts = await Product.countDocuments({});
console.log("result:",totalAmount,totalUsers,totalOrders,totalProducts)
    res.status(200).json({
      success: true,
      totalOrders,
      totalAmount,
      totalUsers,
      totalProducts,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};


const getSingleUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user by ID
    const user = await Users.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch orders by username
    const orders = await Order.find({ username: user.name });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Orders not found for this user' });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateProductDetails = async (req, res) => {
  try {
      const { id, ...updateData } = req.body;
console.log(id)
      // Update product details in the database
      const updatedProduct = await Product.findOneAndUpdate(
          { id:id },
          { $set: updateData },
          { new: true } // Return the updated document
      );
console.log(updatedProduct)
      if (!updatedProduct) {
          return res.status(404).json({ success: false, message: 'Product not found' });
      }

      console.log(updatedProduct);
      res.status(200).json({ success: true, message: 'Product details updated', data: updatedProduct });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getProductDetails =async (req, res) => {
  try {
    console.log("params id:",req.params.id)
    const product = await Product.find({id:req.params.id});
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    console.log(product)
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

const getSingleProductDetails=async (req, res) => {
  try {
    console.log("params id:",req.params.productId)
    const product = await Product.find({_id: req.params.productId});
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    console.log(product)
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}



const decrementCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user.id;

    // Find the user by ID
    let userdata = await Users.findOne({ id: userId });

    if (!userdata) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if cartData is initialized
    if (!userdata.cartData) {
      return res.status(400).json({ success: false, message: "No items in the cart" });
    }

    // Decrement the item count or remove it if count is 0
    if (userdata.cartData[itemId]) {
      if (userdata.cartData[itemId] > 1) {
        // Decrement the count by 1
        userdata.cartData[itemId] -= 1;
      } else {
        // Remove the item if count is 1
        delete userdata.cartData[itemId];
      }
    } else {
      return res.status(400).json({ success: false, message: "Item not in cart" });
    }

    // Update the user's cartData
    await Users.findOneAndUpdate({ id: userId }, { cartData: userdata.cartData });

    res.json({ success: true, message: "Item decremented from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

const cancelOrder = async (req, res) => {
  const { orderId, productId } = req.body;
  const userId = req.user.id;

  try {
    // Find the order
    const order = await Order.findOne({ id: orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Find the specific product within the order
    const product = order.products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found in order' });
    }

    // Update the product quantity in the inventory
    const inventoryProduct = await Product.findOne({ id: productId });
    if (inventoryProduct) {
      inventoryProduct.quantity += product.quantity;
      await inventoryProduct.save();
      console.log("Updated product quantity:", inventoryProduct.id, inventoryProduct.quantity);
    } else {
      console.log("Product not found in inventory:", productId);
    }

    // Update the product status in the order
    product.status = "This product will be cancelled";
    await order.save();
console.log("orede",order)
    res.status(200).json({ success: true, message: 'Product cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling product:', error.message);
    res.status(500).json({ success: false, message: 'Error cancelling product', error: error.message });
  }
};

const returnProduct = async (req, res) => {
  const { orderId, productId } = req.body;
  const userId = req.user.id;
console.log(req.body);
  try {
    // Find the order
    const order = await Order.findOne({ id: orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Find the specific product within the order
    const product = order.products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found in order' });
    }

    // Update the product quantity in the inventory
    const inventoryProduct = await Product.findOne({ id: productId });
    if (inventoryProduct) {
      inventoryProduct.quantity += product.quantity;
      await inventoryProduct.save();
      console.log("Updated product quantity:", inventoryProduct.id, inventoryProduct.quantity);
    } else {
      console.log("Product not found in inventory:", productId);
    }

    // Update the product status in the order
    product.status = "This product will return successfully";
    await order.save();
    console.log("Order updated:", order);

    res.status(200).json({ success: true, message: 'Product returned successfully' });
  } catch (error) {
    console.error('Error returning product:', error.message);
    res.status(500).json({ success: false, message: 'Error returning product', error: error.message });
  }
};



const getAdminDetails = async (req, res) => {
  try {
    console.log(req.body);
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    console.log("saved",username,password);

    const passCompare = req.body.username === username && req.body.password === password;

    if (passCompare) {
      const token = jwt.sign({ username: req.body.username }, 'secret_ecom');
      res.status(200).json({
        success: true,
        message: "Login successful",
        token: token
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message
    });
  }
};



const postBanner = async (req, res) => {
  try {
    const { description, startDate, endDate, status, image } = req.body;
console.log(req.body)
    const newBanner = new Banner({
      
      description: description,
      image,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status
    });
    
    await newBanner.save();
    console.log(newBanner)
    res.json({ success: true,banner:newBanner, message: 'Banner created successfully!' });
  } catch (err) {
    console.error('Error creating banner:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const fetchBanners=async (req, res) => {
  try {
    const banners = await Banner.find();
    console.log("banners:",banners)
    res.json({ success: true, banners:banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ success: false, message: 'Error fetching banners' });
  }
}

const deleteBanner=async (req, res) => {
  try {
    const bannerId = req.params.id;
    console.log("bannerId:",bannerId)
    const deletedBanner = await Banner.findOneAndDelete(bannerId);
    
    if (deletedBanner) {
      res.json({ success: true, message: 'Banner deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Banner not found' });
    }
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ success: false, message: 'Error deleting banner' });
  }
}


const updateBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const updatedBannerData = req.body;
    console.log(updatedBannerData);
    
    const updatedBanner = await Banner.findByIdAndUpdate(bannerId, updatedBannerData, { new: true });
    
    if (updatedBanner) {
      res.json({ success: true, banner: updatedBanner });
    } else {
      res.status(404).json({ success: false, message: 'Banner not found' });
    }
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ success: false, message: 'Error updating banner' });
  }
};



      module.exports = {
        removeFromCart,decrementCart,postBanner,
        getAddress,uploadSingleimg,deleteBanner,
        deleteAddress,fetchBanners,updateBanner,
        updateUserDetails,
        getUserDetails,
        postAddAddress,
        searchProducts,
        toggleAvailability,
        blockUser,
        unblockUser,
        getCart,
        getAllUsers,
        getNewCollection,
        postAddToCart,
        getPopularInWomen,
        postLogin,
        postSignup,
        createtask,
        uploadImg,
        postImage,
        removeProduct,
        getAllProducts,
        comparePassword,
        changePassword,
         getUser,
        postOrder,
        getOrder,
        getSingleOrder,
        updateStatus,returnProduct,getAdminDetails,
        getDashboard,getProductDetails,cancelOrder,
        getSingleUserOrders,updateProductDetails,getSingleProductDetails
      };
      