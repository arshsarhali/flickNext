import styles from './section-cards.module.css'
import Card from './card'

const SectionCard = (props)=>{
    const {title, videos =[], size, id} = props

    return(
        <section className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.cardWrapper}>

        {videos.map((video, idx) => (
        <Card id={idx}  imgUrl={video.imgUrl} size={size} key={id} />
        )
        )}
   
        </div>

        </section>
    )
}

export default SectionCard