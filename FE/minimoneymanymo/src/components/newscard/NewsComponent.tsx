import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import confetti from "canvas-confetti"
import Modal from "react-modal"
import { solveQuiz } from "@/api/news-api"
import { Card } from "@material-tailwind/react"
import Swal from "sweetalert2"
import { setMemberInfo } from "@/utils/user-utils"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/store/hooks"
import { selectParent } from "@/store/slice/parent"
import { selectChild } from "@/store/slice/child"
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

function firework(): void {
  const duration: number = 15 * 100 // 지속 시간
  const animationEnd: number = Date.now() + duration
  const defaults: {
    startVelocity: number
    spread: number
    ticks: number
    zIndex: number
  } = {
    startVelocity: 25,
    spread: 360,
    ticks: 50,
    zIndex: 0,
  }

  // min과 max 사이의 랜덤 숫자를 생성하는 함수
  function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft: number = animationEnd - Date.now()

    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }

    const particleCount: number = 50 * (timeLeft / duration)

    // 파티클이 아래로 떨어지므로 약간 높은 위치에서 시작
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    )

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    )
  }, 250)
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
  const [displayBonus, setDisplayBonus] = useState(0) // displayBonus 상태 추가
  const parent = useAppSelector(selectParent) // 부모 상태 선택
  const child = useAppSelector(selectChild) // 자식 상태 선택
  const navigate = useNavigate() // useNavigate 훅 사용
  const dispatch = useDispatch()

  const handleOpen = () => {
    if (child.userId) {
      console.log(child.userId)
      setOpen(!open)
    } else {
      if (parent.userId) {
        Swal.fire({
          icon: "warning",
          text: "자녀만 풀 수 있습니다",
        })
      } else {
        Swal.fire({
          icon: "warning",
          text: "로그인이 필요합니다",
        }).then(() => {
          navigate("/login")
        })
      }
    }
  }

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(parseInt(event.target.value)) // 선택된 옵션 번호 상태 업데이트
  }

  const handleSubmit = async () => {
    if (selectedOption !== null) {
      try {
        const response = await solveQuiz(selectedOption.toString(), id)
        handleOpen()
        console.log(response.data.result)
        if (response.data.result) {
          firework()

          const bonusMoney = response.data.bonusMoney
          Swal.fire({
            title: "정답입니다!",
            text: `+ ${bonusMoney.toLocaleString()}머니!`,
            icon: "success",
            confirmButtonText: "확인",
          }).then(() => {
            setMemberInfo(dispatch, 1)
            handleOpen()
            navigate("/newslist") // 정답일 경우 /news 페이지로 이동
          })
        } else {
          Swal.fire({
            title: "틀렸습니다!",
            icon: "error",
            confirmButtonText: "확인",
          }).then(() => {
            handleOpen()
            navigate("/newslist")
          })
        }
      } catch (error) {
        console.error("퀴즈 제출 중 오류 발생:", error)
        Swal.fire({
          title: "오류 발생",
          text: "퀴즈 제출에 실패했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        })
      }
    } else {
      Swal.fire({
        title: "옵션을 선택해 주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      })
    }
  }

  return (
    <>
      <Card className="mx-auto max-w-[800px] p-4">
        <div color="blue-gray" className="mb-3 text-3xl font-bold">
          {title}
        </div>
        <div color="gray" className="mb-4 ml-2 text-sm">
          {author} | {publisher} | {publishedDate}
        </div>

        <div
          className="content mb-4"
          dangerouslySetInnerHTML={{
            __html: content.replace(/<img/g, '<img class="mx-auto"'), // 이미지 가운데 정렬
          }}
        />
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleOpen}
            className={`rounded-xl bg-secondary-m2 px-4 py-2 text-white`} // child.id가 없으면 버튼을 회색으로 비활성화
          >
            퀴즈 풀기
          </button>
        </div>
      </Card>

      {/* Modal 사용 */}
      <Modal
        isOpen={open}
        onRequestClose={handleOpen}
        contentLabel="퀴즈! 경제 한입"
        style={{
          overlay: {
            position: "fixed",
            inset: "0 0 0 0",
            zIndex: 100,
            backgroundColor: "rgba(26, 26, 26, 0.75)",
            backdropFilter: `blur(2px)`,
          },
          content: {
            position: "absolute",
            top: "auto",
            left: "30%",
            right: "30%",
            bottom: "auto",
            // transform: "translate(-50%, -50%)",
            minWidth: 360, // for mobile
            background: "#fff",
            overflow: "auto",
            outline: "none",
            padding: 0,
            border: "none",
            borderRadius: 4,
            WebkitOverflowScrolling: "touch",
          },
        }}
        // className="relative mx-auto mt-10 max-w-md rounded-lg bg-white shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="p-6">
          <div className="mb-6 text-2xl font-bold">🔎 퀴즈! 경제 한입</div>
          <div className="m-2 mb-4 text-xl font-bold" color="blue-gray">
            {question}
          </div>

          <div className="mb-2 flex flex-col items-start gap-2 px-3">
            {parsedOptions.map((option: { text: string }, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="radio"
                  id={`option-${index + 1}`}
                  name="options"
                  value={index + 1}
                  onChange={handleOptionChange}
                  className="mr-2"
                />
                <label
                  htmlFor={`option-${index + 1}`}
                  className="text-gray-800"
                >
                  {option.text}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              className="ml-4 rounded-xl bg-secondary-m2 px-4 py-2 text-white"
            >
              제출하기
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default NewsComponent
