import { WithdrawableMoneyProps } from "@/types/accountTypes"

function formatDate(dateString: string, allFlag: boolean): string {
  // 문자열을 연도, 월, 일로 분리
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)

  // 포맷팅된 문자열 반환
  return allFlag ? `${year}.${month}.${day}` : `${month}.${day}`
}

const WithdrawablReqItem: React.FC<WithdrawableMoneyProps> = (props) => {
  let { createdAt, amount, approvedAt } = props
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
        {approvedAt ? (
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
