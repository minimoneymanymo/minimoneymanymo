import Heading from "../common/Heading"
import { AnalysisData } from "./types"
import RadarChart from "./RadarChart"

interface InvestmentStyleProps {
  analysisData: AnalysisData | null // null 가능성을 포함한 타입 정의
}

const InvestmentStyle: React.FC<InvestmentStyleProps> = (props) => {
  const { analysisData } = props // props를 직접 사용

  return (
    <div className="h-fit w-full">
      <Heading title="투자성향"></Heading>
      <RadarChart data={analysisData!} />
    </div>
  )
}

export default InvestmentStyle
