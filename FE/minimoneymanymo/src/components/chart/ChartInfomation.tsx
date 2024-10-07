import { useAppSelector } from "@/store/hooks"
import { selectTooltip } from "@/store/slice/tooltip"
import { tooltipInfo } from "./tooltipInfo"
import { Tooltip, Typography } from "@mui/material"
import TooltipComponent from "./TooltipComponent"
import { formatNumber } from "@/utils/stock-utils"
import { DailyStockData, Stock } from "./ChartType"

export const FinancialInfo: React.FC<{
  stockData: DailyStockData | undefined
}> = ({ stockData }): JSX.Element => {
  const isTooltipEnabled = useAppSelector(selectTooltip)

  return (
    <div className="relative col-span-1 m-1 ml-2 flex h-fit w-full flex-col rounded bg-secondary-50 px-4 py-2 shadow-md">
      {/* <div className="absolute inset-0 z-0 rounded bg-secondary-m2 opacity-10"></div> */}
      <Tooltip
        disableHoverListener={!isTooltipEnabled} // 툴팁 활성화 여부에 따라 비활성화
        title={
          <div className="w-fit p-3 text-sm">
            <Typography color="inherit">재무재표</Typography>
            {tooltipInfo["재무재표"]}
          </div>
        }
        PopperProps={{
          sx: {
            "& .MuiTooltip-tooltip": {
              bgcolor: "", // 원하는 색으로 변경
              color: "white", // 텍스트 색상 변경
              borderRadius: "4px", // 테두리
              padding: "8px", // 패딩 조정
              maxWidth: 500,
            },
          },
        }}
        placement="left-end"
      >
        <button
          className={`w-fit rounded-sm p-0.5 px-1 font-bold ${isTooltipEnabled ? "hover:bg-secondary-200" : ""}`}
        >
          재무재표
        </button>
      </Tooltip>
      <span>{Element("PER", stockData?.peRatio)}</span>
      <span>{Element("PBR", stockData?.pbRatio)}</span>
      <span>{Element("EPS", stockData?.earningsPerShare)}</span>
      <span>{Element("BPS", stockData?.bookValuePerShare)}</span>
    </div>
  )
}

export const CompanyInfo: React.FC<{
  stockInfo: Stock | undefined
  stockData: DailyStockData | undefined
}> = ({ stockInfo, stockData }) => {
  return (
    <div className="relative col-span-4 m-1 ml-2 flex h-[155px] flex-col rounded p-4 pt-2 shadow-md">
      <div className="mb-2 flex items-center gap-4 border-b-2 py-1">
        <span className="w-fit whitespace-nowrap text-xl font-bold">
          {stockInfo?.companyName}
        </span>
        <div className="flex w-full flex-col">
          <span className="text-sm">
            <TooltipComponent label={stockInfo?.marketName} />
          </span>
          <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm">
            {stockInfo?.industry}
          </span>
        </div>
      </div>
      <div className="flex space-x-8">
        <div className="flex basis-3/5 flex-col">
          {Element(
            "시가총액",
            stockData?.marketCapitalization
              ? formatNumber(stockData?.marketCapitalization)
              : undefined
          )}
          {Element(
            "누적거래대금",
            stockData?.tradingValue
              ? formatNumber(stockData?.tradingValue)
              : undefined
          )}
          {Element(
            "상장주식수",
            stockData?.outstandingShares
              ? formatNumber(stockData?.outstandingShares)
              : undefined
          )}
        </div>
        <div className="flex w-full basis-2/5 flex-col">
          {Element("거래량 회전률", `${stockData?.volumeTurnoverRatio} %`)}
          {Element("52주 최고가", stockData?.high52Week)}
          {Element("52주 최저가", stockData?.low52Week)}
        </div>
      </div>
    </div>
  )
}

const Element = (
  key: string,
  value: string | number | undefined
): JSX.Element => {
  const info = tooltipInfo[key] || "설명 없음" // 설명이 없을 경우 기본값 설정
  const isTooltipEnabled = useAppSelector(selectTooltip)

  return (
    <div className="flex w-full">
      <Tooltip
        disableHoverListener={!isTooltipEnabled}
        title={
          <div className="w-fit p-3 text-sm">
            <Typography color="inherit">{key}</Typography>
            {info}
          </div>
        }
        PopperProps={{
          sx: {
            "& .MuiTooltip-tooltip": {
              bgcolor: "", // 원하는 색으로 변경
              color: "white", // 텍스트 색상 변경
              borderRadius: "4px", // 테두리 둥글게
              padding: "8px", // 패딩 조정
              maxWidth: 500,
            },
          },
        }}
        placement="left-end"
      >
        <button
          className={`w-fit rounded-sm p-0.5 px-1 ${isTooltipEnabled ? "hover:bg-secondary-200" : ""}`}
        >
          {key}
        </button>
      </Tooltip>
      <span className="flex-1 text-right">{value ?? "-"}</span>
    </div>
  )
}
