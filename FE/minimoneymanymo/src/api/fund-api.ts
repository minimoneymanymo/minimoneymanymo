/* eslint-disable */
import { axiosAuthInstance, axiosPublicInstance } from "@/api/httpcommons"
import axios from "axios"

// 부모-계좌 충전
const depositBalanceApi = async (
  balance: number,
  accountNo: string,
  userKey: string
) => {
  try {
    const response = await axiosAuthInstance.put(
      `/members/deposit?balance=${balance}&accountNo=${accountNo}`,
      { userKey: userKey }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 부모-계좌 환불
const refundBalanceApi = async (
  balance: number,
  accountNo: string,
  userKey: string
) => {
  try {
    const response = await axiosAuthInstance.put(
      `/members/withdraw?balance=${balance}&accountNo=${accountNo}`,
      { userKey: userKey }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 자식-출금 요청
const requestWithdrawApi = async (money: number) => {
  try {
    const response = await axiosAuthInstance.post(`/funds/request-withdraw`, {
      withdrawableMoney: money,
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 자식-출금 요청 내역
const getWithdrawListApi = async () => {
  try {
    const response = await axiosAuthInstance.get(`/funds/withdraw-list`)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 부모-자식의출금요청내역
const getChildWithdrawListApi = async (childrenId: string) => {
  try {
    const response = await axiosAuthInstance.get(
      `/funds/child-withdraw-list?childrenId=${childrenId}`
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 부모-출금 요청 승인
const approveRequestApi = async (param: object) => {
  try {
    const response = await axiosAuthInstance.put(
      `/funds/approve-request`,
      param
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 계좌 연결
const linkAccountApi = async (accountNumber: string) => {
  try {
    const response = await axiosAuthInstance.put(`/members/link-account`, {
      accountNumber: accountNumber,
      bankCode: "001",
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 자식-머니사용내역
const getAllMoneyRecordsApi = async () => {
  try {
    const response = await axiosAuthInstance.get(`/funds/money-list`)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 자식-보유자금내역
const getMoneyApi = async () => {
  try {
    const response = await axiosAuthInstance.get(`/funds`)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 자식-거래내역
const getTradeListApi = async (year: number, month: number) => {
  try {
    const response = await axiosAuthInstance.get(
      `/funds/trade-list?year=${year}&month=${month}`
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 자식-보유주식 조회
const getStockApi = async () => {
  try {
    const response = await axiosAuthInstance.get(`/funds/stocks`)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 오류 처리 함수
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    console.error("API 호출 시 오류 발생:", error.response)
    throw error.response
  } else {
    console.error("API 호출 시 오류 발생:", error)
    throw { status: 500, message: "서버 오류" }
  }
}

// 부모 - 이유 보상 머니 지급을 위한 투자이유 목록 불러오기

const getChildTradelistApi = async (
  childrenId: string,
  year: number,
  month: number
) => {
  try {
    console.log("API 호출 시 연도:", year) // 연도 확인
    console.log("API 호출 시 월:", month) // 월 확인
    const res = await axiosAuthInstance.get("/funds/child-trade-list", {
      params: {
        childrenId: childrenId,
        year: year,
        month: month,
      },
    })
    return res.data
  } catch (error) {
    handleApiError(error)
  }
}

//용돈지급
const giveAllowanceApi = async (
  childrenId: number,
  inputValue: number | ""
) => {
  try {
    const res = await axiosAuthInstance.put(
      `/funds/giveMoney`,

      {
        childrenId,
        amount: inputValue,
      }
    )
    console.log(res.data)
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      // Axios 에러 객체인 경우
      console.error("updateAllowance에서 오류 발생:", e.response)
      return e.response // e.response는 { data, status, headers, config }를 포함함
    } else {
      // Axios 에러가 아닌 경우
      console.error("updateAllowance에서 오류 발생:", e)
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
  getAllMoneyRecordsApi,
  getMoneyApi,
  getChildWithdrawListApi,
  getTradeListApi,
  getStockApi,
  getChildTradelistApi,
  giveAllowanceApi,
}
