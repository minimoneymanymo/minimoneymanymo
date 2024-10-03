import { getMyChildAnalysisApi } from "@/api/analysis-api"
import { useChild } from "@/components/context/ChildContext"
import InvestmentMBTI from "@/components/investmentStyle/InvestmentMBTI"
import MyInvestmentStyle from "@/components/investmentStyle/InvestmentStyle"
import { AnalysisData } from "@/components/investmentStyle/types"
import { useEffect, useState } from "react"

const MyChildInvestStylePage = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null) // 초기값을 null로 설정
  const { child } = useChild()
  useEffect(() => {
    const fetchAnalysis = async () => {
      const res = await getMyChildAnalysisApi(child!.childrenId)
      if (res.data) {
        setAnalysisData(res.data)
        console.log(res.data)
      }
    }
    fetchAnalysis()
  }, [])

  return (
    <>
      <MyInvestmentStyle analysisData={analysisData} />
      <InvestmentMBTI />
    </>
  )
}

export default MyChildInvestStylePage
