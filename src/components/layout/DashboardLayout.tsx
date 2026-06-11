import { ReactNode } from 'react'
import type { Profile, ThemeMode, UserRole } from '../../lib/types'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
	children: ReactNode
	profile: Profile | null
	role: UserRole | null
	email: string
	theme: ThemeMode
	onLogout: () => void
	onToggleTheme: () => void
}

export function DashboardLayout({
	children,
	profile,
	role,
	email,
	theme,
	onLogout,
	onToggleTheme,
}: DashboardLayoutProps) {
	return (
		<div className='flex h-screen bg-slate-50 dark:bg-slate-950'>
			<Sidebar role={role} />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<Navbar
					profile={profile}
					email={email}
					theme={theme}
					onLogout={onLogout}
					onToggleTheme={onToggleTheme}
				/>
				<main className='w-full flex-1 overflow-y-auto p-6 max-w-7xl mx-auto space-y-6'>
					{children}
				</main>
			</div>
		</div>
	)
}
