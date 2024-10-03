import { getMyAnalysisApi } from "@/api/analysis-api"
import InvestmentMBTI from "@/components/investmentStyle/InvestmentMBTI"
import InvestmentStyle from "@/components/investmentStyle/InvestmentStyle"
import { AnalysisData } from "@/components/investmentStyle/types"
import { useEffect, useState } from "react"

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
    <div>
      <InvestmentStyle analysisData={analysisData} />
      <InvestmentMBTI />
    </div>
  )
}

export default ChildInvestStylePage
