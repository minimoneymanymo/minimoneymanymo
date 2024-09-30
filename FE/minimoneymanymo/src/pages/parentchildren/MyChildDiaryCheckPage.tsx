import React, { useState } from "react"
import MyChildDiaryList from "@/components/my-children/MyChildDiaryList" // 리스트 컴포넌트
import MyChildDiaryGiveMoney from "@/components/my-children/MyChildDiaryGiveMoney" // 상세 정보 컴포넌트
import { MyChildDiary } from "@/components/my-children/types"

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

  return (
    <div className="flex w-full">
      {/* 좌측에 MyChildDiaryList 컴포넌트 */}
      <div className={`w-full ${selectedDiary ? "w-1/2" : "w-full"}`}>
        <MyChildDiaryList onSelectDiary={handleDiarySelect} />
      </div>

      {/* 우측에 MyChildDiaryGiveMoney 컴포넌트 (선택된 diary가 있을 때만 표시) */}
      {selectedDiary && (
        <div className="w-1/2">
          <MyChildDiaryGiveMoney diary={selectedDiary} />
        </div>
      )}
    </div>
  )
}

export default MyChildDiaryCheckPage
