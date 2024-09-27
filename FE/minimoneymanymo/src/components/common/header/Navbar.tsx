import { Link, NavLink } from "react-router-dom"
import { logOutUser } from "../../../utils/user-utils"

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
  const handleLogOut = () => {
    alert("로그아웃")
    logOutUser()
  }

  return (
    <ul className="flex h-16 items-center text-center text-lg">
      <>
        {/* <li className="mx-2.5 flex h-full cursor-pointer">
            <NavChat onClick={onClickChatHandler} />
          </li> */}
        <li className="mx-2.5 flex h-full cursor-pointer items-center">
          <Link to="/parent/my-wallet">부모 마이페이지</Link>
        </li>
        <li className="mx-2.5 flex h-full cursor-pointer items-center">
          <Link to="/my-info/wallet">자녀마이페이지</Link>
        </li>

        <li className="mx-2.5 flex h-full cursor-pointer items-center">
          <Link to="/login">로그인</Link>
        </li>
        <li className="mx-2.5 flex h-full cursor-pointer items-center">
          <Link to="/sign-up">회원가입</Link>
        </li>
        <li className="mx-2.5 flex h-full cursor-pointer truncate">
          <button onClick={handleLogOut}>로그아웃</button>
        </li>
      </>
    </ul>
  )
}

function Navbar(): JSX.Element {
  return (
    <nav className="flex h-20 flex-col items-center justify-center border-b px-10">
      <div className="container mx-auto flex items-center justify-between">
        <NavItemList />
        <NavAction />
      </div>
    </nav>
  )
}

export default Navbar
