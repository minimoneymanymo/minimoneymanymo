import { RecordItemProps } from "@/types/accountTypes"

function formatTime(dateString: string, isDate: boolean): string {
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  const hour = dateString.substring(8, 10)
  const minute = dateString.substring(10, 12)

  return isDate ? `${month}.${day}` : `${hour}:${minute}`
}

function printType(type: string): string {
  switch (type) {
    case "0":
      return "입금"
    case "1":
      return "출금"
    case "2":
      return "퀴즈보상"
    case "3":
      return "이유보상"
    case "4":
      return "매수"
    case "5":
      return "매도"
    default:
      return "기타"
  }
}

function groupByDate(items: RecordItemProps[]) {
  return items.reduce((groups: { [key: string]: RecordItemProps[] }, item) => {
    // reduce: 배열을 순회하며 하나의 결과로 축약
    const dateKey = item.createdAt.substring(0, 8) // yyyyMMdd 형식의 날짜 추출
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(item)
    return groups
  }, {})
}

const RecordForm: React.FC<{ data: RecordItemProps[] }> = ({ data }) => {
  const groupedData = groupByDate(data)

  return (
    <div className="mx-5 my-3 rounded-2xl bg-white px-4 pt-4 shadow-md">
      {Object.keys(groupedData)
        .sort((a, b) => b.localeCompare(a))
        .map((date) => (
          <div key={date} className="flex flex-row">
            {/* 날짜 구분 */}
            <h2 className="mr-5 text-xl font-bold text-gray-500">
              {formatTime(date, true)}
            </h2>

            {/* 해당 날짜의 거래 기록 */}
            <div className="mb-3 w-full">
              {groupedData[date].map((item, index) => (
                <RecordItem key={index} {...item} />
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
const RecordItem: React.FC<RecordItemProps> = (props) => {
  let { createdAt, tradeType, amount, remainAmount, companyName } = props

  // 트레이트 타입에 따라 텍스트 및 색상 설정
  const isNegative = tradeType === "1" || tradeType === "4"
  const formattedAmount = isNegative
    ? `- ${Number(amount).toLocaleString()}`
    : `+ ${Number(amount).toLocaleString()}`
  const amountColor = isNegative ? "text-blue-500" : "text-red-500"

  return (
    <div className="flex w-full justify-between pb-6">
      <div className="flex flex-col">
        <b className="text-">{companyName || printType(tradeType)}</b>
        <span className="mt-1 text-sm text-gray-500">
          {formatTime(createdAt, false)} | {printType(tradeType)}
        </span>
      </div>
      <div className="flex flex-col text-end">
        <b className={amountColor}>{formattedAmount} 머니</b>
        <span className="mt-1 text-sm text-gray-500">
          {Number(remainAmount).toLocaleString()} 머니
        </span>
      </div>
    </div>
  )
}

export default RecordForm
