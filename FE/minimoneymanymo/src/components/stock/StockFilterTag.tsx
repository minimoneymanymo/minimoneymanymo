// StockFilterTag.tsx
import React from "react"
import { Typography } from "@material-tailwind/react" // Material Tailwind Typography import

interface StockFilterTagProps {
  label: string
}

const StockFilterTag: React.FC<StockFilterTagProps> = ({ label }) => {
  return (
    <span className="bg-primary-50 flex items-center rounded-full px-3 py-2">
      <Typography variant="small">{label}</Typography>
    </span>
  )
}

export default StockFilterTag
