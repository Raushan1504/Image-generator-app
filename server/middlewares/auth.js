import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
const {token} = req.headers;
console.log("AUTH HEADER:", token);
    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized. Login Again"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        
        if(decoded.id){
            req.userId = decoded.id;
            console.log(req.userId);
        }
        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        return res.json({
            success: false,
            message: "Invalid Token"
        });
    }
};

export default userAuth;
