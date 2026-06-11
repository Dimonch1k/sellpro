import type { Session } from '@supabase/supabase-js'
import { Mail, Phone, Shield, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { USER_ROLE_LABELS } from '../../lib/constants'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../lib/types'
import { getInitials, normalizeErrorMessage } from '../../lib/utils'

interface ProfilePageProps {
	session: Session
	profile: Profile | null
	onProfileUpdated: (profile: Profile) => void
}

export function ProfilePage({
	session,
	profile,
	onProfileUpdated,
}: ProfilePageProps) {
	const [fullName, setFullName] = useState(profile?.full_name ?? '')
	const [phone, setPhone] = useState(profile?.phone ?? '')
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')
	const [isSavingProfile, setIsSavingProfile] = useState(false)
	const [isSavingPassword, setIsSavingPassword] = useState(false)

	useEffect(() => {
		setFullName(profile?.full_name ?? '')
		setPhone(profile?.phone ?? '')
	}, [profile])

	const handleProfileSave = async () => {
		setErrorMessage('')
		setSuccessMessage('')

		if (!fullName.trim()) {
			setErrorMessage('Вкажіть повне ім’я.')
			return
		}

		setIsSavingProfile(true)
		const { data, error } = await supabase
			.from('profiles')
			.update({
				full_name: fullName.trim(),
				phone: phone.trim() || null,
			})
			.eq('id', session.user.id)
			.select('*')
			.single()
		setIsSavingProfile(false)

		if (error || !data) {
			setErrorMessage(normalizeErrorMessage(error))
			return
		}

		onProfileUpdated(data as Profile)
		setSuccessMessage('Профіль оновлено.')
	}

	const handlePasswordChange = async () => {
		setErrorMessage('')
		setSuccessMessage('')

		if (!currentPassword.trim()) {
			setErrorMessage('Вкажіть поточний пароль.')
			return
		}

		if (newPassword.length < 6) {
			setErrorMessage('Новий пароль має містити щонайменше 6 символів.')
			return
		}

		if (newPassword !== confirmPassword) {
			setErrorMessage('Нові паролі не збігаються.')
			return
		}

		setIsSavingPassword(true)
		const signInResult = await supabase.auth.signInWithPassword({
			email: session.user.email ?? '',
			password: currentPassword,
		})

		if (signInResult.error) {
			setIsSavingPassword(false)
			setErrorMessage('Поточний пароль вказано невірно.')
			return
		}

		const { error } = await supabase.auth.updateUser({ password: newPassword })
		setIsSavingPassword(false)

		if (error) {
			setErrorMessage(normalizeErrorMessage(error))
			return
		}

		setCurrentPassword('')
		setNewPassword('')
		setConfirmPassword('')
		setSuccessMessage('Пароль успішно змінено.')
	}

	const displayName = profile?.full_name || session.user.email || 'Користувач'

	return (
		<>
			<div>
				<h1 className='app-page-title'>Профіль користувача</h1>
				<p className='app-page-subtitle'>Керування особистою інформацією</p>
			</div>

			{errorMessage ? (
				<div className='app-alert-error'>{errorMessage}</div>
			) : null}
			{successMessage ? (
				<div className='app-alert-success'>{successMessage}</div>
			) : null}

			<div className='flex w-full flex-col gap-6 xl:flex-row'>
				<div className='app-panel w-full flex-1 p-6'>
					<div className='mb-6 flex items-center gap-6'>
						<div className='flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white'>
							{getInitials(displayName)}
						</div>
						<div>
							<h2 className='text-2xl font-semibold text-slate-900 dark:text-slate-100'>
								{displayName}
							</h2>
							<p className='text-slate-600 dark:text-slate-400'>
								{session.user.email}
							</p>
							<div className='mt-2'>
								<span className='inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'>
									<Shield className='mr-1 h-4 w-4' />
									{profile ? USER_ROLE_LABELS[profile.role] : 'Без ролі'}
								</span>
							</div>
						</div>
					</div>

					<div className='border-t border-slate-200 pt-6 dark:border-slate-800'>
						<h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100'>
							Особиста інформація
						</h3>
						<div className='space-y-4'>
							<div>
								<label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
									<span className='flex items-center gap-2'>
										<User className='h-4 w-4' />
										Повне ім’я
									</span>
								</label>
								<input
									value={fullName}
									onChange={event => setFullName(event.target.value)}
									className='app-input'
								/>
							</div>

							<div>
								<label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
									<span className='flex items-center gap-2'>
										<Phone className='h-4 w-4' />
										Телефон
									</span>
								</label>
								<input
									value={phone}
									onChange={event => setPhone(event.target.value)}
									className='app-input'
								/>
							</div>

							<div>
								<label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
									<span className='flex items-center gap-2'>
										<Mail className='h-4 w-4' />
										Email
									</span>
								</label>
								<input
									value={session.user.email ?? ''}
									disabled
									className='app-input'
								/>
							</div>
						</div>

						<div className='mt-6 flex gap-3'>
							<button
								onClick={handleProfileSave}
								disabled={isSavingProfile}
								className='rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-60'
							>
								{isSavingProfile ? 'Збереження...' : 'Зберегти зміни'}
							</button>
						</div>
					</div>
				</div>

				<div className='app-panel p-6 xl:w-[24rem]'>
					<h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100'>
						Зміна паролю
					</h3>
					<div className='space-y-4'>
						<input
							value={currentPassword}
							onChange={event => setCurrentPassword(event.target.value)}
							type='password'
							placeholder='Поточний пароль'
							className='app-input'
						/>
						<input
							value={newPassword}
							onChange={event => setNewPassword(event.target.value)}
							type='password'
							placeholder='Новий пароль'
							className='app-input'
						/>
						<input
							value={confirmPassword}
							onChange={event => setConfirmPassword(event.target.value)}
							type='password'
							placeholder='Підтвердження нового паролю'
							className='app-input'
						/>
						<button
							onClick={handlePasswordChange}
							disabled={isSavingPassword}
							className='rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-60'
						>
							{isSavingPassword ? 'Оновлення...' : 'Змінити пароль'}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
