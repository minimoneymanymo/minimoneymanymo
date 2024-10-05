import { StockHeld } from "@/types/stockTypes"
import React from "react"
import { useNavigate } from "react-router-dom"

const StockHeldSmallItem: React.FC<StockHeld> = (props) => {
  const {
    stockCode,
    remainSharesCount,
    totalAmount,
    companyName,
    marketName,
    closingPrice,
    priceChange,
    stockPriceChangeRate,
  } = props

  const navigate = useNavigate()

  const getTextColor = (value: number) => {
    if (value > 0) return "text-red-500"
    if (value < 0) return "text-blue-500"
    return "text-black"
  }

  const formatPriceChange = (value: number) => {
    if (value > 0) {
      return `▲ ${value.toLocaleString()}`
    } else if (value < 0) {
      return `▼ ${Math.abs(value).toLocaleString()}` // 음수일 때 절대값으로 변환
    } else {
      return `${value.toLocaleString()}`
    }
  }

  const movePage = () => {
    navigate(`/stock/${stockCode}`)
  }

  return (
    <div
      onClick={movePage}
      className="mr-4 mt-3 flex min-w-[250px] flex-col rounded-xl bg-white p-4 shadow-md"
    >
      <span className="text-sm text-gray-500">
        {stockCode} {marketName}
      </span>
      <span className="text-lg font-bold">{companyName}</span>
      <div className="flex items-center justify-between">
        <span className={`text-2xl font-bold ${getTextColor(priceChange)}`}>
          {closingPrice.toLocaleString()}{" "}
        </span>
        <span className={`text-sm ${getTextColor(priceChange)}`}>
          {formatPriceChange(priceChange)}원 ({stockPriceChangeRate}%)
        </span>
      </div>
      <div className="mt-2 flex justify-between">
        보유 주식 수<span className="font-bold">{remainSharesCount} 주</span>
      </div>
      <div className="flex justify-between">
        보유 금액
        <span className="font-bold">{totalAmount.toLocaleString()} 머니</span>
      </div>
    </div>
  )
}

export default StockHeldSmallItem
