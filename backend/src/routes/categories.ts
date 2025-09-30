import { Router, Request, Response } from 'express';
import { CategoryModel } from '../models/CategoryModel';

const router = Router();

// GET /api/categories - Получить все категории
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.findAll();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Ошибка при получении категорий' }
    });
  }
});

// GET /api/categories/:id - Получить категорию по ID
router.get('/:id(\\d+)', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Неверный ID категории' }
      });
    }

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: { message: 'Категория не найдена' }
      });
    }

    // Получаем количество растений в категории
    const plantCount = await CategoryModel.getPlantCount(id);

    res.json({
      success: true,
      data: {
        ...category,
        plant_count: plantCount
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Ошибка при получении категории' }
    });
  }
});

// GET /api/categories/slug/:slug - Получить категорию по slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await CategoryModel.findBySlug(slug);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: { message: 'Категория не найдена' }
      });
    }

    // Получаем количество растений в категории
    const plantCount = await CategoryModel.getPlantCount(category.id);

    res.json({
      success: true,
      data: {
        ...category,
        plant_count: plantCount
      }
    });
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Ошибка при получении категории' }
    });
  }
});

export default router;
