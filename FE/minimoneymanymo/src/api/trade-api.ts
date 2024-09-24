import axios from "axios"
import {axiosAuthInstance} from "./httpcommons"
import {tradeData} from "@/components/trade/tradeData"

// 매매
export const postTrade = async (tradeData: tradeData) => {
  try {
    const res = await axiosAuthInstance.post(`/stocks`, tradeData)
    console.log(res.data)
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      // Axios 에러 객체인 경우
      console.error("postTrade axios 오류 발생:", e.response)
      return e.response
    } else {
      // Axios 에러가 아닌 경우
      console.error("postTrade 서버 오류 발생:", e)
      return {status: 500, message: "서버 오류"} // 기본적인 에러 메시지
    }
  }
}

// 보유머니 API 호출 함수
export const getChildMoney = async (stockCode: String) => {
  try {
    const res = await axiosAuthInstance.get(`/members/info/${stockCode}`)
    console.log(res.data)
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      // Axios 에러 객체인 경우
      console.error("getChildMoney axios 오류 발생:", e.response)
      return e.response
    } else {
      // Axios 에러가 아닌 경우
      console.error("getChildMoney 서버 오류 발생:", e)
      return {status: 500, message: "서버 오류"} // 기본적인 에러 메시지
    }
  }
}
