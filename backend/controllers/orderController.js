import Order from "../models/orderModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (You must be logged in)
export const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    } else {
      // Create a new order object based on our Order Model
      const order = new Order({
        orderItems,
        // THIS is why we needed the protect middleware! It attached the user to req.user.
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      // Save it to MongoDB
      const createdOrder = await order.save();

      // Send back a 201 (Created) status and the new order data
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error saving the order" });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (You must be logged in to see a receipt!)
export const getOrderById = async (req, res) => {
  try {
    // .populate() is Mongoose magic. It looks at the User ID attached to the order,
    // goes to the User collection, and grabs that user's name and email to attach to this result!
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching order details" });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();

      // This data comes directly from PayPal after a successful transaction
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error updating payment" });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    // Find all orders where the 'user' field matches the ID of the logged-in user
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching your orders" });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    try {
        // .populate('user', 'id name') attaches the name of the buyer so we can display it!
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching all orders' });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating delivery status' });
    }
};