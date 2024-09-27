import { useState } from "react"
import { Slider } from "@material-tailwind/react"

interface PERFilterProps {
  temporaryFilters: {
    perMin: number | null
    perMax: number | null
  }
  handlePERRangeChange: (min: number, max: number) => void
  handlePresetPER: (min: number, max: number | null) => void
}

export function PERFilter({
  temporaryFilters,
  handlePERRangeChange,
  handlePresetPER,
}: PERFilterProps) {
  const INF = 1000000000000
  const [selectedButton, setSelectedButton] = useState<string | null>(null)
  const [showSlider, setShowSlider] = useState<boolean>(false)
  const [minValue, setMinValue] = useState<number | "">(
    temporaryFilters.perMin || ""
  )
  const [maxValue, setMaxValue] = useState<number | "">(
    temporaryFilters.perMax || ""
  )

  const handleMinChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value)
    setMinValue(numValue)
    if (numValue !== "") handlePERRangeChange(numValue, maxValue || 0)
  }

  const handleMaxChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value)
    setMaxValue(numValue)
    if (numValue !== "") handlePERRangeChange(minValue || 0, numValue)
  }

  const handleButtonClick = (min: number, max: number | null) => {
    handlePresetPER(min, max) // Correctly trigger handlePresetPER here
    setSelectedButton(`${min}-${max}`)
    setShowSlider(max === INF) // Toggle slider visibility only if max is null
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">PER</h3>
      <p className="mb-4 text-gray-600">PER을 선택하세요.</p>
      <p className="mb-4 text-gray-600">
        주가를 주당순이익으로 나눈 값으로 PER이 낮을수록 기업이 내는 이익에 비해
        주가가 저평가 되어 있다는 의미에요.
      </p>

      {/* 사전 설정된 범위 선택 */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleButtonClick(0, 10)} // Use handleButtonClick to properly manage state
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "0-10" ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          0배 이상 ~ 10배 미만
        </button>
        <button
          onClick={() => handleButtonClick(10, 20)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "10-20" ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          10배 이상 ~ 20배 미만
        </button>
        <button
          onClick={() => handleButtonClick(0, INF)} // Correctly trigger showSlider
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
          <h3 className="text-xl font-semibold">PER 설정</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minValue}
              onChange={(e) => handleMinChange(e.target.value)}
              className="w-64 rounded-md border border-gray-300 p-2 text-right focus:border-gray-400 focus:outline-none focus:ring-0"
              placeholder="이상"
            />
            <span>~</span>
            <input
              type="number"
              value={maxValue}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="f w-64 rounded-md border border-gray-300 p-2 text-right focus:border-gray-400 focus:outline-none focus:ring-0"
              placeholder="이하"
            />
          </div>
        </div>
      )}
    </div>
  )
}
