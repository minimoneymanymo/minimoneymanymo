import { axiosAuthInstance } from "./httpcommons"

export const getMyAnalysisApi = async () => {
  try {
    const res = await axiosAuthInstance.get(`/analysis/report`)
    return res.data
  } catch (error) {
    console.error("Error getting trade Analysis:", error)
    throw error
  }
}

export const getMyChildAnalysisApi = async (childrenId: number) => {
  try {
    const res = await axiosAuthInstance.get(
      `/analysis/report/child/${childrenId}`
    )
    return res.data
  } catch (error) {
    console.error("Error getting trade Analysis:", error)
    throw error
  }
}
