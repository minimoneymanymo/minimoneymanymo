// Header의 구조 정의
export interface Header {
  apiName: string
  transmissionDate: string
  transmissionTime: string
  institutionCode: string
  fintechAppNo: string
  apiServiceCode: string
  institutionTransactionUniqueNo: string
  apiKey: string
  userKey: string
}

// API 응답 전체 구조 정의, REC를 제네릭으로 설정
export interface AccountResponse<RECType> {
  Header: Header
  REC: RECType // 다양한 REC 구조를 위한 제네릭 타입
}

export interface AccountState {
  bankName: string
  accountNo: string
  accountName: string
  accountBalance: string
}

export interface Bank {
  bankCode: string
  bankName: string
}

export interface MAccountInfoProps {
  name: string
  balance: number
  modalOnClick?: () => void
}

export interface AccountInfoProps {
  bankName?: string
  accoutNo?: string
  accountName?: string
  accountBalance?: string
  modalOnClick?: () => void
}

export interface MoneyInfoProps {
  money: number
  withdrawableMoney: number
}

export interface WithdrawableMoneyProps {
  createdAt: string
  amount: string
  approvedAt: string
}

export interface RecordItemProps {
  createdAt: string
  tradeType: string
  amount: number
  companyName?: string | null
  tradeSharesCount?: number | null
  remainAmount: number
}
