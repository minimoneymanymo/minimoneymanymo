import React, { useEffect, useState } from "react"
import { getChildTradelistApi } from "@/api/fund-api"
import { MyChildDiary } from "./types"
import { useChild } from "../context/ChildContext"

interface MyChildDiaryListProps {
  onSelectDiary: (diary: MyChildDiary) => void
  selectedDate: { year: number; month: number } // selectedDate prop 추가
}

const MyChildDiaryList: React.FC<MyChildDiaryListProps> = ({
  onSelectDiary,
  selectedDate, // selectedDate prop 받기
}) => {
  const [diaryList, setDiaryList] = useState<MyChildDiary[]>([])
  const [loading, setLoading] = useState(false) // 로딩 상태
  const { child } = useChild() // child 가져오기

  // 연도와 월 상태 관리
  const [year, setYear] = useState(selectedDate.year)
  const [month, setMonth] = useState(selectedDate.month)

  useEffect(() => {
    // API 호출 함수
    const fetchDiaryList = async () => {
      if (!child || !child.userId) return
      setLoading(true) // API 호출 시작 시점에 로딩 상태 설정
      try {
        const response = await getChildTradelistApi(child.userId, year, month)
        if (response.stateCode === 200 && Array.isArray(response.data)) {
          setDiaryList(response.data)
        } else {
          setDiaryList([])
        }
      } catch (error) {
        setDiaryList([])
      } finally {
        setLoading(false) // API 호출 종료 후 로딩 상태 해제
      }
    }
    fetchDiaryList()
  }, [year, month, child])

  // selectedDate가 변경될 때 year와 month를 업데이트
  useEffect(() => {
    setYear(selectedDate.year)
    setMonth(selectedDate.month)
  }, [selectedDate])

  if (loading) {
    return <div>로딩 중...</div>
  }

  return (
    <ul className="custom-scrollbar max-h-96 w-full overflow-y-auto">
      {diaryList.map((diary) => {
        const diaryMonth = diary.createdAt.slice(4, 6)
        const diaryDay = diary.createdAt.slice(6, 8)
        const diaryHour = diary.createdAt.slice(8, 10)
        const diaryMinute = diary.createdAt.slice(10, 12)

        const tradeTypeDisplay =
          diary.tradeType === "4"
            ? "매수"
            : diary.tradeType === "5"
              ? "매도"
              : ""

        return (
          <li
            key={`${diary.createdAt}-${diary.remainAmount}-${diary.tradeSharesCount}-${Math.random()}`}
            className="mb-4 flex w-full p-4"
          >
            <button className="w-full" onClick={() => onSelectDiary(diary)}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-between gap-0">
                  <p className="mr-2 text-xl font-bold leading-[1.2]">
                    {diary.companyName}{" "}
                  </p>
                  <p className="mr-4 text-xs leading-[1.2] text-gray-500">
                    {diary.tradeSharesCount}주
                  </p>
                </div>

                <div className="ml-auto flex-grow text-right text-base font-bold text-secondary-600-m2">
                  {" "}
                  {/* ml-auto로 오른쪽으로 이동 */}
                  {diary.reasonBonusMoney === null
                    ? "머니 미지급"
                    : `${diary.reasonBonusMoney}머니 지급완료`}
                </div>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-left text-gray-500">
                  {diaryMonth}월 {diaryDay}일 {diaryHour}:{diaryMinute} |{" "}
                  <span
                    className={
                      tradeTypeDisplay === "매수" ? "text-buy" : "text-sell"
                    }
                  >
                    {tradeTypeDisplay}
                  </span>
                </p>
                <p className="text-right text-xl font-bold">
                  {diary.amount.toLocaleString()} 머니
                </p>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default MyChildDiaryList
