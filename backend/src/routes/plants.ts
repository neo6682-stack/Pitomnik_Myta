import { Router, Request, Response } from 'express';
import { PlantModel } from '../models/PlantModel';
import { PlantFilters } from '../types/plant';

const router = Router();

// GET /api/plants - Получить список растений с фильтрами
router.get('/', async (req: Request, res: Response) => {
  try {
    const filters: PlantFilters = {
      category_id: req.query.category_id ? parseInt(req.query.category_id as string) : undefined,
      light_requirements: req.query.light_requirements as string,
      is_honey_plant: req.query.is_honey_plant === 'true' ? true : req.query.is_honey_plant === 'false' ? false : undefined,
      is_evergreen: req.query.is_evergreen === 'true' ? true : req.query.is_evergreen === 'false' ? false : undefined,
      is_roof_suitable: req.query.is_roof_suitable === 'true' ? true : req.query.is_roof_suitable === 'false' ? false : undefined,
      is_ground_cover: req.query.is_ground_cover === 'true' ? true : req.query.is_ground_cover === 'false' ? false : undefined,
      has_aroma: req.query.has_aroma === 'true' ? true : req.query.has_aroma === 'false' ? false : undefined,
      is_floristic_cut: req.query.is_floristic_cut === 'true' ? true : req.query.is_floristic_cut === 'false' ? false : undefined,
      is_dried_flower: req.query.is_dried_flower === 'true' ? true : req.query.is_dried_flower === 'false' ? false : undefined,
      coastal_climate_resistant: req.query.coastal_climate_resistant === 'true' ? true : req.query.coastal_climate_resistant === 'false' ? false : undefined,
      min_price: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
      max_price: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const [plants, totalCount] = await Promise.all([
      PlantModel.findAll(filters),
      PlantModel.getCount(filters)
    ]);

    res.json({
      success: true,
      data: {
        plants,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: totalCount,
          pages: Math.ceil(totalCount / (filters.limit || 20))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Ошибка при получении списка растений' }
    });
  }
});

// GET /api/plants/statistics - Получить статистику растений
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    const statistics = await PlantModel.getStatistics();
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Ошибка при получении статистики' }
    });
  }
});

// GET /api/plants/:id - Получить растение по ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Неверный ID растения' }
      });
    }

    const plant = await PlantModel.findById(id);
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: { message: 'Растение не найдено' }
      });
    }

    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    console.error('Error fetching plant:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Ошибка при получении растения' }
    });
  }
});

// GET /api/plants/slug/:slug - Получить растение по slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const plant = await PlantModel.findBySlug(slug);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: { message: 'Растение не найдено' }
      });
    }

    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    console.error('Error fetching plant by slug:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Ошибка при получении растения' }
    });
  }
});

export default router;
