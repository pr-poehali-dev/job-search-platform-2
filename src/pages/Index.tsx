import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');

  const vacancies = [
    { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp', salary: '200 000 - 300 000 ₽', location: 'Москва', tags: ['React', 'TypeScript', 'Удаленно'], match: 95 },
    { id: 2, title: 'Product Manager', company: 'StartupHub', salary: '180 000 - 250 000 ₽', location: 'Санкт-Петербург', tags: ['Agile', 'B2B', 'SaaS'], match: 88 },
    { id: 3, title: 'UX/UI Designer', company: 'DesignStudio', salary: '150 000 - 200 000 ₽', location: 'Удаленно', tags: ['Figma', 'User Research', 'Mobile'], match: 82 },
    { id: 4, title: 'Backend Developer', company: 'DataTech', salary: '220 000 - 320 000 ₽', location: 'Москва', tags: ['Python', 'Django', 'PostgreSQL'], match: 78 },
  ];

  const companies = [
    { id: 1, name: 'TechCorp', rating: 4.8, reviews: 234, vacancies: 12, logo: '🏢' },
    { id: 2, name: 'StartupHub', rating: 4.6, reviews: 156, vacancies: 8, logo: '🚀' },
    { id: 3, name: 'DesignStudio', rating: 4.9, reviews: 89, vacancies: 5, logo: '🎨' },
    { id: 4, name: 'DataTech', rating: 4.7, reviews: 198, vacancies: 15, logo: '💾' },
  ];

  const tests = [
    { id: 1, title: 'Определение карьерного направления', duration: '15 мин', icon: 'Compass', completed: false },
    { id: 2, title: 'Оценка soft skills', duration: '20 мин', icon: 'Users', completed: false },
    { id: 3, title: 'Тест на профессиональные навыки', duration: '30 мин', icon: 'BrainCircuit', completed: true },
    { id: 4, title: 'Анализ карьерных предпочтений', duration: '10 мин', icon: 'Target', completed: false },
  ];

  const userProfile = {
    name: 'Александр Иванов',
    position: 'Frontend Developer',
    experience: '5 лет',
    skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'Git'],
    education: 'МГУ, Факультет ВМК',
    salary: '200 000 ₽',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Briefcase" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-foreground">CareerHub</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setActiveTab('home')} className={`text-sm font-medium transition-colors hover:text-primary ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}`}>
                Главная
              </button>
              <button onClick={() => setActiveTab('vacancies')} className={`text-sm font-medium transition-colors hover:text-primary ${activeTab === 'vacancies' ? 'text-primary' : 'text-muted-foreground'}`}>
                Вакансии
              </button>
              <button onClick={() => setActiveTab('profile')} className={`text-sm font-medium transition-colors hover:text-primary ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}>
                Резюме
              </button>
              <button onClick={() => setActiveTab('tests')} className={`text-sm font-medium transition-colors hover:text-primary ${activeTab === 'tests' ? 'text-primary' : 'text-muted-foreground'}`}>
                Тесты
              </button>
              <button onClick={() => setActiveTab('companies')} className={`text-sm font-medium transition-colors hover:text-primary ${activeTab === 'companies' ? 'text-primary' : 'text-muted-foreground'}`}>
                Компании
              </button>
              <button onClick={() => setActiveTab('contacts')} className={`text-sm font-medium transition-colors hover:text-primary ${activeTab === 'contacts' ? 'text-primary' : 'text-muted-foreground'}`}>
                Контакты
              </button>
            </div>
            
            <Button>Войти</Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center py-16 space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Найди работу мечты
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Умная платформа подбора вакансий на основе твоих навыков и опыта
              </p>
              
              <div className="flex gap-4 max-w-2xl mx-auto">
                <Input placeholder="Должность, ключевые слова" className="flex-1" />
                <Input placeholder="Город" className="w-48" />
                <Button size="lg" className="gap-2">
                  <Icon name="Search" size={20} />
                  Найти
                </Button>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-primary">12,500+</div>
                  <div className="text-sm text-muted-foreground mt-1">Вакансий</div>
                </Card>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-primary">3,200+</div>
                  <div className="text-sm text-muted-foreground mt-1">Компаний</div>
                </Card>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground mt-1">Точность подбора</div>
                </Card>
              </div>
            </section>

            {/* Features */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-center">Возможности платформы</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                      <Icon name="Target" className="text-primary" size={24} />
                    </div>
                    <CardTitle>Умные рекомендации</CardTitle>
                    <CardDescription>
                      Алгоритм анализирует твой профиль и предлагает вакансии с высоким процентом соответствия
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                      <Icon name="LineChart" className="text-primary" size={24} />
                    </div>
                    <CardTitle>Карьерные тесты</CardTitle>
                    <CardDescription>
                      Пройди профессиональные тесты для определения своих сильных сторон и карьерного направления
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                      <Icon name="Star" className="text-primary" size={24} />
                    </div>
                    <CardTitle>Рейтинг компаний</CardTitle>
                    <CardDescription>
                      Изучай отзывы сотрудников и выбирай лучших работодателей с высоким рейтингом
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </section>

            {/* Top Vacancies Preview */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Рекомендованные вакансии</h2>
                <Button variant="outline" onClick={() => setActiveTab('vacancies')}>
                  Все вакансии
                  <Icon name="ArrowRight" className="ml-2" size={16} />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {vacancies.slice(0, 4).map((vacancy) => (
                  <Card key={vacancy.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                          <CardDescription>{vacancy.company}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                          {vacancy.match}% match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Wallet" size={16} className="text-muted-foreground" />
                        <span className="font-medium">{vacancy.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="MapPin" size={16} />
                        <span>{vacancy.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {vacancy.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'vacancies' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">Вакансии</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Icon name="SlidersHorizontal" size={16} className="mr-2" />
                  Фильтры
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Input placeholder="Поиск вакансий..." className="flex-1" />
              <Button>
                <Icon name="Search" size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              {vacancies.map((vacancy) => (
                <Card key={vacancy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{vacancy.title}</CardTitle>
                        <CardDescription className="text-base">{vacancy.company}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 text-lg px-4 py-1">
                        <Icon name="Sparkles" size={16} className="mr-1" />
                        {vacancy.match}% match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-base">
                        <Icon name="Wallet" size={18} className="text-muted-foreground" />
                        <span className="font-semibold">{vacancy.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-base text-muted-foreground">
                        <Icon name="MapPin" size={18} />
                        <span>{vacancy.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vacancy.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-sm">{tag}</Badge>
                      ))}
                    </div>
                    <div className="pt-2">
                      <Button className="w-full">Откликнуться</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold">Моё резюме</h1>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-3xl">
                    👤
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
                    <CardDescription className="text-lg">{userProfile.position}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Опыт работы</div>
                    <div className="font-medium">{userProfile.experience}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Желаемая зарплата</div>
                    <div className="font-medium">{userProfile.salary}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground mb-1">Образование</div>
                    <div className="font-medium">{userProfile.education}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-3">Навыки</div>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill) => (
                      <Badge key={skill} className="text-sm px-3 py-1">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full" size="lg">
                    <Icon name="Pencil" size={18} className="mr-2" />
                    Редактировать резюме
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Рекомендации на основе профиля</CardTitle>
                <CardDescription>
                  Вакансии, которые лучше всего подходят под ваш опыт и навыки
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {vacancies.slice(0, 2).map((vacancy) => (
                  <div key={vacancy.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{vacancy.title}</div>
                        <div className="text-sm text-muted-foreground">{vacancy.company}</div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        {vacancy.match}%
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{vacancy.salary}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Карьерные тесты</h1>
              <p className="text-lg text-muted-foreground">
                Пройди тесты для определения карьерного направления и оценки навыков
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {tests.map((test) => (
                <Card key={test.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Icon name={test.icon as any} className="text-primary" size={24} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{test.title}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-2">
                            <Icon name="Clock" size={14} />
                            {test.duration}
                          </div>
                        </CardDescription>
                      </div>
                      {test.completed && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <Icon name="Check" size={14} className="mr-1" />
                          Пройден
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant={test.completed ? 'outline' : 'default'}>
                      {test.completed ? 'Пройти снова' : 'Начать тест'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Trophy" className="text-primary" size={24} />
                  Получи карьерный сертификат
                </CardTitle>
                <CardDescription>
                  Пройди все тесты и получи персональный анализ карьерного профиля
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-primary">25%</div>
                    <div className="text-sm text-muted-foreground">прогресс</div>
                  </div>
                  <Button>Продолжить тестирование</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Рейтинг компаний</h1>
              <p className="text-lg text-muted-foreground">
                Лучшие работодатели по отзывам сотрудников
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {companies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-3xl shrink-0">
                        {company.logo}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{company.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={18} />
                            <span className="font-semibold text-lg">{company.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({company.reviews} отзывов)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Briefcase" size={16} />
                      <span>{company.vacancies} открытых вакансий</span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Смотреть вакансии</Button>
                      <Button variant="outline">Отзывы</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Свяжитесь с нами</h1>
              <p className="text-lg text-muted-foreground">
                Есть вопросы? Мы всегда готовы помочь
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon name="Mail" className="text-primary" size={24} />
                  </div>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>support@careerhub.ru</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon name="Phone" className="text-primary" size={24} />
                  </div>
                  <CardTitle>Телефон</CardTitle>
                  <CardDescription>+7 (495) 123-45-67</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon name="MapPin" className="text-primary" size={24} />
                  </div>
                  <CardTitle>Адрес</CardTitle>
                  <CardDescription>Москва, ул. Тверская, 1</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Напишите нам</CardTitle>
                <CardDescription>
                  Заполните форму и мы свяжемся с вами в ближайшее время
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Имя</label>
                    <Input placeholder="Ваше имя" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Сообщение</label>
                  <textarea 
                    className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Ваше сообщение..."
                  />
                </div>
                <Button size="lg" className="w-full">
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить сообщение
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Briefcase" className="text-white" size={18} />
                </div>
                <span className="text-lg font-bold">CareerHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Умная платформа для поиска работы и развития карьеры
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Для соискателей</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Поиск вакансий</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Создать резюме</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Карьерные тесты</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Для работодателей</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Разместить вакансию</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Поиск кандидатов</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Тарифы</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Компания</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Блог</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 CareerHub. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
