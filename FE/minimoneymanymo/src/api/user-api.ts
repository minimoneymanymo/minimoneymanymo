import {axiosPublicInstance} from "@/api/httpcommons"

// 아이디 체크
export const getIsDuplicatedId = async (id: string, role: string) => {
  try {
    const res = await axiosPublicInstance.get("/members/checkid", {
      params: {
        id: id,
        role: role,
      },
    })
    return res.data

    // 회원가입 후 바로 로그인을 위해 loginUser thunk를 dispatch로 호출
    // return postLoginUser(loginData)
  } catch (e) {
    return e
  }
}

export const userLogin = async (formData: FormData) => {
  // FormData의 내용 로그 출력
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
