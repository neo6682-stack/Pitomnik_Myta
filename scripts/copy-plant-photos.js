const fs = require('fs');
const path = require('path');

const photosDir = '/Users/dmitryrudenkov/repos/Pitomnik_Myta/Каталог растений фото';
const assetsDir = '/Users/dmitryrudenkov/repos/Pitomnik_Myta/frontend/assets/plants';
const plantsDataPath = '/Users/dmitryrudenkov/repos/Pitomnik_Myta/data/plants.json';

// Создаем папку для фотографий растений
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Читаем данные о растениях
const plantsData = JSON.parse(fs.readFileSync(plantsDataPath, 'utf8'));

// Функция для создания безопасного имени файла
function createSafeFileName(name) {
    return name
        .replace(/[^a-zA-Z0-9а-яА-Я\s-]/g, '') // Убираем спецсимволы
        .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
        .toLowerCase();
}

// Функция для поиска папки с фотографиями растения
function findPlantPhotoFolder(plantName) {
    const photoFolders = fs.readdirSync(photosDir);
    
    // Ищем точное совпадение
    let exactMatch = photoFolders.find(folder => folder === plantName);
    if (exactMatch) {
        return exactMatch;
    }
    
    // Ищем частичное совпадение
    let partialMatch = photoFolders.find(folder => {
        const folderName = folder.toLowerCase();
        const plantNameLower = plantName.toLowerCase();
        
        // Проверяем, содержит ли название папки ключевые слова из названия растения
        const plantWords = plantNameLower.split(/\s+/);
        return plantWords.some(word => word.length > 3 && folderName.includes(word));
    });
    
    return partialMatch;
}

// Функция для копирования фотографий
function copyPlantPhotos() {
    let copiedCount = 0;
    let notFoundCount = 0;
    const notFound = [];
    
    console.log('🌱 Начинаем копирование фотографий растений...\n');
    
    plantsData.forEach((plant, index) => {
        const plantName = plant.name;
        const photoFolder = findPlantPhotoFolder(plantName);
        
        if (photoFolder) {
            const sourceFolder = path.join(photosDir, photoFolder);
            const photos = fs.readdirSync(sourceFolder);
            
            // Берем первое изображение
            const photoFile = photos.find(file => 
                /\.(jpg|jpeg|png|webp)$/i.test(file)
            );
            
            if (photoFile) {
                const sourcePath = path.join(sourceFolder, photoFile);
                const safeFileName = createSafeFileName(plantName);
                const extension = path.extname(photoFile);
                const targetFileName = `${safeFileName}${extension}`;
                const targetPath = path.join(assetsDir, targetFileName);
                
                try {
                    fs.copyFileSync(sourcePath, targetPath);
                    console.log(`✅ ${index + 1}. ${plantName} -> ${targetFileName}`);
                    copiedCount++;
                    
                    // Обновляем данные растения
                    plant.image_url = `assets/plants/${targetFileName}`;
                } catch (error) {
                    console.log(`❌ Ошибка копирования ${plantName}: ${error.message}`);
                }
            } else {
                console.log(`⚠️  ${index + 1}. ${plantName} - нет изображений в папке`);
                notFoundCount++;
                notFound.push(plantName);
            }
        } else {
            console.log(`❌ ${index + 1}. ${plantName} - папка не найдена`);
            notFoundCount++;
            notFound.push(plantName);
        }
    });
    
    // Сохраняем обновленные данные
    fs.writeFileSync(plantsDataPath, JSON.stringify(plantsData, null, 2));
    
    console.log(`\n📊 Результаты:`);
    console.log(`✅ Скопировано: ${copiedCount}`);
    console.log(`❌ Не найдено: ${notFoundCount}`);
    
    if (notFound.length > 0) {
        console.log(`\n❌ Растения без фотографий:`);
        notFound.forEach(name => console.log(`   - ${name}`));
    }
    
    console.log(`\n🎉 Копирование завершено!`);
}

// Запускаем копирование
copyPlantPhotos();
