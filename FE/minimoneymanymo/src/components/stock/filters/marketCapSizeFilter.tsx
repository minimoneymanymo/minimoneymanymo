// MarketTypeFilter.tsx
import React from "react"
import { Radio } from "@material-tailwind/react" // Import Radio from Material Tailwind

interface MarketCapSizeFilterProps {
  marketCapSize: string | null
  handleMarketCapSizeChange: (marketCapType: string) => void
}

export function MarketCapSizeFilter({
  marketCapSize,
  handleMarketCapSizeChange,
}: MarketCapSizeFilterProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold">시가총액</h3>
      <p className="mb-4 text-gray-600">시가총액을 선택하세요.</p>
      <div className="flex flex-col gap-2">
        <Radio
          id="SMALL"
          name="marketCapSize"
          label="소형주"
          checked={marketCapSize === "SMALL"}
          onChange={() => handleMarketCapSizeChange("SMALL")}
          color="blue" // Optional: Change color as needed
        />
        <Radio
          id="중형주"
          name="marketCapSize"
          label="중형주"
          checked={marketCapSize === "MEDIUM"}
          onChange={() => handleMarketCapSizeChange("MEDIUM")}
          color="blue" // Optional: Change color as needed
        />
        <Radio
          id="대형주"
          name="marketCapSize"
          label="대형주"
          checked={marketCapSize === "LARGE"}
          onChange={() => handleMarketCapSizeChange("LARGE")}
          color="blue" // Optional: Change color as needed
        />
      </div>
    </div>
  )
}
