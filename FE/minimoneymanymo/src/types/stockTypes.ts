export interface StockHeld {
  childrenId: number
  stockCode: string
  remainSharesCount: number // 실수
  totalAmount: number
  companyName: string
  marketName: string
  closingPrice: number
  averagePrice: number
  evaluateMoney: number
  priceChangeRate: number
  priceChangeMoney: number
  priceChange: number
  stockPriceChangeRate: number
}
