import { Package, Users, FileText, Percent, CreditCard, BarChart3, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const features = [
  {
    icon: Package,
    title: 'Облік товарів',
    description: 'Управління асортиментом, категоріями, цінами та залишками',
  },
  {
    icon: Users,
    title: 'Покупці',
    description: 'База клієнтів з історією угод та фінансовою статистикою',
  },
  {
    icon: FileText,
    title: 'Угоди',
    description: 'Створення угод, контроль виконання та автоматизація документообігу',
  },
  {
    icon: Percent,
    title: 'Знижки',
    description: 'Гнучка система знижок залежно від обсягу закупівель',
  },
  {
    icon: CreditCard,
    title: 'Платежі',
    description: 'Облік оплат, контроль дебіторської заборгованості',
  },
  {
    icon: BarChart3,
    title: 'Фінансова аналітика',
    description: 'Звіти, графіки, аналіз прибутку та рентабельності',
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Облік реалізації готової продукції
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Повнофункціональна система управління оптово-роздрібними продажами,
              покупцями, угодами, знижками та фінансовою аналітикою
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onNavigate('signin')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Увійти
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors border border-blue-500"
              >
                Почати роботу
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Можливості системи
            </h2>
            <p className="text-lg text-gray-600">
              Все необхідне для ефективного управління продажами
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Готові почати?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Приєднуйтесь до тисяч компаній, які автоматизували свої продажі
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Почати роботу
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
