import { useEffect, useState } from "react"

interface PriceFilterProps {
  temporaryFilters: {
    priceMin: number | null
    priceMax: number | null
  }
  handlePriceRangeChange: (min: number, max: number) => void
  handlePresetPrice: (min: number, max: number | null) => void
}

export function PriceFilter({
  temporaryFilters,
  handlePriceRangeChange,
  handlePresetPrice,
}: PriceFilterProps) {
  const INF = 1000000000000
  const [selectedButton, setSelectedButton] = useState<string | null>(null)
  const [minValue, setMinValue] = useState<number | "">(
    temporaryFilters.priceMin || ""
  )
  const [maxValue, setMaxValue] = useState<number | "">(
    temporaryFilters.priceMax || ""
  )

  useEffect(() => {
    if (
      temporaryFilters.priceMin === 0 &&
      temporaryFilters.priceMax === 10000
    ) {
      setSelectedButton("0-10000")
    } else if (
      temporaryFilters.priceMin === 10000 &&
      temporaryFilters.priceMax === 50000
    ) {
      setSelectedButton("10000-50000")
    } else if (temporaryFilters.priceMax === INF) {
      setSelectedButton(`0-${INF}`)
    } else {
      setSelectedButton(null)
    }

    setMinValue(temporaryFilters.priceMin || "")
    setMaxValue(temporaryFilters.priceMax || "")
  }, [temporaryFilters])

  const handleMinChange = (value: string) => {
    const numValue = value === "" ? null : Number(value)
    setMinValue(numValue as number)
    if (numValue !== null) handlePriceRangeChange(numValue, maxValue || INF)
  }

  const handleMaxChange = (value: string) => {
    const numValue = value === "" ? null : Number(value)
    setMaxValue(numValue as number)
    if (numValue !== null) handlePriceRangeChange(minValue || 0, numValue)
  }

  const handleButtonClick = (min: number, max: number | null) => {
    handlePresetPrice(min, max)
    setSelectedButton(`${min}-${max}`)
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">주가</h3>
      <p className="mb-4 text-gray-600">최소 가격과 최대 가격을 선택하세요.</p>
      <p className="mb-4 text-gray-600">
        1주당 가격을 뜻해요. 당일 4:30에 집계되었어요.
      </p>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleButtonClick(0, 10000)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "0-10000" ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          0 이상 ~ 10,000 이하
        </button>
        <button
          onClick={() => handleButtonClick(10000, 50000)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "10000-50000" ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          10,000 이상 ~ 50,000 이하
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

      {selectedButton === `0-${INF}` && (
        <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 shadow-md">
          <h3 className="text-xl font-semibold">가격 설정</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minValue === null ? "" : minValue}
              onChange={(e) => handleMinChange(e.target.value)}
              className="w-64 rounded-md border border-gray-300 p-2 text-right focus:border-gray-400 focus:outline-none focus:ring-0"
              placeholder="최소값"
            />
            <span>~</span>
            <input
              type="number"
              value={maxValue === null ? "" : maxValue}
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
