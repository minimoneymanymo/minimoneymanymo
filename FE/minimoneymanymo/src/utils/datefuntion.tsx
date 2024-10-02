export const formatDate = (dateString: string) => {
  const dateArray = dateString.split("-")
  const formattedDateString = `${dateArray[0]}년 ${dateArray[1]}월 ${dateArray[2]}일`
  return formattedDateString
}

export function formatDateTime(dateString: string): string {
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  const hour = dateString.substring(8, 10)
  const minute = dateString.substring(10, 12)

  return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일 ${hour}:${minute}`
}

export const computeTime = (recentTime: string) => {
  const timeNow = new Date()
  const timeRecent = new Date(recentTime)
  const diffTime = Math.abs(timeNow.getTime() - timeRecent.getTime())
  const diffMins = Math.floor(diffTime / (1000 * 60))
  const diffHrs = Math.floor(diffMins / 60)

  if (diffHrs < 1) {
    return diffMins < 1 ? "방금 전" : `${diffMins}분 전`
  } else if (diffHrs < 24) {
    return `${diffHrs}시간 전`
  } else {
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays < 7) {
      return `${diffDays}일 전`
    } else {
      const diffWeeks = Math.floor(diffDays / 7)
      if (diffWeeks < 4) {
        return `${diffWeeks}주 전`
      } else {
        return formatDate(recentTime)
      }
    }
  }
}
