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
    console.log(dateString)
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, "0") // 월 가져오기 (01~12)
    const day = String(date.getDate()).padStart(2, "0") // 일 가져오기 (01~31)
    return `${month}월 ${day}일` // "월"과 "일"을 포함한 문자열 반환
  }

  const formatCreatedAt = (dateString: string): string => {
    console.log(dateString)
    const dateParts = dateString.split("-")
    const year = dateParts[0] // 년
    const month = dateParts[1] // 월
    const day = dateParts[2] // 일
    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일` // 포맷팅
  }

  const formattedDate = formatDate(selectedDate)

  return (
    <div className="flex flex-col">
      <h2 className="mb-1 text-center text-3xl font-bold">
        {formattedDate}{" "}
        <span className="text-xl font-bold" style={{ fontSize: "0.8rem" }}>
          {" "}
          {/* "월", "일"의 글자 크기 조정 */}의
        </span>{" "}
        <span className="text-xl">나의 투자</span>
      </h2>{" "}
      <br />
      {/* 날짜와 나의 투자 문구를 한 줄에 출력 */}
      <div className="flex justify-between">
        <div className="col-span-1 w-1/2 pr-4">
          <div className="flex justify-between text-sm">
            <h3 className="pb-2 text-base font-bold">머니 변동 내역</h3>
            <div className="flex space-x-3">
              <p className="text-buy">
                +
                {filteredEvents
                  .reduce((acc, event) => {
                    return event.tradeType === "4" ? acc + event.amount : acc // 매수는 더하기
                  }, 0)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                머니
              </p>
              <p className="text-sell">
                -
                {filteredEvents
                  .reduce((acc, event) => {
                    return event.tradeType === "5" ? acc + event.amount : acc // 매도는 더하기
                  }, 0)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                머니
              </p>
            </div>
          </div>
          <ul className="hidden-scrollbar h-[320px] overflow-y-auto bg-gray-50 p-1 px-0.5">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => {
                console.log(event) // event 값 출력
                const isSellType = event.tradeType === "5" // tradeType이 5인지 확인

                return (
                  <li
                    key={index}
                    className="mb-2 h-fit min-h-[65px] rounded-lg bg-white px-4 py-2 shadow-md" // 흰색 배경, radius 15, 여백 추가
                  >
                    <div className="flex h-full justify-between">
                      <div className="flex h-full flex-col space-y-2">
                        <span>{event.companyName}</span>
                        <span className="text-sm text-gray-500">
                          {event.createdTime} | {isSellType ? "매수" : "매도"}
                        </span>
                      </div>
                      <div className="flex h-full flex-col items-end space-y-1">
                        <span
                          className={`${isSellType ? "text-buy" : "text-sell"} font-bold`}
                        >
                          {isSellType
                            ? `+${event.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                            : `-${event.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}{" "}
                          머니 {/* 기호 추가 */}
                        </span>
                        <span className="space-y-1 text-xs text-gray-500">
                          {event.tradeSharesCount} 주
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between"></div>
                  </li>
                )
              })
            ) : (
              <li className="mb-2 rounded-lg bg-white p-4 shadow-md">
                No events
              </li>
            )}
          </ul>
        </div>
        {/* 투자 기록 출력 */}
        {/* 투자 기록 출력 */}
        {/* 투자 기록 출력 */}
        <div className="col-span-1 w-1/2">
          <h3 className="text-base font-bold">투자 기록</h3>
          <h1 className="pb-2 text-sm">
            이 종목을 선택한 이유가 무엇인지 기억나나요?
            <br />그 때의 생각을 다시 떠올려봐요
          </h1>
          <ul className="custom-scrollbar h-[280px] overflow-y-auto bg-gray-100 py-1">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => {
                console.log(event) // event 값 출력
                const isSellType = event.tradeType === "5" // tradeType이 5인지 확인
                const isBuyType = event.tradeType === "4" // tradeType이 4인지 확인
                return (
                  <li
                    key={index}
                    className="mb-2 rounded-lg bg-white p-4 shadow-md" // 흰 배경, radius, 여백 추가
                  >
                    <div className="">
                      {(isSellType || isBuyType) && (
                        <div className="mb-0.5 flex justify-between text-xs text-gray-500">
                          <div className="ml-2 mt-1 flex justify-between">
                            <p className="">거래유형</p>
                            <p
                              className={`${isSellType ? "text-buy" : "text-sell"} ml-2`}
                            >
                              {isSellType ? "매수" : "매도"}
                            </p>
                          </div>
                          <div className="mr-2 mt-1">
                            <p>
                              일시 {formatCreatedAt(event.createdAt)}{" "}
                              {event.createdTime}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="m-2 mt-0.5 flex justify-between">
                      <strong className="text-xl">{event.companyName}</strong>
                      <strong className="text-xl">
                        {event.tradeSharesCount} 주
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <div className="ml-2 mr-2 flex flex-1 justify-between text-sm">
                        <p>거래 머니</p>
                        <p className="text-right">
                          {event.amount
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          머니
                        </p>
                      </div>
                      <div className="ml-2 mr-2 flex flex-1 justify-between text-sm">
                        <p className="text-black">손익 머니</p>
                        <p
                          className={`text-right ${
                            event.stockTradingGain !== null &&
                            event.stockTradingGain !== undefined
                              ? event.stockTradingGain > 0
                                ? "text-buy" // 양수일 때 색상
                                : event.stockTradingGain < 0
                                  ? "text-sell" // 음수일 때 색상
                                  : "text-black" // 0일 때 색상
                              : "text-black" // null 또는 undefined일 때 기본 검정색
                          }`}
                        >
                          {event.stockTradingGain !== null &&
                          event.stockTradingGain !== undefined
                            ? event.stockTradingGain
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : "0"}{" "}
                          머니
                        </p>
                      </div>
                    </div>
                    <div className="h-min-[80px] m-2 rounded-lg bg-primary-50 p-3 text-start text-base">
                      {event.reason}
                    </div>
                  </li>
                )
              })
            ) : (
              <li className="mb-2 rounded-lg bg-white p-4 shadow-md">
                No events
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MyInvestment
