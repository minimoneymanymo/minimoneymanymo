import React, { useState } from "react"
import { MyChildDiary } from "@/components/my-children/types"
import { putReasonBonusMoney } from "@/api/stock-api" // 수정된 API 호출 함수 가져오기

// diary prop 타입 정의
interface MyChildDiaryGiveMoneyProps {
  diary: MyChildDiary
}

const MyChildDiaryGiveMoney: React.FC<MyChildDiaryGiveMoneyProps> = ({
  diary,
}) => {
  const [bonusMoney, setBonusMoney] = useState<string>("") // 입력된 보너스 머니 상태
  const [message, setMessage] = useState<string>("") // 처리 결과 메시지 상태

  // tradeType 표시 변환
  const tradeTypeDisplay =
    diary.tradeType === "4" ? "매수" : diary.tradeType === "5" ? "매도" : ""

  // 보너스 머니 전송 함수
  const handleSendBonusMoney = async () => {
    const reasonBonusMoneyRequest = {
      childrenUserId: Number(diary.childrenId), // childrenId를 적절하게 사용
      createAt: diary.createdAt, // createdAt 값을 전달
      reasonBonusMoney: Number(bonusMoney), // 입력된 보너스 머니를 숫자로 변환
    }

    try {
      const response = await putReasonBonusMoney(reasonBonusMoneyRequest) // API 호출
      if (response.stateCode === 200) {
        setMessage("보너스 머니가 성공적으로 지급되었습니다.")
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
      <p>MyChildDiaryGiveMoney 페이지 입니다. </p>
      <h2>상세 정보</h2>
      <p>거래 유형: {tradeTypeDisplay}</p>
      <p>회사명: {diary.companyName}</p>
      <p>금액: {diary.amount}원</p>
      <p>거래 수량: {diary.tradeSharesCount}</p>
      <p>이유: {diary.reason}</p>
      <p>잔액: {diary.remainAmount}원</p>
      {diary.reasonBonusMoney === null && (
        <div>
          <label>
            보너스 머니 입력:
            <input
              type="text"
              value={bonusMoney}
              onChange={(e) => setBonusMoney(e.target.value)} // 입력값 상태 업데이트
            />
          </label>
          <button onClick={handleSendBonusMoney}>보너스 머니 지급</button>{" "}
          {/* 버튼 클릭 시 API 호출 */}
        </div>
      )}
      {message && <p>{message}</p>} {/* 처리 결과 메시지 표시 */}
    </div>
  )
}

export default MyChildDiaryGiveMoney
