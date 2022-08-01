import styles from './section-cards.module.css'
import Card from './card'
import Link from 'next/link'
import cls from 'classnames'

const SectionCard = (props) => {
	const { title, videos = [], size, shouldWrap = false } = props

	return (
		<section className={styles.container}>
			<h2 className={styles.title}>{title}</h2>
			<div className={cls(shouldWrap && styles.wrap, styles.cardWrapper)}>
				{videos.map((video, idx) => (
					<Link href={`/video/${video.id}`} key={video.id}>
						<a>
							<Card id={idx} imgUrl={video.imgUrl} size={size} />
						</a>
					</Link>
				))}
			</div>
		</section>
	)
}

export default SectionCard
