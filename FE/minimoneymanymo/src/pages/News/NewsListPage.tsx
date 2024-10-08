import React, { useEffect, useState } from "react"
import NewsCard from "@/components/newscard/NewsCard" // NewsComponent로 변경
import { getNewsQuizzes } from "@/api/news-api" // 뉴스 퀴즈 API 호출 함수
import { Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom" // useNavigate 사용
import TaskAltIcon from "@mui/icons-material/TaskAlt"
import CloseIcon from "@mui/icons-material/Close"

const NewsListPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]) // 뉴스 아이템 상태
  const [loading, setLoading] = useState<boolean>(false) // 로딩 상태
  const [page, setPage] = useState<number>(0) // 현재 페이지 번호
  const [hasMore, setHasMore] = useState<boolean>(true) // 더 많은 뉴스가 있는지 여부
  const navigate = useNavigate()

  interface NewsItem {
    id: string
    image: string
    title: string
    content: string
    isQuizAnswered: string
  }

  const fetchNews = async () => {
    if (loading || !hasMore) return // 로딩 중이거나 더 이상 뉴스가 없으면 종료

    setLoading(true)
    try {
      const response = await getNewsQuizzes(page) // 페이지에 해당하는 뉴스 퀴즈 가져오기
      console.log(response)
      if (response.length == 0 || response == null) {
        setHasMore(false)
      } else {
        const formattedNews = response.map((item: any) => ({
          id: item.newsQuiz.id,
          image: item.newsQuiz.imageUrl,
          title: item.newsQuiz.title,
          content: item.newsQuiz.content,
          isQuizAnswered: item.isQuizAnswered,
        }))

        setNewsItems((prev) => [...prev, ...formattedNews]) // 이전 뉴스 아이템에 추가
        setHasMore(response.data.length > 0) // 더 많은 뉴스가 있는지 확인
      }
    } catch (error) {
      console.error("뉴스 데이터를 가져오는 데 실패했습니다.", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews() // 컴포넌트가 처음 마운트될 때 뉴스 데이터를 가져옴
  }, [page]) // 페이지가 변경될 때마다 데이터 재요청

  useEffect(() => {
    const handleScroll = () => {
      // 페이지 스크롤 이벤트 핸들러
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        setPage((prev) => prev + 1) // 페이지 증가
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll) // 컴포넌트 언마운트 시 이벤트 핸들러 제거
  }, [])

  const handleSelectNews = (newsItem: NewsItem) => {
    navigate(`/news/${newsItem.id}`) // 뉴스의 id를 경로로 설정하여 이동
  }

  return (
    <div className="w-full">
      <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: 2 }}>
        <div className="mb-2 text-2xl font-bold" color="blue-gray">
          뉴스 퀴즈 목록
        </div>
        <div className="mb-8">
          최신 뉴스 정보를 얻고, 퀴즈에 도전하여 보상 머니를 획득하세요! <br />
          지식을 쌓는 즐거움을 느낄 수 있을 거예요!
        </div>

        <div className="flex flex-wrap">
          {newsItems.map((newsItem, index) => {
            let icon = null

            // 퀴즈를 풀었을 때: 초록 체크 아이콘
            if (newsItem.isQuizAnswered == "0") {
              icon = (
                <div
                  className="absolute right-10 top-3 flex items-center justify-center"
                  style={{
                    backgroundColor: "white", // 흰색 배경
                    borderRadius: "50%", // 둥글게 만들기
                    width: "30px", // 배경의 너비 (수정된 크기)
                    height: "30px", // 배경의 높이 (수정된 크기)
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)", // 그림자 추가 (선택 사항)
                    zIndex: 2, // 아이콘이 다른 요소 위에 렌더링되도록 설정
                  }}
                >
                  <TaskAltIcon
                    className="text-green-500"
                    style={{ fontSize: 20 }} // 아이콘 크기 조정
                  />
                </div>
              )
            }
            // 퀴즈를 틀렸을 때: 빨간 X 아이콘
            else if (newsItem.isQuizAnswered == "1") {
              icon = (
                <div
                  className="absolute right-10 top-3 flex items-center justify-center"
                  style={{
                    backgroundColor: "white", // 흰색 배경
                    borderRadius: "50%", // 둥글게 만들기
                    width: "30px", // 배경의 너비 (수정된 크기)
                    height: "30px", // 배경의 높이 (수정된 크기)
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)", // 그림자 추가 (선택 사항)
                    zIndex: 2, // 아이콘이 다른 요소 위에 렌더링되도록 설정
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
                className="relative w-full p-2 sm:w-1/2 lg:w-1/3" // 부모 요소에 relative 추가
                onClick={() => handleSelectNews(newsItem)}
              >
                <NewsCard
                  image={newsItem.image}
                  title={newsItem.title}
                  content={newsItem.content}
                />
                {/* 상태에 따른 아이콘 */}
                {icon && <div style={{ zIndex: 2 }}>{icon}</div>}
              </div>
            )
          })}
        </div>
        {loading && <div>로딩 중...</div>}
      </Box>
    </div>
  )
}

export default NewsListPage
