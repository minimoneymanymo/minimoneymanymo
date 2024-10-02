import { StockHeld } from "@/types/stockTypes"
import React from "react"
import { useNavigate } from "react-router-dom"

const StockHeldItem: React.FC<StockHeld> = (props) => {
  const {
    stockCode,
    remainSharesCount,
    totalAmount,
    companyName,
    marketName,
    closingPrice,
    averagePrice,
    evaluateMoney,
    priceChangeRate,
    priceChangeMoney,
  } = props

  const navigate = useNavigate()

  // 가격 변화에 따라 텍스트 색상 설정
  const getTextColor = (value: number) => {
    if (value > 0) return "text-red-500"
    if (value < 0) return "text-blue-500"
    return "text-black"
  }

  const formatWithSign = (value: number) => {
    if (value > 0) {
      return `+ ${Math.round(value * 100) / 100}`
    } else if (value < 0) {
      return `- ${Math.abs(Math.round(value * 100) / 100)}`
    } else {
      return `${Math.round(value * 100) / 100}`
    }
  }

  const movePage = () => {
    navigate(`/stock/${stockCode}`)
  }

  return (
    <div
      onClick={movePage}
      className="flex w-[430px] flex-col rounded-xl bg-white px-6 py-7 shadow-md"
    >
      {/* 상단 */}
      <div className="flex flex-row justify-between">
        <div>
          <div className="text-gray-500">
            {stockCode} {marketName}
          </div>
          <div className="text-xl font-bold"> {companyName}</div>
        </div>
        <div className="mt-6 flex flex-col text-end">
          <div
            className={`text-xl font-bold ${getTextColor(priceChangeMoney)}`}
          >
            {formatWithSign(priceChangeMoney)} 머니
          </div>
          <div className={getTextColor(priceChangeRate)}>
            ({formatWithSign(priceChangeRate)}%)
          </div>
        </div>
      </div>

      {/* 하단 */}
      <div className="mt-5 flex flex-col">
        <div className="flex flex-row justify-between">
          <span>보유 주식 수</span>
          <b>{remainSharesCount} 주</b>
        </div>
        <div className="mt-2 flex flex-row justify-between">
          <div className="flex flex-[1] flex-col">
            <div className="flex flex-row justify-between">
              <span>평균단가</span>
              <span>{averagePrice.toLocaleString()} 머니</span>
            </div>
            <div className="mt-1 flex flex-row justify-between">
              <span>평가머니</span>
              <span>{Math.round(evaluateMoney).toLocaleString()} 머니</span>
            </div>
          </div>
          <div className="ml-10 flex flex-[1] flex-col">
            <div className="flex flex-row justify-between">
              <span>매입머니</span>
              <span>{totalAmount.toLocaleString()} 머니</span>
            </div>
            <div className="mt-1 flex flex-row justify-between">
              <span>현재가</span>
              <span>{closingPrice.toLocaleString()} 머니</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockHeldItem
