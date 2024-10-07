export interface Analysis {
  name: string
  tradingFrequency: number
  cashRatio: number
  winLossRatio: number
  diversification: number
  stability: number
  investmentType: string
}

export interface AnalysisData {
  myStatistics: Analysis | null
  overallStatistics: Analysis | null
}
