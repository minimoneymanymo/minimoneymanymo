import WithdrawablReqItem from "../child/WithdrawalReqItem"
import Heading from "../common/Heading"
import { useChild } from "../context/ChildContext"
import { useEffect, useState } from "react"
import { WithdrawableMoneyProps } from "@/types/accountTypes"
import { getChildWithdrawListApi } from "@/api/fund-api"
import Swal from "sweetalert2"
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
        //alert(res.message || "오류가 발생했습니다. 다시 시도해주세요.")
        Swal.fire({
          title: "오류가 발생했습니다. 다시 시도해주세요.",
          icon: "error",
        })
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
