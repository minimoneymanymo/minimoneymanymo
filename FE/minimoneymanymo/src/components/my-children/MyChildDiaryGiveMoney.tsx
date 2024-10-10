import React, { useState, useEffect } from "react"
import { MyChildDiary } from "@/components/my-children/types"
import { putReasonBonusMoney } from "@/api/stock-api" // 수정된 API 호출 함수 가져오기
import { useChild } from "../context/ChildContext"
import { useNavigate } from "react-router-dom" // react-router-dom을 사용하여 navigate 기능 추가
import { useAppSelector } from "@/store/hooks"
import { selectParent } from "@/store/slice/parent"
import { alertBasic} from "@/utils/alert-util"

// diary prop 타입 정의
interface MyChildDiaryGiveMoneyProps {
  diary: MyChildDiary
}

const MyChildDiaryGiveMoney: React.FC<MyChildDiaryGiveMoneyProps> = ({
  diary,
}) => {
  const [bonusMoney, setBonusMoney] = useState<string>("") // 입력된 보너스 머니 상태
  const [message, setMessage] = useState<string>("") // 처리 결과 메시지 상태
  const { child, fetchChild } = useChild()
  const [transactionCompleted, setTransactionCompleted] =
    useState<boolean>(false) // 거래 완료 상태 추가
  const navigate = useNavigate() // navigate 훅 사용
  const parent = useAppSelector(selectParent)
  // tradeType 표시 변환
  const tradeTypeDisplay =
    diary.tradeType === "4" ? "매수" : diary.tradeType === "5" ? "매도" : ""

  const formatDate = (dateString: string) => {
    const year = dateString.substring(0, 4) // 2024
    const month = dateString.substring(4, 6) // 06
    const day = dateString.substring(6, 8) // 28
    const hours = dateString.substring(8, 10) // 14
    const minutes = dateString.substring(10, 12) // 11

    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일 ${hours}:${minutes}`
  }

  useEffect(() => {
    if (diary.reasonBonusMoney !== null) {
      setMessage("보너스 머니가 지급되었습니다.") // 초기 메시지 설정
    }
  }, [diary, diary.reasonBonusMoney]) // diary가 변경될 때마다 출력

  // 보너스 머니 전송 함수
  const handleSendBonusMoney = async () => {
    // child가 null인지 확인
    if (!child) {
      console.error("child 정보가 없습니다.")
      return
    }

    // 보너스 머니가 입력되지 않은 경우 경고 창 표시
    if (bonusMoney.trim() === "") {
      alertBasic("gold-pig.svg", "지급 머니가 빈칸입니다. 지급 머니를 입력해주세요.")
      return
    }

    const reasonBonusMoneyRequest = {
      childrenUserId: child.userId, // childrenId를 적절하게 사용
      createdAt: diary.createdAt, // createdAt 값을 전달
      reasonBonusMoney: Number(bonusMoney), // 입력된 보너스 머니를 숫자로 변환
    }

    try {
      const response = await putReasonBonusMoney(reasonBonusMoneyRequest) // API 호출
      if (response.stateCode === 201) {
        setMessage("보너스 머니가 성공적으로 지급되었습니다.")
        setBonusMoney("") // 보너스 머니 입력 칸 비우기
        setTransactionCompleted(true)
        fetchChild() // 자녀 정보 업데이트
      } else {
        setMessage("보너스 머니 지급에 실패하였습니다.")
      }
    } catch (error) {
      console.error("API 호출 오류:", error)
      setMessage("보너스 머니 지급 중 오류가 발생하였습니다.")
    }
  }

  return (
    <div className="p-4">
      <p className="text-lg">
        {tradeTypeDisplay} <br />
      </p>
      <p
        className={`text-xl font-bold ${tradeTypeDisplay === "매수" ? "text-buy" : "text-sell"}`}
      >
        {tradeTypeDisplay === "매수" ? "+" : "-"}
        {diary.amount.toLocaleString()} 머니
      </p>
      <p className="p-2"></p>
      <div className="flex w-full justify-between text-gray-500">
        <p>거래 유형 </p>
        <p>
          {diary.companyName} {tradeTypeDisplay}
        </p>
      </div>
      <div className="flex w-full justify-between text-gray-500">
        <p>일시</p>
        <p>{formatDate(diary.createdAt)}</p>
      </div>
      <br />
      <p className="text-gray-500">
        이유
        <br />
      </p>
      <p className="p-2">{diary.reason}</p>
      <br />
      {/* 머니 지급 칸 출력 */}
      {/* 머니 지급 칸 출력 */}
      {/* 머니 지급 칸 출력 */}
      {!transactionCompleted &&
        diary.reasonBonusMoney === null && ( // 거래가 완료되지 않았고 reasonBonusMoney가 null인 경우에만 표시
          <div className="flex flex-col items-center">
            <input
              type="tel"
              className="w-30 w-fit rounded-lg bg-gray-300 p-2 text-center text-white placeholder-white" // 클래스 적용
              value={
                Number(bonusMoney) === 0
                  ? ""
                  : Number(bonusMoney).toLocaleString()
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "") // 숫자 이외의 값 제거
                if (Number(onlyNumbers) <= parent.balance!) {
                  setBonusMoney(onlyNumbers)
                } else {
                  setBonusMoney(parent.balance.toString()!)
                  e.preventDefault()
                }
              }}
              onKeyDown={(e) => {
                if (
                  !/^[0-9]$/.test(e.key) && // 숫자키가 아닌 경우
                  e.key !== "Backspace" && // 백스페이스 허용
                  e.key !== "ArrowLeft" && // 왼쪽 화살표 허용
                  e.key !== "ArrowRight" // 오른쪽 화살표 허용
                ) {
                  e.preventDefault() // 그 외의 입력을 막음
                }
              }}
              placeholder="지급 머니를 입력해주세요"
            />
            {/* 버튼 클릭 시 API 호출 */}
            <p className="p-1"></p>
            <button
              className="w-20 rounded-lg bg-secondary-600-m2 p-2 text-center text-white"
              onClick={handleSendBonusMoney}
            >
              지급
            </button>{" "}
          </div>
        )}
      {(transactionCompleted || diary.reasonBonusMoney !== null) && ( // 거래가 완료되었거나 reasonBonusMoney가 null이 아닐 때만 메시지 표시
        <p className="p-2 text-center font-bold text-secondary-m2">{message}</p>
      )}{" "}
    </div>
  )
}

export default MyChildDiaryGiveMoney
