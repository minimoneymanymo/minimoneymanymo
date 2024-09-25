import {axiosAuthInstance, axiosPublicInstance} from "@/api/httpcommons"
import axios from "axios"

// 아이디 체크
export const getIsDuplicatedId = async (email: string) => {
  try {
    const res = await axiosPublicInstance.post("/members/checkid", {
      email: email, // JSON 형식으로 이메일을 포함
    });
    return res.data; // 서버로부터 받은 응답 반환
  } catch (e) {
    return e; // 오류 발생 시, 오류 객체 반환
  }
}
//이메일 인증코드
export const checkAuthCode = async (email: string, authNum: string) => {
  try {
    const res = await axiosPublicInstance.post("/members/mailauthCheck", {
      email: email, // JSON 형식으로 이메일 포함
      authNum: authNum, // JSON 형식으로 인증 코드 포함
    });
    return res.data; // 서버로부터 받은 응답 반환
  } catch (e) {
    return e; // 오류 발생 시, 오류 객체 반환
  }
};
//회원가입

export const signUp = async (
  userId: string, password: string, 
  name: String, role: String, 
  userKey:String, phoneNumber: String,birthDay:String, 
  parentsNumber : String) => {
  try {
    const res = await axiosPublicInstance.post("/members/join", {
      userId,password,name,userKey,phoneNumber, parentsNumber,role,birthDay
    });
    return res.data; // 서버로부터 받은 응답 반환
  } catch (e) {
    return e; // 오류 발생 시, 오류 객체 반환
  }
};



export const userLogin = async (formData: FormData) => {
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`)
  }
  try {
    const res = await axiosPublicInstance.post("/members/login", formData)
    return res
  } catch (e) {
    return e
  }
}

// 나의 자식 목록 조회
export const getMyChildren = async () => {
  try {
    const res = await axiosAuthInstance.get("/members/mychildren")
    console.log(res.data)
    return res.data
  } catch (e) {
    return e
  }
}

// 참여대기 인원확인
export const getMyChildWaiting = async () => {
  try {
    const res = await axiosAuthInstance.get("/members/mychildren/waiting")
    console.log(res.data)
    return res.data
  } catch (e) {
    return e
  }
}

// 참여대기 인원승인
export const addMyChildWaiting = async (childrenId: number) => {
  try {
    const res = await axiosAuthInstance.put("/members/mychildren/waiting", {
      childrenId,
    })
    console.log(res.data)
    return res.data
  } catch (e) {
    return e
  }
}

//나의 자식 한명 조회
export const getMyChild = async (childrenId: number) => {
  try {
    const res = await axiosAuthInstance.get(`/members/mychild/${childrenId}`)
    console.log(res.data)
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      // Axios 에러 객체인 경우
      console.error("getMyChild 오류 발생:", e.response)
      return e.response // e.response는 { data, status, headers, config }를 포함함
    } else {
      // Axios 에러가 아닌 경우
      console.error("getMyChild 오류 발생:", e)
      return {status: 500, message: "서버 오류"} // 기본적인 에러 메시지
    }
  }
}

//머니 설정
export const updateAllowance = async (
  childrenId: number,
  inputValue: number | ""
) => {
  try {
    const res = await axiosAuthInstance.put(
      `/members/mychild/setAllowance`,

      {
        childrenId,
        settingMoney: inputValue,
      }
    )
    console.log(res.data)
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      // Axios 에러 객체인 경우
      console.error("updateAllowance에서 오류 발생:", e.response)
      return e.response // e.response는 { data, status, headers, config }를 포함함
    } else {
      // Axios 에러가 아닌 경우
      console.error("updateAllowance에서 오류 발생:", e)
      return {status: 500, message: "서버 오류"} // 기본적인 에러 메시지
    }
  }
}
//출금가능금액 설정
export const updateWithdrawableMoney = async (
  childrenId: number,
  inputValue: number | ""
) => {
  try {
    const res = await axiosAuthInstance.put(
      `/members/mychild/setWithdraw`,

      {
        childrenId,
        settingWithdrawableMoney: inputValue,
      }
    )
    console.log(res.data)
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      // Axios 에러 객체인 경우
      console.error("updateAllowance에서 오류 발생:", e.response)
      return e.response // e.response는 { data, status, headers, config }를 포함함
    } else {
      // Axios 에러가 아닌 경우
      console.error("updateAllowance에서 오류 발생:", e)
      return {status: 500, message: "서버 오류"} // 기본적인 에러 메시지
    }
  }
}
//퀴즈보상머니 설정
export const updateQuizBonusMoney = async (
  childrenId: number,
  inputValue: number | ""
) => {
  try {
    const res = await axiosAuthInstance.put(`/members/mychild/setQuiz`, {
      childrenId,
      settingQuizBonusMoney : inputValue,
    })
    console.log(res.data)
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      // Axios 에러 객체인 경우
      console.error("updateAllowance에서 오류 발생:", e.response)
      return e.response // e.response는 { data, status, headers, config }를 포함함
    } else {
      // Axios 에러가 아닌 경우
      console.error("updateAllowance에서 오류 발생:", e)
      return {status: 500, message: "서버 오류"} // 기본적인 에러 메시지
    }
  }
}


