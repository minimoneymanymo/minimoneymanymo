import {getMyChildren} from "@/api/user-api"
import {useEffect, useState} from "react"
import {Child} from "./types"
import MyChildItem from "./MyChildItem"

interface MyChildrenListProps {
  refreshChildrenList: boolean // 부모로부터 받은 prop
}

function MyChildrenList({
  refreshChildrenList,
}: MyChildrenListProps): JSX.Element {
  const [childrenList, setChildrenList] = useState<Child[]>([])
  useEffect(() => {
    const fetchchildrenList = async () => {
      const res = await getMyChildren()
      console.log(res.data)
      if (res) {
        setChildrenList(res.data)
      }
    }
    fetchchildrenList()
  }, [refreshChildrenList])
  return (
    <>
      <div className="flex w-full flex-col h-1/2 ">
        <div className="flex h-12 w-full items-center border-b border-gray-300 font-bold">
          <span className="m-4">등록된 자녀</span>
        </div>
        <ul className="overflow-auto">
          {childrenList?.map((child) => (
            <li key={child.childrenId} className="m-5 border">
              <MyChildItem child={child} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default MyChildrenList
