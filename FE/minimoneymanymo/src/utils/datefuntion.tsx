export const formatDate = (dateString: string) => {
  const dateArray = dateString.split("-")
  const formattedDateString = `${dateArray[0]}년 ${dateArray[1]}월 ${dateArray[2]}일`
  return formattedDateString
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
