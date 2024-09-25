import { useEffect, useState } from "react"
import { getStockList } from "@/api/stock-api"
import { Typography } from "@material-tailwind/react"
import {
  getPriceChangeColorAndSign,
  formatMarketCapitalization,
} from "@/utils/stock-utils"
import { ArrowDropUp, ArrowDropDown, UnfoldMore } from "@mui/icons-material" // 추가한 아이콘

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

  // 서버로 데이터를 요청하는 함수
  const fetchStockList = async () => {
    try {
      const queryParams = new URLSearchParams({
        marketType: filters.marketType || "",
        marketCapSize: filters.marketCapSize || "",
        sort: `${sortKey},${sortOrder}`, // 정렬 조건 추가
      }).toString()

      const res = await getStockList(queryParams)
      setStockRows(res.data.content)
    } catch (error) {
      console.error("Failed to fetch stock list:", error)
    }
  }

  // 필터 또는 정렬이 변경될 때마다 서버에 새 요청을 보냄
  useEffect(() => {
    fetchStockList()
  }, [filters, sortKey, sortOrder])

  // 정렬 핸들러
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
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
              <tr key={stock.stockCode}>
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
    </div>
  )
}

export default StockList
