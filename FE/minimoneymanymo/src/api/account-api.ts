import { fintechInstance } from "@/api/httpcommons"

// 은행코드 조회
const inquireBankCodesApi = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  console.log(param)
  fintechInstance.post('/bank/inquireBankCodes', param)
    .then(success)
    .catch(fail)
}
// 계좌 조회
const inquireAccountApi = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  fintechInstance.post('/demandDeposit/inquireDemandDepositAccount', param)
    .then(success)
    .catch(fail)
}

// 계좌 출금
const withdrawApi = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  fintechInstance.post('/demandDeposit/updateDemandDepositAccountWithdrawal', param)
    .then(success)
    .catch(fail)
}

// 계좌 입금
const depositApi = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  fintechInstance.post('/demandDeposit/updateDemandDepositAccountDeposit', param)
    .then(success)
    .catch(fail)
}

// 1원 송금
const authAccountApi = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  fintechInstance.post('/accountAuth/openAccountAuth', param)
    .then(success)
    .catch(fail)
}

// 1원 송금 검증
const checkAuthCodeApi = async (
  param: any,
  success: (response: any) => void,
  fail: (response: any) => void
) => {
  fintechInstance.post('/accountAuth/checkAuthCode', param)
    .then(success)
    .catch(fail)
}

export { inquireBankCodesApi, inquireAccountApi, withdrawApi, depositApi, authAccountApi, checkAuthCodeApi}