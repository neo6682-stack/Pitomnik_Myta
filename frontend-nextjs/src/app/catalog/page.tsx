'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Grid, List, Heart, ShoppingCart } from 'lucide-react';

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

export default function CatalogPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);

  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://pitomnik-myta-backend.railway.app/api'
    : 'http://localhost:3001/api';

  useEffect(() => {
    loadData();
  }, [currentPage, selectedCategory, sortBy]);

  const loadData = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
        ...(priceRange.min && { min_price: priceRange.min }),
        ...(priceRange.max && { max_price: priceRange.max }),
        sort_by: sortBy
      });

      const [plantsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE}/plants?${params}`),
        fetch(`${API_BASE}/categories`)
      ]);
      
      const plantsData = await plantsRes.json();
      const categoriesData = await categoriesRes.json();
      
      if (plantsData.success) {
        setPlants(plantsData.data.plants);
        setTotalPages(plantsData.data.pagination.total_pages);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadData();
  };

  const toggleFavorite = (plantId: number) => {
    setFavorites(prev => 
      prev.includes(plantId) 
        ? prev.filter(id => id !== plantId)
        : [...prev, plantId]
    );
  };

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || plant.category_name === selectedCategory;
    const matchesPrice = (!priceRange.min || plant.price >= parseInt(priceRange.min)) &&
                        (!priceRange.max || plant.price <= parseInt(priceRange.max));
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/assets/logo.png"
                alt="Питомник МЯТА"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Питомник МЯТА</h1>
                <p className="text-sm text-gray-600">Каталог растений</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/catalog" className="text-green-600 font-medium">Каталог</Link>
              <Link href="/sets" className="text-gray-600 hover:text-green-600">Наборы</Link>
              <Link href="/about" className="text-gray-600 hover:text-green-600">О нас</Link>
              <Link href="/contacts" className="text-gray-600 hover:text-green-600">Контакты</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Корзина (0)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Фильтры
              </h2>

              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Поиск растений..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Все категории</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена (₽)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                  <input
                    type="number"
                    placeholder="До"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сортировка
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="name">По названию</option>
                  <option value="price_asc">Цена: по возрастанию</option>
                  <option value="price_desc">Цена: по убыванию</option>
                  <option value="created_at">По дате добавления</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setPriceRange({ min: '', max: '' });
                  setCurrentPage(1);
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Каталог растений
                </h1>
                <p className="text-gray-600">
                  Найдено {filteredPlants.length} растений
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Plants Grid/List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Загрузка каталога...</p>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
                }>
                  {filteredPlants.map(plant => (
                    <div
                      key={plant.id}
                      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}>
                        <Image
                          src={plant.image_url || '/assets/logo.png'}
                          alt={plant.name}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => toggleFavorite(plant.id)}
                          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              favorites.includes(plant.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                            }`} 
                          />
                        </button>
                      </div>
                      
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <h3 className="font-semibold text-lg mb-2">{plant.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{plant.category_name}</p>
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{plant.short_description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {plant.is_honey_plant && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                              🍯 Медонос
                            </span>
                          )}
                          {plant.is_evergreen && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              🌲 Вечнозеленое
                            </span>
                          )}
                          {plant.is_roof_suitable && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              🏠 Для крыш
                            </span>
                          )}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Назад
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 border rounded-lg ${
                            currentPage === page
                              ? 'bg-green-600 text-white border-green-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Вперед
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
