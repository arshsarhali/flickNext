import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import magic from '../lib/magic-client'

import styles from '../styles/login.module.css'

const Login = () => {
	const router = useRouter()

	const [userMsg, setUsrMsg] = useState('')
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const handleComplete = () => {
			setIsLoading(false)
		}
		router.events.on('routeChangeComplete', handleComplete)
		router.events.on('routeChangeError', handleComplete)
		return () => {
			router.events.off('routeChangeComplete', handleComplete)
			router.events.off('routeChangeError', handleComplete)
		}
	}, [router])

	const handleLoginWithEmail = async (e) => {
		e.preventDefault()
		if (email) {
			try {
				setIsLoading(true)

				const didToken = await magic.auth.loginWithMagicLink({ email })
				if (didToken) {
					const response = await fetch('/api/login', {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${didToken}`,
							'Content-Type': 'application/json',
						},
					})

					const loggedInResponse = await response.json()
					if (loggedInResponse.done) {
						router.push('/')
					} else {
						setIsLoading(false)
						setUsrMsg('Something went wrong while logging in')
					}
				}
			} catch (err) {
				console.log('Something went wrong', err)
				setIsLoading(false)
			}
		}
	}

	const handleOnChangeEmail = (e) => {
		const email = e.target.value
		setUsrMsg('')
		setEmail(email)
	}
	return (
		<div className={styles.container}>
			<Head>
				<title>Netflix Signin</title>
			</Head>

			<header className={styles.header}>
				<div className={styles.headerWrapper}>
					<a className={styles.logoLink} href='/ '>
						<div className={styles.logoWrapper}>
							<Image
								src={'/static/netflix.svg'}
								alt='Netflix logo'
								width='128px'
								height='34px'
							/>
						</div>
					</a>
				</div>
			</header>

			<main className={styles.main}>
				<div className={styles.mainWrapper}>
					<h1 className={styles.signinHeader}>Sign In</h1>

					<input
						className={styles.emailInput}
						type='text'
						onChange={handleOnChangeEmail}
						placeholder='Email Address'
					/>
					<p className={styles.userMsg}>{userMsg}</p>

					<button className={styles.loginBtn} onClick={handleLoginWithEmail}>
						{isLoading ? 'Loading...' : 'Sign In'}
					</button>
				</div>
			</main>
		</div>
	)
}

export default Login
