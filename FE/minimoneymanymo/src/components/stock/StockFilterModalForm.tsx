import Modal from "react-modal"
import { StockModalSidebar } from "./StockModalSidebar"
import { useState } from "react"

Modal.setAppElement("#root")

interface StockFilter {
  marketType: string | null
  marketCapSize: string | null
  perMin: number | null
  perMax: number | null
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

  const handleMarketTypeChange = (marketType: string) => {
    setTemporaryFilters({ ...temporaryFilters, marketType })
  }

  const handleSearch = () => {
    updateFilters(temporaryFilters)
    handleOpen() // 모달 닫기
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
            <div>
              <h3 className="text-xl font-semibold">시장</h3>
              <p className="mb-4 text-gray-600">시장을 선택하세요.</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="KOSPI"
                    checked={temporaryFilters.marketType === "KOSPI"}
                    onChange={() => handleMarketTypeChange("KOSPI")}
                  />
                  코스피 시장만 보기
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="KOSDAQ"
                    checked={temporaryFilters.marketType === "KOSDAQ"}
                    onChange={() => handleMarketTypeChange("KOSDAQ")}
                  />
                  코스닥 시장만 보기
                </label>
              </div>
            </div>
          )}
          {/* 시가 총액 */}
          {/* PER */}
          {selectedCategory === "PER" && (
            <div>
              <h3 className="text-xl font-semibold">PER</h3>
              <p className="mb-4 text-gray-600">PER을 선택하세요.</p>
              {/* PER 관련 콘텐츠 추가 */}
            </div>
          )}
          {/* PBR */}
          {selectedCategory === "PBR" && (
            <div>
              <h3 className="text-xl font-semibold">PBR</h3>
              <p className="mb-4 text-gray-600">PBR을 선택하세요.</p>
              {/* PER 관련 콘텐츠 추가 */}
            </div>
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

          {/* 하단의 검색 및 초기화 버튼 */}
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleSearch}
              className="rounded-lg bg-primary-m1 px-4 py-2 text-white hover:bg-primary-600"
            >
              검색하기
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