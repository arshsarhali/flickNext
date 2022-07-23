import Head from 'next/head'

import styles from '../styles/Home.module.css'

import Banner from '../components/banner/banner'
import NabBar from '../components/nav/navbar'
import SectionCard from '../components/card/section-cards'
import { getVideos, getPopularVideos } from '../lib/videos'

export async function getServerSideProps(){

  const netflixVideos = await getVideos('netflix');
  const technologyVideos = await getVideos('technology');
  const trailerVideos = await getVideos('movie trailer');
  const popularVideos = await getPopularVideos();
  return {props:{netflixVideos , technologyVideos, trailerVideos , popularVideos}}
}

export default function Home({netflixVideos, technologyVideos, trailerVideos, popularVideos}) {
 

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Netflix video streaming clone" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>

<div className={styles.main}>
    <NabBar username='arsh@gmail.conm' />

     <Banner title='Peaky Blinders' subTitle='Season 4' imgUrl='/static/peaky_blinders.webp'/>

     <div className={styles.sectionWrapper}>
    <SectionCard title='New on Netflix' videos={netflixVideos} size='large' />
    <SectionCard title='Technology' videos={technologyVideos} size='small' />
    <SectionCard title='Trailer' videos={trailerVideos} size='medium' />
    <SectionCard title='Popular' videos={popularVideos} size='small' />

    </div>
    </div>
    </div>
  )
}
