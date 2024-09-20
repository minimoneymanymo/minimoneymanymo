import { fintechInstance } from "@/api/httpcommons"

// 은행코드 조회
const inquireBankCodes = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  // 프록시 적용
  fintechInstance.post('/api/bank/inquireBankCodes', param)
    .then(success)
    .catch(fail)
}

// 계좌 조회
const inquireAccount = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  fintechInstance.post('demandDeposit/inquireDemandDepositAccount', param)
    .then(success)
    .catch(fail)
}

// 계좌 출금
const withdraw = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  fintechInstance.post('demandDeposit/updateDemandDepositAccountWithdrawal', param)
    .then(success)
    .catch(fail)
}

// 계좌 입금
const deposit = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  fintechInstance.post('demandDeposit/updateDemandDepositAccountDeposit', param)
    .then(success)
    .catch(fail)
}

// 1원 송금
const authAccount = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  fintechInstance.post('accountAuth/openAccountAuth', param)
    .then(success)
    .catch(fail)
}

// 1원 송금 검증
const checkAuthCode = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  fintechInstance.post('accountAuth/checkAuthCode', param)
    .then(success)
    .catch(fail)
}

export { inquireBankCodes, inquireAccount, withdraw, deposit, authAccount, checkAuthCode}