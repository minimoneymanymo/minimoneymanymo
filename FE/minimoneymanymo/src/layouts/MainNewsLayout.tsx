import * as React from "react"
import Box from "@mui/material/Box"
import NewsCard from "../components/newscard/NewsCard"
import { getTodayNews } from "@/api/news-api"
import { Typography } from "@material-tailwind/react"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick" // react-slick 라이브러리 추가
import "@/assets/css/slick.css"
import { useNavigate } from "react-router-dom" // useNavigate 사용
import TaskAltIcon from "@mui/icons-material/TaskAlt"
import CloseIcon from "@mui/icons-material/Close"
interface NewsItem {
  id: string
  image: string
  title: string
  content: string
  isQuizAnswered: string
}

const MainNewsLayout: React.FC = () => {
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  const navigate = useNavigate()

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getTodayNews()
        const formattedNews = data.map((item: any) => ({
          id: item.newsQuiz.id,
          image: item.newsQuiz.imageUrl,
          title: item.newsQuiz.title,
          content: item.newsQuiz.content,
          isQuizAnswered: item.isQuizAnswered,
        }))
        setNewsItems(formattedNews)
      } catch (error) {
        console.error("뉴스 데이터를 가져오는 데 실패했습니다.", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const handleSelectNews = (newsItem: NewsItem) => {
    navigate(`/news/${newsItem.id}`) // 뉴스의 id를 경로로 설정하여 이동
  }

  if (loading) {
    return <div>로딩 중...</div>
  }

  const settings = {
    className: "center",
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 4,
    speed: 700,
    arrows: true,
    initialSlide: 0,
  }

  return (
    <>
      <Typography variant="h5" color="blue-gray">
        오늘의 뉴스퀴즈
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative", // Box에 relative 추가
        }}
      >
        <Slider {...settings}>
          {newsItems.map((newsItem, index) => {
            // 상태에 따른 카드의 배경 스타일 및 아이콘 결정
            let cardOverlayStyle = ""
            let icon = null

            if (newsItem.isQuizAnswered == "0") {
              // 퀴즈를 풀었을 때: 초록 체크 아이콘
              icon = (
                <div
                  className="absolute right-7 top-2 flex items-center justify-center"
                  style={{
                    backgroundColor: "white", // 흰색 배경
                    borderRadius: "50%", // 둥글게 만들기
                    width: "30px", // 배경의 너비 (수정된 크기)
                    height: "30px", // 배경의 높이 (수정된 크기)
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // 그림자 추가 (선택 사항)
                  }}
                >
                  <TaskAltIcon
                    className="text-green-500"
                    style={{ fontSize: 20 }} // 아이콘 크기 조정
                  />
                </div>
              )
            } else if (newsItem.isQuizAnswered >= "1") {
              // 퀴즈를 틀렸을 때: 빨간 X 아이콘
              icon = (
                <div
                  className="absolute right-7 top-2 flex items-center justify-center"
                  style={{
                    backgroundColor: "white", // 흰색 배경
                    borderRadius: "50%", // 둥글게 만들기
                    width: "30px", // 배경의 너비 (수정된 크기)
                    height: "30px", // 배경의 높이 (수정된 크기)
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // 그림자 추가 (선택 사항)
                  }}
                >
                  <CloseIcon
                    className="text-red-500"
                    style={{ fontSize: 20 }} // 아이콘 크기 조정
                  />
                </div>
              )
            }

            return (
              <div
                key={index}
                className="relative px-5"
                onClick={() => handleSelectNews(newsItem)}
              >
                <NewsCard
                  image={newsItem.image}
                  title={newsItem.title}
                  content={newsItem.content}
                />
                {/* 상태에 따라 어둡게 처리된 오버레이 */}
                <div
                  className={`absolute inset-0 ${cardOverlayStyle}`}
                  style={{ zIndex: 1 }}
                ></div>
                {/* 상태에 따른 아이콘 */}
                {icon && <div style={{ zIndex: 2 }}>{icon}</div>}
              </div>
            )
          })}
        </Slider>
        {/* "더 보기" 텍스트 */}
        <Typography
          variant="body2"
          color="blue-gray"
          onClick={() => navigate("/newslist")} // 더 보기 클릭 시 이동할 경로
          sx={{
            position: "absolute",
            top: "10px",
            right: "0px",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "0.8rem",
          }}
        >
          더 보기
        </Typography>
      </Box>
    </>
  )
}

export default MainNewsLayout
