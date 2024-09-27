/* eslint-disable */
import { axiosAuthInstance } from "@/api/httpcommons"
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
const requestWithdrawApi = async (param: object) => {
  try {
    const response = await axiosAuthInstance.post(
      `/funds/request-withdraw`,
      param
    )
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

export {
  depositBalanceApi,
  refundBalanceApi,
  requestWithdrawApi,
  getWithdrawListApi,
  approveRequestApi,
  linkAccountApi,
}
