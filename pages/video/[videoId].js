import { useRouter } from 'next/router'
import Modal from 'react-modal'
import styles from '../../styles/video.module.css'

import { getYoutubeVideoById } from '../../lib/videos'

import cls from 'classnames'
import NavBar from '../../components/nav/navbar'
import Like from '../../components/icons/like-icon'
import DisLike from '../../components/icons/dislike-icon'
import { useState } from 'react'

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

	const handleToggleLike = () => {
		setToggleLike(!toggleLike)
		setToggleDislike(toggleLike)
	}

	const handleToggelDislike = () => {
		setToggleDislike(!toggleDislike)
		setToggleLike(toggleDislike)
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
					frameborder='0'
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
