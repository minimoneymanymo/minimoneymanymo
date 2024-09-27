import React, { useEffect, useState } from "react"
import { getChildTradelistApi } from "@/api/fund-api"
import { MyChildDiary } from "./types"
import { useChild } from "../context/ChildContext"

// 상위 페이지로 선택한 다이어리 넘김
interface MyChildDiaryListProps {
  onSelectDiary: (diary: MyChildDiary) => void
}

const MyChildDiaryList: React.FC<MyChildDiaryListProps> = ({
  onSelectDiary,
}) => {
  const [diaryList, setDiaryList] = useState<MyChildDiary[]>([])
  const [loading, setLoading] = useState(true)
  const { child } = useChild()

  useEffect(() => {
    // child가 null인지 확인
    if (!child) {
      console.error("child 정보가 없습니다.")
      setLoading(false) // 로딩 종료
      return
    }

    // API 호출 함수로 데이터 가져오기
    const getMyChildDiaryList = async () => {
      try {
        const childrenId = child.userId // 실제 childrenId 값을 넣어야 함
        const year = parseInt(child.createdAt.slice(0, 4))
        const month = parseInt(child.createdAt.slice(4, 6))

        const response = await getChildTradelistApi(childrenId, year, month)
        console.log("API 응답:", response) // API 응답 로그 출력

        // 응답이 data 배열인지 확인 후 상태 설정
        if (response.stateCode === 200 && Array.isArray(response.data)) {
          setDiaryList(response.data) // 데이터 배열 설정
        } else {
          console.error("잘못된 데이터 형식:", response)
          setDiaryList([]) // 잘못된 형식일 경우 빈 배열 설정
        }
      } catch (error) {
        console.error("API 호출 오류:", error)
        setDiaryList([]) // 오류 발생 시 빈 배열 설정
      } finally {
        setLoading(false) // 로딩 완료
      }
    }

    getMyChildDiaryList()
  }, [])

  if (loading) {
    return <div>로딩 중...</div> // 로딩 상태 표시
  }

  return (
    <div>
      <h2>00이의 투자 일기</h2>
      <br />
      <ul>
        {diaryList.map((diary) => {
          // createdAt 문자열에서 필요한 정보 추출
          const year = diary.createdAt.slice(0, 4) // 년
          const month = diary.createdAt.slice(4, 6) // 월
          const day = diary.createdAt.slice(6, 8) // 일
          const hour = diary.createdAt.slice(8, 10) // 시
          const minute = diary.createdAt.slice(10, 12) // 분

          // tradeType 표시 변환
          const tradeTypeDisplay =
            diary.tradeType === "4"
              ? "매수"
              : diary.tradeType === "5"
                ? "매도"
                : ""

          return (
            <li key={diary.createdAt} className="mb-4">
              {/* 여백 추가 */}
              <button onClick={() => onSelectDiary(diary)}>
                {diary.companyName} - {diary.amount} 머니
                <br />
                {year}년 {month}월 {day}일 {hour}시 {minute}분 :{" "}
                {tradeTypeDisplay} {diary.amount} 머니
                {diary.reasonBonusMoney === null ? (
                  <div>
                    <p>머니 미지급</p>
                  </div>
                ) : (
                  <div>
                    <p>{diary.reasonBonusMoney} 머니 지급완료</p>
                  </div>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default MyChildDiaryList
