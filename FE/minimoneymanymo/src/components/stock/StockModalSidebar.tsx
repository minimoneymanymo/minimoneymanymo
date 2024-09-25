// MultiLevelSidebar.tsx
import React from "react"

// 필터 인터페이스 정의
interface StockFilter {
  marketType: string | null //시장 종류
  marketCapSize: string | null // 시가총액 크기 (소, 중, 대)
  // perMin: number | null // PER 최소값
  // perMax: number | null // PER 최대값
  // pbrMin: number | null // PBR 최소값
  // pbrMax: number | null
  // epsMin: number | null // EPS 최소값
  // epsMax: number | null
  // bpsMin: number | null // BPS 최소값
  // bpsMax: number | null
  // priceMin: number | null // 주가 최소값
  // priceMax: number | null
  // changeRateMin: number | null // 주가 등락률 최소값
  // changeRateMax: number | null
  // high52WeekMin: number | null // 52주 최고가 최소값
  // high52WeekMax: number | null
  // low52WeekMin: number | null // 52주 최저가 최소값
  // low52WeekMax: number | null
  // volumeMin: bigint | null // 1일 누적 거래량 최소값
  // volumeMax: bigint | null
  // tradingValueMin: bigint | null // 1일 누적 거래 대금 최소값
  // tradingValueMax: bigint | null
  // volumeTurnoverRatioMin: number | null // 거래량 회전률 최소값
  // volumeTurnoverRatioMax: number | null
}

interface StockModalSidebarProps {
  filters: StockFilter
  updateFilters: (filters: StockFilter) => void
}

export function StockModalSidebar({
  filters,
  updateFilters,
}: StockModalSidebarProps) {
  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ ...filters, [key]: value })
  }
  return (
    <div className="w-full">
      <h3 className="mb-4 text-lg font-semibold">필터 설정</h3>
      <button onClick={() => handleFilterChange("marketType", "KOSPI")}>
        코스피
      </button>
      <button onClick={() => handleFilterChange("marketCapSize", "LARGE")}>
        대형주
      </button>
      {/* 다른 필터 옵션 추가 */}
    </div>
  )
}
