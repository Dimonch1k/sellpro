import { LucideIcon } from 'lucide-react'

interface StatCardProps {
	title: string
	value: string | number
	icon: LucideIcon
	trend?: {
		value: number
		isPositive: boolean
	}
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
	return (
		<div className='app-panel p-6'>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-sm text-slate-600 dark:text-slate-400'>{title}</p>
					<p className='mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100'>{value}</p>
					{trend && (
						<p
							className={`mt-1 text-sm ${trend.isPositive ? 'app-status-positive' : 'app-status-negative'}`}
						>
							{trend.isPositive ? '+' : ''}
							{trend.value}%
						</p>
					)}
				</div>
				<div className='rounded-lg bg-blue-50 p-3 dark:bg-blue-950/50'>
					<Icon className='h-6 w-6 text-blue-600 dark:text-blue-400' />
				</div>
			</div>
		</div>
	)
}
