import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Home.module.css'

import Banner from '../components/banner/banner'
import NabBar from '../components/nav/navbar'
import Card from '../components/card/card'
import SectionCard from '../components/card/section-cards'

export default function Home() {

  const peakyvideos =[
    {
    imgUrl:'/static/peaky_blinders.webp'
    },
    {
      imgUrl:'/static/peaky_blinders.webp'
      },
      {
        imgUrl:'/static/peaky_blinders.webp'
        },
        {
          imgUrl:'/static/peaky_blinders.webp'
          },
          {
            imgUrl:'/static/peaky_blinders.webp'
            },
            {
              imgUrl:'/static/peaky_blinders.webp'
              },
              {
                imgUrl:'/static/peaky_blinders.webp'
                },
  ]
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Netflix video streaming clone" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>

    <NabBar username='arsh@gmail.conm' />

     <Banner title='Peaky Blinders' subTitle='Season 4' imgUrl='/static/peaky_blinders.webp'/>

     <div className={styles.sectionWrapper}>
    <SectionCard title='section title' videos={peakyvideos} size='large' />
    <SectionCard title='section title' videos={peakyvideos} size='medium' />



    </div>
  
    </div>
  )
}
