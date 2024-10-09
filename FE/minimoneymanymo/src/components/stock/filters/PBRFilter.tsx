import { useEffect, useState } from "react"
import { Slider } from "@material-tailwind/react"

interface PBRFilterProps {
  temporaryFilters: {
    pbrMin: number | null
    pbrMax: number | null
  }
  handlePBRRangeChange: (min: number, max: number) => void
  handlePresetPBR: (min: number, max: number | null) => void
}

export function PBRFilter({
  temporaryFilters,
  handlePBRRangeChange,
  handlePresetPBR,
}: PBRFilterProps) {
  const INF = 1000000000000
  const [selectedButton, setSelectedButton] = useState<string | null>(null)
  const [showSlider, setShowSlider] = useState<boolean>(false)
  const [minValue, setMinValue] = useState<number | "">(
    temporaryFilters.pbrMin || ""
  )
  const [maxValue, setMaxValue] = useState<number | "">(
    temporaryFilters.pbrMax || ""
  )

  // temporaryFilters 값이 변경될 때마다 상태를 업데이트
  useEffect(() => {
    if (temporaryFilters.pbrMin === 0 && temporaryFilters.pbrMax === 1) {
      setSelectedButton("0-1")
      setShowSlider(false)
    } else if (temporaryFilters.pbrMin === 1 && temporaryFilters.pbrMax === 3) {
      setSelectedButton("1-3")
      setShowSlider(false)
    } else if (temporaryFilters.pbrMax === INF) {
      setSelectedButton(`0-${INF}`)
      setShowSlider(true)
    } else {
      setSelectedButton(null)
      setShowSlider(false)
    }
    setMinValue(temporaryFilters.pbrMin || "")
    setMaxValue(temporaryFilters.pbrMax || "")
  }, [temporaryFilters])

  const handleMinChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value)
    setMinValue(numValue)
    if (numValue !== "") handlePBRRangeChange(numValue, maxValue || 0)
  }

  const handleMaxChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value)
    setMaxValue(numValue)
    if (numValue !== "") handlePBRRangeChange(minValue || 0, numValue)
  }

  const handleButtonClick = (min: number, max: number | null) => {
    handlePresetPBR(min, max)
    setSelectedButton(`${min}-${max}`)
    setShowSlider(max === INF) // Toggle slider visibility only if max is INF
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">PBR</h3>
      <p className="mb-4 text-gray-600">PBR을 선택하세요.</p>
      <p className="mb-4 text-gray-600">
        주가를 주당순자산으로 나눈 값으로, PBR이 낮을수록 기업의 실제 자산가치
        대비 주가가 저평가 되어 있다는 의미에요.
      </p>

      {/* 사전 설정된 범위 선택 */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleButtonClick(0, 1)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "0-1" ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          0배 이상 ~ 1배 미만
        </button>
        <button
          onClick={() => handleButtonClick(1, 3)}
          className={`flex-1 rounded-lg px-4 py-5 ${
            selectedButton === "1-3" ? "bg-secondary-m3" : "bg-gray-200"
          } text-sm`}
        >
          1배 이상 ~ 3배 미만
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
