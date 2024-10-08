import MypageNav from "@/components/common/mypage/MyPageNav"
import React from "react"
import { Outlet } from "react-router-dom"

const ParentPageLayout: React.FC = () => {
  const menuItems = [
    {
      label: "내 계좌 관리",
      path: "/parent/my-wallet",
    },
    {
      label: "나의 자녀 관리",
      path: "/parent/my-children",
      chip: 5,
    },
    {
      label: "내 프로필",
      path: "/parent/my-info",
    },
  ]

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex h-full w-[1140px] rounded-xl p-3">
        <div className="h-full w-[240px]">
          <div className="h-full w-full">
            <MypageNav menuItems={menuItems} role={0}></MypageNav>
          </div>
        </div>
        <Outlet></Outlet>
      </main>
    </div>
  )
}

export default ParentPageLayout
