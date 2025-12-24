import jwt from 'jsonwebtoken'

export const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Неавторизованный" });
        }
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        const userId = payload.userId || payload.id || payload.user?._id;
       req.user = { _id: userId };
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}