import { fintechInstance } from "@/api/httpcommons"
const { VITE_SSAFY_API_KEY: apiKey } = import.meta.env

// 사용자 계정 생성
const registerMemberApi = async (param: string) => {
  try {
    const res = await fintechInstance.post("/member", {
      apiKey: apiKey,
      userId: param,
    })
    return res.data.userKey // 서버로부터 받은 응답 반환
  } catch (e) {
    return e // 오류 발생 시, 오류 객체 반환
  }
}

// 은행코드 조회
const inquireBankCodesApi = async (
  param: object,
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  console.log(param)
  fintechInstance
    .post("/bank/inquireBankCodes", param)
    .then(success)
    .catch(fail)
}
// 계좌 조회
const inquireAccountApi = async (
  param: object,
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  fintechInstance
    .post("/demandDeposit/inquireDemandDepositAccount", param)
    .then(success)
    .catch(fail)
}

// 계좌 출금
const withdrawApi = async (
  param: object,
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  fintechInstance
    .post("/demandDeposit/updateDemandDepositAccountWithdrawal", param)
    .then(success)
    .catch(fail)
}

// 계좌 입금
const depositApi = async (
  param: object,
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  fintechInstance
    .post("/demandDeposit/updateDemandDepositAccountDeposit", param)
    .then(success)
    .catch(fail)
}

// 1원 송금
const authAccountApi = async (
  param: object,
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  fintechInstance
    .post("/accountAuth/openAccountAuth", param)
    .then(success)
    .catch(fail)
}

// 1원 송금 검증
const checkAuthCodeApi = async (
  param: object,
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  fintechInstance
    .post("/accountAuth/checkAuthCode", param)
    .then(success)
    .catch(fail)
}

export {
  inquireBankCodesApi,
  inquireAccountApi,
  withdrawApi,
  depositApi,
  authAccountApi,
  checkAuthCodeApi,
  registerMemberApi,
}
