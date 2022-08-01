import Head from 'next/head'
import SectionCard from '../../components/card/section-cards'
import NavBar from '../../components/nav/navbar'
import redirectUser from '../../utils/redirectUser'

import styles from '../../styles/mylist.module.css'
import { getFavouritedVideos } from '../../lib/videos'

export async function getServerSideProps(context) {
	const { userId, token } = await redirectUser(context)

	if (!userId && !token) {
		return {
			props: {},
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}
	}

	const videos = await getFavouritedVideos(userId, token)

	return {
		props: {
			myListVideos: videos,
		},
	}
}

const myList = ({ myListVideos }) => {
	return (
		<div>
			<Head>
				<title> My List</title>
			</Head>

			<main className={styles.main}>
				<NavBar />
				<div className={styles.sectionWrapper}>
					<SectionCard
						title='My List'
						videos={myListVideos}
						size='small'
						shouldWrap
					/>
				</div>
			</main>
		</div>
	)
}

export default myList
