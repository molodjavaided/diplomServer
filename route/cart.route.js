import { Router } from "express";
import { Cart } from "../model/cart.model.js";
import { Product } from "../model/product.model.js";
import { isAuth } from "../middleware/isAuth.js";
import { createProductMap } from "../utils/product-map.js";
import { calculateCartTotals } from "../utils/calculate-cart-totals.js";

export const cartRouter = Router()

// Получить корзину пользователя
cartRouter.get('/', isAuth, async (req,res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id })
        if (!cart) {
            cart = await Cart.create({
                userId: req.user._id,
                items: []
            })
        }
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

// Добавить товар в корзину
cartRouter.post('/items', isAuth, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Товар не найден" })
        }
        if (!product.inStock || product.quantity < quantity) {
            return res.status(400).json({ message: "Товара нет в наличии", available: product.quantity })
        }
        let cart = await Cart.findOne({ userId: req.user._id })
        if (!cart) {
            cart = await Cart.create({
                userId: req.user._id,
                items: []
            })
        }
        const existingItem = cart.items.findIndex(item => item.productId.toString() === productId.toString())

        if (existingItem !== -1) {
            cart.items[existingItem].quantity += quantity

            cart.items[existingItem].totalPrice = product.price * quantity

        } else {
            cart.items.push({
                productId,
                quantity,
                price: product.price,
                title: product.title,
                description: product.description || "",
                imageUrl: product.imageUrl || "",
                inStock: product.inStock,
                totalPrice: product.price * quantity
            })
        }

        calculateCartTotals(cart)

        await cart.save()

        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Меняем кол-во товара в корзине
cartRouter.patch('/items/:productId', isAuth, async (req,res) => {
    try {
        const { productId } = req.params
        const { quantity } = req.body

        if (quantity < 1) {
            return res.status(400).json({ message: 'Требуется более одного' })
        }
        const cart = await Cart.findOne({ userId: req.user._id })
        if (!cart) {
            return res.status(404).json({ message: 'Корзина не найдена' })
        }
        const itemInCartIndex = cart.items.findIndex(item => item.productId.toString() === productId)
        if (itemInCartIndex === -1) {
            return res.status(404).json({ message: 'Товар не найден в корзине' })
        }
        const product = await Product.findById(productId)
        if (product && product.quantity < quantity) {
            return res.status(400).json({ message: "Товара недостаточно на складе", available: product.quantity })
        }
        cart.items[itemInCartIndex].quantity = quantity
        cart.items[itemInCartIndex].totalPrice = cart.items[itemInCartIndex].price * quantity
        calculateCartTotals(cart);
        await cart.save();
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Удалить товар из корзины
cartRouter.delete('/items/:productId', isAuth, async (req,res) => {
    try {
        const { productId } = req.params
        const cart = await Cart.findOne({ userId: req.user._id })
        if (!cart) {
            return res.status(404).json({ message: 'Корзина не найдена' })
        }
        cart.items = cart.items.filter(item => item.productId.toString() !== productId)
        calculateCartTotals(cart);
        await cart.save();
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Очистить корзину
cartRouter.delete('/', isAuth, async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.user._id },
            {
             items: [],
             totalPrice: 0,
             totalQuantity: 0
            },
            { new: true }
        )
        if (!cart) {
            return res.status(404).json({ message: 'Корзина не найдена' })
        }
        res.status(200).json(cart)
    } catch (error) {
         res.status(500).json({ message: error.message })
    }
})

// Оформить заказ
cartRouter.post('/order', isAuth, async (req,res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id })
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Корзина пуста" })
        }
        const productsId = cart.items.map(item => item.productId)
        const products = await Product.find({ _id: { $in: productsId }  })

        const productMap = createProductMap(products)

        for (const item of cart.items) {
            const product = productMap.get(item.productId.toString())

            if (!product) {
                return res.status(404).json({ message: "Товар не найден" })
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Товара ${item.title} недостаточно на складе. В наличии ${product.quantity}` })
            }
            const newQuantity = product.quantity - item.quantity;

            await Product.findByIdAndUpdate(
                item.productId,
                {
                    quantity: newQuantity,
                    inStock: newQuantity > 0
                }
            )
        }

        await Cart.findOneAndUpdate(
            { userId: req.user._id },
            {
                items: [],
                totalPrice: 0,
                totalQuantity: 0
            }
        )
        res.status(200).json({
            success: true,
            message: 'Заказ успешно оформлен. Мы с вами свяжемся',
            order: {
                totalItems: cart.totalQuantity,
                totalPrice: cart.totalPrice,
                orderDate: new Date().toISOString()
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})