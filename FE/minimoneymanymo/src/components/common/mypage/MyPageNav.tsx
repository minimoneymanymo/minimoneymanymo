import { Card, List, ListItem, ListItemSuffix } from "@material-tailwind/react"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAppSelector } from "@/store/hooks"
import { selectChild } from "@/store/slice/child"
import { selectParent } from "@/store/slice/parent"
import Swal from "sweetalert2"

interface MenuItem {
  label: string
  path: string
  chip?: number
}

interface MypageNavProps {
  readonly menuItems: ReadonlyArray<MenuItem> // Array of MenuItem is read-only
  readonly role: number // Mark role as read-only
}

function MypageNav({ menuItems, role }: MypageNavProps): JSX.Element {
  const navigate = useNavigate()

  const [selectedPath, setSelectedPath] = useState<string>("")
  const [profileImgUrl, setProfileImgUrl] = useState<string>("")
  const [name, setName] = useState<string>("")
  const parentMyInfo = useAppSelector(selectParent)
  const childMyInfo = useAppSelector(selectChild)

  useEffect(() => {
    if (role === 0) {
      if (parentMyInfo === null) {
        //alert("로그인안됨")
        Swal.fire({
          title: "로그인이 필요합니다",
          icon: "warning",
        })
      }
      setName(parentMyInfo.name)
      setProfileImgUrl(parentMyInfo.profileImgUrl)
    } else {
      if (childMyInfo === null) {
        //alert("로그인안됨")
        Swal.fire({
          title: "로그인이 필요합니다",
          icon: "warning",
        })
      }
      setName(childMyInfo.name)
      setProfileImgUrl(childMyInfo.profileImgUrl)
    }
    console.log(parentMyInfo.profileImgUrl)
    console.log(childMyInfo)
  }, [])

  // 메뉴 항목 클릭 시 경로를 업데이트하고 네비게이트
  const handleClick = (path: string) => {
    setSelectedPath(path)
    navigate(path)
  }

  return (
    <div className="h-[calc(100vh-2rem)] w-fit space-y-5 pt-5">
      <button
        className="w-full cursor-pointer border-none bg-transparent p-0"
        onClick={() => {
          setSelectedPath("/parent/my-wallet")
          navigate("/parent/my-wallet")
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/parent/my-wallet")
            setSelectedPath("/parent/my-wallet")
          }
        }}
      >
        <div className="flex h-16 w-fit items-center space-x-2 py-5">
          <img
            src={profileImgUrl || "/images/profile.jpg"}
            alt="프로필사진"
            onError={(e) => {
              e.currentTarget.src = "/images/profile.jpg" // 이미지 로드 실패 시 기본 이미지로 대체
            }}
            className="size-16 rounded-full"
          />
          <div className="text-2xl">{name} </div>
        </div>
      </button>
      <Card className="shadow-blue-gray-900/5 w-fit p-0 px-1 py-4">
        <List className="w-fit min-w-[160px] p-0">
          {menuItems.map((item: MenuItem) => (
            <ListItem
              key={item.label}
              onClick={() => handleClick(item.path)}
              className={`w-40 ${
                selectedPath === item.path ? "bg-gray-200" : ""
              }`}
            >
              {item.label}
              {item.chip && (
                <ListItemSuffix className="w-[20px] rounded-full bg-primary-m1 text-sm text-white">
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
