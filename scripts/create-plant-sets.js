const fs = require('fs');
const path = require('path');

// Читаем данные о растениях
const plantsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/plants.json'), 'utf8')
);

// Функция для создания набора растений
function createPlantSet(name, description, category, plants, basePrice) {
  const totalPrice = plants.reduce((sum, plant) => sum + plant.price, 0);
  const setPrice = Math.round(totalPrice * 0.7); // 30% скидка за набор
  const originalPrice = Math.round(totalPrice * 0.8); // 20% скидка от розничной цены
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: name,
    description: description,
    short_description: description.length > 150 ? description.substring(0, 150) + '...' : description,
    price: setPrice,
    original_price: originalPrice,
    category: category,
    is_seasonal: false,
    season: null,
    is_premium: setPrice > 2000,
    is_available: true,
    image_url: null,
    slug: name.toLowerCase().replace(/[^a-zа-я0-9\s-]/g, '').replace(/\s+/g, '-'),
    created_at: new Date().toISOString(),
    plants: plants.map(plant => ({
      plant_id: plant.id,
      quantity: 1,
      plant_name: plant.name,
      plant_price: plant.price
    }))
  };
}

// Создаем наборы растений
const plantSets = [];

// 1. "Пасека PRO" - набор для пчеловодов
const honeyPlants = plantsData.filter(p => p.is_honey_plant && p.is_available);
const honeySet = createPlantSet(
  "Пасека PRO",
  "Профессиональный набор медоносных растений для пчеловодов. Включает разнообразные цветущие растения, обеспечивающие непрерывный медосбор с весны до осени. Все растения подобраны для максимальной продуктивности и привлекательности для пчел.",
  "honey",
  honeyPlants.slice(0, 8), // Берем 8 лучших медоносных растений
  0
);
plantSets.push(honeySet);

// 2. "Зелёная крыша" - набор для озеленения крыш
const roofPlants = plantsData.filter(p => p.is_roof_suitable && p.is_available);
const roofSet = createPlantSet(
  "Зелёная крыша",
  "Специальный набор растений для озеленения крыш и террас. Включает низкорослые, засухоустойчивые и ветроустойчивые растения, идеально подходящие для экстенсивного озеленения крыш.",
  "roof",
  roofPlants.slice(0, 6), // 6 растений для крыш
  0
);
plantSets.push(roofSet);

// 3. "Сад ароматов" - ароматные растения
const aromaticPlants = plantsData.filter(p => p.has_aroma && p.is_available);
const aromaSet = createPlantSet(
  "Сад ароматов",
  "Коллекция ароматных растений для создания благоухающего сада. Включает растения с различными типами ароматов: цветочными, пряными, цитрусовыми. Идеально для создания ароматических зон в саду.",
  "aroma",
  aromaticPlants.slice(0, 7), // 7 ароматных растений
  0
);
plantSets.push(aromaSet);

// 4. "Флористический набор" - для букетов и срезки
const floristicPlants = plantsData.filter(p => p.is_floristic_cut && p.is_available);
const floristicSet = createPlantSet(
  "Флористический набор",
  "Профессиональный набор растений для флористов и любителей букетов. Включает растения с красивыми цветами, подходящие для срезки, сухоцветов и создания композиций.",
  "floristic",
  floristicPlants.slice(0, 6), // 6 растений для флористики
  0
);
plantSets.push(floristicSet);

// 5. "Вечнозелёный микс" - круглогодичная декоративность
const evergreenPlants = plantsData.filter(p => p.is_evergreen && p.is_available);
const evergreenSet = createPlantSet(
  "Вечнозелёный микс",
  "Набор вечнозеленых растений для круглогодичной декоративности сада. Обеспечивает красивый вид сада даже в зимний период. Включает различные формы и размеры вечнозеленых растений.",
  "evergreen",
  evergreenPlants.slice(0, 5), // 5 вечнозеленых растений
  0
);
plantSets.push(evergreenSet);

// 6. "Приморский сад" - для приморского климата
const coastalPlants = plantsData.filter(p => p.coastal_climate_resistant && p.is_available);
const coastalSet = createPlantSet(
  "Приморский сад",
  "Специальный набор растений, устойчивых к приморскому климату. Включает растения, которые хорошо переносят соленые брызги, сильные ветры и повышенную влажность воздуха.",
  "coastal",
  coastalPlants.slice(0, 6), // 6 приморских растений
  0
);
plantSets.push(coastalSet);

// 7. "Сухоцветы" - для зимних композиций
const driedFlowerPlants = plantsData.filter(p => p.is_dried_flower && p.is_available);
const driedFlowerSet = createPlantSet(
  "Сухоцветы",
  "Коллекция растений, идеально подходящих для создания сухоцветов и зимних композиций. Включает растения с прочными цветами и стеблями, сохраняющими форму и цвет после высушивания.",
  "dried_flower",
  driedFlowerPlants.slice(0, 5), // 5 растений для сухоцветов
  0
);
plantSets.push(driedFlowerSet);

// 8. "Почвопокровный ковер" - для покрытия почвы
const groundCoverPlants = plantsData.filter(p => p.is_ground_cover && p.is_available);
const groundCoverSet = createPlantSet(
  "Почвопокровный ковер",
  "Набор почвопокровных растений для создания живого ковра в саду. Включает низкорослые, стелющиеся растения, которые быстро разрастаются и подавляют сорняки.",
  "ground_cover",
  groundCoverPlants.slice(0, 4), // 4 почвопокровных растения
  0
);
plantSets.push(groundCoverSet);

// 9. "Сезонный весенний" - весенние цветы
const springPlants = plantsData.filter(p => 
  p.is_available && 
  (p.flowering_period.includes('май') || p.flowering_period.includes('апрель') || p.flowering_period.includes('март'))
);
const springSet = createPlantSet(
  "Весенний сад",
  "Набор раннецветущих растений для создания яркого весеннего сада. Включает растения, которые зацветают одними из первых и радуют глаз после долгой зимы.",
  "seasonal",
  springPlants.slice(0, 6), // 6 весенних растений
  0
);
springSet.is_seasonal = true;
springSet.season = 'spring';
plantSets.push(springSet);

// 10. "Премиум коллекция" - редкие и коллекционные сорта
const premiumPlants = plantsData
  .filter(p => p.is_available && p.price > 400)
  .sort((a, b) => b.price - a.price);
const premiumSet = createPlantSet(
  "Премиум коллекция",
  "Эксклюзивная коллекция редких и коллекционных сортов растений. Включает самые ценные и декоративные экземпляры из нашего каталога. Идеально для коллекционеров и ценителей редких растений.",
  "premium",
  premiumPlants.slice(0, 4), // 4 самых дорогих растения
  0
);
premiumSet.is_premium = true;
plantSets.push(premiumSet);

// Сохраняем наборы растений
const outputDir = path.join(__dirname, '../data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'plant_sets.json'),
  JSON.stringify(plantSets, null, 2),
  'utf8'
);

// Создаем отчет
const report = {
  created_at: new Date().toISOString(),
  total_sets: plantSets.length,
  sets_by_category: {
    honey: plantSets.filter(s => s.category === 'honey').length,
    roof: plantSets.filter(s => s.category === 'roof').length,
    aroma: plantSets.filter(s => s.category === 'aroma').length,
    floristic: plantSets.filter(s => s.category === 'floristic').length,
    evergreen: plantSets.filter(s => s.category === 'evergreen').length,
    coastal: plantSets.filter(s => s.category === 'coastal').length,
    dried_flower: plantSets.filter(s => s.category === 'dried_flower').length,
    ground_cover: plantSets.filter(s => s.category === 'ground_cover').length,
    seasonal: plantSets.filter(s => s.category === 'seasonal').length,
    premium: plantSets.filter(s => s.category === 'premium').length
  },
  price_range: {
    min: Math.min(...plantSets.map(s => s.price)),
    max: Math.max(...plantSets.map(s => s.price)),
    average: plantSets.reduce((sum, s) => sum + s.price, 0) / plantSets.length
  },
  sets: plantSets.map(set => ({
    name: set.name,
    category: set.category,
    price: set.price,
    original_price: set.original_price,
    plants_count: set.plants.length,
    is_premium: set.is_premium,
    is_seasonal: set.is_seasonal
  }))
};

fs.writeFileSync(
  path.join(outputDir, 'plant_sets_report.json'),
  JSON.stringify(report, null, 2),
  'utf8'
);

console.log('✅ Наборы растений созданы успешно!');
console.log(`📦 Создано наборов: ${plantSets.length}`);
console.log(`💰 Диапазон цен: ${report.price_range.min} - ${report.price_range.max} руб.`);
console.log(`📊 Средняя цена: ${Math.round(report.price_range.average)} руб.`);
console.log('\n📋 Созданные наборы:');
plantSets.forEach(set => {
  console.log(`  • ${set.name} (${set.category}) - ${set.price} руб. (${set.plants.length} растений)`);
});

console.log('\n📁 Файлы сохранены в папке data/:');
console.log('- plant_sets.json - наборы растений');
console.log('- plant_sets_report.json - отчет о наборах');
