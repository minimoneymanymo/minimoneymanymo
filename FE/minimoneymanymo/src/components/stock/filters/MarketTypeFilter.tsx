import React, { useEffect, useState } from "react"
import { Radio } from "@material-tailwind/react" // Import Radio from Material Tailwind

interface MarketTypeFilterProps {
  marketType: string | null
  handleMarketTypeChange: (marketType: string) => void
}

export function MarketTypeFilter({
  marketType,
  handleMarketTypeChange,
}: MarketTypeFilterProps) {
  const [selectedMarketType, setSelectedMarketType] = useState<string | null>(
    marketType
  )

  useEffect(() => {
    setSelectedMarketType(marketType)
  }, [marketType])

  const handleRadioChange = (type: string) => {
    setSelectedMarketType(type)
    handleMarketTypeChange(type)
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">시장</h3>
      <p className="mb-4 text-gray-600">시장을 선택하세요.</p>
      <div className="flex flex-col gap-2">
        <Radio
          id="KOSPI"
          name="marketType"
          label="코스피 시장만 보기"
          checked={selectedMarketType === "KOSPI"}
          onChange={() => handleRadioChange("KOSPI")}
          color="green" // Optional: Change color as needed
        />
        <Radio
          id="KOSDAQ"
          name="marketType"
          label="코스닥 시장만 보기"
          checked={selectedMarketType === "KOSDAQ"}
          onChange={() => handleRadioChange("KOSDAQ")}
          color="green" // Optional: Change color as needed
        />
      </div>
    </div>
  )
}
