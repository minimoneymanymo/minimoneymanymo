import { useEffect, useState } from "react"
import { IgrFinancialChartModule } from "igniteui-react-charts"
import { IgrFinancialChart } from "igniteui-react-charts"
import style from "./style.module.css"

IgrFinancialChartModule.register()

interface DailyStockData {
  date: string
  highestPrice: number
  lowestPrice: number
  tradingVolume: number
  operatingPrice: number
  closingPrice: number
}
interface DailyStockData2 {
  time: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface FinancialChartPanesProps {
  dailyStockChart: DailyStockData[] | undefined
}

const data = [
  {
    time: new Date(2013, 1, 1),
    open: Math.floor(268.93),
    high: Math.floor(268.93),
    low: 262.8,
    close: 265.0,
    volume: 6118146,
  },
  {
    time: new Date(2013, 1, 4),
    open: Math.floor(262.78),
    high: Math.floor(264.68),
    low: 259.07,
    close: 259.98,
    volume: 3723793,
  },
  {
    time: new Date(2013, 1, 5),
    open: Math.floor(262.0),
    high: Math.floor(268.03),
    low: 261.46,
    close: 266.89,
    volume: 4013780,
  },
  {
    time: new Date(2013, 1, 6),
    open: Math.floor(265.16),
    high: Math.floor(266.89),
    low: 261.11,
    close: 262.22,
    volume: 2772204,
  },
  {
    time: new Date(2013, 1, 7),
    open: Math.floor(264.1),
    high: Math.floor(264.1),
    low: 255.11,
    close: 260.23,
    volume: 3977065,
  },
  // {
  //   time: new Date(2013, 1, 8),
  //   open: Math.floor(261.4),
  //   high: Math.floor(265.25),
  //   low: 260.56,
  //   close: 261.95,
  //   volume: 3879628,
  // },
  // {
  //   time: new Date(2013, 1, 11),
  //   open: Math.floor(263.2),
  //   high: Math.floor(263.25),
  //   low: 256.6,
  //   close: 257.21,
  //   volume: 3407457,
  // },
  // {
  //   time: new Date(2013, 1, 12),
  //   open: Math.floor(259.19),
  //   high: Math.floor(260.16),
  //   low: 257.0,
  //   close: 258.7,
  //   volume: 2944730,
  // },
  // {
  //   time: new Date(2013, 1, 13),
  //   open: Math.floor(261.53),
  //   high: Math.floor(269.96),
  //   low: 260.3,
  //   close: 269.47,
  //   volume: 5295786,
  // },
  // {
  //   time: new Date(2013, 1, 14),
  //   open: Math.floor(267.37),
  //   high: Math.floor(270.65),
  //   low: 265.4,
  //   close: 269.24,
  //   volume: 3464080,
  // },
  // {
  //   time: new Date(2013, 1, 15),
  //   open: Math.floor(267.63),
  //   high: Math.floor(268.92),
  //   low: 263.11,
  //   close: 265.09,
  //   volume: 3981233,
  // },
  // {
  //   time: new Date(2013, 1, 16),
  //   open: Math.floor(266.2),
  //   high: Math.floor(269.0),
  //   low: 262.5,
  //   close: 267.3,
  //   volume: 4012341,
  // },
  // {
  //   time: new Date(2013, 1, 17),
  //   open: Math.floor(268.45),
  //   high: Math.floor(272.1),
  //   low: 266.4,
  //   close: 270.8,
  //   volume: 3894123,
  // },
  {
    time: new Date(2013, 1, 18),
    open: Math.floor(270.6),
    high: Math.floor(274.2),
    low: 269.5,
    close: 272.5,
    volume: 4156721,
  },
  {
    time: new Date(2013, 1, 19),
    open: Math.floor(273.0),
    high: Math.floor(275.5),
    low: 271.2,
    close: 273.9,
    volume: 4278934,
  },
  {
    time: new Date(2013, 1, 20),
    open: Math.floor(274.1),
    high: Math.floor(276.8),
    low: 273.0,
    close: 275.5,
    volume: 4032178,
  },
  {
    time: new Date(2013, 1, 21),
    open: Math.floor(275.2),
    high: Math.floor(277.6),
    low: 273.5,
    close: 276.3,
    volume: 3920182,
  },
  {
    time: new Date(2013, 1, 22),
    open: Math.floor(276.9),
    high: Math.floor(278.5),
    low: 274.8,
    close: 277.4,
    volume: 3794821,
  },
  {
    time: new Date(2013, 1, 23),
    open: Math.floor(277.5),
    high: Math.floor(279.9),
    low: 275.5,
    close: 278.6,
    volume: 3658923,
  },
  {
    time: new Date(2013, 1, 24),
    open: Math.floor(278.7),
    high: Math.floor(281.0),
    low: 276.6,
    close: 280.1,
    volume: 3990147,
  },
  {
    time: new Date(2013, 1, 25),
    open: Math.floor(280.2),
    high: Math.floor(282.7),
    low: 278.1,
    close: 281.5,
    volume: 3847230,
  },
  {
    time: new Date(2013, 1, 26),
    open: Math.floor(281.8),
    high: Math.floor(284.0),
    low: 279.8,
    close: 283.2,
    volume: 4112345,
  },
  {
    time: new Date(2013, 1, 27),
    open: Math.floor(283.5),
    high: Math.floor(285.6),
    low: 281.2,
    close: 284.5,
    volume: 3951342,
  },
  {
    time: new Date(2013, 1, 28),
    open: Math.floor(284.8),
    high: Math.floor(287.0),
    low: 282.8,
    close: 286.0,
    volume: 3789123,
  },
  // {
  //   time: new Date(2013, 2, 1),
  //   open: Math.floor(286.3),
  //   high: Math.floor(288.2),
  //   low: 284.1,
  //   close: 287.4,
  //   volume: 4102345,
  // },
  // {
  //   time: new Date(2013, 2, 2),
  //   open: Math.floor(287.6),
  //   high: Math.floor(289.8),
  //   low: 285.5,
  //   close: 288.9,
  //   volume: 4009182,
  // },
  // {
  //   time: new Date(2013, 2, 3),
  //   open: Math.floor(289.1),
  //   high: Math.floor(291.3),
  //   low: 287.0,
  //   close: 290.2,
  //   volume: 3857211,
  // },
  // {
  //   time: new Date(2013, 2, 4),
  //   open: Math.floor(290.5),
  //   high: Math.floor(292.7),
  //   low: 288.4,
  //   close: 291.8,
  //   volume: 3710345,
  // },
  // {
  //   time: new Date(2013, 2, 5),
  //   open: Math.floor(292.0),
  //   high: Math.floor(294.2),
  //   low: 289.8,
  //   close: 293.3,
  //   volume: 3982143,
  // },
  // {
  //   time: new Date(2013, 2, 6),
  //   open: Math.floor(293.5),
  //   high: Math.floor(295.6),
  //   low: 291.2,
  //   close: 294.8,
  //   volume: 3837129,
  // },
  // {
  //   time: new Date(2013, 2, 7),
  //   open: Math.floor(295.1),
  //   high: Math.floor(297.3),
  //   low: 292.9,
  //   close: 296.4,
  //   volume: 4175821,
  // },
  // {
  //   time: new Date(2013, 2, 8),
  //   open: Math.floor(296.5),
  //   high: Math.floor(298.8),
  //   low: 294.4,
  //   close: 297.9,
  //   volume: 4013712,
  // },
  // {
  //   time: new Date(2013, 2, 11),
  //   open: Math.floor(298.1),
  //   high: Math.floor(300.3),
  //   low: 295.8,
  //   close: 299.2,
  //   volume: 3890143,
  // },
  // {
  //   time: new Date(2013, 2, 12),
  //   open: Math.floor(299.5),
  //   high: Math.floor(301.7),
  //   low: 297.2,
  //   close: 300.6,
  //   volume: 4127930,
  // },
  // {
  //   time: new Date(2013, 2, 13),
  //   open: Math.floor(300.8),
  //   high: Math.floor(303.0),
  //   low: 298.5,
  //   close: 302.1,
  //   volume: 3950241,
  // },
  // {
  //   time: new Date(2013, 2, 14),
  //   open: Math.floor(302.3),
  //   high: Math.floor(304.5),
  //   low: 299.9,
  //   close: 303.7,
  //   volume: 4021345,
  // },
  // {
  //   time: new Date(2013, 2, 15),
  //   open: Math.floor(304.0),
  //   high: Math.floor(306.2),
  //   low: 301.7,
  //   close: 305.2,
  //   volume: 4168421,
  // },
  // {
  //   time: new Date(2013, 2, 16),
  //   open: Math.floor(305.5),
  //   high: Math.floor(307.7),
  //   low: 303.2,
  //   close: 306.8,
  //   volume: 3847212,
  // },
  // {
  //   time: new Date(2013, 2, 17),
  //   open: Math.floor(307.0),
  //   high: Math.floor(309.3),
  //   low: 304.8,
  //   close: 308.3,
  //   volume: 4210345,
  // },
  // {
  //   time: new Date(2013, 2, 18),
  //   open: Math.floor(308.5),
  //   high: Math.floor(310.7),
  //   low: 306.2,
  //   close: 309.8,
  //   volume: 4045934,
  // },
  // {
  //   time: new Date(2013, 2, 19),
  //   open: Math.floor(310.0),
  //   high: Math.floor(312.3),
  //   low: 307.6,
  //   close: 311.3,
  //   volume: 3974821,
  // },
]
type ChartData = {
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export default function Home2({ dailyStockChart }: any) {
  const title = "Financial Chart"
  // const [chartData, setChartData] = useState([])
  const [chartData, setChartData] = useState<ChartData[]>([])

  // useEffect(() => {
  //   console.log("dailyStockChart",dailyStockChart)
  //   console.log("data", data)
  //   const mappedData = dailyStockChart?.map((item) => ({
  //     time: new Date(item.date),
  //     open: Math.floor(item.operatingPrice,

  //)     low: item.lowestPrice,
  //     close: item.closingPrice,
  //     volume: item.tradingVolume,
  //   }))
  //   // console.log("data", typeof data[0].date)
  //   if(mappedData){
  //     console.log("mappedData", mappedData[0])
  //   }
  // }, [])

  class StockItem {
    public open?: number
    public close?: number
    public high?: number
    public low?: number
    public volume?: number

    public date?: Date
  }
  useEffect(() => {
    console.log("dailyStockChart", dailyStockChart)
    if (dailyStockChart) {
      //  const mappedData = dailyStockChart.map((item) => {
      //    // 기존 날짜에서 연도를 2023으로 변경
      //   //  const newDate = item.date.replace(/^(\d{4})/, "2023")
      //   let parts = item.date.split("-")
      //    return {
      //      time: new Date(Number(parts[0]), Number(parts[1]), Number(parts[2])), // Date 객체로 변환
      //      open: item.operatingPrice,
      //      high: item.highestPrice,
      //      low: item.lowestPrice,
      //      close: item.closingPrice,
      //      volume: item.tradingVolume,
      //    }
      //  })
      //  let stockItems: StockItem[] = []
      //     for (let item of dailyStockChart) {
      //      let parts = item.date
      //       let stock = new StockItem();
      //        stock.date = new Date(item.date)
      //        stock.high = item.highestPrice
      //        stock.low = item.lowestPrice
      //        stock.volume = item.tradingVolume
      //        stock.open = item.operatingPrice
      //        stock.close = item.closingPrice
      //       stockItems.push(stock)
      //     }
      //       console.log("stockItems", stockItems)

      const stock = []
      let i = 1
      for (let item of dailyStockChart) {
        const parts = item.date.split("-")
        //  console.log( Number(parts[0]), Number(parts[1])+1, Number(parts[2]))
        //   console.log(item.date)
        const year = Number(parts[0])
        const month = Number(parts[1]) - 1 // 0부터 시작하므로 1 빼기
        const day = Number(parts[2])

        stock.push({
          date: new Date(Number(parts[0]), Number(parts[1]), Number(parts[2])),
          // date: new Date(item.date),
          // date: new Date(2024,1,i++),
          open: item.operatingPrice,
          high: item.highestPrice,
          low: item.lowestPrice,
          close: item.closingPrice,
          volume: item.tradingVolume,
        })
      }
      console.log("stock", stock)
      console.log("data", data)

      setChartData(stock)
    }
  }, [dailyStockChart])

  return (
    <div>
      <h1 className={style.title}>{title}</h1>
      <div>
        Read more on the&nbsp;
        <a href="https://www.infragistics.com/products/ignite-ui-react/react/components/financialchart.html">
          official documentation page
        </a>
      </div>
      <div className={style.container}>
        <IgrFinancialChart
          width="700px"
          height="500px"
          dataSource={chartData}
          // isToolbarVisible={false}
          dataToolTipIncludedColumns={[
            "Open",
            "Close",
            "High",
            "Low",
            "Change",
          ]}
          zoomSliderType="Candle"
          // volumeType="Area"
          brushes={["#3182F6"]} // Set the fill color for the series
          outlines={["#3182F6"]}
          // toolTipType="false"
        ></IgrFinancialChart>
      </div>
    </div>
  )
}
