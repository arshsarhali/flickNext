import styles from './card.module.css'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import cls from 'classnames'

const Card = (props) => {
	const {
		id,
		imgUrl = 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1479&q=80',
		size = 'medium',
	} = props
	const [imgSrc, setImgSrc] = useState(imgUrl)

	const handleOnError = () => {
		setImgSrc(
			'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1479&q=80'
		)
	}

	const classMap = {
		large: styles.lgItem,
		medium: styles.mdItem,
		small: styles.smItem,
	}

	const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 }
	return (
		<div className={styles.container}>
			<motion.div
				className={cls(classMap[size], styles.imgMotionWrapper)}
				whileHover={scale}
			>
				<Image
					src={imgSrc}
					alt='Image'
					layout='fill'
					className={styles.cardImg}
					onError={handleOnError}
				/>
			</motion.div>
		</div>
	)
}

export default Card
