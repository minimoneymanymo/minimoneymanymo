import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react"
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid"
import {useNavigate} from "react-router-dom"
import { useState } from "react"

interface MenuItem {
  label: string
  path: string
  chip?: Number
}

interface MypageNavProps {
  menuItems: MenuItem[]
}
function MypageNav({menuItems}: MypageNavProps): JSX.Element {
  const navigate = useNavigate()

  const [selectedPath, setSelectedPath] = useState<string>("")
  // 메뉴 항목 클릭 시 경로를 업데이트하고 네비게이트
  const handleClick = (path: string) => {
    setSelectedPath(path)
    navigate(path)
  }

  return (
    <div className="mx-auto my-auto h-[calc(100vh-2rem)] w-[160px] space-y-5 py-5">
      <button
        className="w-full cursor-pointer border-none bg-transparent p-0"
        onClick={() => navigate("/parent/my-wallet")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/parent/my-wallet")
          }
        }}
      >
        <div className="flex h-16 w-[160px] items-center space-x-2 py-5">
          <img
            src={"/images/profile.jpg"}
            alt="프로필사진"
            onError={(e) => {
              e.currentTarget.src = "/images/profile.jpg" // 이미지 로드 실패 시 기본 이미지로 대체
            }}
            className="size-16"
          />
          <div className="text-2xl">닉네임 </div>
        </div>
      </button>
      <Card className="shadow-blue-gray-900/5 w-fit p-0 px-1 py-4">
        <List className="w-[160px] min-w-[160px] p-0">
          {menuItems.map((item) => (
            <ListItem
              key={item.label}
              onClick={() => handleClick(item.path)}
              className={`w-40 ${
                selectedPath === item.path ? "bg-gray-200" : ""
              }`}
            >
              {item.label}
              {item.chip && (
                <ListItemSuffix className="w-[20px] text-sm bg-primary-m1 rounded-full text-white">
                  {item.chip}
                </ListItemSuffix>
              )}
            </ListItem>
          ))}
        </List>
      </Card>
    </div>
  )
}

export default MypageNav
