import Chart from "./Chart"
import { ChartData, DailyStockData, Stock } from "./ChartType"
import { Tooltip, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useAppSelector } from "@/store/hooks"
import { selectTooltip } from "@/store/slice/tooltip"
import { tooltipInfo } from "./tooltipInfo"
import IconInfo from "@/assets/icons/IconInfo"
import TooltipComponent from "./TooltipComponent"
import { CompanyInfo, FinancialInfo } from "./ChartInfomation"
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
  const isTooltipEnabled = useAppSelector(selectTooltip) // Get tooltip state

  const [trendLinePeriod, setTrendLinePeriod] = useState<number | null>(5)
  const [isVisibletrendLine, setIsVisibletrendLine] = useState<boolean>(true)

  useEffect(() => {
    if (selectedChartType === "daily") {
      setTrendLinePeriod(5)
    } else if (selectedChartType === "monthly") {
      setTrendLinePeriod(1)
    } else if (selectedChartType === "weekly") {
      setTrendLinePeriod(1)
    }
    setIsVisibletrendLine(true)
  }, [selectedChartType])

  // 일 주 월 버튼 생성 함수
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
        <Tooltip
          disableHoverListener={!isTooltipEnabled}
          title={
            <div className="w-fit p-3 text-sm">
              <Typography color="inherit">{label}봉</Typography>
              {tooltipInfo[label]}
            </div>
          }
          PopperProps={{
            sx: {
              "& .MuiTooltip-tooltip": {
                backgroundColor: "rgba(255, 255, 255, 0.7)", // 배경색을 설정
                color: "black", // 텍스트 색상 변경
                borderRadius: "0.25rem", // 테두리 둥글게
                padding: "0.5rem", // 패딩 조정
                maxWidth: "500px", // 최대 너비 설정
                backdropFilter: "blur(8px)", // 블러 효과 추가
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)", // 그림자 추가 (선택 사항)
              },
            },
          }}
          placement="top"
        >
          <button
            className={`w-fit rounded-sm p-0.5 px-1 ${isTooltipEnabled ? "hover:bg-secondary-200" : ""}`}
          >
            {label}
          </button>
        </Tooltip>
      </button>
    )
  }

  const handlePeriod = (
    period: 1 | 3 | 4 | 5 | 6 | 12 | 24 | 20 | 60 | 120
  ) => {
    if (period === trendLinePeriod && isVisibletrendLine) {
      setIsVisibletrendLine(false)
      setTrendLinePeriod(null)
      return
    }
    setTrendLinePeriod(period) // 그 외에는 그대로 설정
    setIsVisibletrendLine(true)
  }

  const periodButton = (
    period: 1 | 3 | 4 | 5 | 6 | 12 | 24 | 20 | 60 | 120
  ): JSX.Element => {
    return (
      <button
        className={`my-1 px-2 py-1 ${
          trendLinePeriod === period ? "rounded-lg bg-gray-100 font-bold" : ""
        }`}
        onClick={() => handlePeriod(period)}
      >
        {period && selectedChartType === "daily" && (
          <TooltipComponent label={`${period}일`} title={`${period}일선`} />
        )}
        {period && selectedChartType === "weekly" && (
          <TooltipComponent label={`${period}주`} title={`${period}주선`} />
        )}
        {period && selectedChartType === "monthly" && (
          <TooltipComponent
            label={`${period}개월`}
            title={`${period}개월선`} // 여기에서 '년선'으로 수정
          />
        )}
      </button>
    )
  }

  return (
    <div className="z-10 flex h-full w-full flex-col bg-white">
      <div className="m-2 mt-0 h-full rounded border border-t pb-14 shadow-md">
        <div className="flex h-fit w-full items-center justify-between ps-8">
          <div className="mt-1 w-[50px]"> 차트</div>
          <Tooltip
            title={
              <div className="w-fit p-3 text-sm">
                <Typography color="inherit">캔들 차트</Typography>
                {tooltipInfo["캔들차트"]}
              </div>
            }
            PopperProps={{
              sx: {
                "& .MuiTooltip-tooltip": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)", // 배경색을 설정
                  color: "black", // 텍스트 색상 변경
                  borderRadius: "0.25rem", // 테두리 둥글게
                  padding: "0.5rem", // 패딩 조정
                  maxWidth: "1000px", // 최대 너비 설정
                  backdropFilter: "blur(8px)", // 블러 효과 추가
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)", // 그림자 추가 (선택 사항)
                },
              },
            }}
            placement="right-end"
          >
            <button className={`mt-1 h-full items-center`}>
              <IconInfo width="20" />
            </button>
          </Tooltip>

          {/* 툴팁 활성화/비활성화 버튼 */}
          <div className="m-2 flex justify-end"></div>
          <div className="mr-3 flex w-full items-center justify-end text-sm">
            <div className="mr-2 w-[25px] border-b border-red-600"></div>
            <Tooltip
              title={
                <div className="w-fit p-3 text-sm">
                  <Typography color="inherit">이동평균선(이평선)</Typography>
                  {tooltipInfo["이동평균"]}
                </div>
              }
              PopperProps={{
                sx: {
                  "& .MuiTooltip-tooltip": {
                    backgroundColor: "rgba(255, 255, 255, 0.6)", // 배경색을 설정
                    color: "black", // 텍스트 색상 변경
                    borderRadius: "0.25rem", // 테두리 둥글게
                    padding: "0.5rem", // 패딩 조정
                    maxWidth: "300px", // 최대 너비 설정
                    backdropFilter: "blur(8px)", // 블러 효과 추가
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)", // 그림자 추가 (선택 사항)
                  },
                },
              }}
              placement="left-end"
            >
              <button
                className={` ${isTooltipEnabled ? "hover:bg-secondary-200" : ""}`}
              >
                이동평균
              </button>
            </Tooltip>
            <div className="ml-3 w-[180px]">
              {selectedChartType === "daily" && (
                <>
                  {periodButton(5)}
                  {periodButton(20)}
                  {periodButton(60)}
                  {periodButton(120)}
                </>
              )}
              {selectedChartType === "weekly" && (
                <>
                  {periodButton(4)}
                  {periodButton(12)}
                  {periodButton(24)}
                </>
              )}

              {selectedChartType === "monthly" && (
                <>
                  {periodButton(3)}
                  {periodButton(6)}
                  {periodButton(12)}
                </>
              )}
            </div>
          </div>
          <div className="flex h-fit justify-end">
            {renderButton("일", "daily")}
            {renderButton("주", "weekly")}
            {renderButton("월", "monthly")}
          </div>
        </div>
        <div className="h-full">
          <Chart
            chartData={chartData}
            isVisibletrendLine={isVisibletrendLine}
            trendLinePeriod={trendLinePeriod}
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-5 pr-6">
        <CompanyInfo stockData={stockData} stockInfo={stockInfo} />
        <FinancialInfo stockData={stockData} />
      </div>
    </div>
  )
}

export default ChartComponent
