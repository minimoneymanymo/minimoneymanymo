import {
  IgrFinancialChart,
  IgrFinancialChartModule,
} from "igniteui-react-charts"
import { ChartData } from "./ChartType"

interface ChartComponentProps {
  chartData: ChartData[]
}
IgrFinancialChartModule.register()

const Chart: React.FC<ChartComponentProps> = ({ chartData }) => {
  const initialWindowRect = { left: 1, top: 0, width: 0.5, height: 1 } // 초기 확대 범위
  const defaultWindowRect = { left: 1, top: 0, width: 0.8, height: 1 } // 초기 확대 범위

  // const tooltipTemplate = (data: ChartData): any[] => {
  //   return `
  //   <div>
  //     <strong>${data.date}</strong><br/>
  //     Open: ${data.open}<br/>
  //     High: ${data.high}<br/>
  //     Low: ${data.low}<br/>
  //     Close: ${data.close}
  //   </div>
  // `
  // }

  return (
    <div className="box-border size-full">
      <IgrFinancialChart
        width="100%"
        height="100%"
        dataSource={chartData}
        // tooltipTemplates={tooltipTemplate}
        // dataToolTipIncludedColumns={tooltipTemplate}
        // zoomSliderType="column"
        brushes={["#3182F6"]}
        outlines={["#3182F6"]}
        // xAxisInterval={1}
        // xAxisGap={0.75}
        isToolbarVisible="false" //툴바 비활성화
        chartType={"Candle"}
        // transitionInDuration={100000}
        yAxisLabelFormat="{0}"
        isVerticalZoomEnabled="false"
        zoomSliderType="none"
        // volumeThickness={0.11}
        volumeType="column"
        volumeThickness="0.8"
        xAxisTitle={"거래량"}
        xAxisLabel={"거래량"}
        volumeBrushes={"#478D81"}
        trendLineBrushes={["#FF5733", "#33FF57", "#3357FF", "#3182F6"]}
        trendLineType="simpleAverage" //이동평균 SMA
        // trendLineType="exponentialAverage" //지수이동평균 EMA
        // trendLineType="linearFit" //선형추세선
        // trendLineType="linearFit" //선형추세선
        // xAxisMinimumValue={new Date(2024,8,8)}
        // xAxisMaximumValue={new Date(2024,9,8)}
        // xAxisZoomMaximumCategoryRange={2}
        // xAxisZoomToCategoryStart={0}
        volumeOutlines={"white"}
        toolTipType="data"
        dataToolTipUnitsText={""}
        // xAxisZoomToCategoryRange={}
        windowRect={
          chartData.length > 20 ? initialWindowRect : defaultWindowRect
        } // 조건부로 설정된 windowRect 20개 기준
      />
    </div>
  )
}

export default Chart
