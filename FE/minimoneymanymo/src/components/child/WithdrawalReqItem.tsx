import { approveRequestApi } from "@/api/fund-api"
import { useAppSelector } from "@/store/hooks"
import { selectParent } from "@/store/slice/parent"
import { WithdrawableMoneyProps } from "@/types/accountTypes"
import { useChild } from "../context/ChildContext"
import Swal from "sweetalert2"
function formatDate(dateString: string, allFlag: boolean): string {
  // 문자열을 연도, 월, 일로 분리
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)

  // 포맷팅된 문자열 반환
  return allFlag ? `${year}.${month}.${day}` : `${month}.${day}`
}

interface WithdrawablReqItemProps extends WithdrawableMoneyProps {
  onApprove?: () => void // 이벤트 핸들러 타입 정의
}

const WithdrawablReqItem: React.FC<WithdrawablReqItemProps> = (props) => {
  let { createdAt, amount, approvedAt, isParent, onApprove } = props
  const parent = useAppSelector(selectParent)
  const { child } = useChild()

  const approveRequest = async () => {
    const param = {
      childrenId: child?.userId,
      createdAt: createdAt,
      amount: amount,
      userKey: parent.userKey,
    }
    const res = await approveRequestApi(param)
    if (res.stateCode === 201) {
      if (onApprove) {
        onApprove()
      }
    } else {
      //alert(res.message || "오류가 발생했습니다. 다시 시도해주세요.")
      Swal.fire({
        icon: "error",
        title: `오류가 발생했습니다.`,
      })
    }
  }

  return (
    <div className="mb-3 flex justify-between">
      {/* 앞 */}
      <div className="flex flex-row items-center">
        <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-300">
          <span className="text-md font-bold">$</span>
        </div>
        {formatDate(createdAt, true)}
      </div>

      {/* 뒤 */}
      <div className="flex flex-row items-center">
        <b className="mr-16">{Number(amount).toLocaleString()}원</b>
        {isParent ? (
          approvedAt ? (
            <button className="rounded-lg border border-secondary-m2 bg-secondary-m2 bg-transparent px-6 py-2 text-sm text-secondary-m2">
              완료
            </button>
          ) : (
            <div>
              <button
                onClick={approveRequest}
                className="rounded-lg bg-secondary-m2 px-6 py-2 text-sm text-white"
              >
                지급
              </button>
            </div>
          )
        ) : approvedAt ? (
          <div>
            <span className="text-primary-m1">
              {formatDate(approvedAt, false)} 승인
            </span>
          </div>
        ) : (
          <span className="ml-8 text-gray-400">미승인</span>
        )}
      </div>
    </div>
  )
}
export default WithdrawablReqItem
