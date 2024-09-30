import React from "react"
import { investmentData } from "./investmentData.ts"

interface MyInvestmentProps {
  filteredEvents: investmentData[]
  selectedDate: string // 날짜를 props로 추가
}

const MyInvestment: React.FC<MyInvestmentProps> = ({
  filteredEvents,
  selectedDate,
}) => {
  // 날짜 포맷 변환: YYYY-MM-DD 형식에서 "MM월 DD일" 형식으로 변환
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, "0") // 월 가져오기 (01~12)
    const day = String(date.getDate()).padStart(2, "0") // 일 가져오기 (01~31)
    return `${month}월 ${day}일` // "월"과 "일"을 포함한 문자열 반환
  }

  const formattedDate = formatDate(selectedDate)

  return (
    <div className="flex flex-col">
      <h2 className="mb-1 text-center text-2xl font-bold">
        {formattedDate}{" "}
        <span className="text-lg font-bold" style={{ fontSize: "0.8rem" }}>
          {" "}
          {/* "월", "일"의 글자 크기 조정 */}의
        </span>{" "}
        <span className="text-lg">나의 투자</span>
      </h2>{" "}
      {/* 날짜와 나의 투자 문구를 한 줄에 출력 */}
      <div className="flex justify-between">
        <div className="col-span-1 w-1/2">
          <h3 className="font-bold">머니 변동 내역</h3>
          <ul>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => {
                console.log(event) // event 값 출력
                return (
                  <li key={index}>
                    {event.companyName} ({event.stockTradingGain} ,{" "}
                    {event.amount})
                  </li>
                )
              })
            ) : (
              <li>No events</li>
            )}
          </ul>
        </div>
        <div className="col-span-1 w-1/2">
          <h3 className="font-bold">투자 기록</h3>
          <h1 className="text-sm">
            이 종목을 선택한 이유가 무엇인지 기억나나요? 그 때의 생각을 다시
            떠올려봐요
          </h1>
          <ul>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => {
                console.log(event) // event 값 출력
                return (
                  <li key={index}>
                    {event.tradeType} ({event.reason})
                  </li>
                )
              })
            ) : (
              <li>No events</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MyInvestment
