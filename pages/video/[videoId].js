import { useRouter } from 'next/router'
import Modal from 'react-modal'
import styles from '../../styles/video.module.css'

import { getYoutubeVideoById } from '../../lib/videos'

import cls from 'classnames'
import NavBar from '../../components/nav/navbar'
import Like from '../../components/icons/like-icon'
import DisLike from '../../components/icons/dislike-icon'
import { useEffect, useState } from 'react'

Modal.setAppElement('#__next')
export async function getStaticProps(context) {
	const videoId = context.params.videoId
	const videoArray = await getYoutubeVideoById(videoId)
	return {
		props: {
			video: videoArray.length > 0 ? videoArray[0] : {},
		},

		revalidate: 10,
	}
}

export async function getStaticPaths() {
	const listOfVideos = ['whgdkjDJAjg', '_InqQJRqGW4', 'cq2iTHoLrt0']

	const paths = listOfVideos.map((videoId) => ({
		params: { videoId },
	}))

	return { paths, fallback: 'blocking' }
}

const Video = ({ video }) => {
	const router = useRouter()

	const { title, publishTime, discription, viewCount, channelName } = video

	const { videoId } = router.query

	const [toggleLike, setToggleLike] = useState(false)

	const [toggleDislike, setToggleDislike] = useState(false)

	useEffect(() => {
		const getFavourited = async () => {
			const response = await fetch(`/api/stats?videoId=${videoId}`, {
				method: 'GET',
			})

			const data = await response.json()

			if (data.length > 0) {
				const favourited = data[0].favourited

				if (favourited == 2) {
					setToggleLike(true)
					setToggleDislike(false)
				} else if (favourited == 1) {
					setToggleLike(false)
					setToggleDislike(true)
				} else {
					setToggleLike(false)
					setToggleDislike(false)
				}
			}
		}

		getFavourited()
	}, [videoId])

	const runRatingService = async (favourited) => {
		await fetch('/api/stats', {
			method: 'POST',
			body: JSON.stringify({
				videoId,
				favourited,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}
	const handleToggleLike = async () => {
		const val = !toggleLike
		setToggleLike(val)
		const favourited = val ? 2 : 0
		await runRatingService(favourited)
		if (toggleDislike) {
			setToggleDislike(!toggleDislike)
		}
	}

	const handleToggelDislike = async () => {
		const val = !toggleDislike
		setToggleDislike(!toggleDislike)
		const favourited = val ? 1 : 0
		await runRatingService(favourited)
		if (toggleLike) {
			setToggleLike(!toggleLike)
		}
	}

	return (
		<div className={styles.container}>
			<NavBar />
			<Modal
				isOpen={true}
				onRequestClose={() => router.back()}
				contentLabel='Watch video'
				className={styles.modal}
				overlayClassName={styles.overlay}
			>
				<iframe
					id='ytplayer'
					type='text/html'
					width='100%'
					height='360'
					className={styles.videoPlayer}
					src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
					frameBorder='0'
				></iframe>

				<div className={styles.likeDislikeBtnWrapper}>
					<div className={styles.likeBtnWrapper}>
						<button onClick={handleToggleLike}>
							<div className={styles.btnWrapper}>
								<Like selected={toggleLike} />
							</div>
						</button>
					</div>
					<button onClick={handleToggelDislike}>
						<div className={styles.btnWrapper}>
							<DisLike selected={toggleDislike} />
						</div>
					</button>
				</div>

				<div className={styles.modalBody}>
					<div className={styles.modalBodyContent}>
						<div className={styles.col1}>
							<p className={styles.publishTime}>{publishTime}</p>
							<p className={styles.title}>{title}</p>
							<p className={styles.description}>{discription}</p>
						</div>
						<div className={styles.col2}>
							<p className={cls(styles.subText, styles.subTextWrapper)}>
								<span className={styles.textColor}>Channel: </span>
								<span className={styles.channelTitle}>{channelName}</span>
							</p>
							<p className={cls(styles.subText, styles.subTextWrapper)}>
								<span className={styles.textColor}>View Count: </span>
								<span className={styles.viewCount}>{viewCount}</span>
							</p>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default Video
