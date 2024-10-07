import { axiosAuthInstance, axiosPublicInstance } from "@/api/httpcommons"
import axios from "axios"

export const getTodayNews = async () => {
  try {
    const res = await axiosAuthInstance.get(`/quiz/today`)
    console.log(res.data)
    return res.data.data // 성공적인 응답 반환
  } catch (e) {
    throw e
  }
}

export const getNewsDetail = async (newsId: string) => {
  try {
    const res = await axiosAuthInstance.get(`/quiz/detail?number=${newsId}`)
    console.log(res.data)
    return res.data.data
  } catch (e: any) {
    console.log(e.message)
    throw e
  }
}

export const solveQuiz = async (option: string, id: string) => {
  try {
    const res = await axiosAuthInstance.post(`/quiz/solve`, { option, id })
    console.log(res.data)
    return res.data
  } catch (e: any) {
    console.log(e.message)
    throw e
  }
}

export const getNewsQuizzes = async (page: number, size: number = 6) => {
  try {
    const res = await axiosAuthInstance.get(`/quiz?page=${page}&number=${size}`)
    console.log(res.data)
    return res.data.data
  } catch (e: any) {
    console.log(e.message)
    throw e
  }
}
