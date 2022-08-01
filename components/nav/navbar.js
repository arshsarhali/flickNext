import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

import styles from './navbar.module.css'
import magic from '../../lib/magic-client'
import { useEffect, useState } from 'react'

const NavBar = () => {
	const router = useRouter()

	const [showDropDown, setShowDropDown] = useState(false)
	const [username, setUsername] = useState('')
	const [didToken, setDidToken] = useState('')

	useEffect(() => {
		const getUsername = async () => {
			try {
				const { email } = await magic.user.getMetadata()
				const didToken = await magic.user.getIdToken()

				if (email) {
					setUsername(email)
					setDidToken(didToken)
				}
			} catch (err) {
				console.log('error retriving username', err)
			}
		}

		getUsername()
	}, [])

	const handleSignOut = async (e) => {
		e.preventDefault()

		try {
			const response = await fetch('/api/logout', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${didToken}`,
					'Content-Type': 'application/json',
				},
			})

			const res = await response.json()
		} catch (error) {
			console.error('Error logging out', error)
			router.push('/login')
		}
	}

	const handleOnClickHome = (e) => {
		e.preventDefault()
		router.push('/')
	}

	const handleOnClickMyList = (e) => {
		e.preventDefault()
		router.push('/browse/my-list')
	}

	const handleShowDropDown = (e) => {
		e.preventDefault()
		setShowDropDown(!showDropDown)
	}
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<a className={styles.logoLink} href='/'>
					<div className={styles.logoWrapper}>
						<Image
							src={'/static/netflix.svg'}
							alt='Netflix logo'
							width='128px'
							height='34px'
						/>
					</div>
				</a>

				<ul className={styles.navItems}>
					<li className={styles.navItem} onClick={handleOnClickHome}>
						Home
					</li>
					<li className={styles.navItem2} onClick={handleOnClickMyList}>
						MyList
					</li>
				</ul>

				<nav className={styles.navContainer}>
					<div>
						<button className={styles.usernameBtn} onClick={handleShowDropDown}>
							<p className={styles.username}>{username}</p>
							<Image
								src={'/static/expand_more.svg'}
								alt='Expand more icon'
								width='24px'
								height='24px'
							/>
						</button>
						{showDropDown && (
							<div className={styles.navDropdown}>
								<div>
									<a className={styles.linkName} onClick={handleSignOut}>
										signout
									</a>

									<div className={styles.lineWrapper}></div>
								</div>
							</div>
						)}
					</div>
				</nav>
			</div>
		</div>
	)
}

export default NavBar
