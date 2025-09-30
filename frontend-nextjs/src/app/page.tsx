'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X, Heart, Star } from 'lucide-react';

interface Plant {
  id: number;
  name: string;
  scientific_name: string;
  description: string;
  short_description: string;
  category_name: string;
  image_url: string;
  price: number;
  is_honey_plant: boolean;
  is_evergreen: boolean;
  is_roof_suitable: boolean;
  is_ground_cover: boolean;
  has_aroma: boolean;
  is_floristic_cut: boolean;
  height_min: number;
  height_max: number;
  flowering_period: string;
  flower_color: string;
  plant_color: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function Home() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // API Base URL - будет автоматически определяться в зависимости от окружения
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://pitomnik-myta-backend.railway.app/api'
    : 'http://localhost:3001/api';

  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plantsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE}/plants?limit=12`),
        fetch(`${API_BASE}/categories`)
      ]);
      
      const plantsData = await plantsRes.json();
      const categoriesData = await categoriesRes.json();
      
      if (plantsData.success) {
        setPlants(plantsData.data.plants);
      }
      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || plant.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'h-16 bg-white/95 backdrop-blur-sm shadow-lg' : 'h-24 bg-gradient-to-r from-green-600 to-green-700'
      }`}>
        {/* Top bar */}
        {!isScrolled && (
          <div className="bg-green-200 text-green-800 text-center py-2 text-sm">
            Бесплатная доставка от 5000₽ | +7 918 55 28 423 | Mytapitomnik@mail.ru
          </div>
        )}
        
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className={`relative transition-all duration-300 ${
              isScrolled ? 'w-12 h-12' : 'w-20 h-20'
            }`}>
              <Image
                src="/assets/logo.png"
                alt="Питомник МЯТА"
                fill
                className="rounded-full object-cover"
              />
            </div>
            {!isScrolled && (
              <div className="text-white">
                <h1 className="text-2xl font-bold">Питомник МЯТА</h1>
                <p className="text-sm opacity-90">Многолетние цветы и травы</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/catalog" className="text-white hover:text-green-200 transition-colors font-medium">
              Каталог
            </Link>
            <Link href="/sets" className="text-white hover:text-green-200 transition-colors font-medium">
              Наборы
            </Link>
            <Link href="/about" className="text-white hover:text-green-200 transition-colors font-medium">
              О нас
            </Link>
            <Link href="/contacts" className="text-white hover:text-green-200 transition-colors font-medium">
              Контакты
            </Link>
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск растений..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Корзина (0)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Питомник <span className="text-green-600">МЯТА</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Многолетние цветы и травы для вашего сада. Качественные растения от питомника в Ростовской области.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Смотреть каталог
            </button>
            <button className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium">
              Наборы растений
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { number: plants.length, label: 'Растений в каталоге', bg: 'bg-blue-500' },
              { number: plants.filter(p => p.is_honey_plant).length, label: 'Медоносные', bg: 'bg-yellow-500' },
              { number: plants.filter(p => p.is_evergreen).length, label: 'Вечнозеленые', bg: 'bg-green-500' },
              { number: plants.filter(p => p.is_roof_suitable).length, label: 'Для крыш', bg: 'bg-purple-500' },
              { number: plants.filter(p => p.has_aroma).length, label: 'Ароматные', bg: 'bg-pink-500' },
              { number: plants.filter(p => p.is_floristic_cut).length, label: 'Для флористики', bg: 'bg-red-500' }
            ].map((stat, index) => (
              <div key={index} className={`${stat.bg} text-white p-6 rounded-lg text-center`}>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plants Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Наши растения</h2>
          
          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Все категории</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Plants Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Загрузка каталога растений...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlants.map(plant => (
                <div
                  key={plant.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPlant(plant)}
                >
                  <div className="relative h-48">
                    <Image
                      src={plant.image_url || '/assets/logo.png'}
                      alt={plant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{plant.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{plant.category_name}</p>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{plant.short_description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {plant.is_honey_plant && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">🍯 Медонос</span>}
                      {plant.is_evergreen && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">🌲 Вечнозеленое</span>}
                      {plant.is_roof_suitable && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">🏠 Для крыш</span>}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">{plant.price}₽</span>
                      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                        В корзину
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Plant Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedPlant.name}</h2>
                <button
                  onClick={() => setSelectedPlant(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64">
                  <Image
                    src={selectedPlant.image_url || '/assets/logo.png'}
                    alt={selectedPlant.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                
                <div>
                  <p className="text-gray-600 mb-4">{selectedPlant.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div><strong>Научное название:</strong> {selectedPlant.scientific_name}</div>
                    <div><strong>Категория:</strong> {selectedPlant.category_name}</div>
                    <div><strong>Высота:</strong> {selectedPlant.height_min}-{selectedPlant.height_max} см</div>
                    <div><strong>Период цветения:</strong> {selectedPlant.flowering_period}</div>
                    <div><strong>Цвет цветка:</strong> {selectedPlant.flower_color}</div>
                    <div><strong>Цвет растения:</strong> {selectedPlant.plant_color}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">{selectedPlant.price}₽</span>
                    <div className="flex space-x-2">
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
                        В корзину
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-green-200 text-green-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Питомник МЯТА</h3>
              <p className="text-sm mb-2">Специализируемся на выращивании многолетних цветов и трав.</p>
              <p className="text-sm">📍 Ростовская область, Неклиновский район, село Николаевка</p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Контакты</h3>
              <p className="text-sm mb-1">📞 +7 918 55 28 423</p>
              <p className="text-sm mb-1">👤 Ирина Леонидовна</p>
              <p className="text-sm">📧 Mytapitomnik@mail.ru</p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Каталог</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/catalog" className="hover:underline">Все растения</Link></li>
                <li><Link href="/sets" className="hover:underline">Наборы растений</Link></li>
                <li><Link href="/honey" className="hover:underline">Медоносные растения</Link></li>
                <li><Link href="/roof" className="hover:underline">Для крыш</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Услуги</h3>
              <ul className="space-y-2 text-sm">
                <li>Консультации</li>
                <li>Проектирование</li>
                <li>Доставка</li>
                <li>B2B поставки</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-green-300 mt-8 pt-8 text-center text-sm">
            © 2025 Питомник МЯТА. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}