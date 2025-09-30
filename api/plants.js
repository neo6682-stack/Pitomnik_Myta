// Mock data for plants API
const plantsData = [
  {
    id: 1,
    name: "Аквилегия обыкновенная \"CLEMENTINE\"(SALMON ROSE)",
    description: "Цвет растения: Сине-зеленый. Цвет цветка: Розово-лососевый. Высота: 30-40 см. Время цветения: Май-июль.",
    category: "Медоносные растения",
    price: 250,
    image_url: "/assets/plants/akvilegiya-obyknovennaya-clementinesalmon-rose.jpg",
    is_honey_plant: true,
    is_evergreen: false,
    height_min: 30,
    height_max: 40
  },
  {
    id: 2,
    name: "Душица обыкновенная \"Фея\"",
    description: "Ароматное лекарственное растение. Высота: 20-30 см. Цветение: Июль-август.",
    category: "Ароматные растения",
    price: 180,
    image_url: "/assets/plants/dushitsa-obyknovennaya-feya.jpg",
    is_medicinal: true,
    has_aroma: true,
    height_min: 20,
    height_max: 30
  },
  {
    id: 3,
    name: "Молиния голубая \"Heidebraut\"",
    description: "Декоративная трава. Высота: 60-80 см. Цветение: Август-сентябрь.",
    category: "Декоративные травы",
    price: 320,
    image_url: "/assets/plants/moliniya-golubaya-heidebraut.jpg",
    is_evergreen: false,
    height_min: 60,
    height_max: 80
  }
];

export default function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    // Simple pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const plants = plantsData.slice(startIndex, endIndex);

    res.status(200).json({
      plants,
      pagination: {
        page,
        limit,
        total: plantsData.length,
        totalPages: Math.ceil(plantsData.length / limit)
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
