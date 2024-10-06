import { useState } from "react"
import React from "react"
import { useNavigate } from "react-router-dom"
import { solveQuiz } from "@/api/news-api"
import {
  Button,
  Typography,
  Card,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react"
interface NewsModalProps {
  id: string
  title: string
  content: string
  publisher: string
  publishedDate: string
  author: string
  question: string
  options: string
}

const NewsComponent: React.FC<NewsModalProps> = ({
  id,
  title,
  content,
  publisher,
  publishedDate,
  author,
  question,
  options,
}) => {
  const [open, setOpen] = useState(false) // 모달 상태 관리
  const parsedOptions = JSON.parse(options) // JSON 문자열을 객체로 변환
  const [selectedOption, setSelectedOption] = useState<number | null>(null) // 선택된 옵션 번호 상태 관리
  const navigate = useNavigate() // useNavigate 훅 사용

  const handleOpen = () => setOpen(!open) // 모달 여닫기 함수

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(parseInt(event.target.value)) // 선택된 옵션 번호 상태 업데이트
  }

  const handleSubmit = async () => {
    if (selectedOption !== null) {
      try {
        const response = await solveQuiz(selectedOption.toString(), id)

        if (response) {
          alert("정답입니다!") // 정답일 경우
        } else {
          alert("틀렸습니다. 다시 시도해보세요.") // 오답일 경우
        }

        handleOpen()
        navigate("/news")
      } catch (error) {
        console.error("퀴즈 제출 중 오류 발생:", error)
        alert("퀴즈 제출에 실패했습니다.")
      }
    } else {
      alert("옵션을 선택해 주세요.")
    }
  }

  return (
    <>
      <Card className="mx-auto max-w-[800px] p-4">
        <Typography variant="h3" color="blue-gray" className="mb-2 font-bold">
          {title}
        </Typography>
        <Typography variant="small" color="gray" className="mb-4 ml-2 text-sm">
          {author} | {publisher} | {publishedDate}
        </Typography>

        <div
          className="content mb-4"
          dangerouslySetInnerHTML={{
            __html: content.replace(/<img/g, '<img class="mx-auto"'), // 이미지 가운데 정렬
          }}
        />
        <div className="mt-4">
          <Button color="blue" onClick={handleOpen}>
            퀴즈 풀기
          </Button>
        </div>
      </Card>

      {/* 모달 */}
      <Dialog open={open} handler={handleOpen} size="md">
        <DialogHeader>퀴즈! 경제한입</DialogHeader>
        <DialogBody divider>
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-4 text-center"
          >
            질문: {question}
          </Typography>
          {parsedOptions.map((option: { text: string }, index: number) => (
            <div key={index} className="mb-2 flex items-center">
              <input
                type="radio"
                id={`option-${index + 1}`} // 1부터 시작하도록 조정
                name="options"
                value={index + 1} // 선택된 번호를 value로 설정
                onChange={handleOptionChange}
                className="mr-2"
              />
              <label htmlFor={`option-${index + 1}`} className="text-gray-800">
                {option.text}
              </label>
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button color="green" onClick={handleSubmit}>
            제출하기
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default NewsComponent
