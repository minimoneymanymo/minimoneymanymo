import MyChildrenList from "@/components/my-children/MyChildrenList"
import MyChildrenWaitingList from "@/components/my-children/MyChildrenWaitingList"
import { useState } from "react"

function MyChildrenPage(): JSX.Element {
  const [childrenListUpdated, setChildrenListUpdated] = useState(false)

  const refreshChildrenList = () => {
    setChildrenListUpdated((prev) => !prev) // 자녀 목록을 갱신할 때 상태를 변경
  }

  return (
    <>
      <div className="flex w-full flex-col">
        <MyChildrenList refreshChildrenList={childrenListUpdated} />
        <MyChildrenWaitingList onChildApproved={refreshChildrenList} />
      </div>
    </>
  )
}

export default MyChildrenPage
