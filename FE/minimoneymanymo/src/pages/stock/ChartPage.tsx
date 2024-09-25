import { IgrFinancialChart } from "igniteui-react-charts"
import { IgrFinancialChartModule } from "igniteui-react-charts"
import React, { useEffect, useState } from "react"
import { getStockDetail } from "@/api/stock-api"
import Home2 from "../home2/home2"
import { useParams } from "react-router-dom"

IgrFinancialChartModule.register()

interface DailyStockData {
  date: Date
  highestPrice: number
  lowestPrice: number
  tradingVolume: number
  operatingPrice: number
  closingPrice: number
}

interface FinancialChartPanesProps {
  dailyStockChart: DailyStockData[] | undefined
}

function ChartPage(): JSX.Element {
  const { stockCode } = useParams()
  const [dailyStockChart, setDailyStockChart] = useState<any | undefined>()

  useEffect(() => {
    const fetchStockData = async () => {
      if (!stockCode) return
      const res = await getStockDetail(stockCode)
      console.log(res.data.dailyStockChart)
      if (res) {
        setDailyStockChart(res.data.dailyStockChart)
      }
    }
    fetchStockData()
  }, [])

  return (
    <div className="h-full w-[900px]">
      <Home2 dailyStockChart={dailyStockChart} />
      <FinancialChartPanes dailyStockChart={dailyStockChart} />
    </div>
  )
}

export default ChartPage

class FinancialChartPanes extends React.Component<
  FinancialChartPanesProps,
  any
> {
  public data: any[] = [] // 초기값 할당

  constructor(props: FinancialChartPanesProps) {
    super(props)
    this.initData()
  }

  public render(): JSX.Element {
    return (
      <div className="sample container">
        <h2>주식 차트</h2>
        <div className="container">
          <IgrFinancialChart
            width="100%"
            height="100%"
            chartType="Candle"
            zoomSliderType="Candle"
            volumeType="Area"
            overlayBrushes="rgba(5, 138, 0, 0.17)"
            overlayOutlines="rgba(5, 138, 0, 0.4)"
            overlayThickness={1}
            dataSource={this.data}
            brushes={["#3182F6", "#F04452"]} // Set the fill color for the series
            outlines={["#3182F6"]}
          />
        </div>
      </div>
    )
  }

  public componentDidUpdate(prevProps: FinancialChartPanesProps) {
    // props가 업데이트되었을 때 데이터 초기화
    if (prevProps.dailyStockChart !== this.props.dailyStockChart) {
      this.initData()
    }
  }

  public initData() {
    const { dailyStockChart } = this.props
    console.log(this.props)
    // 매핑 함수
    const mappedData = dailyStockChart?.map((item) => ({
      time: new Date(item.date),
      open: item.operatingPrice,
      high: item.highestPrice,
      low: item.lowestPrice,
      close: item.closingPrice,
      volume: item.tradingVolume,
    }))

    this.data = mappedData || []
    // console.log(mappedData)
  }
}
