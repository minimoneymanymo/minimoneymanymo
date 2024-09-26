import React, { useEffect, useRef, useState } from "react"
import moment from "moment"
import MyInvestment from "./MyInvestment"
import { getTradeList } from "@/api/investment-api"
import { investmentData } from "./investmentData"

// Event 대신 investmentData 타입 사용
const getBackgroundColor = (tradeType: number) => {
  switch (tradeType) {
    case 1:
      return "bg-green-100" // type 1: 연두색
    case 2:
      return "bg-yellow-100" // type 2: 노란색
    case 3:
      return "bg-red-100" // type 3: 빨간색
    default:
      return "bg-white"
  }
}

interface TradeListResponse {
  data: {
    amount: number
    tradeSharesCount: number
    reason: string
    tradeType: number // tradeType은 number라고 가정
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
  const [events, setEvents] = useState<(typeof investmentData)[]>([]) // 상태로 events 관리

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
        className="mt-4 grid h-[450px] grid-cols-2 rounded border border-blue-300 bg-blue-100 p-4"
        ref={eventSectionRef}
      >
        <MyInvestment filteredEvents={filteredEvents} />
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
            className={`relative border text-center ${dayEvents.length > 0 ? "cursor-pointer" : "cursor-default opacity-50"}`}
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
                  {dayEvents.map((event, index) => (
                    <div
                      key={index}
                      className={`m-1 w-fit overflow-hidden text-ellipsis rounded p-1 text-start ${getBackgroundColor(event.tradeType)}`}
                    >
                      {event.companyName}
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

  const prevMonth = () =>
    setCurrentMonth(currentMonth.clone().subtract(1, "month"))
  const nextMonth = () => setCurrentMonth(currentMonth.clone().add(1, "month"))

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <span className="text-3xl font-bold">
          {currentMonth.format("MMMM, YYYY")}
        </span>
        <div className="flex w-24 items-center justify-between text-3xl">
          <button
            onClick={prevMonth}
            className="text-gray-600 hover:text-gray-800"
          >
            &lt;
          </button>
          <h2 className="text-lg">{currentMonth.format("M월")}</h2>
          <button
            onClick={nextMonth}
            className="text-gray-600 hover:text-gray-800"
          >
            &gt;
          </button>
        </div>
      </div>

      {generateCalendarWeeks()}
    </div>
  )
}

export default Calender
