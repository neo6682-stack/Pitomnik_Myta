export interface Plant {
  id: number;
  name: string;
  scientific_name?: string;
  description: string;
  short_description: string;
  category_id: number;
  
  // Характеристики
  light_requirements: 'sun' | 'partial_shade' | 'shade';
  is_medicinal: boolean;
  is_honey_plant: boolean;
  is_evergreen: boolean;
  is_roof_suitable: boolean;
  is_ground_cover: boolean;
  has_aroma: boolean;
  is_floristic_cut: boolean;
  is_dried_flower: boolean;
  coastal_climate_resistant: boolean;
  
  // Размеры
  height_min?: number;
  height_max?: number;
  width_min?: number;
  width_max?: number;
  
  // Цветение
  flowering_period?: string;
  flower_color?: string;
  plant_color?: string;
  
  // Уход
  watering_frequency: string;
  soil_type: string;
  frost_resistance: string;
  care_instructions?: string;
  
  // Цена и наличие
  price: number;
  wholesale_price: number;
  stock_quantity: number;
  is_available: boolean;
  
  // SEO
  slug: string;
  meta_title?: string;
  meta_description?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  parent_id?: number;
  created_at: string;
}

export interface PlantFilters {
  category_id?: number;
  light_requirements?: string;
  is_honey_plant?: boolean;
  is_evergreen?: boolean;
  is_roof_suitable?: boolean;
  is_ground_cover?: boolean;
  has_aroma?: boolean;
  is_floristic_cut?: boolean;
  is_dried_flower?: boolean;
  coastal_climate_resistant?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PlantSet {
  id: number;
  name: string;
  description: string;
  short_description: string;
  price: number;
  original_price?: number;
  category: 'honey' | 'roof' | 'aroma' | 'floristic' | 'evergreen';
  is_seasonal: boolean;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  is_premium: boolean;
  is_available: boolean;
  image_url?: string;
  slug: string;
  created_at: string;
}

export interface PlantSetItem {
  id: number;
  set_id: number;
  plant_id: number;
  quantity: number;
  created_at: string;
}
