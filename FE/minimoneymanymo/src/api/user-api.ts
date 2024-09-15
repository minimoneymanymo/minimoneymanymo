import {axiosAuthInstance, axiosPublicInstance} from "@/api/httpcommons"

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

  } catch (e) {
    return e
  }
}

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
export const getMyChildren = async ()=>{
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

