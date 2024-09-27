import Chart from "./Chart"
import { ChartData, DailyStockData, Stock } from "./ChartType"

interface ChartComponentProps {
  chartData: ChartData[] // 실제 데이터 타입에 맞게 정의하세요
  selectedChartType: string
  handleChartDataChange: (type: "daily" | "weekly" | "monthly") => void
  stockData: DailyStockData | undefined
  stockInfo: Stock | undefined
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  chartData,
  selectedChartType,
  handleChartDataChange,
  stockData,
  stockInfo,
}) => {
  // 버튼 생성 함수
  const renderButton = (
    label: string,
    type: "daily" | "weekly" | "monthly"
  ) => {
    return (
      <button
        className={`my-1 px-3 py-2 ${
          selectedChartType === type ? "rounded-lg bg-gray-100 font-bold" : ""
        }`}
        onClick={() => handleChartDataChange(type)}
      >
        {label}
      </button>
    )
  }

  const Info = (): JSX.Element => {
    return (
      <div className="relative col-span-1 m-2 box-border flex w-full flex-col space-y-1.5 rounded p-4 pt-5 shadow-md">
        <div className="absolute inset-0 rounded bg-secondary-m2 opacity-10"></div>
        <span>{Element("PER", stockData?.peRatio)}</span>
        <span>{Element("PBR", stockData?.pbRatio)}</span>
        <span>{Element("EPS", stockData?.earningsPerShare)}</span>
        <span>{Element("BPS", stockData?.bookValuePerShare)}</span>
      </div>
    )
  }

  const Info2 = (): JSX.Element => {
    return (
      <div className="relative col-span-4 m-2 ms-8 box-border flex rounded p-4 shadow-md">
        <div className="flex flex-1 flex-col space-y-1">
          <div className="mb-2 flex items-end gap-4">
            <span className="w-fit whitespace-nowrap text-xl">
              {stockInfo?.companyName}
            </span>
            <div className="flex w-full flex-col">
              <span className="text-sm">{stockInfo?.marketName}</span>
              <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                {stockInfo?.industry}
              </span>
            </div>
          </div>
          {Element("시가총액(억)", stockData?.marketCapitalization)}
          {Element("누적거래대금(만)", stockData?.tradingValue)}
          {Element("상장주식수(주)", stockData?.outstandingShares)}
        </div>
        <div className="mt-3 flex w-full flex-1 flex-col space-y-1">
          {/* {Element("", "")} */}
          {Element("거래량 회전률", `${stockData?.volumeTurnoverRatio} %`)}
          {Element("액면가", stockInfo?.faceValue)}
          {Element("52주 최고가", stockData?.high52Week)}
          {Element("52주 최저가", stockData?.low52Week)}
        </div>
        {/* <div className="absolute inset-0 rounded bg-primary-m1 opacity-10"></div> */}
      </div>
    )
  }
  const Element = (
    key: string,
    value: string | number | undefined
  ): JSX.Element => {
    return (
      <div className="flex w-full">
        <span className="flex-1">{key}</span>
        <span className="flex-1">{value ? value.toLocaleString() : "-"}</span>
      </div>
    )
  }

  return (
    <div className="z-10 flex h-full w-full flex-col bg-white shadow-md">
      <div className="flex h-fit w-full items-center justify-between ps-8">
        <span className="">차트</span>
        <div className="flex h-fit justify-end">
          {renderButton("일", "daily")}
          {renderButton("주", "weekly")}
          {renderButton("월", "monthly")}
        </div>
      </div>
      <Chart chartData={chartData} />
      <div className="grid w-full grid-cols-5 pr-8">
        <Info2 />
        <Info />
      </div>
    </div>
  )
}

export default ChartComponent
