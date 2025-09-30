const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Информация о питомнике
const NURSERY_INFO = {
  name: "Питомник многолетних цветов и трав \"МЯТА\"",
  location: "Ростовская область, Неклиновский район, село Николаевка",
  contacts: {
    phone: "+7 918 55 28 423",
    contact_person: "Ирина Леонидовна",
    email: "Mytapitomnik@mail.ru"
  }
};

// Функция для нормализации строки
function normalizeString(str) {
  if (!str) return '';
  return str.toString().trim().replace(/\s+/g, ' ');
}

// Функция для определения характеристик растения
function analyzePlantCharacteristics(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  
  return {
    is_honey_plant: /медонос|пчел|мед|нектар/i.test(text),
    is_evergreen: /вечнозелен|зимнезелен|круглогодичн/i.test(text),
    is_roof_suitable: /крыш|низкоросл|почвопокровн|стелющ/i.test(text),
    is_ground_cover: /почвопокровн|стелющ|ковров/i.test(text),
    has_aroma: /аромат|душист|пахуч|запах/i.test(text),
    is_medicinal: /лечебн|медицинск|целебн|лекарственн/i.test(text)
  };
}

// Функция для определения требований к свету
function determineLightRequirements(description) {
  if (!description) return 'partial_shade';
  
  const text = description.toLowerCase();
  
  if (/солнц|светл|открыт/i.test(text)) {
    return 'sun';
  } else if (/тень|тенев|затенен/i.test(text)) {
    return 'shade';
  } else {
    return 'partial_shade';
  }
}

// Функция для создания slug
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Функция для определения периода цветения
function extractFloweringPeriod(description) {
  if (!description) return '';
  
  const text = description.toLowerCase();
  const months = {
    'январ': 'январь',
    'феврал': 'февраль', 
    'март': 'март',
    'апрел': 'апрель',
    'май': 'май',
    'июн': 'июнь',
    'июл': 'июль',
    'август': 'август',
    'сентябр': 'сентябрь',
    'октябр': 'октябрь',
    'ноябр': 'ноябрь',
    'декабр': 'декабрь'
  };
  
  const foundMonths = [];
  for (const [key, month] of Object.entries(months)) {
    if (text.includes(key)) {
      foundMonths.push(month);
    }
  }
  
  return foundMonths.join(', ');
}

// Основная функция парсинга
function parseCatalog() {
  try {
    console.log('🌱 Начинаем парсинг каталога растений...');
    
    const catalogPath = path.join(__dirname, '../plants_catalog/Каталог растений _ остатки Осень 2025 _ 29.09.xlsx');
    
    if (!fs.existsSync(catalogPath)) {
      throw new Error(`Файл каталога не найден: ${catalogPath}`);
    }
    
    // Читаем Excel файл
    const workbook = XLSX.readFile(catalogPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Конвертируем в JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📊 Найдено ${rawData.length} строк в файле`);
    console.log('📋 Заголовки:', rawData[0]);
    
    // Определяем индексы колонок на основе реальной структуры файла
    const headers = rawData[0];
    const columnIndexes = {
      name: 1, // 'Название'
      plant_color: 2, // 'Цвет растения'
      flower_color: 3, // 'Цвет цветка'
      height: 4, // 'Высота растения'
      light_requirements: 5, // 'Среда для жизни (солнце/полутень/тень)'
      flowering_time: 6, // 'Время цветения'
      care: 7, // 'Содержание растения и уход'
      coastal_climate: 8, // 'Выдерживает приморский климат / или нет'
      honey_plant: 9, // 'Медонос / или нет'
      evergreen: 10, // 'Вечно зеленое / или нет'
      roof_suitable: 11, // 'Для озеленения крыш / или нет'
      ground_cover: 12, // 'Почвопокровное / или нет'
      aroma_type: 13, // 'Тип аромата'
      floristic_cut: 14, // 'Подходит для среза флористики / или нет'
      dried_flower: 15 // 'Сухоцвет / или нет'
    };
    
    console.log('🔍 Найденные колонки:', columnIndexes);
    
    const plants = [];
    const categories = new Set();
    
    // Обрабатываем каждую строку данных
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      
      // Пропускаем пустые строки
      if (!row || row.every(cell => !cell)) continue;
      
      const name = normalizeString(row[columnIndexes.name]);
      if (!name) continue;
      
      // Извлекаем данные из всех колонок
      const plantColor = normalizeString(row[columnIndexes.plant_color]);
      const flowerColor = normalizeString(row[columnIndexes.flower_color]);
      const height = normalizeString(row[columnIndexes.height]);
      const lightReq = normalizeString(row[columnIndexes.light_requirements]);
      const floweringTime = normalizeString(row[columnIndexes.flowering_time]);
      const care = normalizeString(row[columnIndexes.care]);
      const coastalClimate = normalizeString(row[columnIndexes.coastal_climate]);
      const honeyPlant = normalizeString(row[columnIndexes.honey_plant]);
      const evergreen = normalizeString(row[columnIndexes.evergreen]);
      const roofSuitable = normalizeString(row[columnIndexes.roof_suitable]);
      const groundCover = normalizeString(row[columnIndexes.ground_cover]);
      const aromaType = normalizeString(row[columnIndexes.aroma_type]);
      const floristicCut = normalizeString(row[columnIndexes.floristic_cut]);
      const driedFlower = normalizeString(row[columnIndexes.dried_flower]);
      
      // Определяем категорию на основе характеристик
      let category = 'Многолетники';
      if (honeyPlant && honeyPlant.toLowerCase().includes('да')) {
        category = 'Медоносные растения';
      } else if (evergreen && evergreen.toLowerCase().includes('да')) {
        category = 'Вечнозеленые растения';
      } else if (roofSuitable && roofSuitable.toLowerCase().includes('да')) {
        category = 'Растения для крыш';
      } else if (groundCover && groundCover.toLowerCase().includes('да')) {
        category = 'Почвопокровные растения';
      }
      
      categories.add(category);
      
      // Создаем описание из всех доступных данных
      const descriptionParts = [];
      if (plantColor) descriptionParts.push(`Цвет растения: ${plantColor}`);
      if (flowerColor) descriptionParts.push(`Цвет цветка: ${flowerColor}`);
      if (height) descriptionParts.push(`Высота: ${height}`);
      if (floweringTime) descriptionParts.push(`Время цветения: ${floweringTime}`);
      if (care) descriptionParts.push(`Уход: ${care}`);
      if (coastalClimate) descriptionParts.push(`Приморский климат: ${coastalClimate}`);
      if (aromaType) descriptionParts.push(`Аромат: ${aromaType}`);
      
      const description = descriptionParts.join('. ');
      
      // Определяем характеристики на основе данных из Excel
      const isHoneyPlant = honeyPlant && honeyPlant.toLowerCase().includes('да');
      const isEvergreen = evergreen && evergreen.toLowerCase().includes('да');
      const isRoofSuitable = roofSuitable && roofSuitable.toLowerCase().includes('да');
      const isGroundCover = groundCover && groundCover.toLowerCase().includes('да');
      const hasAroma = aromaType && aromaType.toLowerCase() !== 'нет' && aromaType.toLowerCase() !== 'н/д';
      const isFloristicCut = floristicCut && floristicCut.toLowerCase().includes('да');
      const isDriedFlower = driedFlower && driedFlower.toLowerCase().includes('да');
      
      // Определяем требования к свету
      let lightRequirements = 'partial_shade';
      if (lightReq) {
        if (lightReq.toLowerCase().includes('солнце')) {
          lightRequirements = 'sun';
        } else if (lightReq.toLowerCase().includes('тень')) {
          lightRequirements = 'shade';
        }
      }
      
      // Парсим высоту
      let heightMin = null, heightMax = null;
      if (height) {
        const heightMatch = height.match(/(\d+)\s*-\s*(\d+)/);
        if (heightMatch) {
          heightMin = parseInt(heightMatch[1]);
          heightMax = parseInt(heightMatch[2]);
        } else {
          const singleHeight = height.match(/(\d+)/);
          if (singleHeight) {
            heightMin = parseInt(singleHeight[1]);
            heightMax = parseInt(singleHeight[1]);
          }
        }
      }
      
      // Генерируем базовую цену на основе характеристик (примерная оценка)
      let basePrice = 150; // Базовая цена
      if (isHoneyPlant) basePrice += 50;
      if (isEvergreen) basePrice += 100;
      if (hasAroma) basePrice += 75;
      if (isFloristicCut) basePrice += 50;
      if (isDriedFlower) basePrice += 25;
      
      const plant = {
        id: i,
        name: name,
        scientific_name: '', // Можно добавить отдельную колонку
        description: description,
        short_description: description.length > 150 ? description.substring(0, 150) + '...' : description,
        category: category,
        
        // Характеристики
        light_requirements: lightRequirements,
        is_medicinal: false, // Не указано в файле
        is_honey_plant: isHoneyPlant,
        is_evergreen: isEvergreen,
        is_roof_suitable: isRoofSuitable,
        is_ground_cover: isGroundCover,
        has_aroma: hasAroma,
        is_floristic_cut: isFloristicCut,
        is_dried_flower: isDriedFlower,
        coastal_climate_resistant: coastalClimate && coastalClimate.toLowerCase().includes('да'),
        
        // Размеры
        height_min: heightMin,
        height_max: heightMax,
        width_min: null,
        width_max: null,
        
        // Цветение
        flowering_period: floweringTime || '',
        flower_color: flowerColor || '',
        plant_color: plantColor || '',
        
        // Уход
        watering_frequency: 'moderate', // По умолчанию
        soil_type: 'any', // По умолчанию
        frost_resistance: 'good', // По умолчанию
        care_instructions: care || '',
        
        // Цена и наличие (генерируем примерные цены)
        price: basePrice,
        wholesale_price: Math.round(basePrice * 0.8 * 100) / 100, // 20% скидка для опта
        stock_quantity: Math.floor(Math.random() * 20) + 1, // Случайное количество от 1 до 20
        is_available: true, // Предполагаем, что все растения доступны
        
        // SEO
        slug: createSlug(name),
        meta_title: `${name} - купить в питомнике МЯТА`,
        meta_description: description || `Купить ${name} в питомнике многолетних цветов и трав МЯТА. Качественные растения с доставкой.`,
        
        // Информация о питомнике
        nursery: NURSERY_INFO,
        
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      plants.push(plant);
    }
    
    // Создаем категории
    const categoriesList = Array.from(categories).map((name, index) => ({
      id: index + 1,
      name: name,
      description: `Категория растений: ${name}`,
      slug: createSlug(name),
      parent_id: null,
      created_at: new Date().toISOString()
    }));
    
    // Сохраняем результаты
    const outputDir = path.join(__dirname, '../data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Сохраняем растения
    fs.writeFileSync(
      path.join(outputDir, 'plants.json'),
      JSON.stringify(plants, null, 2),
      'utf8'
    );
    
    // Сохраняем категории
    fs.writeFileSync(
      path.join(outputDir, 'categories.json'),
      JSON.stringify(categoriesList, null, 2),
      'utf8'
    );
    
    // Создаем отчет
    const report = {
      parsed_at: new Date().toISOString(),
      nursery: NURSERY_INFO,
      statistics: {
        total_plants: plants.length,
        available_plants: plants.filter(p => p.is_available).length,
        categories_count: categoriesList.length,
        total_value: plants.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0),
        honey_plants: plants.filter(p => p.is_honey_plant).length,
        evergreen_plants: plants.filter(p => p.is_evergreen).length,
        roof_suitable: plants.filter(p => p.is_roof_suitable).length,
        ground_cover: plants.filter(p => p.is_ground_cover).length,
        aromatic_plants: plants.filter(p => p.has_aroma).length,
        medicinal_plants: plants.filter(p => p.is_medicinal).length,
        floristic_cut: plants.filter(p => p.is_floristic_cut).length,
        dried_flowers: plants.filter(p => p.is_dried_flower).length,
        coastal_resistant: plants.filter(p => p.coastal_climate_resistant).length,
        sun_plants: plants.filter(p => p.light_requirements === 'sun').length,
        shade_plants: plants.filter(p => p.light_requirements === 'shade').length,
        partial_shade_plants: plants.filter(p => p.light_requirements === 'partial_shade').length
      },
      categories: categoriesList.map(c => c.name),
      price_range: {
        min: Math.min(...plants.map(p => p.price).filter(p => p > 0)),
        max: Math.max(...plants.map(p => p.price).filter(p => p > 0)),
        average: plants.reduce((sum, p) => sum + p.price, 0) / plants.length
      }
    };
    
    fs.writeFileSync(
      path.join(outputDir, 'parsing_report.json'),
      JSON.stringify(report, null, 2),
      'utf8'
    );
    
    console.log('✅ Парсинг завершен успешно!');
    console.log(`📊 Обработано растений: ${plants.length}`);
    console.log(`📦 Доступно к продаже: ${report.statistics.available_plants}`);
    console.log(`💰 Общая стоимость: ${report.statistics.total_value.toFixed(2)} руб.`);
    console.log(`\n🌱 Характеристики растений:`);
    console.log(`🍯 Медоносных растений: ${report.statistics.honey_plants}`);
    console.log(`🌲 Вечнозеленых растений: ${report.statistics.evergreen_plants}`);
    console.log(`🏠 Подходящих для крыш: ${report.statistics.roof_suitable}`);
    console.log(`🌿 Почвопокровных: ${report.statistics.ground_cover}`);
    console.log(`🌸 Ароматных растений: ${report.statistics.aromatic_plants}`);
    console.log(`💊 Лекарственных растений: ${report.statistics.medicinal_plants}`);
    console.log(`✂️ Для флористики: ${report.statistics.floristic_cut}`);
    console.log(`🌾 Сухоцветы: ${report.statistics.dried_flowers}`);
    console.log(`🌊 Приморский климат: ${report.statistics.coastal_resistant}`);
    console.log(`\n☀️ Требования к свету:`);
    console.log(`☀️ Солнце: ${report.statistics.sun_plants}`);
    console.log(`🌤️ Полутень: ${report.statistics.partial_shade_plants}`);
    console.log(`🌑 Тень: ${report.statistics.shade_plants}`);
    
    console.log('\n📁 Файлы сохранены в папке data/:');
    console.log('- plants.json - каталог растений');
    console.log('- categories.json - категории');
    console.log('- parsing_report.json - отчет о парсинге');
    
  } catch (error) {
    console.error('❌ Ошибка при парсинге каталога:', error.message);
    process.exit(1);
  }
}

// Запускаем парсинг
parseCatalog();