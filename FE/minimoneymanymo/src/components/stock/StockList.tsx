import { useEffect, useState, useRef, useCallback } from "react"
import { getStockList } from "@/api/stock-api"
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
}

// 필터 인터페이스 정의
interface StockFilter {
  marketType: string | null
  marketCapSize: string | null
  perMin: number | null
  perMax: number | null
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
        marketType: filters.marketType || "",
        marketCapSize: filters.marketCapSize || "",
        sort: `${sortKey},${sortOrder}`,
        page: page.toString(),
      }).toString()

      const res = await getStockList(queryParams)
      if (reset) {
        // 필터가 변경되었을 때 초기화 후 데이터 로드
        setStockRows(res.data.content)
      } else {
        // 무한스크롤 또는 정렬 시 기존 데이터에 붙이기
        setStockRows((prevRows) => [...prevRows, ...res.data.content])
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
    { label: "", key: "" }, //종목 번호
    { label: "", key: "" }, //종목 이름
    { label: "현재가", key: "" },
    { label: "등락률", key: "" },
    { label: "시가총액", key: "MC" }, // 시가총액 기준 정렬
    { label: "거래량", key: "TV" }, // 거래량 기준 정렬
  ]

  return (
    <div className="overflow-x-auto">
      <table className="mt-4 w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map(({ label, key }) => (
              <th
                key={label}
                className="border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50 cursor-pointer border-y p-4 text-right transition-colors"
                onClick={() => key && handleSort(key)}
                style={{ width: "5%" }}
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-end gap-2 font-normal leading-none opacity-70"
                >
                  {label}
                  {key && getSortIcon(key)}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stockRows.map((stock, index) => {
            const { color, sign } = getPriceChangeColorAndSign(
              stock.priceChange
            )
            return (
              <tr
                key={stock.stockCode}
                onClick={() => handleRowClick(stock.stockCode)}
                className="cursor-pointer hover:bg-gray-50"
                ref={
                  index === stockRows.length - 1 ? lastStockElementRef : null
                }
              >
                <td
                  className="border-blue-gray-50 border-b p-4 text-center"
                  style={{ width: "5%" }}
                >
                  <Typography
                    variant="small"
                    className="font-bold text-primary-m1"
                  >
                    {index + 1} {/* 인덱스 번호 표시 */}
                  </Typography>
                </td>
                <td
                  className="border-blue-gray-50 border-b p-4 text-left"
                  style={{ width: "20%" }}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="truncate font-normal"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {stock.companyName}
                  </Typography>
                </td>
                <td
                  className="border-blue-gray-50 border-b p-4 text-right"
                  style={{ width: "15%" }}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {stock.closingPrice.toLocaleString()}원
                  </Typography>
                </td>
                <td
                  className="border-blue-gray-50 border-b p-4 text-right"
                  style={{ width: "20%" }}
                >
                  <Typography
                    variant="small"
                    color={color}
                    className="font-normal"
                  >
                    {sign}
                    {stock.priceChangeRate.toFixed(2)}%
                  </Typography>
                  <Typography
                    variant="small"
                    color={color}
                    className="font-normal"
                  >
                    {sign}
                    {stock.priceChange}원
                  </Typography>
                </td>
                <td
                  className="border-blue-gray-50 border-b p-4 text-right"
                  style={{ width: "20%" }}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {formatMarketCapitalization(stock.marketCapitalization)}
                  </Typography>
                </td>
                <td
                  className="border-blue-gray-50 border-b p-4 text-right"
                  style={{ width: "20%" }}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {stock.tradingVolume.toLocaleString()}주
                  </Typography>
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
