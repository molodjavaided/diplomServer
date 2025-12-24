import { User } from '../model/user.model.js'

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user)

        if (user.role !== 0) {
            return res.status(403).json({ message: "Доступ запрещён" })
        }

        req.userRole = user.role;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}