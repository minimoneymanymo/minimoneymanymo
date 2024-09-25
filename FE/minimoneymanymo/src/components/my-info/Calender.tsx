import React, {useEffect, useRef, useState} from "react"
import moment from "moment"

interface Event {
  title: string
  date: string

  tradeType: number // tradeType 추가
}

const events: Event[] = [
  {title: "Meeting", date: "2024-09-04", tradeType: 1}, // 월요일
  {
    title: "ConferenceConferenceConference",
    date: "2024-09-07",
    tradeType: 2,
  }, // 목요일
  {title: "Workshop", date: "2024-09-09", tradeType: 3}, // 토요일
  {title: "Workshop", date: "2024-09-09", tradeType: 2},
  {title: "Workshop", date: "2024-09-09", tradeType: 1},
  {title: "Workshop", date: "2024-09-09", tradeType: 1},
  {title: "Workshop", date: "2024-09-09", tradeType: 1},
]

// tradeType에 따라 배경 색상을 반환하는 함수
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

const Calender: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(moment())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const startOfMonth = currentMonth.clone().startOf("month").startOf("week")
  const endOfMonth = currentMonth.clone().endOf("month").endOf("week")
  const eventSectionRef = useRef<HTMLDivElement | null>(null)
  // 컴포넌트가 렌더링될 때 컴포넌트의 하단으로 스크롤 이동
  useEffect(() => {
    if (selectedDate && eventSectionRef.current) {
      eventSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
    // 밑에 여유를 두도록 하면 좋을것같음.
  }, [selectedDate])

  const renderEventComponent = () => {
    if (!selectedDate) return null

    //해당 날자 일기 내역
    const filteredEvents = events.filter((event) => {
      const eventStart = moment(event.date)
      return eventStart.isSame(selectedDate)
    })

    return (
      <div
        className="mt-4 grid h-[450px] grid-cols-2 rounded border border-blue-300 bg-blue-100 p-4"
        ref={eventSectionRef}
      >
        <div className="col-span-1">
          <h3 className="font-bold">머니 변동 내역</h3>
          <ul>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <li key={index}>
                  {event.title} ({event.date})
                </li>
              ))
            ) : (
              <li>No events</li>
            )}
          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="font-bold"> 투자 기록 </h3>
          <ul>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <li key={index}>
                  {event.title} ({event.date})
                </li>
              ))
            ) : (
              <li>No events</li>
            )}
          </ul>
        </div>
      </div>
    )
  }

  const generateCalendarWeeks = () => {
    const weeks: JSX.Element[] = []
    let day = startOfMonth.clone()

    // 요일 헤더 추가
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
    weeks.push(weekDaysHeader) // 요일 헤더를 weeks 배열에 추가

    while (day.isBefore(endOfMonth)) {
      const weekDays: JSX.Element[] = []
      for (let i = 0; i < 7; i++) {
        const currentDay = day.clone()
        const dayEvents = events.filter((event) =>
          moment(event.date).isSame(currentDay, "day")
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
                      {event.title}
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

      // 선택된 날짜에 따라 컴포넌트 렌더링
      if (
        selectedDate &&
        day.isSame(moment(selectedDate).add(1, "week"), "week")
      ) {
        weeks.push(renderEventComponent!())
      }
    }
    return weeks
  }

  const handleDayClick = (date: string) => {
    setSelectedDate(date === selectedDate ? null : date) // 클릭한 날짜 선택 해제
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
