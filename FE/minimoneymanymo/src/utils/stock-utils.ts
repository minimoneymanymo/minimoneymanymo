// 증감 색깔 지정 함수
export const getPriceChangeColorAndSign = (value: number) => {
  if (value > 0) {
    return { color: "red", sign: "+" }
  } else if (value < 0) {
    return { color: "blue", sign: "" }
  }
  return { color: "gray", sign: "" } // 0인 경우 기본 색상
}

// 시가총액 형식 변환 함수
export const formatMarketCapitalization = (value: number): string => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(2)} 조원`
  } else {
    return `${value.toFixed(2)} 억원`
  }
}
