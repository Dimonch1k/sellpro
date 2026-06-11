import { LogOut } from 'lucide-react'
import { USER_ROLE_LABELS } from '../../lib/constants'
import type { Profile, ThemeMode } from '../../lib/types'
import { getInitials } from '../../lib/utils'
import { ThemeToggle } from '../shared/ThemeToggle'

interface NavbarProps {
	profile: Profile | null
	email: string
	theme: ThemeMode
	onLogout: () => void
	onToggleTheme: () => void
}

export function Navbar({
	profile,
	email,
	theme,
	onLogout,
	onToggleTheme,
}: NavbarProps) {
	const displayName = profile?.full_name?.trim() || email || 'Користувач'
	const initials = getInitials(displayName) || 'SP'

	return (
		<div className='border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80'>
			<div className='flex items-center justify-between'>
				<p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
					Робочий кабінет
				</p>

				<div className='flex items-center gap-4 ml-6'>
					<ThemeToggle theme={theme} onToggle={onToggleTheme} />
					<div className='flex items-center gap-3'>
						<div className='text-right'>
							<p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
								{displayName}
							</p>
							<p className='text-xs text-slate-500 dark:text-slate-400'>
								{profile ? USER_ROLE_LABELS[profile.role] : email}
							</p>
						</div>
						<div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium'>
							{initials}
						</div>
					</div>

					<button
						type='button'
						onClick={onLogout}
						className='rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
						aria-label='Вийти'
					>
						<LogOut className='w-5 h-5' />
					</button>
				</div>
			</div>
		</div>
	)
}
