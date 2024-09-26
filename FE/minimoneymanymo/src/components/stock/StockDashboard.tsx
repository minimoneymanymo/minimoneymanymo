// MainDashboard.tsx
import { useState } from "react"
import StockList from "./StockList"
import { StockFilterModalForm } from "./StockFilterModalForm"
import { Typography, Button } from "@material-tailwind/react"
import StockFilterMenu from "./StockFilterMenu"
import { Tune } from "@mui/icons-material"
import StockFilterTag from "./StockFilterTag"

// Label과 value의 매핑 객체 정의
const marketCapSizeMapping: Record<string, string> = {
  SMALL: "소형주",
  MEDIUM: "중형주",
  LARGE: "대형주",
}

const marketTypeMapping: Record<string, string> = {
  KOSPI200: "코스피200",
  KOSPI: "코스피",
  KSQ150: "코스닥150",
  KOSDAQ: "코스닥",
  KONEX: "코넥스",
}

interface StockFilter {
  marketType: string | null // 시장 유형 (예: KOSPI, KOSDAQ)
  marketCapSize: string | null // 시가총액 크기 (예: Large, Mid, Small)
  perMin: number | null // 최소 PER 값
  perMax: number | null // 최대 PER 값
  pbrMin: number | null // 최소 PBR 값
  pbrMax: number | null // 최대 PBR 값
  priceMin: number | null // 최소 가격
  priceMax: number | null // 최대 가격
  changeRateMin: number | null // 최소 등락률
  changeRateMax: number | null // 최대 등락률
  high52WeekMin: number | null // 52주 최고가 최소값
  high52WeekMax: number | null // 52주 최고가 최대값
  low52WeekMin: number | null // 52주 최저가 최소값
  low52WeekMax: number | null // 52주 최저가 최대값
  tradingValueMin: number | null // 최소 거래대금
  tradingValueMax: number | null // 최대 거래대금
  volumeMax: number | null // 최대 거래량
}

function MainDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState<StockFilter>({
    marketType: "ALL",
    marketCapSize: "ALL",
    perMin: null,
    perMax: null,
    pbrMin: null,
    pbrMax: null,
    priceMin: null,
    priceMax: null,
    changeRateMin: null,
    changeRateMax: null,
    high52WeekMin: null,
    high52WeekMax: null,
    low52WeekMin: null,
    low52WeekMax: null,
    tradingValueMin: null,
    tradingValueMax: null,
    volumeMax: null,
  })

  // 모달 끄고 닫고
  const handleModalOpen = () => setIsModalOpen(!isModalOpen)

  // 필터 업데이트
  const updateFilters = (newFilters: StockFilter) => {
    console.log(newFilters)
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
  // 필터 관련 태그 설정
  const renderFilterTags = () => {
    const tags = []

    if (filters.marketType && filters.marketType !== "ALL") {
      const marketTypeLabel =
        marketTypeMapping[filters.marketType] || filters.marketType
      tags.push(
        <StockFilterTag key="market" label={`시장 · ${marketTypeLabel}`} />
      )
    }

    if (filters.marketCapSize && filters.marketCapSize !== "ALL") {
      const marketCapLabel =
        marketCapSizeMapping[filters.marketCapSize] || filters.marketCapSize
      tags.push(
        <StockFilterTag
          key="marketCap"
          label={`시가총액 · ${marketCapLabel}`}
        />
      )
    }

    if (filters.perMin !== null || filters.perMax !== null) {
      const perRange = `${filters.perMin || 0}배 이상 ~ ${filters.perMax || "무제한"}배`
      tags.push(<StockFilterTag key="per" label={`PER · ${perRange}`} />)
    }

    if (filters.pbrMin !== null || filters.pbrMax !== null) {
      const pbrRange = `${filters.pbrMin || 0}배 이상 ~ ${filters.pbrMax || "무제한"}배`
      tags.push(<StockFilterTag key="pbr" label={`PBR · ${pbrRange}`} />)
    }

    // TODO: 다른 필터 추가
    return tags
  }

  return (
    <div className="w-full p-4">
      <Typography variant="h5" color="blue-gray">
        주식
      </Typography>

      {/* 필터 모달 버튼 */}
      <div className="mb-4 mt-4 flex items-center gap-x-4">
        <Button
          className="flex items-center gap-2 rounded-full border-none bg-gray-100 px-4 py-2 text-gray-600 shadow-none hover:bg-gray-200 hover:shadow-none"
          onClick={handleModalOpen}
        >
          <Tune className="h-5 w-5 text-gray-600" /> {/* 아이콘 */}
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

        {/* 필터 태그 표시 */}
        <div className="flex flex-wrap gap-2">{renderFilterTags()}</div>
      </div>

      {/* 주식 목록 */}
      <StockList filters={filters} />
    </div>
  )
}

export default MainDashboard
