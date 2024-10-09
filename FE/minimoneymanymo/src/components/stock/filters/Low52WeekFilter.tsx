import { useEffect, useState } from "react"

interface Low52WeekFilterProps {
  temporaryFilters: {
    low52WeekMin: number | null
    low52WeekMax: number | null
  }
  handleLow52WeekRangeChange: (min: number, max: number) => void
  handlePresetLow52Week: (min: number, max: number | null) => void
}

export function Low52WeekFilter({
  temporaryFilters,
  handleLow52WeekRangeChange,
  handlePresetLow52Week,
}: Low52WeekFilterProps) {
  const INF = 1000000000000
  const [selectedButton, setSelectedButton] = useState<string | null>(null)
  const [showSlider, setShowSlider] = useState<boolean>(false)
  const [minValue, setMinValue] = useState<number | "">(
    temporaryFilters.low52WeekMin || ""
  )
  const [maxValue, setMaxValue] = useState<number | "">(
    temporaryFilters.low52WeekMax || ""
  )

  useEffect(() => {
    if (
      temporaryFilters.low52WeekMin === 0 &&
      temporaryFilters.low52WeekMax === 100000
    ) {
      setSelectedButton("0-100000")
      setShowSlider(false)
    } else if (
      temporaryFilters.low52WeekMin === 100000 &&
      temporaryFilters.low52WeekMax === 500000
    ) {
      setSelectedButton("100000-500000")
      setShowSlider(false)
    } else if (temporaryFilters.low52WeekMax === INF) {
      setSelectedButton(`0-${INF}`)
      setShowSlider(true)
    } else {
      setSelectedButton(null)
      setShowSlider(false)
    }

    setMinValue(temporaryFilters.low52WeekMin || "")
    setMaxValue(temporaryFilters.low52WeekMax || "")
  }, [temporaryFilters])

  const handleMinChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value)
    setMinValue(numValue)
    if (numValue !== "") handleLow52WeekRangeChange(numValue, maxValue || 0)
  }

  const handleMaxChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value)
    setMaxValue(numValue)
    if (numValue !== "") handleLow52WeekRangeChange(minValue || 0, numValue)
  }

  const handleButtonClick = (min: number, max: number | null) => {
    handlePresetLow52Week(min, max)
    setSelectedButton(`${min}-${max}`)
    setShowSlider(max === INF)
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">52주 최저가</h3>
      <p className="mb-4 text-gray-600">52주 최저가를 선택하세요.</p>
      <p className="mb-4 text-gray-600">
        52주 동안 기록된 주가 중에서 가장 낮은 주가를 뜻해요. 오늘의 52주
        최저가를 검색해보세요.
      </p>

      {/* 사전 설정된 범위 선택 */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleButtonClick(0, 100000)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "0-100000" ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          0 ~ 100,000원
        </button>
        <button
          onClick={() => handleButtonClick(100000, 500000)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "100000-500000"
              ? "bg-secondary-m3"
              : "bg-gray-200"
          } text-sm`}
        >
          100,000 ~ 500,000원
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

      {/* 슬라이더를 사용한 사용자 정의 설정 */}
      {showSlider && (
        <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 shadow-md">
          <h3 className="text-xl font-semibold">52주 최저가 설정</h3>
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