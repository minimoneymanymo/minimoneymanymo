import {useEffect, useState} from "react"
import {getStockList} from "@/api/stock-api" // 서버 API 호출
import {ChevronUpDownIcon} from "@heroicons/react/24/outline"
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
  Button,
} from "@material-tailwind/react"
import StockFilterMenu from "./StockFilterMenu"

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
  const [sortCriteria, setSortCriteria] = useState<string>("MC,desc") // TODO: 필터 기준 추가해야 함

  // 서버로 데이터를 요청하는 함수
  const fetchStockList = async () => {
    try {
      console.log(filters.marketCapSize)
      const queryParams = new URLSearchParams({
        marketType: filters.marketType || "",
        marketCapSize: filters.marketCapSize || "", //TODO: 필터 기준 추가해야 함
        sort: sortCriteria,
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
  }, [filters, sortCriteria])

  const TABLE_HEAD = ["종목", "현재가", "등락률", "시가총액", "거래량"]

  // 필터 메뉴에서 선택된 값을 업데이트하는 함수
  const handleSelectMarketType = (selected: string) => {
    setFilters((prev) => ({...prev, marketType: selected}))
  }

  const handleSelectMarketCapSize = (selected: string) => {
    setFilters((prev) => ({...prev, marketCapSize: selected}))
  }

  // 시가총액 형식 변환 함수
  const formatMarketCapitalization = (value: number): string => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(2)} 조원`
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(2)} 억원`
    }
    return `${value.toLocaleString()} 만원`
  }

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
            {label: "코스피", value: "KOSPI"},
            {label: "코스닥", value: "KOSDAQ"},
            {label: "코스피200", value: "KOSPI200"},
            {label: "코스닥150", value: "KSQ150"},
            {label: "코넥스", value: "KONEX"},
          ]}
          selected={filters.marketType}
          onSelect={handleSelectMarketType}
        />
        <StockFilterMenu
          label="시가총액"
          items={[
            {label: "소형주", value: "SMALL"},
            {label: "중형주", value: "MEDIUM"},
            {label: "대형주", value: "LARGE"},
          ]}
          selected={filters.marketCapSize}
          onSelect={handleSelectMarketCapSize}
        />
      </div>

      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50 cursor-pointer border-y p-4 transition-colors"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}
                    {(index === TABLE_HEAD.length - 1 ||
                      index === TABLE_HEAD.length - 2) && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stockRows.map((stock) => (
              <tr key={stock.stockCode}>
                <td className="border-blue-gray-50 border-b p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {stock.companyName}
                  </Typography>
                </td>
                <td className="border-blue-gray-50 border-b p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {stock.closingPrice.toLocaleString()} 원
                  </Typography>
                </td>
                <td className="border-blue-gray-50 border-b p-4">
                  <Typography
                    variant="small"
                    color="blue"
                    className="font-normal"
                  >
                    {stock.priceChangeRate.toFixed(2)}%
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue"
                    className="font-normal"
                  >
                    {stock.priceChange} 원
                  </Typography>
                </td>
                <td className="border-blue-gray-50 border-b p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {formatMarketCapitalization(stock.marketCapitalization)}
                  </Typography>
                </td>
                <td className="border-blue-gray-50 border-b p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {stock.tradingVolume.toLocaleString()} 주
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="border-blue-gray-50 flex items-center justify-between border-t p-4"></CardFooter>
    </Card>
  )
}

export default StockList
