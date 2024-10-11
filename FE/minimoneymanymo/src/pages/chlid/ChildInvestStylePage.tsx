import { getMyAnalysisApi } from "@/api/analysis-api"
import InvestmentMBTI from "@/components/investmentStyle/InvestmentMBTI"
import InvestmentStyle from "@/components/investmentStyle/InvestmentStyle"
import { AnalysisData } from "@/components/investmentStyle/types"
import { useEffect, useState } from "react"
import Heading from "@/components/common/Heading"
import ToggleList from "@/components/common/ToggleList" // ToggleList 임포트
import IndicatorDescriptions from "@/components/investmentStyle/IndicatorDescriptions" // 설명 컴포넌트 임포트

const ChildInvestStylePage = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      const res = await getMyAnalysisApi()
      if (res.data) {
        setAnalysisData(res.data)
        console.log(res.data)
      }
    }
    fetchAnalysis()
  }, [])

  return (
    <div className="flex w-full flex-col space-y-4">
      <Heading title="투자성향" />
      <div className="mt-4">
        <div className="rounded-2xl bg-white p-6">
          <InvestmentMBTI analysisData={analysisData} />
        </div>
      </div>

      <Heading title="투자분석" />
      <div className="mt-4">
        <div className="rounded-2xl bg-white p-6">
          <InvestmentStyle analysisData={analysisData} />
        </div>
      </div>
      <div className="mt-4">
        <ToggleList title="지표 상세 보기">
          <IndicatorDescriptions />
        </ToggleList>
      </div>
    </div>
  )
}

export default ChildInvestStylePage
