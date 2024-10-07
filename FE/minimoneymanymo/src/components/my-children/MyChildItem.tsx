import { Children } from "./types"

interface MyChildProps {
  child: Children | Children
}

function MyChildItem({ child }: MyChildProps): JSX.Element {
  const Element = (key: string, value: number | undefined): JSX.Element => {
    return (
      <div className="flex w-full">
        <span className="w-[110px]">{key}</span>
        <span className="flex-1 text-right">
          {value ? Math.floor(value).toLocaleString() : "-"}
          &nbsp;&nbsp;&nbsp;머니
        </span>
      </div>
    )
  }

  return (
    <div className="m-5 flex h-44 items-center rounded-lg bg-white shadow-md">
      <img
        src={child.profileimgUrl || "/images/ping.JPG"}
        alt="프로필사진"
        onError={(e) => {
          e.currentTarget.src = "/images/ping.JPG" // 이미지 로드 실패 시 기본 이미지로 대체
        }}
        className="m-8 h-32 w-36 rounded-md border object-cover"
        // className="size-16"
      />
      <div>
        <p className="mb-3 text-2xl font-semibold">{child.name}</p>
        {/* <p>User ID: {child.userId}</p> */}
        <div className="">
          {Element("보유머니", child.money)}
          {Element("평가금", child.totalAmount)}
          {Element("출금가능금액", child.withdrawableMoney)}
        </div>
      </div>
    </div>
  )
}

export default MyChildItem
