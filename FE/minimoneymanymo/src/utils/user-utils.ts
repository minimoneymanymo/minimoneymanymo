import { getMemberInfo } from "@/api/user-api"
import { AppDispatch } from "@/store"
import { childActions } from "@/store/slice/child"
import { parentActions } from "@/store/slice/parent"

// 액세스 토큰을 세션에서 가져옴
export const getAccessTokenFromSession = (): string | null => {
  const accessToken = sessionStorage.getItem("accessToken")
  return accessToken
}

// 액세스 토큰을 세션에 저장
export const setAccessTokenAtSession = (accessToken: string): string => {
  sessionStorage.setItem("accessToken", accessToken)
  return accessToken
}

// 리프레시 토큰을 로컬 스토리지에서 가져옴
export const getRefreshTokenFromLocalStorage = (): string | null => {
  const refreshToken = localStorage.getItem("refreshToken")
  return refreshToken
}

// 리프레시 토큰을 로컬 스토리지에 저장
export const setRefreshTokenAtLocalStorage = (refreshToken: string): string => {
  localStorage.setItem("refreshToken", refreshToken)
  return refreshToken
}

// 유저 정보를 세션 스토리지에 저장
export const setUserInfosAtSession = (
  userInfos: Record<string, string>
): void => {
  Object.keys(userInfos).forEach((key) => {
    sessionStorage.setItem(key, userInfos[key])
  })
}

// 유저 정보를 세션 스토리지에서 받아와서 상태에 저장하기 위해 넘겨줌
// export const getUserInfosFromSession = (): Record<string, string> => {
//   // 유저 정보 key값
//   const userInfoKeys = [
//     "nickname",
//     "id",
//     "email",
//     "birth",
//     "phone",
//     "isAuthenticated",
//     "role",
//     "image",
//     "socialType",
//   ]
//   // 유저 정보를 저장할 빈 객체 초기화
//   const userInfos: Record<string, string> = {}

//   // 키값을 순회하면서 세션에서 값을 찾고 객체에 추가
//   userInfoKeys.forEach((key) => {
//     const item = sessionStorage.getItem(key)
//     if (item) {
//       userInfos[key] = item
//     }
//   })

//   return userInfos
// }

// 로그아웃
export const logOutUser = (): void => {
  sessionStorage.clear()
}

// 액세스 토큰 삭제
export const deleteJWT = (): void => {
  sessionStorage.removeItem("accessToken")
}

export const setMemberInfo = async (dispatch: AppDispatch, role: number) => {
  const res = await getMemberInfo()
  if (res.stateCode === 200) {
    console.log(res)
    console.log(role)
    if (role === 0) {
      const {
        userId,
        phoneNumber,
        accountNumber,
        name,
        balance,
        profileImgUrl,
        userKey,
      } = res.data
      const payload = {
        userId,
        phoneNumber,
        accountNumber,
        name,
        balance,
        profileImgUrl,
        userKey,
      }
      dispatch(parentActions.setUserInfo(payload))
    } else if (role === 1) {
      const {
        childrenId,
        userId,
        name,
        profileImgUrl,
        money,
        withdrawableMoney,
        totalAmount,
        userKey,
        createdAt,
        accountNumber,
        birthDay,
      } = res.data
      const payload = {
        childrenId,
        userId,
        name,
        profileImgUrl,
        money,
        withdrawableMoney,
        totalAmount,
        userKey,
        createdAt,
        accountNumber,
        birthDay,
      }
      dispatch(childActions.setUserInfo(payload))
    }
  }
}
