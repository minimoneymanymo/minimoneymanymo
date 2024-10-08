/* eslint-disable */
import { fintechInstance, axiosAuthInstance } from "@/api/httpcommons"
import { alertBasic } from "@/utils/alert-util"
import axios from "axios"

const { VITE_SSAFY_API_KEY: apiKey } = import.meta.env

// 금융 API 사용할거면 result가 null인지 확인!
// response.data를 return, result.REC 통해 필요한 데이터 접근하면 됨

// 사용자 계정 생성
const registerMemberApi = async (userId: string) => {
  try {
    const response = await axiosAuthInstance.post(
      `/fin/member?userId=${userId}`
    )
    console.log(response)
    if (response.status === 200) return response.data.userKey
    else return null
  } catch (e: any) {
    if (e.status === 500) {
      return null
    }
  }
}
const searchMemberApi = async (userId: string) => {
  try {
    const response = await axiosAuthInstance.post(
      `/fin/member/search?userId=${userId}`
    )
    console.log(response)
    if (response.status === 200) return response.data.userKey
    else return null
  } catch (e: any) {
    console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSS")
    if (e.status === 500) {
      return null
    } else {
      return handleApiError(e)
    }
  }
}

// 은행코드 조회
const inquireBankCodesApi = async () => {
  try {
    const response = await axiosAuthInstance.post("/fin/inquireBankCodes")
    console.log(response)
    if (response.status === 200) return response.data
    else return null
  } catch (error) {
    return handleApiError(error)
  }
}

// 계좌 조회
const inquireAccountApi = async (accountNo: string, userKey: string) => {
  try {
    const response = await axiosAuthInstance.post(
      `/fin/inquireDemandDepositAccount?accountNo=${accountNo}`,
      { userKey: userKey }
    )
    console.log(response)
    if (response.status === 200) return response.data
    else return null
  } catch (error) {
    return handleApiError(error)
  }
}

// 1원 송금
const authAccountApi = async (
  accountNo: string,
  authText: string,
  userKey: string
) => {
  try {
    const response = await axiosAuthInstance.post(
      `/fin/openAccountAuth?accountNo=${accountNo}&authText=${authText}`,
      { userKey: userKey }
    )
    console.log(response)
    if (response.status === 200) return response.data
    else return null
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      alertBasic("cry.svg", "유효한 계좌번호가 아닙니다.")
    }
    return handleApiError(error)
  }
}

// 1원 송금 검증
const checkAuthCodeApi = async (
  accountNo: string,
  authText: string,
  authCode: string,
  userKey: string
) => {
  try {
    const response = await axiosAuthInstance.post(
      `/fin/checkAuthCode?accountNo=${accountNo}&authText=${authText}&authCode=${authCode}`,
      { userKey: userKey }
    )
    console.log(response)
    if (response.status === 200) return response.data
    else return null
  } catch (error) {
    return handleApiError(error)
  }
}

// 계좌 출금
const withdrawApi = async (param: object) => {
  try {
    const response = await fintechInstance.post(
      "/demandDeposit/updateDemandDepositAccountWithdrawal",
      param
    )
    console.log(response)
    if (response.status === 200) return response.data
    else return null
  } catch (error) {
    return handleApiError(error)
  }
}

// 계좌 입금
const depositApi = async (param: object) => {
  try {
    const response = await fintechInstance.post(
      "/demandDeposit/updateDemandDepositAccountDeposit",
      param
    )
    console.log(response)
    if (response.status === 200) return response.data
    else return null
  } catch (error) {
    return handleApiError(error)
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
  inquireBankCodesApi,
  inquireAccountApi,
  withdrawApi,
  depositApi,
  authAccountApi,
  checkAuthCodeApi,
  registerMemberApi,
  searchMemberApi,
}
