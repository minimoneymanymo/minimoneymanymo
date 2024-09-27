import React from "react"
import { MyChildDiary } from "@/components/my-children/types"

// diary prop 타입 정의
interface MyChildDiaryGiveMoneyProps {
  diary: MyChildDiary
}

const MyChildDiaryGiveMoney: React.FC<MyChildDiaryGiveMoneyProps> = ({
  diary,
}) => {
  return (
    <div>
      <p>MyChildDiaryGiveMoney 페이지 입니다. </p>
      <h2>상세 정보</h2>
      <p>회사명: {diary.companyName}</p>
      <p>금액: {diary.amount}원</p>
      <p>거래 수량: {diary.tradeSharesCount}</p>
      <p>이유: {diary.reason}</p>
      <p>잔액: {diary.remainAmount}원</p>
      {/* 추가적인 정보 표시 */}
    </div>
  )
}

export default MyChildDiaryGiveMoney
