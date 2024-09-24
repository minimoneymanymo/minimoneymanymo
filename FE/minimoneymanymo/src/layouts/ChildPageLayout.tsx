import MypageNav from "@/components/common/mypage/MyPageNav"
import React from "react"
import {Outlet} from "react-router-dom"

const ChildPageLayout: React.FC = () => {
const menuItems = [
  {
    label: "마이 데이터",
    path: "/my-info/wallet",
  },
  {
    label: "나의 주식",
    path: "/my-info/finance",
  },
  {
    label: "투자 일기",
    path: "/my-info/diary",
  },
  {
    label: "투자 성향",
    path: "/my-info/invest-style",
  },
  {
    label: "내 프로필",
    path: "/my-info",
  },
]

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex h-full w-[1140px] space-x-7 border">
        <div className="h-full w-[240px]">
            <MypageNav menuItems={menuItems}></MypageNav>
        </div>
        <div className="w-full">

        <Outlet></Outlet>
        </div>
      </main>
    </div>
  )

}

export default ChildPageLayout
