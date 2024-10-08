import React, { useState } from "react"
import MyChildDiaryList from "@/components/my-children/MyChildDiaryList" // 리스트 컴포넌트
import MyChildDiaryGiveMoney from "@/components/my-children/MyChildDiaryGiveMoney" // 상세 정보 컴포넌트
import { MyChildDiary } from "@/components/my-children/types"
import YearMonthPicker from "@/components/common/YearMonthPicker"
import { useChild } from "@/components/context/ChildContext"

function MyChildDiaryCheckPage(): JSX.Element {
  // 선택한 diary 항목을 저장할 상태
  const [selectedDiary, setSelectedDiary] = useState<MyChildDiary | null>(null)

  // 리스트에서 diary 항목을 선택했을 때 호출되는 함수
  const handleDiarySelect = (diary: MyChildDiary) => {
    // 이미 선택된 항목이면 선택 해제
    if (selectedDiary && selectedDiary.createdAt === diary.createdAt) {
      setSelectedDiary(null)
    } else {
      setSelectedDiary(diary)
    }
  }

  const today = new Date()
  const [selectedDate, setSelectedDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  })

  const handleDateChange = (year: number, month: number) => {
    if (year !== selectedDate.year || month !== selectedDate.month) {
      setSelectedDate({ year, month })
    }
    console.log("변경 후 selectedDate는 :", { year, month }) // 새로운 상태
  }

  const { child } = useChild() // child 가져오기

  return (
    <>
      {/* 년, 월 선택 UI */}
      <div className="flex w-full items-center justify-between p-1">
        <p className="text-xl font-bold">
          {child ? `${child.name}의 투자 일기` : "우리 아이의 투자 일기"}
        </p>
        <p>
          <YearMonthPicker onChange={handleDateChange} />
        </p>
      </div>
      {/* 회색 선 추가 */}
      <div className="my-2 border-b border-gray-300" /> {/* 회색 선 */}
      <div className="flex w-full">
        {/* 좌측에 MyChildDiaryList 컴포넌트 */}
        <div className={`w-full ${selectedDiary ? "w-1/2" : "w-full"}`}>
          <MyChildDiaryList
            onSelectDiary={handleDiarySelect}
            selectedDate={selectedDate}
          />
        </div>

        {/* 우측에 MyChildDiaryGiveMoney 컴포넌트 (선택된 diary가 있을 때만 표시) */}
        {selectedDiary && (
          <div className="w-1/2">
            <MyChildDiaryGiveMoney diary={selectedDiary} />
          </div>
        )}
      </div>
    </>
  )
}

export default MyChildDiaryCheckPage
