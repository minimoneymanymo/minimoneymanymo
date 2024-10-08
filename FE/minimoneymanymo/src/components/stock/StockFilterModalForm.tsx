import Modal from "react-modal"
import { StockModalSidebar } from "./StockModalSidebar"
import { useState } from "react"
import { PERFilter } from "./filters/PERFilter"
import { PBRFilter } from "./filters/PBRFilter"
import { PriceFilter } from "./filters/PriceFilter"
import { ChangeRateFilter } from "./filters/ChangeRateFilter"
import { High52WeekFilter } from "./filters/High52WeekFilter"
import { Low52WeekFilter } from "./filters/Low52WeekFilter"
import { TradingValueFilter } from "./filters/TradingValueFilter"
import { TradingVolumeFilter } from "./filters/TradingVolumeFilter"

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
    const resetState: StockFilter = {
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
    }
    setTemporaryFilters(resetState)
    updateFilters(resetState)
    // handleOpen()
  }

  const handleSearch = () => {
    updateFilters(temporaryFilters)
    handleOpen()
  }

  const handleRangeChange = (key: string, min: number, max: number | null) => {
    setTemporaryFilters((prevFilters) => ({
      ...prevFilters,
      [key + "Min"]: min,
      [key + "Max"]: max,
    }))
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
              handleMarketTypeChange={(marketType) =>
                setTemporaryFilters({ ...temporaryFilters, marketType })
              }
            />
          )}
          {/* 시가총액 */}
          {selectedCategory === "시가총액" && (
            <MarketCapSizeFilter
              marketCapSize={temporaryFilters.marketCapSize}
              handleMarketCapSizeChange={(marketCapSize) =>
                setTemporaryFilters({ ...temporaryFilters, marketCapSize })
              }
            />
          )}
          {/* PER */}
          {selectedCategory === "PER" && (
            <PERFilter
              temporaryFilters={temporaryFilters}
              handlePERRangeChange={(min, max) =>
                handleRangeChange("per", min, max)
              }
              handlePresetPER={(min, max) => handleRangeChange("per", min, max)}
            />
          )}
          {/* PBR */}
          {selectedCategory === "PBR" && (
            <PBRFilter
              temporaryFilters={temporaryFilters}
              handlePBRRangeChange={(min, max) =>
                handleRangeChange("pbr", min, max)
              }
              handlePresetPBR={(min, max) => handleRangeChange("pbr", min, max)}
            />
          )}
          {/* 주가 */}
          {selectedCategory === "주가" && (
            <PriceFilter
              temporaryFilters={temporaryFilters}
              handlePriceRangeChange={(min, max) =>
                handleRangeChange("price", min, max)
              }
              handlePresetPrice={(min, max) =>
                handleRangeChange("price", min, max)
              }
            />
          )}
          {/* 주가 등락률 */}
          {selectedCategory === "주가 등락률" && (
            <ChangeRateFilter
              temporaryFilters={temporaryFilters}
              handleChangeRateRangeChange={(min, max) =>
                handleRangeChange("changeRate", min, max)
              }
              handlePresetChangeRate={(min, max) =>
                handleRangeChange("changeRate", min, max)
              }
            />
          )}
          {/* 52주 최고가 */}
          {selectedCategory === "52주 최고가" && (
            <High52WeekFilter
              temporaryFilters={temporaryFilters}
              handleHigh52WeekRangeChange={(min, max) =>
                handleRangeChange("high52Week", min, max)
              }
              handlePresetHigh52Week={(min, max) =>
                handleRangeChange("high52Week", min, max)
              }
            />
          )}
          {/* 52주 최저가 */}
          {selectedCategory === "52주 최저가" && (
            <Low52WeekFilter
              temporaryFilters={temporaryFilters}
              handleLow52WeekRangeChange={(min, max) =>
                handleRangeChange("low52Week", min, max)
              }
              handlePresetLow52Week={(min, max) =>
                handleRangeChange("low52Week", min, max)
              }
            />
          )}
          {/* 거래량 */}
          {selectedCategory === "거래량" && (
            <TradingVolumeFilter
              temporaryFilters={temporaryFilters}
              handleVolumeRangeChange={(min, max) =>
                handleRangeChange("volume", min, max)
              }
              handlePresetVolume={(min, max) =>
                handleRangeChange("volume", min, max)
              }
            />
          )}

          {/* 거래대금 */}
          {selectedCategory === "거래대금" && (
            <TradingValueFilter
              temporaryFilters={temporaryFilters}
              handleTradingValueRangeChange={(min, max) =>
                handleRangeChange("tradingValue", min, max)
              }
              handlePresetTradingValue={(min, max) =>
                handleRangeChange("tradingValue", min, max)
              }
            />
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
              className="rounded-lg bg-secondary-m2 px-4 py-2 text-white hover:bg-secondary-700"
            >
              조회하기
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
