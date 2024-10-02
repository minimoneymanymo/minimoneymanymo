import { useState } from "react"
import { RecordItemProps } from "@/types/accountTypes"
import { formatDateTime } from "@/utils/datefuntion"

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
    const dateKey = item.createdAt.substring(0, 8)
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(item)
    return groups
  }, {})
}

interface RecordFormProps {
  data: RecordItemProps[]
  isMoneyList: boolean
}

const RecordForm: React.FC<RecordFormProps> = ({ data, isMoneyList }) => {
  const groupedData = groupByDate(data)
  const [expandedItem, setExpandedItem] = useState<RecordItemProps | null>(null)

  const handleToggle = (item: RecordItemProps) => {
    if (!isMoneyList) {
      setExpandedItem((prev) => (prev === item ? null : item))
    }
  }

  return (
    <div
      className={`${
        isMoneyList
          ? "mx-8 my-3 rounded-2xl bg-white px-8 pt-4 shadow-md"
          : "my-3 rounded-2xl bg-white px-8 pt-4 shadow-md"
      }`}
    >
      {Object.keys(groupedData)
        .sort((a, b) => b.localeCompare(a))
        .map((date) => (
          <div key={date} className="mb-4 flex flex-row">
            {/* 날짜 구분 */}
            <h2 className="mr-5 text-xl font-bold text-gray-500">
              {formatTime(date, true)}
            </h2>

            {/* 해당 날짜의 거래 기록 */}
            <div className="flex w-full flex-col">
              {groupedData[date].map((item, index) => (
                <div key={index}>
                  <RecordItem {...item} onToggle={() => handleToggle(item)} />
                  {expandedItem === item && (
                    <div className="mb-5 flex flex-row border-y border-t-gray-300 px-6 py-5">
                      <div className="flex flex-[2] flex-col">
                        {/* 거래 유형에 따라 isNegative 결정 */}
                        <div className="flex flex-row justify-between">
                          <span className="mb-3 text-lg font-bold">
                            {item.companyName}
                          </span>
                          <span
                            className={`mb-3 text-lg font-bold ${item.tradeType == "1" || item.tradeType == "4" ? "text-blue-500" : "text-red-500"}`}
                          >
                            {item.tradeType == "1" || item.tradeType == "4"
                              ? `- ${Number(item.amount).toLocaleString()}`
                              : `+ ${Number(item.amount).toLocaleString()}`}{" "}
                            머니
                          </span>
                        </div>
                        <div className="mb-1 flex flex-row justify-between text-gray-500">
                          <span>거래유형</span>
                          <span>{printType(item.tradeType)}</span>
                        </div>
                        <div className="flex flex-row justify-between text-gray-500">
                          <span>일시</span>
                          <span>{formatDateTime(item.createdAt)}</span>
                        </div>
                      </div>
                      <div className="ml-10 flex flex-[3] flex-col">
                        <div className="mb-3 flex justify-between">
                          <span className="text-gray-500">이유</span>
                          <span
                            className={
                              item.reasonBonusMoney
                                ? "text-primary-m1"
                                : "text-gray-400"
                            }
                          >
                            {item.reasonBonusMoney
                              ? `${item.reasonBonusMoney} 머니`
                              : "미지급"}
                          </span>
                        </div>
                        <span className="text-black">{item.reason}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}

interface RecordItemPropsExtended extends RecordItemProps {
  onToggle: () => void
}

const RecordItem: React.FC<RecordItemPropsExtended> = ({
  onToggle,
  createdAt,
  tradeType,
  amount,
  remainAmount,
  companyName,
}) => {
  const isNegative = tradeType === "1" || tradeType === "4"
  const formattedAmount = isNegative
    ? `- ${Number(amount).toLocaleString()}`
    : `+ ${Number(amount).toLocaleString()}`
  const amountColor = isNegative ? "text-blue-500" : "text-red-500"

  return (
    <div
      className="flex w-full cursor-pointer justify-between pb-6"
      onClick={onToggle}
    >
      <div className="flex flex-col">
        <b>{companyName || printType(tradeType)}</b>
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
