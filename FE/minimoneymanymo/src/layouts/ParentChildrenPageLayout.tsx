import { ChildProvider, useChild } from "@/components/context/ChildContext"
import MyChildItem from "@/components/my-children/MyChildItem"
import React, { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"

const ParentChildrenPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { child, fetchChildById } = useChild() // Context에서 child와 fetchChild 가져오기
  const { childId } = useParams()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadChild = async () => {
      setIsLoading(true)
      if (childId) {
        await fetchChildById(Number(childId)) // 자녀 ID를 사용하여 데이터 로드
      }
      setIsLoading(false)
    }
    loadChild()
  }, [childId])

  // child를 받아오길 기다림.
  if (isLoading) return <>로딩중</>

  //메뉴 탭
  let itemId = 0
  const navItems = [
    {
      id: itemId++,
      category: "자금관리",
      to: "finance",
    },
    {
      id: itemId++,
      category: "투자 성향",
      to: "invest-style",
    },
    {
      id: itemId++,
      category: "일기체크",
      to: "diary",
    },
  ]

  // 현재 경로를 가져오기
  const currentPath = location.pathname.split("/").pop()

  // 클릭 핸들러
  const handleNavClick = (path: string) => {
    navigate(path, { state: { child } }) // 상태 전달
  }

  return (
    <div className="flex w-full flex-col">
      {child ? (
        <>
          <MyChildItem child={child} />

          <ul className="justfy-end my-2 ml-auto flex space-x-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.to)}
                  className={`flex items-center truncate rounded-xl px-2 py-1 text-lg ${
                    currentPath === item.to ? "bg-gray-300 font-bold" : ""
                  }`}
                >
                  <span className="text-center">{item.category}</span>
                </button>
              </li>
            ))}
          </ul>
          <Outlet></Outlet>
        </>
      ) : (
        <div>잘못된 접근입니다.</div>
      )}
    </div>
  )
}

const ParentChildrenPageLayout: React.FC = () => {
  return (
    <ChildProvider>
      <ParentChildrenPage />
    </ChildProvider>
  )
}

export default ParentChildrenPageLayout
