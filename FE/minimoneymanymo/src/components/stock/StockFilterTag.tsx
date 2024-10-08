// StockFilterTag.tsx
import React from "react"
import { Typography } from "@material-tailwind/react" // Material Tailwind Typography import

interface StockFilterTagProps {
  label: string
}

const StockFilterTag: React.FC<StockFilterTagProps> = ({ label }) => {
  return (
    <span className="flex items-center rounded-full bg-primary-50 px-3 py-2.5">
      <Typography variant="small">{label}</Typography>
    </span>
  )
}

export default StockFilterTag
