import { useEffect, useState, useRef, useCallback } from "react"
import { getStockList, toggleFavoriteStock } from "@/api/stock-api"
import { Typography } from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"
import {
  getPriceChangeColorAndSign,
  formatMarketCapitalization,
} from "@/utils/stock-utils"
import { ArrowDropUp, ArrowDropDown, UnfoldMore } from "@mui/icons-material"

// 주식 정보 타입 정의
interface StockData {
  companyName: string
  stockCode: string
  closingDate: string
  closingPrice: number
  priceChangeSign: string
  priceChange: number
  priceChangeRate: number
  marketCapitalization: number
  tradingVolume: number
  favorite: boolean
}

// 필터 인터페이스 정의
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
  interestStocks: false
}

function StockList({ filters }: { filters: StockFilter }) {
  const [stockRows, setStockRows] = useState<StockData[]>([])
  const [sortKey, setSortKey] = useState<string>("MC") // 초기 정렬 키
  const [sortOrder, setSortOrder] = useState<string>("desc") // 초기 정렬 순서
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const navigate = useNavigate()

  const handleRowClick = (stockCode: string) => {
    navigate(`/stock/${stockCode}`)
  }

  // 공통으로 사용할 데이터 로드 함수
  const fetchStockList = async (page: number, reset: boolean = false) => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        marketType:
          filters.marketType !== null ? filters.marketType.toString() : "",
        marketCapSize:
          filters.marketCapSize !== null
            ? filters.marketCapSize.toString()
            : "",
        perMin:
          filters.perMin !== undefined && filters.perMin !== null
            ? filters.perMin.toString()
            : "",
        perMax:
          filters.perMax !== undefined && filters.perMax !== null
            ? filters.perMax.toString()
            : "",
        pbrMin:
          filters.pbrMin !== undefined && filters.pbrMin !== null
            ? filters.pbrMin.toString()
            : "",
        pbrMax:
          filters.pbrMax !== undefined && filters.pbrMax !== null
            ? filters.pbrMax.toString()
            : "",
        priceMin:
          filters.priceMin !== undefined && filters.priceMin !== null
            ? filters.priceMin.toString()
            : "",
        priceMax:
          filters.priceMax !== undefined && filters.priceMax !== null
            ? filters.priceMax.toString()
            : "",
        changeRateMin:
          filters.changeRateMin !== undefined && filters.changeRateMin !== null
            ? filters.changeRateMin.toString()
            : "",
        changeRateMax:
          filters.changeRateMax !== undefined && filters.changeRateMax !== null
            ? filters.changeRateMax.toString()
            : "",
        high52WeekMin:
          filters.high52WeekMin !== undefined && filters.high52WeekMin !== null
            ? filters.high52WeekMin.toString()
            : "",
        high52WeekMax:
          filters.high52WeekMax !== undefined && filters.high52WeekMax !== null
            ? filters.high52WeekMax.toString()
            : "",
        low52WeekMin:
          filters.low52WeekMin !== undefined && filters.low52WeekMin !== null
            ? filters.low52WeekMin.toString()
            : "",
        low52WeekMax:
          filters.low52WeekMax !== undefined && filters.low52WeekMax !== null
            ? filters.low52WeekMax.toString()
            : "",
        tradingValueMin:
          filters.tradingValueMin !== undefined &&
          filters.tradingValueMin !== null
            ? filters.tradingValueMin.toString()
            : "",
        volumeMax:
          filters.volumeMax !== undefined && filters.volumeMax !== null
            ? filters.volumeMax.toString()
            : "",
        tradingValueMax:
          filters.tradingValueMax !== undefined &&
          filters.tradingValueMax !== null
            ? filters.tradingValueMax.toString()
            : "",
        search:
          filters.search !== undefined && filters.search !== null
            ? filters.search.toString()
            : "",
        interestStocks: filters.interestStocks ? "true" : "", // 관심 종목 필터 적용
        sort: `${sortKey},${sortOrder}`,
        page: page.toString(),
      }).toString()

      const res = await getStockList(queryParams)
      let stockData = res.data.content

      //관심 종목이 선택되었을 때는 favorite이 true인 것만 들고있기
      if (filters.interestStocks) {
        stockData = stockData.filter((stock: StockData) => stock.favorite)
      }
      if (reset) {
        // 필터가 변경되었을 때 초기화 후 데이터 로드
        setStockRows(stockData)
      } else {
        // 무한스크롤 또는 정렬 시 기존 데이터에 붙이기
        setStockRows((prevRows) => [...prevRows, ...stockData])
      }
      setHasMore(!res.data.last)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch stock list:", error)
      setLoading(false)
    }
  }

  //무한스크롤
  const lastStockElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [loading, hasMore]
  )

  // 페이지나 정렬이 변경될 때 데이터를 추가로 가져옴
  useEffect(() => {
    fetchStockList(page)
  }, [page, sortKey, sortOrder])

  // 필터가 변경되면 데이터 초기화 후 새로 불러옴
  useEffect(() => {
    console.log("Current Filters:", filters)
    setPage(0)
    setStockRows([])
    fetchStockList(0, true) // reset 플래그를 통해 초기화 후 새로 로드
  }, [filters])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
    setPage(0) // 페이지를 초기화
    setStockRows([]) // 기존 데이터 리셋
  }

  // 정렬 아이콘 렌더링 함수
  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <UnfoldMore className="h-4 w-4" />
    return sortOrder === "asc" ? (
      <ArrowDropUp className="h-4 w-4" />
    ) : (
      <ArrowDropDown className="h-4 w-4" />
    )
  }

  const TABLE_HEAD = [
    { width: "w-[110px]", label: "", key: "" }, //종목 번호
    { width: "w-[230px]", label: "", key: "" }, //종목 이름
    { width: "w-[170px] pr-8", label: "현재가", key: "" },
    { width: "w-[260px] pr-16", label: "등락률", key: "" },
    { width: "w-[170px] pr-0", label: "시가총액(머니)", key: "MC" }, // 시가총액 기준 정렬
    { width: "w-[170px]", label: "거래량", key: "TV" }, // 거래량 기준 정렬
  ]

  const toggleLike = async (stockCode: string, index: number) => {
    const newList = [...stockRows]
    const res = await toggleFavoriteStock(stockCode!)
    console.log(newList[index], index)
    if (res.stateCode === 201) {
      if (res.data === true) {
        newList[index].favorite = true
        console.log("좋아요 등록", stockCode)
      } else {
        newList[index].favorite = false
        console.log("좋아요 삭제", stockCode)
      }
    }
    setStockRows(newList)
  }

  console.log("Current Filters:", filters)

  return (
    <div className="overflow-x-auto">
      <table className="mb-64 mt-4 w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map(({ width, label, key }) => (
              <th
                key={`${label}-${Math.random()}`}
                className={`${width} border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50 cursor-pointer border-y p-4 text-right font-normal transition-colors`}
                onClick={() => key && handleSort(key)}
              >
                {label}
                {key && getSortIcon(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stockRows.map((stock, index) => {
            const { color, sign } = getPriceChangeColorAndSign(
              stock.priceChange
            )
            const key = stock.stockCode ? stock.stockCode : `stock-${index}` // Ensure unique key

            return (
              <tr
                key={`${index}-${Math.random()}`}
                onClick={() => handleRowClick(stock.stockCode)}
                className="w-full cursor-pointer hover:bg-gray-50"
                ref={
                  index === stockRows.length - 1 ? lastStockElementRef : null
                }
              >
                <td className="border-blue-gray-50 w-[110px] border-b p-6">
                  <div className="flex gap-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(stock.stockCode, index)
                      }}
                    >
                      <img
                        src={
                          stock.favorite
                            ? "/icons/icon-list-like.svg"
                            : "/icons/icon-list-unlike.svg"
                        }
                        alt="unlike"
                      />
                    </button>
                    <div className="font-bold text-primary-m1">
                      {index + 1} {/* 인덱스 번호 표시 */}
                    </div>
                  </div>
                </td>
                <td className="border-blue-gray-50 w-[230px] border-b p-4 text-left">
                  <div
                    color="blue-gray"
                    className="truncate font-normal"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {stock.companyName}
                  </div>
                </td>
                <td className="border-blue-gray-50 w-[170px] border-b p-4 text-right">
                  <div color="blue-gray" className="font-normal">
                    {stock.closingPrice.toLocaleString()} 머니
                  </div>
                </td>
                <td className="border-blue-gray-50 w-[260px] border-b p-4 text-right">
                  <div color={color} className={`font-normal ${color}`}>
                    {sign} {stock.priceChange.toLocaleString()} 머니 ({sign}
                    {stock.priceChangeRate.toFixed(2)}%)
                  </div>
                </td>
                <td className="border-blue-gray-50 w-[170px] border-b p-4 text-right">
                  <div color="blue-gray" className="font-normal">
                    {formatMarketCapitalization(stock.marketCapitalization)}
                  </div>
                </td>
                <td className="border-blue-gray-50 w-[170px] border-b p-4 text-right">
                  <div color="blue-gray" className="font-normal">
                    {stock.tradingVolume.toLocaleString()} 주
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {loading && <p>Loading...</p>}
    </div>
  )
}

export default StockList
