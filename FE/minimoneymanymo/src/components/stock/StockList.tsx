import { useEffect, useState } from "react"
import { getStockList } from "@/api/stock-api" // 서버 API 호출
import { ArrowDropUp, ArrowDropDown, UnfoldMore } from "@mui/icons-material"
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
  Button,
} from "@material-tailwind/react"
import StockFilterMenu from "./StockFilterMenu"
import {
  getPriceChangeColorAndSign,
  formatMarketCapitalization,
} from "@/utils/stock-utils"

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

function StockList(): JSX.Element {
  const [stockRows, setStockRows] = useState<StockData[]>([])
  const [filters, setFilters] = useState<StockFilter>({
    marketType: "ALL",
    marketCapSize: "ALL",
  })
  const [sortKey, setSortKey] = useState<string>("MC") // 초기 정렬 키
  const [sortOrder, setSortOrder] = useState<string>("desc") // 초기 정렬 순서 (asc, desc)

  // 서버로 데이터를 요청하는 함수
  const fetchStockList = async () => {
    try {
      console.log(filters.marketCapSize)
      const queryParams = new URLSearchParams({
        marketType: filters.marketType || "",
        marketCapSize: filters.marketCapSize || "", //TODO: 필터 기준 추가해야 함
        sort: `${sortKey},${sortOrder}`,
        page: "0",
        size: "10", //TODO: 페이지네이션 할 때 수정해야 함
      }).toString()

      const res = await getStockList(queryParams)
      setStockRows(res.data.content) // 데이터를 상태에 저장
    } catch (error) {
      console.error("Failed to fetch stock list:", error)
    }
  }

  // 필터 또는 정렬이 변경될 때마다 서버에 새 요청을 보냄
  useEffect(() => {
    fetchStockList()
  }, [filters, sortKey, sortOrder])

  // 필터 메뉴에서 선택된 값을 업데이트하는 함수
  const handleSelectMarketType = (selected: string) => {
    setFilters((prev) => ({ ...prev, marketType: selected }))
  }

  const handleSelectMarketCapSize = (selected: string) => {
    setFilters((prev) => ({ ...prev, marketCapSize: selected }))
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <UnfoldMore className="h-4 w-4" />
    return sortOrder === "asc" ? (
      <ArrowDropUp className="h-4 w-4" />
    ) : (
      <ArrowDropDown className="h-4 w-4" />
    )
  }

  const TABLE_HEAD = [
    { label: "종목", key: "" },
    { label: "현재가", key: "" },
    { label: "등락률", key: "" },
    { label: "시가총액", key: "MC" }, // 시가총액 기준 정렬
    { label: "거래량", key: "TV" }, // 거래량 기준 정렬
  ]

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <Typography variant="h5" color="blue-gray">
            종목 정보 조회
          </Typography>
        </div>
      </CardHeader>
      <div className="mb-3 flex gap-3">
        <Button variant="gradient" className="rounded-full">
          필터 추가
        </Button>
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

      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map(({ label, key }) => (
                <th
                  key={label}
                  className="border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50 cursor-pointer border-y p-4 transition-colors"
                  onClick={() => key && handleSort(key)}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {label}
                    {key && getSortIcon(key)}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stockRows.map((stock) => {
              const { color, sign } = getPriceChangeColorAndSign(
                stock.priceChange
              )
              return (
                <tr key={stock.stockCode}>
                  <td
                    className="border-blue-gray-50 border-b p-4"
                    style={{ width: "30%" }}
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
                    className="border-blue-gray-50 border-b p-4"
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
                    className="border-blue-gray-50 border-b p-4"
                    style={{ width: "15%" }}
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
                    className="border-blue-gray-50 border-b p-4"
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
                    className="border-blue-gray-50 border-b p-4"
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
      </CardBody>
      <CardFooter className="border-blue-gray-50 flex items-center justify-between border-t p-4"></CardFooter>
    </Card>
  )
}

export default StockList
