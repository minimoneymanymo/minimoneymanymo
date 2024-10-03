import {
  addMyChildWaiting,
  deleteMyChildWaiting,
  getMyChildWaiting,
} from "@/api/user-api"
import { useEffect, useState } from "react"
import { Children } from "./types"
import { computeTime } from "@/utils/datefuntion"
import Heading from "../common/Heading"

interface MyChildrenWaitingListProps {
  onChildApproved: () => void // 부모로부터 받은 함수
}

function MyChildrenWaitingList({
  onChildApproved,
}: MyChildrenWaitingListProps): JSX.Element {
  const [childrenWaitingList, setChildrenWaitingList] = useState<Children[]>([])

  const fetchchildrenWaitingList = async () => {
    const res = await getMyChildWaiting()
    console.log(res.data)
    if (res) {
      setChildrenWaitingList(res.data)
    }
  }

  useEffect(() => {
    fetchchildrenWaitingList()
  }, [])

  const handleApprove = async (childrenId: number) => {
    try {
      const res = await addMyChildWaiting(childrenId)
      // 자녀 리스트 갱신
      if (res) {
        onChildApproved()
        fetchchildrenWaitingList()
      }
    } catch (e) {
      console.log("수락 실패")
    }
  }
  const handleUnApprove = async (childrenId: number) => {
    try {
      const res = await deleteMyChildWaiting(childrenId)
      if (res) {
        fetchchildrenWaitingList()
      }
    } catch (e) {
      console.log("거절 실패")
    }
  }
  return (
    <>
      <div className="flex h-[400px] w-full flex-col">
        <Heading title="등록 대기중인 자녀" />
        <ul className="custom-scrollbar h-[300px]">
          {childrenWaitingList?.map((child, index) => (
            <li
              key={child.childrenId}
              className="m-5 mb-3 flex justify-between space-x-6 rounded-2xl bg-white px-2 py-1"
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-300">
                  <span className="text-md font-bold">{index + 1}</span>
                </div>
                <span>{child.name}</span>
              </div>
              <div className="flex items-center justify-between space-x-3">
                <span>등록 신청 시간</span>
                <span className="h-fit border-b border-black">
                  {child.createdAt
                    ? computeTime(child.createdAt)
                    : "No date available"}
                </span>
                <div>
                  <button
                    className="m-2 ml-4 rounded-lg bg-secondary-m2 px-6 py-2 text-sm font-normal text-white"
                    onClick={() => handleApprove(child.childrenId)}
                  >
                    수락
                  </button>
                  <button
                    className="m-2 ml-4 rounded-lg bg-secondary-m2 px-6 py-2 text-sm font-normal text-white"
                    onClick={() => handleUnApprove(child.childrenId)}
                  >
                    미수락
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default MyChildrenWaitingList
