import {getMyChildren} from "@/api/user-api"
import MyChildItem from "@/components/my-children/MyChildItem"
import {Child} from "@/components/my-children/types"
import React, {useEffect, useState} from "react"
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"

interface LocationState {
  child: Child
}

const ParentChildrenPageLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [child, setChild] = useState<Child | null>(null)
  const {childId} = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const id = childId
  useEffect(() => {
    setIsLoading(true)
    if (location.state?.child) {
      //location의 state로 자녀 정보가 넘어온 경우 맞는 정보인지 확인 후 그걸로 설정.
      console.log(location.state.child.childrenId, childId)
      if (Number(childId) === location.state.child.childrenId) {
        console.log(location.state.child.childrenId)
        setChild(location.state.child)
        console.log("child", child)
      }
    } else {
      //안넘어온경우 api로 받아옴.
      //추후 적용 예정
    }
    setIsLoading(false)
    if (child) {
    }
  }, [id])

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
    navigate(path, {state: {child}}) // 상태 전달
  }

  return (
    <div className="flex w-full flex-col">
      {child ? (
        <>
          <MyChildItem child={child}></MyChildItem>

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

export default ParentChildrenPageLayout
