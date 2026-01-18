import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js";

const registerUser = async (req, res) => {

    const { name, password, email } = req.body;

    try {

        if (!name || !password || !email) {
            return res.json({
                success: false,
                message: "Missing Details"
            });
        }
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({
                success: false,
                message: "User Already Exists"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        const user = await newUser.save();
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.json({
            success: true,
            token,
            user: {
                name: user.name,
                creditBalance: user.creditBalance
            }
        });

    } catch (error) {
        console.log(error);
        let errorMessage = error.message;
        if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
            errorMessage = 'Database connection failed. Please check MongoDB Atlas IP whitelist or cluster status.';
        }
        res.json({
            success: false,
            message: errorMessage
        });
    }
};
const loginUser = async (req, res) => {

    try {
        console.log(req.body)
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User Does Not Exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            user: {
                name: user.name,
                creditBalance: user.creditBalance
            }
        });

    } catch (error) {
        console.log(error);
        let errorMessage = error.message;
        if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
            console.log('Database connection failed. Please check MongoDB Atlas IP whitelist or cluster status.');
        }
        res.json({
            success: false,
            message: errorMessage
        });
    }
};

const userCredits = async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId)
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User Not Found"
            });
        }

        res.json({
            success: true,
            creditBalance: user.creditBalance,
            user: {
                name: user.name,
                creditBalance: user.creditBalance
            }
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });

    }

};


// Validate Razorpay environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('ERROR: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in environment variables');
}
console.log(process.env.RAZORPAY_KEY_ID)
console.log(process.env.RAZORPAY_KEY_SECRET)

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
const paymentRazorpay = async (req, res) => {
    try {
        const userId = req.userId;  // Get from auth middleware, NOT req.body
        const { planId } = req.body;
        console.log({ userId }, { planId })

        if (!userId || !planId) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const userData = await userModel.findById(userId)
        let creditBalance, plan, amount, date


        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                creditBalance = 100;
                amount = 10;
                break;

            case 'Advanced':
                plan = 'Advanced';
                creditBalance = 500;
                amount = 50;
                break;

            case 'Business':
                plan = 'Business';
                creditBalance = 5000;
                amount = 250;
                break;

            default:
                return res.json({
                    success: false,
                    plan: 'Not found'
                });
        }

        date = Date.now();
        const transactionData = {
            userId, plan, amount, creditBalance, date
        }

        const newTransaction = await transactionModel.create(transactionData)

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id
        }
        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error)
                return res.json({ success: false, message: error })
            }
            res.json({ success: true, order })
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyRazorPay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        console.log(razorpay_order_id)


        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt)

            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment Failed' })
            }
            const userData = await userModel.findById(transactionData.userId)

            const creditBalance = userData.creditBalance + transactionData.creditBalance
            await userModel.findByIdAndUpdate(userData._id, { creditBalance })

            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true })

            res.json({ success: true, message: 'Credits added' })
        } else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorPay };
