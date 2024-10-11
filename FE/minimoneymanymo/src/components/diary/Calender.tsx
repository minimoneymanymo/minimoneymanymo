import React, { useEffect, useRef, useState } from "react"
import moment from "moment"
import MyInvestment from "./MyInvestment"
import { getTradeList } from "@/api/investment-api"
import { investmentData } from "./investmentData" // 인터페이스로 가져옴
import ArrowPrev from "@mui/icons-material/ArrowBackIos"
import ArrowNext from "@mui/icons-material/ArrowForwardIos"

// 배경 색상 설정
const getBackgroundColor = (tradeType: string) => {
  switch (tradeType) {
    case "4":
      return "bg-red-100 text-red-600" // type 4: 빨간색 매수
    case "5":
      return "bg-blue-100 text-blue-600" // type 5: 파란색 매도
    case "0":
      return "bg-yellow-100" // type 0: 용돈
    case "1":
      return "bg-gray-100" // type 1: 출금
    case "2":
      return "bg-orange-100" // type 2: 퀴즈
    case "3":
      return "bg-green-100" // type 3: 이유
    default:
      return "bg-white"
  }
}

// 달력에 출력 멘트 설정
const getTradeTypeLabel = (tradeType: string, companyName: string) => {
  switch (tradeType) {
    case "0":
      return "용돈"
    case "1":
      return "출금"
    case "2":
      return "퀴즈"
    case "3":
      return "이유"
    case "4":
      return `${companyName} 매수` // 회사명 + 매수
    case "5":
      return `${companyName} 매도` // 회사명 + 매도
    default:
      return "알 수 없음" // 기본값
  }
}

interface TradeListResponse {
  data: {
    amount: number
    tradeSharesCount: number
    reason: string
    tradeType: number
    remainAmount: number
    stockTradingGain: number | null
    createdAt: string
    reasonBonusMoney: number | null
    companyName: string
  }[]
}

// getTradeListData 함수를 컴포넌트 외부에 정의
const getTradeListData = async (
  year: number,
  month: number
): Promise<investmentData[]> => {
  try {
    const tradeList: TradeListResponse = await getTradeList(year, month)

    // API에서 반환된 데이터와 investmentData 인터페이스를 매핑
    const formattedEvents: investmentData[] = tradeList.data.map(
      (item): investmentData => ({
        amount: item.amount,
        tradeSharesCount: item.tradeSharesCount,
        reason: item.reason,
        tradeType: item.tradeType.toString(), // tradeType을 string으로 변환
        remainAmount: item.remainAmount,
        stockTradingGain: item.stockTradingGain,
        createdAt: moment(item.createdAt, "YYYYMMDDHHmmss").format(
          "YYYY-MM-DD"
        ),
        reasonBonusMoney: item.reasonBonusMoney,
        companyName: item.companyName,
        createdTime: moment(item.createdAt, "YYYYMMDDHHmmss").format("HH:mm"),
      })
    )

    return formattedEvents
  } catch (error) {
    console.error("Failed to fetch trade list:", error)
    return []
  }
}

const Calender: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(moment())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [events, setEvents] = useState<investmentData[]>([]) // 수정된 부분

  const startOfMonth = currentMonth.clone().startOf("month").startOf("week")
  const endOfMonth = currentMonth.clone().endOf("month").endOf("week")
  const eventSectionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (selectedDate && eventSectionRef.current) {
      eventSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
  }, [selectedDate])

  useEffect(() => {
    const year = currentMonth.year()
    const month = currentMonth.month() + 1 // month는 0부터 시작하므로 1을 더해줌
    getTradeListData(year, month).then(setEvents) // 가져온 이벤트를 상태로 설정
  }, [currentMonth])

  const renderEventComponent = () => {
    if (!selectedDate) return null

    const filteredEvents = events.filter((event) => {
      const eventStart = moment(event.createdAt)
      return eventStart.isSame(selectedDate, "day")
    })

    return (
      <div
        className="mt-4 h-[450px] rounded border bg-white p-4"
        ref={eventSectionRef}
      >
        <MyInvestment
          filteredEvents={filteredEvents}
          selectedDate={selectedDate}
        />
      </div>
    )
  }

  const generateCalendarWeeks = () => {
    const weeks: JSX.Element[] = []
    let day = startOfMonth.clone()

    const weekDaysHeader = (
      <div className="grid w-[840px] grid-cols-7 bg-gray-200 p-2 text-center font-bold">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>
    )
    weeks.push(weekDaysHeader)

    while (day.isBefore(endOfMonth)) {
      const weekDays: JSX.Element[] = []
      for (let i = 0; i < 7; i++) {
        const currentDay = day.clone()
        const dayEvents = events.filter((event) =>
          moment(event.createdAt).isSame(currentDay, "day")
        )

        weekDays.push(
          <div
            key={currentDay.format("YYYY-MM-DD")}
            className={`relative border text-center ${selectedDate === currentDay.format("YYYY-MM-DD") ? "bg-gray-100" : ""} ${dayEvents.length > 0 ? "cursor-pointer" : "cursor-default opacity-50"}`}
            onClick={() =>
              dayEvents.length > 0 &&
              handleDayClick(currentDay.format("YYYY-MM-DD"))
            }
          >
            <div className="absolute start-2 top-2 font-bold">
              {currentDay.format("D")}
            </div>
            {dayEvents.length > 0 && (
              <div className="custom-scrollbar mt-[30px] h-[100px] overflow-auto">
                <div className="flex flex-col-reverse text-xs">
                  {[
                    ...new Map(
                      dayEvents.map((event) => [
                        `${event.tradeType}-${event.companyName}`,
                        event,
                      ])
                    ).values(),
                  ].map((event, index) => (
                    <div
                      key={index}
                      className={`m-1 w-fit overflow-hidden text-ellipsis whitespace-nowrap rounded p-1 text-start ${getBackgroundColor(event.tradeType)}`}
                    >
                      {getTradeTypeLabel(event.tradeType, event.companyName)}{" "}
                      {/* tradeType에 따른 문자열 출력 */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

        day.add(1, "day")
      }
      weeks.push(
        <div
          key={day.format("YYYY-MM-DD")}
          className="grid h-[130px] w-[840px] grid-cols-7"
        >
          {weekDays}
        </div>
      )

      if (
        selectedDate &&
        day.isSame(moment(selectedDate).add(1, "week"), "week")
      ) {
        weeks.push(renderEventComponent?.() || <div />)
      }
    }
    return weeks
  }

  const handleDayClick = (date: string) => {
    setSelectedDate(date === selectedDate ? null : date)
  }

  const prevMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, "month"))
    setSelectedDate(null) // 이전 달로 넘어갈 때 선택된 날짜 초기화
  }

  const nextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, "month"))
    setSelectedDate(null) // 다음 달로 넘어갈 때 선택된 날짜 초기화
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <span className="text-3xl font-bold">
          {currentMonth.format("MMMM, YYYY")}
        </span>
        <div className="flex w-24 items-center justify-between text-3xl">
          <button
            onClick={prevMonth}
            className="flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            <ArrowPrev sx={{ fontSize: 15, color: "#828282" }} />
          </button>
          <h2 className="mx-2 text-lg">{currentMonth.format("M월")}</h2>{" "}
          <button
            onClick={nextMonth}
            className="flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            <ArrowNext sx={{ fontSize: 15, color: "#828282" }} />
          </button>
        </div>
      </div>

      {generateCalendarWeeks()}
    </div>
  )
}

export default Calender
