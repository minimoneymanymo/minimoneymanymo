import axios from "axios"
import {jwtDecode} from "jwt-decode"
const BASE_API_URL = import.meta.env.VITE_REACT_APP_API_URL

import {getAccessTokenFromSession, logOutUser, setAccessTokenAtSession} from "@/utils/user-utils"
export const axiosAuthInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000, // 10초
  //   RestAPI 표준 준수를 위해 JSON 형식 데이터 교환
  headers: {"Content-Type": "application/json"},
})

export const axiosPublicInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000, // 10초
})

// 액세스 토큰 만료 확인
const checkAccessTokenExpiration = (accessToken: string) => {
  // 액세스 토큰 디코드
  const decodedAccessToken = jwtDecode<{ exp: number }>(accessToken);

  // 현재 시간
  const currentTime = Math.floor(Date.now() / 1000)
  // 액세스 토큰 만료 시간
  const tokenExpirationTime = decodedAccessToken.exp

  let isAccessTokenValid = false
  // 현재 시간과 액세스 토큰의 만료 시간을 비교해서 액세스 토큰의 유효성을 검사
  if (currentTime <= tokenExpirationTime) {
    isAccessTokenValid = true
  }

  return isAccessTokenValid
}

// 요청 인터셉터 추가
// 모든 요청에 accessToken 유무를 확인해서, 토큰이 있으면 헤더에 넣어서 요청을 보냄
axiosAuthInstance.interceptors.request.use(
  (config) => {
    // 요청 인터셉터 동작 확인
    // console.groupCollapsed("request interceptors")
    // console.log("요청 인터셉터 동작")
    // 액세스 토큰을 상태에서 가져옴
    let isAccessTokenValid = false

    const accessToken = getAccessTokenFromSession()

    // 액세스 토큰이 있으면, 유효성 확인
    if (accessToken) {
      isAccessTokenValid = checkAccessTokenExpiration(accessToken)
    }

    // 액세스 토큰이 유효한 경우 - 헤더에 액세스 토큰 추가
    if (isAccessTokenValid) {
      config.headers["Authorization"] = `Bearer ${accessToken}`
    } else {
      config.headers["Authorization"] = ""
    }

    return config
  },
  (error) => {
    console.log("axios-instance.js > 요청 인터셉터", error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터 추가
// 모든 axiosInstance 응답에 대해 headers를 확인해서 액세스 토큰을 상태에, 리프레시 토큰을 로컬스토리지에 저장함
axiosAuthInstance.interceptors.response.use(
  (res) => {
    // console.log("axios-instances.js > 응답 인터셉터 res: ", res)

    // 응답의 headers를 언패킹
    const {headers} = res

    // headers에서 액세스 토큰 따로
    const accessToken = headers["authorization"]

    // console.groupCollapsed("JWT fetched")
    // console.log(
    //   "axios-instance.js > 응답 인터셉터에서 받은 액세스 토큰 :",
    //   accessToken
    // )
    // console.groupEnd()

    // 액세스 토큰이 존재하는 경우 dispatch를 사용해서 액세스 토큰을 sessionStorage에 저장
    if (accessToken) {
      accessToken.replace("Bearer ", "")

      setAccessTokenAtSession(accessToken)
    }
    return res
  },
  // 모든 에러에 대한 응답
  async (error) => {
    // 기존 응답 저장
    const originalRequest = error.config

    // 기존에 액세스 토큰을 안담아서 보냈다면 에러 반환
    if (!originalRequest.headers["authorization"]) {
      return Promise.reject(error)
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      //로그아웃 처리
      logOutUser()
      alert("엑세스토큰 만료  로그아웃")
    }

    console.log("인터셉터 에러", error)
    // reject를 반환해서, 요청한 api에서 올바르게 오류 처리를 할 수 있도록 함
    return Promise.reject(error)
  }
)
axiosPublicInstance.interceptors.response.use(
  (res) => {
    // console.log("axios-instances.js > 응답 인터셉터 res: ", res)

    // 응답의 headers를 언패킹
    const {headers} = res
    // headers에서 액세스 토큰 따로
    const accessToken = headers["authorization"]

    // console.groupCollapsed("JWT fetched")
    // console.log(
    //   "axios-instance.js > 응답 인터셉터에서 받은 액세스 토큰 :",
    //   accessToken
    // )
    // console.groupEnd()

    // 액세스 토큰이 존재하는 경우 dispatch를 사용해서 액세스 토큰을 sessionStorage에 저장
    if (accessToken) {
      accessToken.replace("Bearer ", "")
      setAccessTokenAtSession(accessToken)
    }
    return res
  },
  // 모든 에러에 대한 응답
  async (error) => {
    // 기존 응답 저장
    const originalRequest = error.config

    // 기존에 액세스 토큰을 안담아서 보냈다면 에러 반환
    if (!originalRequest.headers["Authorization"]) {
      return Promise.reject(error)
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      //로그아웃 처리
      logOutUser()
      alert("엑세스토큰 만료  로그아웃")
    }

    console.log("인터셉터 에러", error)
    // reject를 반환해서, 요청한 api에서 올바르게 오류 처리를 할 수 있도록 함
    return Promise.reject(error)
  }
)
