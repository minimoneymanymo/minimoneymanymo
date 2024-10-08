// MainDashboard.tsx
import { useState, useEffect, useCallback } from "react"
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
  search: string | null // elasticsearch 검색어
}

interface StockResult {
  stock_code: string
  company_name: string
}

function MainDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<StockResult[]>([]) // 검색 결과 상태 추가
  const [userInput, setUserInput] = useState("")
  const [debouncedInput, setDebouncedInput] = useState(userInput)

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
    search: null,
  })

  // Elasticsearch 쿼리 생성 및 전송 함수
  const fetchStockData = useCallback(
    (
      debouncedInput: string,
      setSearchResults: React.Dispatch<React.SetStateAction<StockResult[]>>
    ) => {
      const {
        VITE_ELASTIC_API_USERID: username,
        VITE_ELASTIC_API_PASSWORD: password,
        VITE_ELASTIC_API_SEARCH: searchUrl,
      } = import.meta.env

      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${username}:${password}`)}`, // 사용자명과 비밀번호를 Base64로 인코딩
      })

      const query = {
        size: 200,
        query: {
          bool: {
            should: [
              {
                match: {
                  company_name: {
                    query: debouncedInput,
                    boost: 2,
                  },
                },
              },
              {
                wildcard: {
                  company_name: {
                    value: `*${debouncedInput}*`,
                  },
                },
              },
              {
                wildcard: {
                  stock_code: {
                    value: `*${debouncedInput}*`,
                  },
                },
              },
            ],
          },
        },
      }

      fetch(`${searchUrl}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(query),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then((data) => {
          const results = data.hits.hits.map(
            (hit: { _source: StockResult }) => ({
              stock_code: hit._source.stock_code,
              company_name: hit._source.company_name,
            })
          )
          console.log(results)

          // stock_code들을 콤마로 구분된 문자열로 변환하여 filters.search에 저장
          const stockCodes = results
            .map((result: { stock_code: string }) => result.stock_code)
            .join(",")
          setFilters((prevFilters) => ({
            ...prevFilters,
            search: stockCodes, // 검색어에 stock_code들 전달
          }))

          console.log(stockCodes)

          setSearchResults(results.slice(0, 10)) // 결과를 10개로 제한
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    },
    []
  )

  // 모달 끄고 닫고
  const handleModalOpen = () => setIsModalOpen(!isModalOpen)

  // 필터 업데이트
  const updateFilters = (newFilters: StockFilter) => {
    console.log(newFilters)
    setFilters(newFilters)
  }

  // 입력값이 변경될 때 디바운싱 처리
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(userInput)
    }, 200) // 200ms 후에 디바운스 입력 업데이트

    return () => {
      clearTimeout(handler) // 이전 타이머를 정리
    }
  }, [userInput])

  // 디바운스된 입력값이 변경되면 Elasticsearch API 호출
  useEffect(() => {
    if (debouncedInput) {
      fetchStockData(debouncedInput, setSearchResults) // 디바운스된 입력값으로 API 호출
    } else {
      // 입력값이 없을 때 검색 결과를 비웁니다.
      setSearchResults([])
    }
  }, [debouncedInput, fetchStockData])

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
    <div className="mt-10 w-full">
      <div className="text-2xl font-bold" color="blue-gray">
        주식
      </div>

      {/* 필터 모달 버튼 */}
      <div className="mb-4 mt-4 flex items-center gap-x-4">
        <button
          className="flex items-center gap-2 rounded-full border-none bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600 shadow-none hover:bg-gray-200 hover:shadow-none"
          onClick={handleModalOpen}
        >
          <Tune className="h-5 w-5 text-gray-600" /> {/* 아이콘 */}
          필터 추가
        </button>

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
        {renderFilterTags()}
        {/* 검색창 추가 */}
        <div className="ml-auto">
          <input
            id="searchInput"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)} // 입력값 상태 업데이트
            className="ml-auto flex items-center gap-2 rounded-full border-none bg-gray-100 px-4 py-2 text-gray-600 placeholder-gray-600 shadow-none hover:bg-gray-200 hover:shadow-none"
            placeholder="주식 검색"
          />
        </div>
      </div>

      {/* 검색 결과 출력 */}
      {/* <div className="mt-4">
        {searchResults.length >= 0 ? (
          <ul>
            {searchResults.map((result, index) => (
              <li key={index} className="border-b p-2">
                {result.stock_code} - {result.company_name}
              </li>
            ))}
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div> */}

      {/* 주식 목록 */}
      <StockList filters={filters} />
    </div>
  )
}

export default MainDashboard
