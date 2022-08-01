import Head from 'next/head'

import styles from '../styles/Home.module.css'

import Banner from '../components/banner/banner'
import NavBar from '../components/nav/navbar'
import SectionCard from '../components/card/section-cards'
import { getVideos, getPopularVideos, watchItAgain } from '../lib/videos'
import redirectUser from '../utils/redirectUser'

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

	const watchItAgainVideos = await watchItAgain(userId, token)
	const netflixVideos = await getVideos('netflix')
	const technologyVideos = await getVideos('technology')
	const trailerVideos = await getVideos('movie trailer')
	const popularVideos = await getPopularVideos()
	return {
		props: {
			netflixVideos,
			technologyVideos,
			trailerVideos,
			popularVideos,
			watchItAgainVideos,
		},
	}
}

export default function Home({
	netflixVideos,
	technologyVideos,
	trailerVideos,
	popularVideos,
	watchItAgainVideos = [],
}) {
	return (
		<div className={styles.container}>
			<Head>
				<title>Netflix</title>
				<meta name='description' content='Netflix video streaming clone' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className={styles.main}>
				<NavBar />

				<Banner
					title='Peaky Blinders'
					subTitle='Season 4'
					videoId='whgdkjDJAjg'
					imgUrl='/static/peaky_blinders.webp'
				/>

				<div className={styles.sectionWrapper}>
					<SectionCard
						title='New on Netflix'
						videos={netflixVideos}
						size='large'
					/>
					<SectionCard
						title='Watch it again'
						videos={watchItAgainVideos}
						size='small'
					/>
					<SectionCard
						title='Technology'
						videos={technologyVideos}
						size='small'
					/>
					<SectionCard title='Trailer' videos={trailerVideos} size='medium' />
					<SectionCard title='Popular' videos={popularVideos} size='small' />
				</div>
			</div>
		</div>
	)
}
