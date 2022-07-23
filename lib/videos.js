
export const getVideosData = async (url)=>{

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

    try{
        const BASE_URL = 'https://youtube.googleapis.com/youtube/v3'
    

    const response = await fetch(`${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}`)

    const data = await response.json()

    if(data?.error){
        console.error('Youtube API error', data.error)
        return[];
    }

    return data.items.map(item =>{
        const id = item.id?.videoId || item.id
        return(

        {
            title:item.snippet.title,
            imgUrl: item.snippet.thumbnails.high.url,
            id
    }
    )}
)
}catch(error){
    console.error('Something went wrong with API', error)
    return[];
}
}

export const getVideos = async (search) =>{

    const URL = `search?part=snippet&maxResults=25&q=${search}&type=video`

    return await getVideosData(URL)
}

export const getPopularVideos = async () =>{
    const URL = 'videos?part=snippet&chart=mostPopular&regionCode=US'

    return await getVideosData(URL)
}