/* eslint-disable */

import { useEffect, useState } from "react"
import { getStockDetail, toggleFavoriteStock } from "@/api/stock-api"
import { useParams } from "react-router-dom"
import { useOutletContext } from "react-router-dom"
import {
  ChartData,
  DailyStockData,
  Stock,
  StockData,
} from "@/components/chart/ChartType"
import ChartComponent from "@/components/chart/ChartComponent"

function StockDetailPage(): JSX.Element {
  const [dailyStockChart, setDailyStockChart] = useState<StockData[]>([])
  const [monthlyStockChart, setMonthlyStockChart] = useState<StockData[]>([])
  const [weeklyStockChart, setWeeklyStockChart] = useState<StockData[]>([])
  const [selectedChartData, setSelectedChartData] = useState<ChartData[]>([])
  const [selectedChartType, setSelectedChartType] = useState<
    "daily" | "weekly" | "monthly"
  >("daily") // 현재 선택된 차트 타입
  const { stockCode } = useParams<string>()
  const [stockInfo, setStockInfo] = useState<Stock>()
  const [stockData, setStockData] = useState<DailyStockData>()
  const [selectedTab, setSelectedTab] = useState<"chart" | "news">("chart")
  const [isLike, setIsLike] = useState<boolean>(false)
  // OutletContext에서 setClosingPrice 함수 가져오기
  const { setClosingPrice } = useOutletContext<{
    setClosingPrice: (price: number) => void
  }>() || { setClosingPrice: () => {} } // 에러 방지를 위한 기본값

  useEffect(() => {
    const fetchStockData = async () => {
      if (!stockCode) return
      const res = await getStockDetail(stockCode)
      console.log(res.data)
      if (res) {
        setDailyStockChart(res.data.dailyStockChart || [])
        setMonthlyStockChart(res.data.monthlyStockChart || [])
        setWeeklyStockChart(res.data.weeklyStockChart || [])
        setStockInfo(res.data.stock)
        setStockData(res.data.dailyStockData)
        setIsLike(res.data.stock.favorite)
        // 첫 번째 항목의 closingPrice를 setClosingPrice에 전달
        if (res.data.dailyStockChart && res.data.dailyStockChart.length > 0) {
          setClosingPrice(
            res.data.dailyStockChart[dailyStockChart.length - 1].closingPrice
          )
          setSelectedChartData(
            mapStockDataToChartData(res.data.dailyStockChart)
          )
        }
      }
    }
    fetchStockData()
  }, [setClosingPrice, stockCode])

  const handleChartDataChange = (dataType: "daily" | "weekly" | "monthly") => {
    let newData: StockData[] = []

    switch (dataType) {
      case "daily":
        newData = dailyStockChart
        break
      case "weekly":
        newData = weeklyStockChart
        break
      case "monthly":
        newData = monthlyStockChart
        break
      default:
        break
    }
    setSelectedChartData(mapStockDataToChartData(newData))
    setSelectedChartType(dataType) // 선택된 차트 타입 업데이트
  }

  const mapStockDataToChartData = (stockData: StockData[]): ChartData[] => {
    return stockData.map((item) => ({
      date: new Date(item.date),
      open: item.operatingPrice,
      high: item.highestPrice,
      low: item.lowestPrice,
      close: item.closingPrice,
      volume: item.tradingVolume,
    }))
  }

  const StockInfo = (): JSX.Element => {
    const toggleLike = async () => {
      setIsLike((prev) => !prev)
      const res = await toggleFavoriteStock(stockCode!)

      if (res.stateCode === 201) {
        if (res.data === true) {
          console.log("좋아요 등록", stockCode)
        } else {
          console.log("좋아요 삭제", stockCode)
        }
      }
    }
    return (
      <div className="m-6 mb-2 flex flex-col gap-2">
        {stockInfo ? (
          <>
            <div className="flex gap-3 text-xl">
              <div>{stockInfo.companyName}</div>
              <div className="text-lg text-gray-500">{stockInfo.stockCode}</div>
              <button onClick={toggleLike}>
                <img
                  src={
                    isLike
                      ? "/icons/icon-detail-like.svg"
                      : "/icons/icon-detail-unlike.svg"
                  }
                  alt="unlike"
                />
              </button>
            </div>
            <div className="flex items-end gap-3 text-xl">
              <div className="text-3xl font-bold">
                {dailyStockChart[0]?.closingPrice.toLocaleString() ??
                  "Loading..."}{" "}
                머니
              </div>
              <span className="text-base text-gray-500">
                어제보다
                {stockData ? (
                  <span
                    className={`ms-4 ${stockData.priceChange > 0 ? "text-red-500" : "text-blue-500"}`}
                  >
                    {stockData.priceChange > 0 ? "+" : "-"}
                    {stockData.priceChange ?? 0} 머니(
                    {stockData?.priceChangeRate ?? "N/A"}%)
                  </span>
                ) : (
                  <span>Loading...</span>
                )}
              </span>
            </div>
          </>
        ) : (
          <div>Loading stock information...</div>
        )}
      </div>
    )
  }

  const ChartOrNews = (): JSX.Element => {
    if (selectedTab === "chart")
      return (
        <ChartComponent
          chartData={selectedChartData}
          handleChartDataChange={handleChartDataChange}
          stockData={stockData}
          selectedChartType={selectedChartType}
          stockInfo={stockInfo}
        />
      )
    else return <NewsComponent />
  }

  //뉴스 자리
  const NewsComponent = (): JSX.Element => {
    return (
      <div className="z-10 bg-white p-4">여기에 기업 뉴스가 표시됩니다.</div>
    )
  }

  return (
    <div className="relative flex h-full w-[800px] flex-col">
      <div className="flex h-fit w-full items-end justify-between">
        <StockInfo />
      </div>
      <div className="absolute right-2 top-14 flex gap-2">
        <button
          className={`h-16 w-24 rounded-t-lg pb-6 ${
            selectedTab === "news"
              ? "bg-gray-100 font-bold"
              : "translate-y-3 bg-gray-300 text-gray-800"
          }`}
          onClick={() => setSelectedTab("news")}
        >
          기업뉴스
        </button>
        <button
          className={`h-16 w-24 rounded-t-lg pb-6 ${
            selectedTab === "chart"
              ? "bg-gray-100 font-bold"
              : "translate-y-3 bg-gray-300 text-gray-800"
          }`}
          onClick={() => setSelectedTab("chart")}
        >
          차트
        </button>
      </div>
      <ChartOrNews />
    </div>
  )
}

export default StockDetailPage
