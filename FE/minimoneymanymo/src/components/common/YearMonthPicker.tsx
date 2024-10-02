import { useState, useEffect } from "react"
import { IconButton } from "@material-tailwind/react"
import ArrowPrev from "@mui/icons-material/ArrowBackIos"
import ArrowNext from "@mui/icons-material/ArrowForwardIos"

interface YearMonthPickerProps {
  onChange: (year: number, month: number) => void
}

const YearMonthPicker = ({ onChange }: YearMonthPickerProps) => {
  const today = new Date()
  const [date, setDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  })

  useEffect(() => {
    onChange(date.year, date.month)
  }, [date, onChange])

  const handlePrev = () => {
    setDate((prevDate) => {
      const newMonth = prevDate.month === 1 ? 12 : prevDate.month - 1
      const newYear = prevDate.month === 1 ? prevDate.year - 1 : prevDate.year
      return { year: newYear, month: newMonth }
    })
  }

  const handleNext = () => {
    setDate((prevDate) => {
      const newMonth = prevDate.month === 12 ? 1 : prevDate.month + 1
      const newYear = prevDate.month === 12 ? prevDate.year + 1 : prevDate.year
      return { year: newYear, month: newMonth }
    })
  }

  return (
    <div className="flex items-center justify-center space-x-4">
      <IconButton onClick={handlePrev} variant="text">
        <ArrowPrev sx={{ fontSize: 15, color: "#828282" }} />{" "}
        {/* 크기 및 색상 변경 */}
      </IconButton>
      <span className="text-lg font-medium">
        {date.year}년 {date.month.toString().padStart(2, "0")}월
      </span>
      <IconButton onClick={handleNext} variant="text">
        <ArrowNext sx={{ fontSize: 15, color: "#828282" }} />{" "}
        {/* 크기 및 색상 변경 */}
      </IconButton>
    </div>
  )
}

export default YearMonthPicker
