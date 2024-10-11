// 자식 목록 불러올 때
export interface Children {
  childrenId: number
  createdAt?: string
  money: number
  name: string
  profileimgUrl: string | null
  totalAmount: number
  userId: string
  withdrawableMoney: number
}

//자식 한명 클릭할 때 씀
export interface Child {
  childrenId: number
  userId: string
  name: string
  profileimgUrl: string | null
  money: number
  totalAmount: number
  withdrawableMoney: number
  settingMoney: 3000
  settingWithdrawableMoney: 5999
  settingQuizBonusMoney: 4000
  createdAt: string
}

export interface MyChildDiary {
  childrenId: string | null
  stockCode: string | null
  amount: number
  tradeSharesCount: number
  reason: string
  tradeType: string
  remainAmount: number
  stockTradingGain: number
  createdAt: string
  reasonBonusMoney: number | null
  companyName: string
}
