import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Razorpay configuration (would need actual keys in production)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_demo123456789';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'demo_secret_key_12345';

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, orderNumber, currency = 'INR' } = req.body;

    // In production, you would create a real Razorpay order
    // const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
    // const order = await razorpay.orders.create({...});

    // For demo purposes, we'll create a mock order
    const razorpayOrderId = 'order_' + crypto.randomBytes(12).toString('hex');
    
    // Update order with Razorpay order ID
    await Order.findOneAndUpdate(
      { orderNumber },
      { razorpayOrderId }
    );

    res.json({
      success: true,
      data: {
        orderId: razorpayOrderId,
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        key: RAZORPAY_KEY_ID,
        orderNumber
      }
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderNumber 
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update order status
    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { 
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        paidAt: new Date(),
        $push: {
          trackingEvents: {
            status: 'Payment Confirmed',
            description: `Payment of ₹${order?.total} received via Razorpay`,
            location: 'Online'
          }
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
});

// @route   POST /api/payments/cod-confirm
// @desc    Confirm COD order
// @access  Private
router.post('/cod-confirm', protect, async (req, res) => {
  try {
    const { orderNumber } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderNumber, user: req.user._id },
      { 
        paymentStatus: 'pending',
        orderStatus: 'confirmed',
        $push: {
          trackingEvents: {
            status: 'Order Confirmed',
            description: 'Your COD order has been confirmed and is being processed',
            location: 'Bengaluru Warehouse'
          }
        }
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'COD order confirmed',
      data: { order }
    });
  } catch (error) {
    console.error('COD confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming COD order',
      error: error.message
    });
  }
});

// @route   GET /api/payments/receipt/:orderNumber
// @desc    Get receipt/invoice data
// @access  Private
router.get('/receipt/:orderNumber', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
      user: req.user._id
    }).populate('items.product', 'name images slug category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Generate receipt data
    const receiptData = {
      invoiceNumber: `INV-${order.orderNumber}`,
      order: order,
      company: {
        name: 'Manvith Charcoal',
        address: 'Madavara, Dasanapura Hobli, Bengaluru North, Karnataka - 562162',
        phone: '+91 89713 32915',
        email: 'info@manvithcharcoal.com',
        gst: '29BDOPN3292F1Z3',
        website: 'www.manvithcharcoal.com'
      },
      generatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: receiptData
    });
  } catch (error) {
    console.error('Receipt generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating receipt',
      error: error.message
    });
  }
});

export default router;

