import {
  IgrFinancialChart,
  IgrFinancialChartModule,
} from "igniteui-react-charts"
import { ChartData } from "./ChartType"
import { IChartTooltipProps } from "igniteui-react-core"
import { formatNumber } from "@/utils/stock-utils"
import TooltipComponent from "./TooltipComponent"

interface ChartComponentProps {
  chartData: ChartData[]
  trendLinePeriod: number | null
  isVisibletrendLine: boolean
}
IgrFinancialChartModule.register()

const Chart: React.FC<ChartComponentProps> = ({
  chartData,
  trendLinePeriod,
  isVisibletrendLine,
}) => {
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

  // IChartTooltipProps를 사용하는 툴팁 컴포넌트
  const CustomTooltip: React.FC<IChartTooltipProps> = (props) => {
    const { dataContext } = props // dataContext에서 item을 가져옴
    const item = dataContext?.item // 실제 데이터 항목

    // item이 존재하지 않거나 필요한 속성이 없는 경우 처리
    if (!item) return null
    return (
      // <div className="border-none bg-white p-2">
      // <div className="absolute z-50 rounded-md bg-white p-2 shadow-lg">
      <div
        className="absolute z-50 rounded-md bg-white p-2 shadow-lg"
        style={{
          top: "-2px",
          left: "-2px",
          // transform: "translate(-50%, -100%)",
        }}
      >
        <div className="flex w-full flex-col space-y-1 text-left">
          {" "}
          {/* 각 항목 사이의 수직 간격 설정 */}
          <div className="flex w-full">
            <b>{item.date.toLocaleDateString("ko-KR")}</b>
          </div>
          <div className="flex w-full">
            <span className="w-[70px]">시작가:</span>
            <span className="w-full text-left">
              {item.open.toLocaleString()} 머니
            </span>
          </div>
          <div className="flex w-full">
            <span className="w-[70px]">최고가:</span>
            <span className="w-full text-left">
              {item.high.toLocaleString()} 머니
            </span>
          </div>
          <div className="flex w-full">
            <span className="w-[70px]">최저가:</span>
            <span className="w-full text-left">
              {item.low.toLocaleString()} 머니
            </span>
          </div>
          <div className="flex w-full">
            <span className="w-[70px]">종가:</span>
            <span className="w-full text-left">
              <b> {item.close.toLocaleString()} 머니</b>
            </span>
          </div>
          <div className="flex w-full">
            <span className="w-[70px]">거래량:</span>
            <span className="w-full text-left">
              {formatNumber(item.volume)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <IgrFinancialChart
        width="100%"
        height="100%"
        dataSource={chartData}
        // tooltipTemplates={tooltipTemplate}
        // dataToolTipIncludedColumns={tooltipTemplate}
        // zoomSliderType="column"
        brushes={["#3182F6"]}
        outlines={["#3182F6"]}
        calloutsVisible={true}
        // xAxisInterval={1}
        // xAxisGap={0.75}
        isToolbarVisible="false" //툴바 비활성화
        tooltipTemplate={CustomTooltip}
        toolTipType="item"
        chartType={"Candle"}
        // transitionInDuration={100000}
        yAxisLabelFormat="{0}"
        isVerticalZoomEnabled="false"
        zoomSliderType="none"
        // volumeThickness={0.11}
        volumeType="column"
        volumeThickness="0.8"
        volumeBrushes={"#478D81"}
        trendLineBrushes={["#FF5733", "#33FF57", "#3357FF", "#3182F6"]}
        trendLineType={isVisibletrendLine ? "simpleAverage" : "none"} //이동평균 SMA
        trendLinePeriod={trendLinePeriod ?? 0}
        // trendLineType="exponentialAverage" //지수이동평균 EMA
        // trendLineType="linearFit" //선형추세선
        // trendLineType="linearFit" //선형추세선
        // xAxisMinimumValue={new Date(2024,8,8)}
        // xAxisMaximumValue={new Date(2024,9,8)}
        // xAxisZoomMaximumCategoryRange={2}
        // xAxisZoomToCategoryStart={0}
        volumeOutlines={"white"}
        // toolTipType="data"
        // dataToolTipUnitsText={""}
        // xAxisZoomToCategoryRange={}
        windowRect={
          chartData.length < 20 ? defaultWindowRect : initialWindowRect
        } // 조건부로 설정된 windowRect 20개 기준
        // toolTipType="Data"
        // dataToolTipIncludedColumns={["Open", "Close", "High", "Low"]}
        // dataToolTipLabelTextColor="rgba(74, 74, 74, 1)"
        // dataToolTipValueTextColor="rgba(0, 173, 3, 1)"
      />
      <TooltipComponent label={"거래량"} />
    </div>
  )
}
export default Chart
