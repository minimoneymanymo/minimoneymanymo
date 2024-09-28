import { addMyChildWaiting, getMyChildWaiting } from "@/api/user-api"
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
  return (
    <>
      <div className="flex w-full flex-col">
        <Heading title="등록 대기중인 자녀" />
        <ul>
          {childrenWaitingList?.map((child, index) => (
            <li key={child.childrenId} className="m-5 space-x-6 border">
              <span>{index + 1}</span>
              <span>{child.name}</span>
              <span>
                {child.createdAt
                  ? computeTime(child.createdAt)
                  : "No date available"}
              </span>
              <button onClick={() => handleApprove(child.childrenId)}>
                {" "}
                수락{" "}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default MyChildrenWaitingList
