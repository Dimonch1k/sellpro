import { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { ThemeMode } from '../../lib/types'
import { ThemeToggle } from '../shared/ThemeToggle'

interface PublicLayoutProps {
	children: ReactNode
	theme: ThemeMode
	onToggleTheme: () => void
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
	`text-sm font-medium transition-colors ${
		isActive
			? 'text-blue-600 dark:text-blue-400'
			: 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'
	}`

export function PublicLayout({
	children,
	theme,
	onToggleTheme,
}: PublicLayoutProps) {
	return (
		<div className='min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
			<header className='sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex min-h-16 flex-wrap items-center justify-between gap-4 py-3'>
						<Link
							to='/'
							className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'
						>
							SellPro
						</Link>
						<div className='flex flex-wrap items-center gap-3 sm:gap-5'>
							<nav className='flex items-center gap-4 sm:gap-5'>
								<NavLink to='/' end className={navLinkClassName}>
									Головна
								</NavLink>
								<NavLink to='/about' className={navLinkClassName}>
									Про нас
								</NavLink>
								<NavLink to='/contacts' className={navLinkClassName}>
									Контакти
								</NavLink>
							</nav>
							<ThemeToggle theme={theme} onToggle={onToggleTheme} />
							<Link
								to='/signin'
								className='rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'
							>
								Увійти
							</Link>
							<Link
								to='/signup'
								className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
							>
								Почати роботу
							</Link>
						</div>
					</div>
				</div>
			</header>
			<main>{children}</main>
		</div>
	)
}
