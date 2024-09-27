import Heading from "@/components/common/Heading"
import Calender from "@/components/my-info/Calender"
import React from "react"

const ChildDairyPage = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <Heading title="투자일기" />
      <div className="ml-5">
        <span className="text-lg">
          {" "}
          투자란 길고도 흥미로운 여행이에요. 지금까지 걸어온 길을 돌아보며
          앞으로의 여정을 계획해 보세요.{" "}
        </span>
        <Calender />
      </div>
    </div>
  )
}

export default ChildDairyPage
