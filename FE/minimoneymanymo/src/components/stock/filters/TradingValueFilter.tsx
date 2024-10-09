import { useEffect, useState } from "react"

interface TradingValueFilterProps {
  temporaryFilters: {
    tradingValueMin: number | null
    tradingValueMax: number | null
  }
  handleTradingValueRangeChange: (min: number, max: number) => void
  handlePresetTradingValue: (min: number, max: number | null) => void
}

export function TradingValueFilter({
  temporaryFilters,
  handleTradingValueRangeChange,
  handlePresetTradingValue,
}: TradingValueFilterProps) {
  const INF = 1000000000000
  const [selectedButton, setSelectedButton] = useState<string | null>(null)
  const [showSlider, setShowSlider] = useState<boolean>(false)
  const [minValue, setMinValue] = useState<number | "">(
    temporaryFilters.tradingValueMin || ""
  )
  const [maxValue, setMaxValue] = useState<number | "">(
    temporaryFilters.tradingValueMax || ""
  )

  useEffect(() => {
    const { tradingValueMin, tradingValueMax } = temporaryFilters
    if (tradingValueMin === 0 && tradingValueMax === 100000000) {
      setSelectedButton("0-100000000")
      setShowSlider(false)
    } else if (tradingValueMin === 100000000 && tradingValueMax === 500000000) {
      setSelectedButton("100000000-500000000")
      setShowSlider(false)
    } else if (tradingValueMax === INF) {
      setSelectedButton(`0-${INF}`)
      setShowSlider(true)
    } else {
      setSelectedButton(null)
      setShowSlider(false)
    }
  }, [temporaryFilters])

  const handleMinChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value)
    setMinValue(numValue)
    if (numValue !== "") handleTradingValueRangeChange(numValue, maxValue || 0)
  }

  const handleMaxChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value)
    setMaxValue(numValue)
    if (numValue !== "") handleTradingValueRangeChange(minValue || 0, numValue)
  }

  const handleButtonClick = (min: number, max: number | null) => {
    if (selectedButton !== `${min}-${max}`) {
      handlePresetTradingValue(min, max)
      setSelectedButton(`${min}-${max}`)
      setShowSlider(max === INF)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">거래대금</h3>
      <p className="mb-4 text-gray-600">거래대금을 선택하세요.</p>
      <p className="mb-4 text-gray-600">
        거래 대금은 일정 기간동안 거래된 총거래대금을 일수로 나눈 값을 의미해요.
        하루 동안의 주식 거래 대금의 총액입니다. 선택한 거래대금 범위 내에서
        검색합니다.
      </p>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleButtonClick(0, 100000000)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "0-100000000" ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          0 ~ 100,000,000원
        </button>
        <button
          onClick={() => handleButtonClick(100000000, 500000000)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "100000000-500000000"
              ? "bg-secondary-m3"
              : "bg-gray-200"
          } text-sm`}
        >
          100,000,000 ~ 500,000,000원
        </button>
        <button
          onClick={() => handleButtonClick(0, INF)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === `0-${INF}` ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          직접 설정
        </button>
      </div>

      {showSlider && (
        <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 shadow-md">
          <h3 className="text-xl font-semibold">거래대금 설정</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minValue}
              onChange={(e) => handleMinChange(e.target.value)}
              className="w-64 rounded-md border border-gray-300 p-2 text-right focus:border-gray-400 focus:outline-none focus:ring-0"
              placeholder="최소값"
            />
            <span>~</span>
            <input
              type="number"
              value={maxValue}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="w-64 rounded-md border border-gray-300 p-2 text-right focus:border-gray-400 focus:outline-none focus:ring-0"
              placeholder="최대값"
            />
          </div>
        </div>
      )}
    </div>
  )
}
