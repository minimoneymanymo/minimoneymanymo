import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { RecordItemProps } from "@/types/accountTypes"

// Chart.js 모듈 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface GroupedRecordData {
  [date: string]: RecordItemProps[]
}

function formatDate(dateStr: string): string {
  return `${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
}

const LineChart: React.FC<{ data: GroupedRecordData }> = ({ data }) => {
  const labels: string[] = new Array(7)
  const chartData: number[] = new Array(7)

  Object.keys(data)
    .sort((a, b) => b.localeCompare(a))
    .forEach((date, index) => {
      const list = data[date]
      let latestAmount = 0
      if (list.length > 0) {
        latestAmount = list[list.length - 1].remainAmount
      }

      labels[labels.length - 1 - index] = formatDate(date) // date를 labels의 끝에서부터 넣음
      chartData[chartData.length - 1 - index] = latestAmount
    })

  const ex = {
    labels: labels,
    datasets: [
      {
        label: "내역 상세보기", // 데이터 라벨 추가
        data: chartData,
        fill: false,
        borderColor: "rgba(140, 140, 140, 1)",
        tension: 0.4, // 선의 굽은 정도 (0이면 직선)
        backgroundColor: "rgba(140, 140, 140, 0.2)", // 배경색 추가
        pointBackgroundColor: "rgba(255, 249, 226, 1)", // 포인트 배경색
        pointBorderColor: "rgba(255, 187, 26, 1)", // 포인트 테두리 색상
        pointHoverRadius: 8, // 포인트 hover 반경
        pointRadius: 5, // 기본 포인트 크기
        pointHoverBackgroundColor: "rgba(255, 187, 26, 1)", // hover시 포인트 배경색
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true, // 툴팁 활성화
        backgroundColor: "rgba(211, 211, 211, 0.8)", // 밝은 회색 배경색
        bodyColor: "#000", // 툴팁 텍스트 색상
        borderWidth: 1, // 툴팁 테두리
        borderColor: "rgba(181, 181, 181, 1)", // 진한 회색 테두리 색상
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(181, 181, 181, 0.2)", // X축 그리드라인 색상
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(181, 181, 181, 0.2)", // Y축 그리드라인 색상
        },
      },
    },
    layout: {
      padding: {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40,
      },
    },
  }
  return <Line data={ex} options={options} />
}

export default LineChart
