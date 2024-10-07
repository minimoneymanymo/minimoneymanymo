import { getMyAnalysisApi } from "@/api/analysis-api"
import InvestmentMBTI from "@/components/investmentStyle/InvestmentMBTI"
import InvestmentStyle from "@/components/investmentStyle/InvestmentStyle"
import { AnalysisData } from "@/components/investmentStyle/types"
import { useEffect, useState } from "react"
import Heading from "@/components/common/Heading"

const ChildInvestStylePage = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null) // 초기값을 null로 설정

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
    // <div className="w-full rounded-lg p-6">
    <div className="mb-12 flex w-full flex-col space-y-4">
      <Heading title="투자성향" />
      <div className="mt-4">
        <div className="mt-6">
          <InvestmentMBTI analysisData={analysisData} />
        </div>
      </div>
      <Heading title="투자분석" />
      <div>
        <div className="mt-6">
          <InvestmentStyle analysisData={analysisData} />
        </div>
      </div>
    </div>
  )
}

export default ChildInvestStylePage
