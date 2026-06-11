import {
	ArrowRight,
	BarChart3,
	CreditCard,
	FileText,
	Package,
	Percent,
	Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

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
		description:
			'Створення угод, контроль виконання та автоматизація документообігу',
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
]

export function HomePage() {
	return (
		<div>
			<section className='relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-700 to-slate-900 text-white'>
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.2),transparent_35%)]' />
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='relative py-20 text-center'>
						<h1 className='text-5xl font-bold mb-6'>
							Облік реалізації готової продукції
						</h1>
						<p className='text-xl text-blue-100/95 mb-8 max-w-3xl mx-auto'>
							Повнофункціональна система управління оптово-роздрібними
							продажами, покупцями, угодами, знижками та фінансовою аналітикою
						</p>
						<div className='flex gap-4 justify-center'>
							<Link
								to='/signin'
								className='bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors'
							>
								Увійти
							</Link>
							<Link
								to='/signup'
								className='bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors border border-blue-500'
							>
								Почати роботу
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className='border-y border-slate-200/80 bg-white py-20 dark:border-slate-800 dark:bg-slate-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
							Можливості системи
						</h2>
						<p className='text-lg text-slate-600 dark:text-slate-300'>
							Все необхідне для ефективного управління продажами
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{features.map(feature => {
							const Icon = feature.icon
							return (
								<div
									key={feature.title}
									className='rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-blue-500'
								>
									<div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/70'>
										<Icon className='w-6 h-6 text-blue-600' />
									</div>
									<h3 className='mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100'>
										{feature.title}
									</h3>
									<p className='text-slate-600 dark:text-slate-300'>
										{feature.description}
									</p>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			<section className='bg-slate-100 py-20 dark:bg-slate-950'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
						Готові почати?
					</h2>
					<p className='text-lg text-slate-600 dark:text-slate-300 mb-8'>
						Приєднуйтесь до тисяч компаній, які автоматизували свої продажі
					</p>
					<Link
						to='/signup'
						className='inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors'
					>
						Почати роботу
						<ArrowRight className='w-5 h-5' />
					</Link>
				</div>
			</section>
		</div>
	)
}
