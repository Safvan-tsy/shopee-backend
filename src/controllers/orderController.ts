import Order, { Orders } from "@models/orderModel";
import AppError from "@utils/appError";
import catchAsync from "@utils/catchAsync";
import Product from "@models/product/productsModel";
import { Email } from "@utils/email";
import User from "@models/user/userModel";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


const createOrder = catchAsync(async (req, res, next) => {
    
    
    const order = await Order.create(req.body)

     for (const orderItem of order.orderItems) {
        const product = await Product.findById(orderItem.product);

        if (product) {
            if (product.countInStock >= orderItem.qty) {
                product.countInStock -= orderItem.qty;
                await product.save();
            } else {
                // cancel order and send mail
                const user = await User.findById(order.userId)
                order.status = "Cancelled"
                order.statusDescription = "Due to product out of stock"
                await order.save();
                await new Email(user).sendOrderCancelled()
                return next(new AppError('Failed to place order', 400))
            }
        } 
        // else {
        //     // Handle the case where the product is not found.
        //     // can choose to cancel the order or take appropriate action here.
        //     console.log(`Product not found for ID: ${orderItem.product}`);
        // }
    }

    
    // send otp to email 
    
    res.status(200).json({
        status: 'success',
        order
    });
})


const getOrderById = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return next(new AppError('no order found ', 400))
    res.status(200).json({
        status: 'success',
        data: {
            order
        }

    })

})

const getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ userId: req.user._id })
    res.status(200).json({
        status: 'success',
        orders
    })

})




export {
    getMyOrders,
    getOrderById,
    createOrder
}