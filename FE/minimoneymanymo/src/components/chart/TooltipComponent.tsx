import { Tooltip, Typography } from "@mui/material"
import { tooltipInfo } from "./tooltipInfo"
import { useAppSelector } from "@/store/hooks"
import { selectTooltip } from "@/store/slice/tooltip"

const TooltipComponent: React.FC<{
  label: string | undefined
  width?: number
  title?: string
}> = ({ label, width, title }) => {
  const isTooltipEnabled = useAppSelector(selectTooltip) // Get tooltip state
  const tooltipContent = label && tooltipInfo[label] // Get tooltip content if it exists

  return (
    <Tooltip
      title={
        tooltipContent ? (
          <div className="w-fit p-3 text-sm">
            <Typography color="inherit">{title ?? label}</Typography>
            {tooltipContent}
          </div>
        ) : undefined // Tooltip is undefined if there's no content
      }
      disableHoverListener={!isTooltipEnabled || !tooltipContent} // Disable if tooltip is not enabled or content doesn't exist
      PopperProps={{
        sx: {
          "& .MuiTooltip-tooltip": {
            backgroundColor: "rgba(255, 255, 255, 0.7)", // 배경색을 설정
            color: "black", // 텍스트 색상 변경
            borderRadius: "0.25rem", // 테두리 둥글게
            padding: "0.5rem", // 패딩 조정
            maxWidth: width ?? "300px", // 최대 너비 설정
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
        {label}
      </button>
    </Tooltip>
  )
}

export default TooltipComponent
