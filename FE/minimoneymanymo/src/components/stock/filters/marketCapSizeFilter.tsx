import React, { useEffect, useState } from "react"
import { Radio } from "@material-tailwind/react" // Import Radio from Material Tailwind

interface MarketCapSizeFilterProps {
  marketCapSize: string | null
  handleMarketCapSizeChange: (marketCapType: string) => void
}

export function MarketCapSizeFilter({
  marketCapSize,
  handleMarketCapSizeChange,
}: MarketCapSizeFilterProps) {
  const [selectedMarketCapSize, setSelectedMarketCapSize] = useState<
    string | null
  >(marketCapSize)

  useEffect(() => {
    setSelectedMarketCapSize(marketCapSize)
  }, [marketCapSize])

  const handleRadioChange = (type: string) => {
    setSelectedMarketCapSize(type)
    handleMarketCapSizeChange(type)
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">시가총액</h3>
      <p className="mb-4 text-gray-600">시가총액을 선택하세요.</p>
      <div className="flex flex-col gap-2">
        <Radio
          id="SMALL"
          name="marketCapSize"
          label="소형주"
          checked={selectedMarketCapSize === "SMALL"}
          onChange={() => handleRadioChange("SMALL")}
          color="green" // Optional: Change color as needed
        />
        <Radio
          id="MEDIUM"
          name="marketCapSize"
          label="중형주"
          checked={selectedMarketCapSize === "MEDIUM"}
          onChange={() => handleRadioChange("MEDIUM")}
          color="green" // Optional: Change color as needed
        />
        <Radio
          id="LARGE"
          name="marketCapSize"
          label="대형주"
          checked={selectedMarketCapSize === "LARGE"}
          onChange={() => handleRadioChange("LARGE")}
          color="green" // Optional: Change color as needed
        />
      </div>
    </div>
  )
}
