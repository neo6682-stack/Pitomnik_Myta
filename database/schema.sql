-- Создание базы данных для каталога растений
CREATE DATABASE pitomnik_myta;

-- Таблица категорий растений
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица растений
CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    scientific_name VARCHAR(200),
    description TEXT,
    short_description TEXT,
    category_id INTEGER REFERENCES categories(id),
    
    -- Характеристики
    light_requirements VARCHAR(50), -- 'sun', 'partial_shade', 'shade'
    is_medicinal BOOLEAN DEFAULT FALSE,
    is_honey_plant BOOLEAN DEFAULT FALSE,
    is_evergreen BOOLEAN DEFAULT FALSE,
    is_roof_suitable BOOLEAN DEFAULT FALSE,
    is_ground_cover BOOLEAN DEFAULT FALSE,
    has_aroma BOOLEAN DEFAULT FALSE,
    
    -- Размеры
    height_min INTEGER, -- в см
    height_max INTEGER,
    width_min INTEGER,
    width_max INTEGER,
    
    -- Цветение
    flowering_period VARCHAR(100),
    flower_color VARCHAR(100),
    
    -- Уход
    watering_frequency VARCHAR(50),
    soil_type VARCHAR(100),
    frost_resistance VARCHAR(50),
    
    -- Цена и наличие
    price DECIMAL(10,2),
    wholesale_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    
    -- SEO
    slug VARCHAR(200) UNIQUE NOT NULL,
    meta_title VARCHAR(200),
    meta_description TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица изображений растений
CREATE TABLE plant_images (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES plants(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица наборов растений
CREATE TABLE plant_sets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category VARCHAR(100), -- 'honey', 'roof', 'aroma', 'floristic', 'evergreen'
    is_seasonal BOOLEAN DEFAULT FALSE,
    season VARCHAR(20), -- 'spring', 'summer', 'autumn', 'winter'
    is_premium BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    slug VARCHAR(200) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Связь наборов и растений
CREATE TABLE plant_set_items (
    id SERIAL PRIMARY KEY,
    set_id INTEGER REFERENCES plant_sets(id) ON DELETE CASCADE,
    plant_id INTEGER REFERENCES plants(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    user_type VARCHAR(20) DEFAULT 'customer', -- 'customer', 'wholesale', 'admin'
    company_name VARCHAR(200),
    inn VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заказов
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица позиций заказа
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    plant_id INTEGER REFERENCES plants(id),
    set_id INTEGER REFERENCES plant_sets(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX idx_plants_category ON plants(category_id);
CREATE INDEX idx_plants_light ON plants(light_requirements);
CREATE INDEX idx_plants_honey ON plants(is_honey_plant);
CREATE INDEX idx_plants_evergreen ON plants(is_evergreen);
CREATE INDEX idx_plants_available ON plants(is_available);
CREATE INDEX idx_plants_slug ON plants(slug);
CREATE INDEX idx_plant_images_plant ON plant_images(plant_id);
CREATE INDEX idx_plant_sets_category ON plant_sets(category);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
