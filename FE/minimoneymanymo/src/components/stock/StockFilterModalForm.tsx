import Modal from "react-modal"
import { StockModalSidebar } from "./StockModalSidebar"
import { useState } from "react"
import { PERFilter } from "./filters/PERFilter"
import { PBRFilter } from "./filters/PBRFilter"
import { MarketTypeFilter } from "./filters/MarketTypeFilter" // Import the new component
import { MarketCapSizeFilter } from "./filters/marketCapSizeFilter"
import { RestartAlt } from "@mui/icons-material"

Modal.setAppElement("#root")

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
  search: string | null
}
interface StockFilterFormProps {
  open: boolean
  handleOpen: () => void
  filters: StockFilter
  updateFilters: (filters: StockFilter) => void
}

export function StockFilterModalForm({
  open,
  handleOpen,
  filters,
  updateFilters,
}: StockFilterFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("시장") // 사이드바에서 선택된 카테고리
  const [temporaryFilters, setTemporaryFilters] = useState<StockFilter>(filters) // 임시 필터 상태 추가

  const resetFilters = () => {
    //여기서 temp필터만 변경하는게 아니고 대시보드 전체의 필터를 초기화
    setTemporaryFilters({
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
      search: null,
    })
    updateFilters({
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
      search: null,
    })
    handleOpen() // 모달 닫기
  }

  const INF: number = 100000000000
  const handleMarketTypeChange = (marketType: string) => {
    setTemporaryFilters({ ...temporaryFilters, marketType })
  }

  const handleSearch = () => {
    updateFilters(temporaryFilters)
    handleOpen() // 모달 닫기
  }

  const handleMarketCapSizeChange = (marketCapSize: string) => {
    setTemporaryFilters({ ...temporaryFilters, marketCapSize })
  }

  const handlePERRangeChange = (min: number, max: number) => {
    setTemporaryFilters({ ...temporaryFilters, perMin: min, perMax: max })
  }

  const handlePresetPER = (min: number, max: number | null) => {
    setTemporaryFilters({ ...temporaryFilters, perMin: min, perMax: max })
  }

  const handlePBRRangeChange = (min: number, max: number) => {
    setTemporaryFilters({ ...temporaryFilters, pbrMin: min, pbrMax: max })
  }

  const handlePresetPBR = (min: number, max: number | null) => {
    setTemporaryFilters({ ...temporaryFilters, pbrMin: min, pbrMax: max })
  }

  return (
    <Modal
      isOpen={open}
      onRequestClose={handleOpen}
      className="flex h-[600px] w-[900px] items-center justify-center rounded-3xl bg-white shadow-lg"
      overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <div className="flex h-full w-full">
        {/* 사이드바 */}
        <StockModalSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* 오른쪽 콘텐츠 영역 */}
        <div className="relative flex-1 overflow-auto p-6">
          {/* 시장 */}
          {selectedCategory === "시장" && (
            <MarketTypeFilter
              marketType={temporaryFilters.marketType}
              handleMarketTypeChange={handleMarketTypeChange}
            />
          )}
          {/* 시가총액 */}
          {selectedCategory === "시가총액" && (
            <MarketCapSizeFilter
              marketCapSize={temporaryFilters.marketCapSize}
              handleMarketCapSizeChange={handleMarketCapSizeChange}
            />
          )}
          {/* PER */}
          {selectedCategory === "PER" && (
            <PERFilter
              temporaryFilters={temporaryFilters}
              handlePERRangeChange={handlePERRangeChange}
              handlePresetPER={handlePresetPER}
            />
          )}
          {/* PBR */}
          {selectedCategory === "PBR" && (
            <PBRFilter
              temporaryFilters={temporaryFilters}
              handlePBRRangeChange={handlePBRRangeChange}
              handlePresetPBR={handlePresetPBR}
            />
          )}
          {/* 주가 */}
          {selectedCategory === "주가" && (
            <div>
              <h3 className="text-xl font-semibold">주가</h3>
              <p className="mb-4 text-gray-600">주가를 선택하세요.</p>
              {/* PER 관련 콘텐츠 추가 */}
            </div>
          )}
          {/* 주가 등락률 */}
          {selectedCategory === "주가 등락률" && (
            <div>
              <h3 className="text-xl font-semibold">주가 등락률</h3>
              <p className="mb-4 text-gray-600">주가 등락률을 선택하세요.</p>
              {/* PER 관련 콘텐츠 추가 */}
            </div>
          )}
          {/* 52주 최고가 */}
          {selectedCategory === "52주 최고가" && (
            <div>
              <h3 className="text-xl font-semibold">52주 최고가</h3>
              <p className="mb-4 text-gray-600">52주 최고가을 선택하세요.</p>
              {/* PER 관련 콘텐츠 추가 */}
            </div>
          )}
          {/* 52주 최저가 */}
          {selectedCategory === "52주 최저가" && (
            <div>
              <h3 className="text-xl font-semibold">52주 최저가</h3>
              <p className="mb-4 text-gray-600">52주 최저가을 선택하세요.</p>
              {/* PER 관련 콘텐츠 추가 */}
            </div>
          )}
          {/* 거래량 */}
          {selectedCategory === "거래량" && (
            <div>
              <h3 className="text-xl font-semibold">거래량</h3>
              <p className="mb-4 text-gray-600">거래량을 선택하세요.</p>
              {/* PER 관련 콘텐츠 추가 */}
            </div>
          )}
          {/* 거래대금 */}
          {selectedCategory === "거래대금" && (
            <div>
              <h3 className="text-xl font-semibold">거래대금</h3>
              <p className="mb-4 text-gray-600">거래대금을 선택하세요.</p>
              {/* PER 관련 콘텐츠 추가 */}
            </div>
          )}
          {/* 하단의 초기화 버튼 */}
          <div className="absolute bottom-4 right-32">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-4 py-2 text-gray-600"
            >
              <RestartAlt className="h-5 w-5 text-gray-600" /> 초기화
            </button>
          </div>

          {/* 하단의 검색 및 초기화 버튼 */}
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleSearch}
              className="rounded-lg bg-primary-m1 px-4 py-2 text-white hover:bg-primary-600"
            >
              조회하기
            </button>
          </div>
        </div>
      </div>

      {/* <button
        onClick={handleOpen}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button> */}
    </Modal>
  )
}
