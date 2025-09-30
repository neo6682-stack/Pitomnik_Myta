import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Award, Users, Leaf, Heart } from 'lucide-react';

export default function AboutPage() {
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
                <p className="text-sm text-gray-600">О нас</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/catalog" className="text-gray-600 hover:text-green-600">Каталог</Link>
              <Link href="/sets" className="text-gray-600 hover:text-green-600">Наборы</Link>
              <Link href="/about" className="text-green-600 font-medium">О нас</Link>
              <Link href="/contacts" className="text-gray-600 hover:text-green-600">Контакты</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            О питомнике <span className="text-green-600">МЯТА</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы специализируемся на выращивании качественных многолетних цветов и трав 
            для вашего сада в Ростовской области уже более 10 лет.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Наша история</h2>
            <p className="text-gray-600 mb-4">
              Питомник МЯТА был основан в 2013 году в живописном селе Николаевка 
              Неклиновского района Ростовской области. Начав с небольшого участка, 
              мы постепенно расширили свою деятельность и теперь выращиваем более 
              200 видов многолетних растений.
            </p>
            <p className="text-gray-600 mb-4">
              Наша миссия — предоставить садоводам и ландшафтным дизайнерам 
              качественный посадочный материал, который будет радовать долгие годы.
            </p>
            <p className="text-gray-600">
              Мы гордимся тем, что наши растения адаптированы к местным климатическим 
              условиям и отличаются высокой приживаемостью.
            </p>
          </div>
          <div className="relative h-96">
            <Image
              src="/assets/logo-background.jpg"
              alt="Питомник МЯТА"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Наши ценности</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Качество</h3>
              <p className="text-gray-600">
                Мы тщательно отбираем и выращиваем только лучшие сорта растений, 
                обеспечивая их здоровье и жизнеспособность.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Забота</h3>
              <p className="text-gray-600">
                Каждое растение получает индивидуальный уход и внимание на всех 
                этапах выращивания.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Сервис</h3>
              <p className="text-gray-600">
                Мы предоставляем полный спектр услуг: от консультаций до доставки 
                и посадки растений.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Наша команда</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ирина Леонидовна</h3>
              <p className="text-green-600 font-medium mb-2">Основатель и главный агроном</p>
              <p className="text-gray-600">
                Более 15 лет опыта в садоводстве и ландшафтном дизайне. 
                Специализируется на многолетних цветах и лекарственных травах.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Команда специалистов</h3>
              <p className="text-green-600 font-medium mb-2">Опытные садоводы</p>
              <p className="text-gray-600">
                Наша команда состоит из опытных садоводов и агрономов, 
                которые знают все секреты выращивания здоровых растений.
              </p>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Наши достижения</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-gray-600">Видов растений</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-gray-600">Довольных клиентов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">10+</div>
              <div className="text-gray-600">Лет опыта</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Приживаемость</div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Наши услуги</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl mb-3">🌱</div>
              <h3 className="font-semibold text-gray-900 mb-2">Продажа растений</h3>
              <p className="text-gray-600 text-sm">
                Широкий ассортимент многолетних цветов и трав
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl mb-3">💡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Консультации</h3>
              <p className="text-gray-600 text-sm">
                Помощь в выборе и уходе за растениями
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl mb-3">🎨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Проектирование</h3>
              <p className="text-gray-600 text-sm">
                Создание ландшафтных проектов
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl mb-3">🚚</div>
              <h3 className="font-semibold text-gray-900 mb-2">Доставка</h3>
              <p className="text-gray-600 text-sm">
                Быстрая и бережная доставка по области
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Свяжитесь с нами</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Адрес</h3>
              <p className="text-gray-600">
                Ростовская область,<br />
                Неклиновский район,<br />
                село Николаевка
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Телефон</h3>
              <p className="text-gray-600">
                +7 918 55 28 423<br />
                Ирина Леонидовна
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                Mytapitomnik@mail.ru
              </p>
            </div>
          </div>
        </section>
      </div>

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
