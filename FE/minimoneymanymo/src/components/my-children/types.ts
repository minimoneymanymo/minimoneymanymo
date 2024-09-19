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
}