import React, { useState } from "react"
import { MyChildDiary } from "@/components/my-children/types"
import { putReasonBonusMoney } from "@/api/stock-api" // 수정된 API 호출 함수 가져오기
import { useChild } from "../context/ChildContext"

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

  // tradeType 표시 변환
  const tradeTypeDisplay =
    diary.tradeType === "4" ? "매수" : diary.tradeType === "5" ? "매도" : ""

  // 보너스 머니 전송 함수
  const handleSendBonusMoney = async () => {
    // child가 null인지 확인
    if (!child) {
      console.error("child 정보가 없습니다.")
      return
    }

    // 보너스 머니가 입력되지 않은 경우 경고 창 표시
    if (bonusMoney.trim() === "") {
      alert("보너스 머니를 지급하세요.")
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
      } else {
        setMessage("보너스 머니 지급에 실패하였습니다.")
      }
    } catch (error) {
      console.error("API 호출 오류:", error)
      setMessage("보너스 머니 지급 중 오류가 발생하였습니다.")
    }
  }

  return (
    <div>
      <p>
        {diary.companyName} {tradeTypeDisplay} <br />
      </p>
      <p>{diary.amount}원</p>
      <p>일시 : {diary.createdAt}</p>
      <p>
        이유
        <br /> {diary.reason}
      </p>
      {!transactionCompleted &&
        diary.reasonBonusMoney === null && ( // 거래가 완료되지 않았고 reasonBonusMoney가 null인 경우에만 표시
          <div>
            <label>
              이유 머니 입력:
              <input
                type="text"
                value={bonusMoney}
                onChange={(e) => setBonusMoney(e.target.value)} // 입력값 상태 업데이트
              />
            </label>
            <button onClick={handleSendBonusMoney}>이유 머니 지급하기</button>{" "}
            {/* 버튼 클릭 시 API 호출 */}
          </div>
        )}
      {message && <p>{message}</p>} {/* 처리 결과 메시지 표시 */}
    </div>
  )
}

export default MyChildDiaryGiveMoney
