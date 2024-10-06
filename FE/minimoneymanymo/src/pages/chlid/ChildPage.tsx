import Heading from "@/components/common/Heading"
import { useAppSelector } from "@/store/hooks"
import { selectChild } from "@/store/slice/child"
import EditIcon from "@mui/icons-material/Edit"
import { useState } from "react"
function ChildPage(): JSX.Element {
  const child = useAppSelector(selectChild) // 부모 상태 선택
  const [inputValue, setInputValue] = useState<string>("")
  const [inputValue2, setInputValue2] = useState<string>("")
  const Element = (key: string, value: string | undefined): JSX.Element => {
    return (
      <div className="flex w-full">
        <span className="w-[110px]">{key}</span>
        <span className="flex-1">{value}</span>
      </div>
    )
  }

  function formatBirthDate(birthDate: string): string {
    if (birthDate.length !== 6) return "Invalid date"

    const yearPrefix = ["0", "1", "2"].includes(birthDate[0]) ? "20" : "19" // 0, 1, 2로 시작하면 2000년대, 그 외는 1900년대
    const year = yearPrefix + birthDate.substring(0, 2) // 첫 두 자리를 연도로
    const month = birthDate.substring(2, 4) // 중간 두 자리를 월로
    const day = birthDate.substring(4, 6) // 마지막 두 자리를 일로

    return `${year} 년 ${month} 월 ${day} 일`
  }

  const handleWithdrawal = () => {}
  const handleChangePW = () => {}
  return (
    <div className="flex h-full w-full flex-col space-y-8">
      <div className="h-[250px] w-full">
        <Heading title="내 정보" />
        <div className="m-5 flex h-44 items-center">
          <div className="relative">
            <img
              src={child.profileImgUrl || "/images/profile.jpg"}
              alt="프로필사진"
              onError={(e) => {
                e.currentTarget.src = "/images/ping.JPG" // 이미지 로드 실패 시 기본 이미지로 대체
              }}
              className="m-8 h-36 w-36 rounded-full object-cover"
              // className="size-16"
            />
            <div className="absolute bottom-8 end-8 rounded-full bg-secondary-200 p-1">
              <EditIcon />
            </div>
          </div>
          <div className="h-full pl-4 pt-10">
            <div className="m-2 text-lg">{Element("아이디", child.userId)}</div>
            <div className="m-2 text-lg">{Element("이름", child.name)}</div>
            <div className="m-2 text-lg">
              {Element("생일", formatBirthDate(child.birthDay))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[200px] w-full">
        <Heading title="비밀번호 변경" />
        <div className="flex w-full flex-col items-end justify-end pr-10 pt-4">
          <input
            type="password"
            className="m-2 h-[35px] w-[250px] rounded-md border p-2"
            value={inputValue} // 숫자 세 자리마다 쉼표
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInputValue(e.target.value) // 상태 업데이트
            }}
            placeholder="변경할 비밀번호"
          />
          <input
            type="password"
            className="m-2 h-[35px] w-[250px] rounded-md border p-2"
            value={inputValue2} // 숫자 세 자리마다 쉼표
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInputValue2(e.target.value) // 상태 업데이트
            }}
            placeholder="변경할 비밀번호 확인"
          />
          <button
            onClick={handleChangePW}
            className="m-2 w-[130px] rounded-lg bg-secondary-m2 px-6 py-2 text-sm font-normal text-white"
          >
            비밀번호 변경
          </button>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <Heading title="탈퇴" />
        <div className="flex w-full justify-end pr-10 pt-4">
          <button
            onClick={handleWithdrawal}
            className="m-2 w-[130px] rounded-lg bg-secondary-m2 px-6 py-2 text-sm font-normal text-white"
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  )
}
export default ChildPage
