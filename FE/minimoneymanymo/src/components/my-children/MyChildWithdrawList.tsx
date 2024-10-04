import WithdrawablReqItem from "../child/WithdrawalReqItem"
import Heading from "../common/Heading"
import { useChild } from "../context/ChildContext"
import { useEffect, useState } from "react"
import { WithdrawableMoneyProps } from "@/types/accountTypes"
import { getChildWithdrawListApi } from "@/api/fund-api"

function MyChildWithdrawList(): JSX.Element {
  const { child, fetchChild } = useChild()
  const [requestList, setRequestList] = useState<WithdrawableMoneyProps[]>([])

  const getChildWithdrawList = async () => {
    if (child?.userId) {
      const res = await getChildWithdrawListApi(child?.userId)
      console.log(res)
      if (res.stateCode === 200) {
        setRequestList(res.data)
      } else {
        if (res.message) {
          alert(res.message)
        } else {
          alert("에러가 발생했습니다. 다시 시도해주세요")
        }
      }
    }
  }

  const handleApprove = async () => {
    getChildWithdrawList()
    await fetchChild()
  }

  useEffect(() => {
    getChildWithdrawList()
  }, [])

  return (
    <div>
      <Heading title="출금 요청" />
      <div className="px-8 py-4">
        {requestList.map((item, index) => (
          <WithdrawablReqItem
            key={index}
            {...item}
            isParent={true}
            onApprove={handleApprove}
          />
        ))}
      </div>
    </div>
  )
}
export default MyChildWithdrawList
