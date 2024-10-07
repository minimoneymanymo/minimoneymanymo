// 증감 색깔 지정 함수
export const getPriceChangeColorAndSign = (value: number) => {
  if (value > 0) {
    return { color: "text-buy", sign: "+" }
  } else if (value < 0) {
    return { color: "text-sell", sign: "" }
  }
  return { color: "text-black", sign: "" } // 0인 경우 기본 색상
}

// 시가총액 형식 변환 함수
export const formatMarketCapitalization = (value: number): string => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(2)} 조원`
  } else {
    return `${value.toFixed(2)} 억원`
  }
}

//큰 숫자 포맷팅
export function formatNumber(num: number | string) {
  if (typeof num === "string") {
    return
  }

  // 각 단위에 대한 변수를 계산
  const trillion = Math.floor(num / 1e12) // 조
  const billion = Math.floor((num % 1e12) / 1e8) // 억
  const million = Math.floor((num % 1e8) / 1e4) // 만
  const remainder = num % 1e4 // 만 단위 이하의 나머지 숫자

  // 결과를 저장할 배열
  const parts: string[] = []

  // 각 단위를 확인하고, 존재할 경우 parts 배열에 추가
  if (trillion > 0) {
    parts.push(`${trillion}조`) // 조가 존재하는 경우 추가
  }
  if (billion > 0) {
    parts.push(`${billion}억`) // 억이 존재하는 경우 추가
  }
  if (million > 0) {
    parts.push(`${million}만`) // 만이 존재하는 경우 추가
  }

  // 만 단위 이하 숫자를 추가
  if (remainder > 0) {
    parts.push(`${remainder}`) // 만 단위 이하 숫자 추가
  }

  // 단위가 없는 경우 원래 숫자를 반환
  return parts.length > 0 ? parts.join(" ") : num.toString()
}
