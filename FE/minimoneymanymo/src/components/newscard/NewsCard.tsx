import * as React from "react"
import { Card, CardHeader, Typography } from "@material-tailwind/react"

// Props의 타입 정의
interface NewsCardProps {
  image: string
  title: string
  content: string
}

const NewsCard: React.FC<NewsCardProps> = ({ image, title }) => {
  return (
    <Card className={`mx-auto max-w-[300px] overflow-hidden`}>
      {/* 너비를 조정 */}
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="relative m-0 rounded-none"
      >
        <img
          src={image}
          alt="card-image"
          className={`h-40 w-full object-cover transition-transform duration-300`} // 스케일 효과 추가
        />
        <Typography
          variant="h6"
          color="white"
          className="absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-4"
        >
          {title}
        </Typography>
      </CardHeader>
    </Card>
  )
}

export default NewsCard
