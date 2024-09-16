import {getMyChildren} from "@/api/user-api"
import {useEffect, useState} from "react"
import {Child} from "./types"
import MyChildItem from "./MyChildItem"
import {useNavigate} from "react-router-dom"
import Heading from "../common/Heading"

interface MyChildrenListProps {
  refreshChildrenList: boolean // 부모로부터 받은 prop
}

function MyChildrenList({
  refreshChildrenList,
}: MyChildrenListProps): JSX.Element {
  const [childrenList, setChildrenList] = useState<Child[]>([])
  const navigate = useNavigate()
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
      <div className="flex h-1/2 w-full flex-col">
        <Heading title="등록된 자녀" />
        <ul className="overflow-auto">
          {childrenList?.map((child) => (
            <li
              key={child.childrenId}
              className=" "
              onClick={() => {
                navigate(`/parent/my-child/${child.childrenId}/finance`, {
                  state: {child},
                })
              }}
            >
              <MyChildItem child={child} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default MyChildrenList
