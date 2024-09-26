import { axiosAuthInstance } from "@/api/httpcommons"

// 부모-계좌 충전
const depositBalanceApi = async (
  param: number,
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  axiosAuthInstance
    .put(`/members/deposit?balance=${param}`)
    .then(success)
    .catch(fail)
}

// 부모-계좌 환불
const refundBalanceApi = async (
  param: number,
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  axiosAuthInstance
    .put(`/members/withdraw?balance=${param}`)
    .then(success)
    .catch(fail)
}

// 자식-출금 요청
const requestWithdrawApi = async (
  param: object,
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  axiosAuthInstance
    .post(`/funds/request-withdraw`, param)
    .then(success)
    .catch(fail)
}

// 자식-출금 요청 내역
const getWithdrawListApi = async (
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  axiosAuthInstance.get(`/funds/withdraw-list`).then(success).catch(fail)
}

// 부모-출금 요청 승인
const approveRequestApi = async (
  param: object,
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  axiosAuthInstance
    .put(`/funds/approve-request`, param)
    .then(success)
    .catch(fail)
}

// 계좌 연결
const linkAccountApi = async (
  param: object,
  success: (response: object) => void,
  fail: (response: object) => void
) => {
  axiosAuthInstance
    .put(`/members/link-account`, param)
    .then(success)
    .catch(fail)
}

export {
  depositBalanceApi,
  refundBalanceApi,
  requestWithdrawApi,
  getWithdrawListApi,
  approveRequestApi,
  linkAccountApi,
}
