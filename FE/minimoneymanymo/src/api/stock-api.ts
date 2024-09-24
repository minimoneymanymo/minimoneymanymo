import {axiosAuthInstance, axiosPublicInstance} from "@/api/httpcommons"
import axios from "axios"

const getStockList = async (condition: string) => {
  console.log("query" + condition)
  try {
    const res = await axiosAuthInstance.get(`/stocks?${condition}`)
    console.log(res.data)
    return res.data
  } catch (e) {
    return e
  }
}

export {getStockList}
