import { useEffect, useState } from "react"

interface ChangeRateFilterProps {
  temporaryFilters: {
    changeRateMin: number | null
    changeRateMax: number | null
  }
  handleChangeRateRangeChange: (min: number, max: number) => void
  handlePresetChangeRate: (min: number, max: number | null) => void
}

export function ChangeRateFilter({
  temporaryFilters,
  handleChangeRateRangeChange,
  handlePresetChangeRate,
}: ChangeRateFilterProps) {
  const INF = 1000000000000
  const [selectedButton, setSelectedButton] = useState<string | null>(null)
  const [showSlider, setShowSlider] = useState<boolean>(false)
  const [minValue, setMinValue] = useState<number | "">(
    temporaryFilters.changeRateMin || ""
  )
  const [maxValue, setMaxValue] = useState<number | "">(
    temporaryFilters.changeRateMax || ""
  )

  useEffect(() => {
    if (
      temporaryFilters.changeRateMin === -5 &&
      temporaryFilters.changeRateMax === 5
    ) {
      setSelectedButton("-5-5")
      setShowSlider(false)
    } else if (
      temporaryFilters.changeRateMin === -10 &&
      temporaryFilters.changeRateMax === 10
    ) {
      setSelectedButton("-10-10")
      setShowSlider(false)
    } else if (temporaryFilters.changeRateMax === INF) {
      setSelectedButton(`-0-${INF}`)
      setShowSlider(true)
    } else {
      setSelectedButton(null)
      setShowSlider(false)
    }

    setMinValue(temporaryFilters.changeRateMin || "")
    setMaxValue(temporaryFilters.changeRateMax || "")
  }, [temporaryFilters])

  const handleMinChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value)
    setMinValue(numValue)
    if (numValue !== "") handleChangeRateRangeChange(numValue, maxValue || 0)
  }

  const handleMaxChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value)
    setMaxValue(numValue)
    if (numValue !== "") handleChangeRateRangeChange(minValue || 0, numValue)
  }

  const handleButtonClick = (min: number, max: number | null) => {
    handlePresetChangeRate(min, max)
    setSelectedButton(`${min}-${max}`)
    setShowSlider(max === INF)
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">주가 등락률</h3>
      <p className="mb-4 text-gray-600">주가 등락률을 선택하세요.</p>
      <p className="mb-4 text-gray-600">
        주가 등락률은 주가가 일정 기간 동안 얼마나 올랐거나 내렸는지를 나타내는
        지표에요.
      </p>

      {/* 사전 설정된 범위 선택 */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleButtonClick(-5, 5)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "-5-5" ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          -5% 이상 ~ +5% 이하
        </button>
        <button
          onClick={() => handleButtonClick(-10, 10)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "-10-10" ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          -10% 이상 ~ +10% 이하
        </button>
        <button
          onClick={() => handleButtonClick(-INF, INF)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === `-0-${INF}` ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          직접 설정
        </button>
      </div>

      {/* 슬라이더를 사용한 사용자 정의 설정 */}
      {showSlider && (
        <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 shadow-md">
          <h3 className="text-xl font-semibold">주가 등락률 설정</h3>
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
