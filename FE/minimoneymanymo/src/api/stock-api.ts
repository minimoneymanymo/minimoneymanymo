import { axiosAuthInstance, axiosPublicInstance } from "@/api/httpcommons"
import axios from "axios"

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
