const {
  VITE_SSAFY_API_KEY: apiKey = process.env.VITE_SSAFY_API_KEY,
  VITE_SSAFY_USER_KEY: userKey = process.env.VITE_SSAFY_USER_KEY,
} = import.meta.env

export const makeParam = (apiName: string, data: object = {}): object => {
  const random = String(Math.floor(100000 + Math.random() * 900000))
  const { date, time } = getNow() // 구조분해할당
  const param = {
    Header: {
      apiName: apiName,
      transmissionDate: date,
      transmissionTime: time,
      institutionCode: "00100",
      fintechAppNo: "001",
      apiServiceCode: apiName,
      institutionTransactionUniqueNo: date + time + random,
      apiKey: apiKey,
      userKey: userKey,
    },
  }

  // 스프레드 연산자(...)를 사용하여 기존 객체를 복사한 후, 원하는 값을 추가
  return { ...param, ...data }
}

export const getNow = (): { date: string; time: string } => {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0") // getMonth()는 0부터 시작하므로 1을 더함
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")

  return { date: `${year}${month}${day}`, time: `${hours}${minutes}${seconds}` }
}
