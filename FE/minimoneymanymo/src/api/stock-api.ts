import { axiosAuthInstance, axiosPublicInstance } from "@/api/httpcommons"
import axios from "axios"

interface ReasonBonusMoneyRequest {
  childrenUserId: string
  createdAt: string
  reasonBonusMoney: number
}

export const getStockList = async (condition: string) => {
  console.log("query" + condition)
  try {
    const res = await axiosAuthInstance.get(`/stocks?${condition}`)
    console.log(res.data)
    return res.data
  } catch (e) {
    return e
  }
}

export const getStockDetail = async (stockCode: string) => {
  try {
    const res = await axiosPublicInstance.get(`/stocks/${stockCode}`)
    console.log(res.data)
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      // Axios 에러 객체인 경우
      console.error("getStockDetail 오류 발생:", e.response)
      return e.response // e.response는 { data, status, headers, config }를 포함함
    } else {
      // Axios 에러가 아닌 경우
      console.error("getStockDetail 오류 발생:", e)
      return { status: 500, message: "서버 오류" } // 기본적인 에러 메시지
    }
  }
}

// 부모 - 자식에게 이유 보상 머니 지급
export const putReasonBonusMoney = async (
  reasonBonusMoneyRequest: ReasonBonusMoneyRequest
) => {
  try {
    console.log(reasonBonusMoneyRequest)
    const res = await axiosAuthInstance.put(
      `/stocks/child-reason-bonus-money`,
      reasonBonusMoneyRequest // 요청 본문에 reasonBonusMoneyRequest 추가
    )
    console.log(res.data)
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      // Axios 에러 객체인 경우
      console.error("putReasonBonusMoney 오류 발생:", e.response)
      return e.response // e.response는 { data, status, headers, config }를 포함함
    } else {
      // Axios 에러가 아닌 경우
      console.error("putReasonBonusMoney 오류 발생:", e)
      return { status: 500, message: "서버 오류" } // 기본적인 에러 메시지
    }
  }
}
