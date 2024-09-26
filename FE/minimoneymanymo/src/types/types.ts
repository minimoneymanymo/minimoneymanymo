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
