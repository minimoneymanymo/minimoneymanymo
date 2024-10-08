import React, { useState, useEffect } from "react"
import { MyChildDiary } from "@/components/my-children/types"
import { putReasonBonusMoney } from "@/api/stock-api" // 수정된 API 호출 함수 가져오기
import { useChild } from "../context/ChildContext"
import { useNavigate } from "react-router-dom" // react-router-dom을 사용하여 navigate 기능 추가
import Swal from "sweetalert2"
// diary prop 타입 정의
interface MyChildDiaryGiveMoneyProps {
  diary: MyChildDiary
}

const MyChildDiaryGiveMoney: React.FC<MyChildDiaryGiveMoneyProps> = ({
  diary,
}) => {
  const [bonusMoney, setBonusMoney] = useState<string>("") // 입력된 보너스 머니 상태
  const [message, setMessage] = useState<string>("") // 처리 결과 메시지 상태
  const { child } = useChild()
  const [transactionCompleted, setTransactionCompleted] =
    useState<boolean>(false) // 거래 완료 상태 추가
  const navigate = useNavigate() // navigate 훅 사용

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

  // diary 내용 콘솔 출력
  useEffect(() => {
    console.log(diary)
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
      //alert("보너스 머니를 지급하세요.")
      Swal.fire({
        title: "보너스 머니를 지급하세요.",
        icon: "warning",
      })
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

        // 3초 후에 현재 페이지 새로 고침
        setTimeout(() => {
          navigate(0)
        }, 2000) // 3000ms = 3초
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
              type="text"
              value={bonusMoney}
              onChange={(e) => setBonusMoney(e.target.value)} // 입력값 상태 업데이트
              placeholder="지급 머니를 입력해주세요" // 플레이스홀더 텍스트
              className="w-30 w-fit rounded-lg bg-gray-300 p-2 text-center text-white placeholder-white" // 클래스 적용
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
        <p className="p-2 text-center text-sm font-bold text-secondary-m2">
          {message}
        </p>
      )}{" "}
      {/* 처리 결과 메시지 표시 */}
    </div>
  )
}

export default MyChildDiaryGiveMoney
