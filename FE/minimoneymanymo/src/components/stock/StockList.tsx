import {useEffect, useState} from "react"
import React from "react"
import {getStockList} from "@/api/stock-api"
import {ChevronDownIcon, ChevronUpDownIcon} from "@heroicons/react/24/outline"
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
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

function StockList(): JSX.Element {
  // 상태로 종목 데이터를 관리
  const [stockRows, setStockRows] = useState<StockData[]>([])

  //종목 리스트 불러오기
  useEffect(() => {
    const fetchStockList = async () => {
      try {
        const res = await getStockList()
        setStockRows(res.data.content) // 데이터를 상태에 저장
      } catch (error) {
        console.error("Failed to fetch stock list:", error)
      }
    }
    fetchStockList()
  }, [])

  const TABLE_HEAD = ["종목", "현재가", "등락률", "시가총액", "거래량"]

  const formatMarketCapitalization = (value: number): string => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(2)} 조원`
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(2)} 억원`
    }
    return `${value.toLocaleString()} 만원`
  }

  // 등락률 색상 지정 함수
  const getPriceChangeColor = (sign: string): string => {
    switch (sign) {
      case "1": // 상한
        return "blue"
      case "2": // 상승
        return "blue"
      case "3": // 보합
        return "gray"
      case "4": // 하한
        return "red"
      case "5": // 하락
        return "red"
      default:
        return "gray"
    }
  }

  // 선택된 아이템에 대한 처리
  const handleSelectMenu1 = (selected: string) => {
    console.log("Menu 1 Selected:", selected)
  }

  const handleSelectMenu2 = (selected: string) => {
    console.log("Menu 2 Selected:", selected)
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
          items={["코스피", "코스닥"]}
          onSelect={handleSelectMenu1}
        />
        <StockFilterMenu
          label="시가총액"
          items={["소형주", "중형주", "대형주"]}
          onSelect={handleSelectMenu2}
        />
      </div>

      {/* 검색된 종목 개수 출력 */}
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
                    {(index == TABLE_HEAD.length - 1 ||
                      index == TABLE_HEAD.length - 2) && (
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
                    // 1 : 상한 2 : 상승 3 : 보합 4 : 하한 5 : 하락 / 0: 값없음
                    color={getPriceChangeColor(stock.priceChangeSign)}
                    className="font-normal"
                  >
                    {stock.priceChangeRate.toFixed(2)}%
                  </Typography>
                  <Typography
                    variant="small" //보다 더 작게
                    // 1 : 상한 2 : 상승 3 : 보합 4 : 하한 5 : 하락 / 0: 값없음
                    color={getPriceChangeColor(stock.priceChangeSign)}
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
                    {/* 단위 만, 억, 조 구분해야 함. */}
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
