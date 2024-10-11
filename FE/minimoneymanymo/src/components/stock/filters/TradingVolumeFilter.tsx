import { useEffect, useState } from "react"

interface TradingVolumeFilterProps {
  temporaryFilters: {
    volumeMin: number | null
    volumeMax: number | null
  }
  handleVolumeRangeChange: (min: number, max: number) => void
  handlePresetVolume: (min: number, max: number | null) => void
}

export function TradingVolumeFilter({
  temporaryFilters,
  handleVolumeRangeChange,
  handlePresetVolume,
}: TradingVolumeFilterProps) {
  const INF = 1000000000000
  const [selectedButton, setSelectedButton] = useState<string | null>(null)
  const [showSlider, setShowSlider] = useState<boolean>(false)
  const [minValue, setMinValue] = useState<number | "">(
    temporaryFilters.volumeMin || ""
  )
  const [maxValue, setMaxValue] = useState<number | "">(
    temporaryFilters.volumeMax || ""
  )

  useEffect(() => {
    if (
      temporaryFilters.volumeMin === 0 &&
      temporaryFilters.volumeMax === 1000000
    ) {
      setSelectedButton("0-1000000")
      setShowSlider(false)
    } else if (
      temporaryFilters.volumeMin === 1000000 &&
      temporaryFilters.volumeMax === 5000000
    ) {
      setSelectedButton("1000000-5000000")
      setShowSlider(false)
    } else if (temporaryFilters.volumeMax === INF) {
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
    if (numValue !== "") handleVolumeRangeChange(numValue, maxValue || 0)
  }

  const handleMaxChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value)
    setMaxValue(numValue)
    if (numValue !== "") handleVolumeRangeChange(minValue || 0, numValue)
  }

  const handleButtonClick = (min: number, max: number | null) => {
    handlePresetVolume(min, max)
    setSelectedButton(`${min}-${max}`)
    setShowSlider(max === INF) // 슬라이더 표시 여부
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">거래량</h3>
      <p className="mb-4 text-gray-600">거래량을 선택하세요.</p>
      <p className="mb-4 text-gray-600">
        일정 기간 동안의 총 거래량을 의미합니다. 선택한 거래량 범위 내에서
        검색합니다.
      </p>

      {/* 사전 설정된 범위 선택 */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleButtonClick(0, 1000000)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "0-1000000" ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          0 ~ 1,000,000 주
        </button>
        <button
          onClick={() => handleButtonClick(1000000, 5000000)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "1000000-5000000"
              ? "bg-secondary-m3"
              : "bg-gray-200"
          } text-sm`}
        >
          1,000,000 ~ 5,000,000 주
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
          <h3 className="text-xl font-semibold">거래량 설정</h3>
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
              className="f w-64 rounded-md border border-gray-300 p-2 text-right focus:border-gray-400 focus:outline-none focus:ring-0"
              placeholder="최대값"
            />
          </div>
        </div>
      )}
    </div>
  )
}
