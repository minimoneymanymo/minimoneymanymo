/* eslint-disable */
import { fintechInstance } from "@/api/httpcommons"
import { AccountResponse } from "@/types/types"
import axios from "axios"

const { VITE_SSAFY_API_KEY: apiKey } = import.meta.env

// 사용자 계정 생성
const registerMemberApi = async (param: string) => {
  try {
    const res = await fintechInstance.post("/member", {
      apiKey: apiKey,
      userId: param,
    })
    return res.data.userKey
  } catch (e) {
    return e
  }
}

// 은행코드 조회
const inquireBankCodesApi = async (param: object) => {
  console.log(param)
  try {
    const response = await fintechInstance.post("/bank/inquireBankCodes", param)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 계좌 조회
const inquireAccountApi = async (param: object) => {
  try {
    const response = await fintechInstance.post(
      "/demandDeposit/inquireDemandDepositAccount",
      param
    )
    return response.data.REC
  } catch (error) {
    handleApiError(error)
  }
}

// 계좌 출금
const withdrawApi = async (param: object) => {
  try {
    const response = await fintechInstance.post(
      "/demandDeposit/updateDemandDepositAccountWithdrawal",
      param
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 계좌 입금
const depositApi = async (param: object) => {
  try {
    const response = await fintechInstance.post(
      "/demandDeposit/updateDemandDepositAccountDeposit",
      param
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 1원 송금
const authAccountApi = async (param: object) => {
  try {
    const response = await fintechInstance.post(
      "/accountAuth/openAccountAuth",
      param
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 1원 송금 검증
const checkAuthCodeApi = async (param: object) => {
  try {
    const response = await fintechInstance.post(
      "/accountAuth/checkAuthCode",
      param
    )
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
  inquireBankCodesApi,
  inquireAccountApi,
  withdrawApi,
  depositApi,
  authAccountApi,
  checkAuthCodeApi,
  registerMemberApi,
}
