import React from "react"
import { AnalysisData } from "./types"
import { Radar } from "react-chartjs-2"
import { useAppSelector } from "@/store/hooks"
import { selectParent } from "@/store/slice/parent"
import { selectChild } from "@/store/slice/child"

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js"

interface RadarChartProps {
  data: AnalysisData | null
}

// Chart.js 요소 및 스케일 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  if (!data || !data.myStatistics || !data.overallStatistics) {
    return <div>Loading...</div> // Provide loading or error state
  }

  // 부모나 자식의 이름 조회
  const userName = data.myStatistics.name

  if (!data || !data.myStatistics || !data.overallStatistics) {
    return <div>Loading...</div> // Provide loading or error state
  }

  const chartData = {
    labels: ["현금비중", "매매횟수", "손익비율", "분산투자비율", "안정성"],
    datasets: [
      {
        label: `${userName}`, // 이름을 "나" 대신 표시
        data: [
          data.myStatistics.cashRatio,
          data.myStatistics.tradingFrequency,
          data.myStatistics.winLossRatio,
          data.myStatistics.diversification,
          data.myStatistics.stability,
        ],
        backgroundColor: "rgba(255, 187, 26, 0.2)", // 노란색 (tertiary-m4) 배경색
        borderColor: "#FFBB1A", // 노란색 경계선
        borderWidth: 2,
      },
      {
        label: "전체 이용자",
        data: [
          data.overallStatistics.cashRatio,
          data.overallStatistics.tradingFrequency,
          data.overallStatistics.winLossRatio,
          data.overallStatistics.diversification,
          data.overallStatistics.stability,
        ],
        backgroundColor: "rgba(71, 141, 129, 0.2)", // 초록색 (secondary-m2) 배경색
        borderColor: "#478D81", // 초록색 경계선
        borderWidth: 2,
      },
    ],
  }

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20, // 간격을 20으로 설정
          font: {
            size: 14, // 틱 글씨 크기 설정
          },
        },
        pointLabels: {
          font: {
            size: 12, // 레이블 글씨 크기 설정
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14, // 범례 글씨 크기 설정
          },
        },
      },
    },
  }

  return (
    <div className="mx-auto w-[500px]">
      <Radar data={chartData} options={options} />
    </div>
  )
}

export default RadarChart
