import { getMyChildren } from "@/api/user-api"
import MyChildItem from "@/components/my-children/MyChildItem"
import {Child} from "@/components/my-children/types"
import React, {useEffect, useState} from "react"
import {NavLink, Outlet, useLocation, useParams} from "react-router-dom"

const ParentChildrenPageLayout: React.FC = () => {
  const location = useLocation()
  const [child, setChild] = useState<Child | null>(null)
  const {childId} = useParams()
  useEffect(() => {
    if (location.state?.child) {
      //location의 state로 자녀 정보가 넘어온 경우 맞는 정보인지 확인 후 그걸로 설정.
      if (childId === location.state.child.childId) 
        setChild(location.state.child)
    }else{
      //안넘어온경우 api로 받아옴.
       //추후 적용 예정
    }
  }, [location.state?.child])

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

  return (
    <div className="flex w-full flex-col">
      {child ? <>
        <MyChildItem child={child}></MyChildItem>
    
      <ul className="my-2 justfy-end ml-auto flex space-x-2">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({isActive}) =>
              `flex items-center truncate rounded-xl px-2 py-1 text-lg ${
                isActive ? "bg-gray-300 font-bold" : ""
              }`
            }
          >
            <span className="text-center">{item.category}</span>
          </NavLink>
        ))}
      </ul>
      <Outlet></Outlet>
      </>
:
<div>잘못된 접근입니다.</div>}
    </div>
  )
}

export default ParentChildrenPageLayout
