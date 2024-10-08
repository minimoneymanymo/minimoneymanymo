import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react"
import { searchCompany } from "@/api/news-api"
import CompanyNewsCard from "./CompanyNewsCard"
import React from "react"
interface Naver {
  companyName: string | undefined
}

interface NewsItem {
  title: string
  originallink: string
  link: string
  description: string
  pubDate: string
}

interface NewsResponse {
  lastBuildDate: string
  total: number
  start: number
  display: number
  items: NewsItem[]
}

const NaverNews: React.FC<Naver> = ({ companyName }) => {
  const [news, setNews] = useState<NewsItem[]>([]) // 뉴스 데이터 상태 관리
  const [loading, setLoading] = useState<boolean>(false) // 로딩 상태
  const [error, setError] = useState<string | null>(null) // 에러 상태 관리

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)

      try {
        if (companyName !== undefined) {
          const response = await searchCompany(companyName) // 회사 이름으로 뉴스 검색

          // 응답을 JSON으로 변환
          const newsResponse: NewsResponse = JSON.parse(response.data) // 응답이 string이라서 파싱 필요

          setNews(newsResponse.items) // 뉴스 데이터 설정
        }
      } catch (e: any) {
        console.log(e)
        setError("뉴스를 불러오는 중 오류가 발생했습니다.") // 에러 처리
      } finally {
        setLoading(false) // 로딩 종료
      }
    }
    fetchNews() // 컴포넌트가 마운트될 때 뉴스 요청
  }, [companyName]) // companyName이 변경될 때마다 다시 요청

  if (loading) {
    return (
      <div className="z-10 h-full min-h-[500px] w-full overflow-y-auto rounded-md border bg-white scrollbar-hide">
        로딩 중...
      </div>
    )
  }

  if (error) {
    return (
      <div className="z-10 h-full min-h-[500px] w-full overflow-y-auto rounded-md border bg-white scrollbar-hide">
        {error}
      </div>
    )
  }

  return (
    <div className="z-10 h-full min-h-[500px] w-full overflow-y-auto rounded-md border bg-white scrollbar-hide">
      {/* 높이를 제한하고 스크롤 추가 */}
      {news.map((newsItem, index) => (
        <React.Fragment key={index}>
          <CompanyNewsCard news={newsItem} />
          {index < news.length - 1 && (
            <div className="mx-auto w-[750px] border-t border-gray-300" /> // 선 너비를 조절
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default NaverNews
