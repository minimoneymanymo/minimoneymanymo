import React from "react"
import { Card, Divider, CardBody, Typography } from "@material-tailwind/react"
import { formatDistanceToNow, parse, isValid } from "date-fns"
import { ko } from "date-fns/locale"
interface NewsItem {
  title: string
  originallink: string
  link: string
  description: string
  pubDate: string
}

interface CompanyNewsCardProps {
  news: NewsItem
}

const formatDate = (dateString: string) => {
  // "Mon, 07 Oct 2024 13:38:00 +0900" 형식으로 파싱
  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return dateString
  }
  const distance = formatDistanceToNow(date, { locale: ko, addSuffix: true }) // n시간 전 또는 n일 전 형식
  return `${distance}`
}

const CompanyNewsCard: React.FC<CompanyNewsCardProps> = ({ news }) => {
  return (
    <a
      href={news.link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full"
    >
      <Card className="mx-auto my-3 w-full cursor-pointer rounded-lg shadow-none">
        {" "}
        {/* 테두리 및 그림자 제거 */}
        <CardBody>
          <div
            className="mb-2 text-lg font-semibold"
            dangerouslySetInnerHTML={{ __html: news.title }}
          />
          <div
            className="mb-2 leading-tight text-gray-700"
            dangerouslySetInnerHTML={{ __html: news.description }}
          />
          <div className="text-sm text-gray-500">
            {formatDate(news.pubDate)}
          </div>
        </CardBody>
      </Card>
    </a>
  )
}
export default CompanyNewsCard
