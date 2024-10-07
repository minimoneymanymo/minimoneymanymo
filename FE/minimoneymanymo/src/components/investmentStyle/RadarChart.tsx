import React from "react"
import { AnalysisData } from "./types"
import { Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js"

// Chart.js 요소 및 스케일 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface RadarChartProps {
  data: AnalysisData
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  console.log(data)
  if (!data || !data.myStatistics || !data.overallStatistics) {
    return <div>Loading...</div> // Provide loading or error state
  }

  const chartData = {
    labels: ["현금비중", "매매횟수", "손익비율", "분산투자비율", "안정성"],
    datasets: [
      {
        label: "나",
        data: [
          data.myStatistics.cashRatio,
          data.myStatistics.tradingFrequency,
          data.myStatistics.winLossRatio,
          data.myStatistics.diversification,
          data.myStatistics.stability,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "친구들",
        data: [
          data.overallStatistics.cashRatio,
          data.overallStatistics.tradingFrequency,
          data.overallStatistics.winLossRatio,
          data.overallStatistics.diversification,
          data.overallStatistics.stability,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    // scales: {
    //   r: {
    //     type: "radialLinear" as const, // type을 'radialLinear'로 명시
    //     angleLines: {
    //       display: true,
    //     },
    //     suggestedMin: 0,
    //     suggestedMax: 100,
    //     ticks: {
    //       stepSize: 20,
    //       font: {
    //         size: 12, // Font size for ticks
    //       },
    //     },
    //     pointLabels: {
    //       font: {
    //         size: 14, // Font size for point labels
    //         weight: "bold", // Type Safety
    //       },
    //     },
    //     grid: {
    //       lineWidth: 1,
    //     },
    //   },
    // },
  }

  return (
    <div className="mx-auto w-[500px]">
      <Radar data={chartData} options={options} />
    </div>
  )
}

export default RadarChart
