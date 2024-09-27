export interface StockData {
  date: string
  highestPrice: number
  lowestPrice: number
  tradingVolume: number
  operatingPrice: number
  closingPrice: number
}

export interface ChartData {
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}
export interface Stock {
  stockCode: string
  companyName: string
  industry: string
  mainProducts: string
  listingDate: string
  settlementMonth: number
  ceoName: string
  website: string | null
  region: string
  marketName: string
  faceValue: string
  currencyName: string
}
export interface DailyStockData {
  stockCode: string
  date: string | null
  marketCapitalization: number
  priceChangeSign: string
  priceChange: number
  priceChangeRate: number
  peRatio: number
  pbRatio: number
  earningsPerShare: number
  bookValuePerShare: number
  foreignNetBuyVolume: string
  htsForeignExhaustionRate: number
  programNetBuyVolume: string
  volumeTurnoverRatio: number
  tradingValue: number
  outstandingShares: number
  high52Week: number
  high52WeekDate: string
  low52Week: number
  low52WeekDate: string
}
