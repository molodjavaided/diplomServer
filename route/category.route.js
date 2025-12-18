import { Router } from 'express'
import { Category } from '../model/category.model.js'
import { isAuth } from '../middleware/isAuth.js';
import { isAdmin } from '../middleware/isAdmin.js';

export const categoryRouter = Router()

// Получить все категории
categoryRouter.get('/', async (req,res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// Получить категорию по id
categoryRouter.get('/:id', async (req,res) => {
    try {
        const category = await Category.findById(req.params.id)

        if (!category) {
            return res.status(404).json({ message: "Категория не найдена" })
        }

        res.status(200).json(category)
    } catch (error) {
         res.status(500).json({ message: error.message })
    }
});

// Создать категорию
categoryRouter.post('/', isAuth, isAdmin, async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(400).json({ message: "Название категории обязательно" })
        }
        const category = await Category.create({ name });
        res.status(201).json(category)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Обновить категорию
categoryRouter.patch('/:id', isAuth, isAdmin, async (req,res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!category) {
            return res.status(404).json({ message: "Категория не найдена" })
        }
        res.status(200).json(category)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Удалить категорию
categoryRouter.delete('/:id', isAuth, isAdmin, async (req,res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if (!category) {
            return res.status(404).json({ message: "Категория не найдена" })
        }
        res.status(200).json({ message: "Категория удалена" })
    } catch (error) {
         res.status(500).json({ message: error.message })
    }
})