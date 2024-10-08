import NewsComponent from "@/components/newscard/NewsComponent"
import { useParams } from "react-router-dom"
import { getNewsDetail } from "@/api/news-api"
import { useEffect, useState } from "react"
interface NewsData {
  id: string
  title: string
  contentHtml: string
  publisher: string
  publishedDate: string
  author: string
  question: string
  options: string
  isQuizAnswered: string
}

function NewsDetail(): JSX.Element {
  const { newsId } = useParams() // URL에서 newsId 추출
  const [newsData, setNewsData] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (newsId) {
      setLoading(true)
      getNewsDetail(newsId)
        .then((data) => {
          setNewsData(data[0].newsQuiz) // API에서 가져온 데이터를 상태로 설정
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching news details:", error)
          setError(true)
          setLoading(false)
        })
    }
  }, [newsId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !newsData) {
    return <div>Error loading news details</div>
  }

  return (
    <div className="w-full">
      <div className="mx-auto flex min-h-screen w-fit items-center justify-center">
        {/* NewsComponent에 API에서 받은 데이터를 prop으로 전달 */}
        <NewsComponent
          id={newsData.id}
          title={newsData.title}
          content={newsData.contentHtml}
          publisher={newsData.publisher}
          publishedDate={newsData.publishedDate}
          author={newsData.author}
          question={newsData.question}
          options={newsData.options} // JSON 문자열로 받은 options
        />
      </div>
    </div>
  )
}

export default NewsDetail
