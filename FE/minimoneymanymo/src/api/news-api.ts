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

export const getNewsQuizzes = async (page: number, size: number) => {
  try {
    console.log("페이지 요청")
    console.log(`page : ${page} , size = ${size}`)
    const res = await axiosAuthInstance.get(`/quiz?page=${page}&number=${size}`)
    console.log("응답이에요 %%%%%%%%%%%%%%%%%%%%%%%%")
    console.log(res.data)
    return res.data.data
  } catch (e: any) {
    console.log(e.message)
    throw e
  }
}

export const searchCompany = async (company: string) => {
  try {
    console.log(company)
    const res = await axiosPublicInstance.get(`/quiz/search?company=${company}`)
    console.log(res.data)
    return res.data
  } catch (e: any) {
    console.log(e.message)
    throw e
  }
}
