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
