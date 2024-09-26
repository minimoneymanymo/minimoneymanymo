import axios from "axios"
import { axiosAuthInstance } from "./httpcommons"

export const getTradeList = async (year: number, month: number) => {
  try {
    const res = await axiosAuthInstance.get(
      `/funds/trade-list?year=${year}&month=${month}`
    )
    return res.data
  } catch (error) {
    console.error("Error getting trade list:", error)
    throw error
  }
}
