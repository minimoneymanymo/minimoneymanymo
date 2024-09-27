import { axiosAuthInstance, axiosPublicInstance } from "@/api/httpcommons"
import axios from "axios"

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

// 부모 - 이유 보상 머니 지급

const getChildTradelistApi = async (
  childrenId: string,
  year: number,
  month: number
) => {
  try {
    const res = await axiosPublicInstance.get("/funds/child-trade-list", {
      params: {
        childrenId: childrenId,
        year: year,
        month: month,
      },
    })
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      // Axios 에러 객체인 경우
      console.error("getChildTradelist axios 오류 발생:", e.response)
      return e.response
    } else {
      // Axios 에러가 아닌 경우
      console.error("getChildTradelist 서버 오류 발생:", e)
      return { status: 500, message: "서버 오류" } // 기본적인 에러 메시지
    }
  }
}

export {
  depositBalanceApi,
  refundBalanceApi,
  requestWithdrawApi,
  getWithdrawListApi,
  approveRequestApi,
  linkAccountApi,
  getChildTradelistApi,
}
