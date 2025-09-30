const fs = require('fs');
const path = require('path');

const plantsDir = '/Users/dmitryrudenkov/repos/Pitomnik_Myta/frontend/assets/plants';
const plantsDataPath = '/Users/dmitryrudenkov/repos/Pitomnik_Myta/data/plants.json';

// Функция для транслитерации кириллицы в латиницу
function transliterate(str) {
    const map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
        'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
        'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
        'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };
    
    return str.replace(/[а-яёА-ЯЁ]/g, function(match) {
        return map[match] || match;
    });
}

// Функция для создания безопасного имени файла
function createSafeFileName(name) {
    return transliterate(name)
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Убираем спецсимволы
        .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
        .toLowerCase();
}

// Читаем данные о растениях
const plantsData = JSON.parse(fs.readFileSync(plantsDataPath, 'utf8'));

console.log('🔄 Начинаем переименование фотографий растений...\n');

let renamedCount = 0;
const renameMap = {};

// Получаем список файлов в папке
const files = fs.readdirSync(plantsDir);

files.forEach(file => {
    if (file === '.' || file === '..') return;
    
    const oldPath = path.join(plantsDir, file);
    const extension = path.extname(file);
    const nameWithoutExt = path.basename(file, extension);
    
    // Создаем новое имя файла
    const newName = createSafeFileName(nameWithoutExt) + extension;
    const newPath = path.join(plantsDir, newName);
    
    if (file !== newName) {
        try {
            fs.renameSync(oldPath, newPath);
            console.log(`✅ ${file} -> ${newName}`);
            renamedCount++;
            
            // Сохраняем маппинг для обновления данных
            renameMap[`assets/plants/${file}`] = `assets/plants/${newName}`;
        } catch (error) {
            console.log(`❌ Ошибка переименования ${file}: ${error.message}`);
        }
    }
});

// Обновляем данные в plants.json
if (Object.keys(renameMap).length > 0) {
    console.log('\n🔄 Обновляем данные в plants.json...');
    
    plantsData.forEach(plant => {
        if (plant.image_url && renameMap[plant.image_url]) {
            plant.image_url = renameMap[plant.image_url];
        }
    });
    
    fs.writeFileSync(plantsDataPath, JSON.stringify(plantsData, null, 2));
    console.log('✅ Данные обновлены');
}

console.log(`\n📊 Результаты:`);
console.log(`✅ Переименовано: ${renamedCount} файлов`);
console.log(`🎉 Переименование завершено!`);
