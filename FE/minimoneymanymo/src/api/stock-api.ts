import {axiosAuthInstance, axiosPublicInstance} from "@/api/httpcommons"
import axios from "axios"

// 은행코드 조회
// 나의 자식 목록 조회
const getStockList = async () => {
  try {
    const res = await axiosAuthInstance.get("/stocks")
    console.log(res.data)
    return res.data
  } catch (e) {
    return e
  }
}

export {getStockList}
