import { Link, NavLink, useNavigate } from "react-router-dom"
import {
  getAccessTokenFromSession,
  logOutUser,
} from "../../../utils/user-utils"
import { useAppSelector } from "@/store/hooks"
import { parentActions, selectParent } from "@/store/slice/parent"
import { childActions, selectChild } from "@/store/slice/child"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const NavItemList = (): JSX.Element => {
  let itemId = 0
  const navItems = [
    {
      id: itemId++,
      category: "main",
      to: "/",
    },
    {
      id: itemId++,
      category: "news",
      to: "/news",
    },
  ]
  return (
    <nav className="flex h-16 items-center sm:h-10 md:h-12">
      <ul className="flex">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              `truncate rounded-xl ${isActive ? "bg-yellow font-bold" : ""}`
            }
          >
            <span className="flex h-12 cursor-pointer items-center px-1 text-center text-lg">
              {item.category}
            </span>
          </NavLink>
        ))}
      </ul>
    </nav>
  )
}

const NavAction = (): JSX.Element => {
  const parent = useAppSelector(selectParent) // 부모 상태 선택
  const child = useAppSelector(selectChild) // 자식 상태 선택
  const [isLogin, setIsLogin] = useState<boolean>()
  const [profileImgUrl, setProfileImgUrl] = useState<string>("")
  const [name, setName] = useState<string>("")
  const dispatch = useDispatch()
  useEffect(() => {
    if (getAccessTokenFromSession() !== null) {
      setIsLogin(true)
      if (parent.userId) {
        setProfileImgUrl(parent.profileImgUrl)
        setName(parent.name)
      } else if (child.userId) {
        setProfileImgUrl(child.profileImgUrl)
        setName(child.name)
      } else {
        setIsLogin(false)
      }
    } else {
      setIsLogin(false)
    }

    console.log("logintoken", getAccessTokenFromSession())
    console.log(parent)
    console.log(child)
  }, [parent, child.profileImgUrl, isLogin])

  const handleLogOut = () => {
    alert("로그아웃")
    logOutUser()
    setIsLogin(false)
    // Redux 상태 초기화
    dispatch(parentActions.clearParent())
    dispatch(childActions.clearChild())
    console.log(getAccessTokenFromSession())
  }

  return (
    <ul className="flex h-16 text-center">
      {isLogin ? (
        <div className="flex items-center space-x-5">
          {parent.userId ? (
            <>
              <li className="flex items-center">
                <img
                  src={profileImgUrl || "/images/profile.jpg"}
                  alt="프로필사진"
                  onError={(e) => {
                    e.currentTarget.src = "/images/profile.jpg" // 이미지 로드 실패 시 기본 이미지로 대체
                  }}
                  className="mx-2 size-8 rounded-full"
                />
                {name} 님{" "}
              </li>
              <li className="mx-2.5 flex h-full cursor-pointer items-center">
                <Link to="/parent/my-wallet">마이페이지</Link>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center">
                <img
                  src={profileImgUrl || "/images/profile.jpg"}
                  alt="프로필사진"
                  onError={(e) => {
                    e.currentTarget.src = "/images/profile.jpg" // 이미지 로드 실패 시 기본 이미지로 대체
                  }}
                  className="mx-2 size-8 rounded-full"
                />
                {name} 님{" "}
              </li>
              <li className="mx-2.5 flex h-full cursor-pointer items-center">
                <Link to="/my-info/wallet">마이페이지</Link>
              </li>
            </>
          )}
          <>
            <li className="mx-2.5 flex h-full cursor-pointer truncate">
              <button onClick={handleLogOut}>로그아웃</button>
            </li>
          </>
        </div>
      ) : (
        <>
          <li className="mx-2.5 flex h-full cursor-pointer items-center">
            <Link to="/login">로그인</Link>
          </li>
          <li className="mx-2.5 flex h-full cursor-pointer items-center">
            <Link to="/sign-up">회원가입</Link>
          </li>
        </>
      )}
    </ul>
  )
}

const NavActionDev = (): JSX.Element => {
  return (
    <ul className="flex h-16 text-center">
      <li className="mx-2.5 flex h-full cursor-pointer items-center">
        <Link to="/parent/my-wallet">부모마이페이지</Link>
      </li>
      <li className="mx-2.5 flex h-full cursor-pointer items-center">
        <Link to="/my-info/wallet">자식마이페이지</Link>
      </li>
      <li className="mx-2.5 flex h-full cursor-pointer items-center">
        <Link to="/news">뉴스</Link>
      </li>
    </ul>
  )
}

function Navbar(): JSX.Element {
  const navigator = useNavigate()
  return (
    <nav className="flex h-20 flex-col items-center justify-center border-b px-10">
      <div className="container mx-auto flex items-center justify-between">
        <button
          onClick={() => {
            navigator("/")
          }}
          className="flex items-center gap-3 text-xl text-primary-600"
        >
          <div className="py-auto flex size-16 items-center justify-center rounded-full border">
            <span>로고</span>
          </div>
          <div
            className="text-left text-sm font-bold"
            style={{ lineHeight: "1.2" }}
          >
            mini
            <br />
            money
            <br />
            manymo
          </div>
        </button>
        {/* <NavItemList /> */}
        <NavActionDev />
        <NavAction />
      </div>
    </nav>
  )
}

export default Navbar
