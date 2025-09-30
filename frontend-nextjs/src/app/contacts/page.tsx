'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
                <p className="text-sm text-gray-600">Контакты</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/catalog" className="text-gray-600 hover:text-green-600">Каталог</Link>
              <Link href="/sets" className="text-gray-600 hover:text-green-600">Наборы</Link>
              <Link href="/about" className="text-gray-600 hover:text-green-600">О нас</Link>
              <Link href="/contacts" className="text-green-600 font-medium">Контакты</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Свяжитесь с нами
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы всегда рады ответить на ваши вопросы и помочь с выбором растений для вашего сада
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Наши контакты</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Адрес</h3>
                  <p className="text-gray-600">
                    Ростовская область,<br />
                    Неклиновский район,<br />
                    село Николаевка
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Телефон</h3>
                  <p className="text-gray-600">
                    <a href="tel:+79185528423" className="hover:text-green-600 transition-colors">
                      +7 918 55 28 423
                    </a>
                    <br />
                    Ирина Леонидовна
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:Mytapitomnik@mail.ru" className="hover:text-green-600 transition-colors">
                      Mytapitomnik@mail.ru
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Время работы</h3>
                  <p className="text-gray-600">
                    Пн-Пт: 8:00 - 18:00<br />
                    Сб: 9:00 - 16:00<br />
                    Вс: 10:00 - 15:00
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Как нас найти</h3>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Карта будет добавлена позже</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Напишите нам</h2>
            
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Сообщение отправлено!</h3>
                <p className="text-green-600">Мы свяжемся с вами в ближайшее время</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Имя *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ваше имя"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Тема обращения
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Выберите тему</option>
                    <option value="consultation">Консультация по растениям</option>
                    <option value="order">Заказ растений</option>
                    <option value="delivery">Вопросы доставки</option>
                    <option value="cooperation">Сотрудничество</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Сообщение *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Опишите ваш вопрос или пожелания..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Отправить сообщение</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Часто задаваемые вопросы</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Как оформить заказ?</h3>
              <p className="text-gray-600">
                Выберите растения в каталоге, добавьте их в корзину и оформите заказ. 
                Мы свяжемся с вами для подтверждения деталей доставки.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Доставляете ли вы растения?</h3>
              <p className="text-gray-600">
                Да, мы доставляем растения по Ростовской области и в соседние регионы. 
                Бесплатная доставка от 5000₽.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Когда лучше сажать растения?</h3>
              <p className="text-gray-600">
                Лучшее время для посадки многолетних растений — весна (апрель-май) 
                и осень (сентябрь-октябрь), когда почва прогрета и влажная.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Предоставляете ли консультации?</h3>
              <p className="text-gray-600">
                Конечно! Мы предоставляем бесплатные консультации по выбору растений, 
                уходу за ними и созданию ландшафтных композиций.
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
