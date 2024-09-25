// MainDashboard.tsx
import React, { useState } from "react"
import StockList from "./StockList"
import { StockFilterModalForm } from "./StockFilterModalForm"
import { Card, Typography, Button } from "@material-tailwind/react"
import StockFilterMenu from "./StockFilterMenu"

interface StockFilter {
  marketType: string | null
  marketCapSize: string | null
}

function MainDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState<StockFilter>({
    marketType: "ALL",
    marketCapSize: "ALL",
  })

  // 모달 끄고 닫고
  const handleModalOpen = () => setIsModalOpen(!isModalOpen)

  // 필터 업데이트
  const updateFilters = (newFilters: StockFilter) => {
    setFilters(newFilters)
  }

  // 솔팅 조건 (시장)
  const handleSelectMarketType = (selected: string) => {
    setFilters((prev) => ({ ...prev, marketType: selected }))
  }

  // 솔팅 조건 (시가총액)
  const handleSelectMarketCapSize = (selected: string) => {
    setFilters((prev) => ({ ...prev, marketCapSize: selected }))
  }

  return (
    <div className="w-full p-4">
      <Typography variant="h5" color="blue-gray">
        종목 정보 조회
      </Typography>

      {/* 필터 모달 버튼 */}
      <div className="mb-4 mt-4 flex items-center gap-x-4">
        <Button
          variant="gradient"
          className="mb-3 mt-4"
          onClick={handleModalOpen}
        >
          필터 추가
        </Button>

        {/* 필터 모달 */}
        <StockFilterModalForm
          open={isModalOpen}
          handleOpen={handleModalOpen}
          filters={filters}
          updateFilters={updateFilters}
        />

        {/* 시장 필터 리스트 */}
        <StockFilterMenu
          label="시장"
          items={[
            { label: "코스피200", value: "KOSPI200" },
            { label: "코스피", value: "KOSPI" },
            { label: "코스닥150", value: "KSQ150" },
            { label: "코스닥", value: "KOSDAQ" },
            { label: "코넥스", value: "KONEX" },
          ]}
          selected={filters.marketType}
          onSelect={handleSelectMarketType}
        />

        {/* 시가 총액 필터 리스트 */}
        <StockFilterMenu
          label="시가총액"
          items={[
            { label: "소형주", value: "SMALL" },
            { label: "중형주", value: "MEDIUM" },
            { label: "대형주", value: "LARGE" },
          ]}
          selected={filters.marketCapSize}
          onSelect={handleSelectMarketCapSize}
        />
      </div>

      {/* 주식 목록 */}
      <StockList filters={filters} />
    </div>
  )
}

export default MainDashboard
