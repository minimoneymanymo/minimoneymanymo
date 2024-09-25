import React from "react"

interface TitleProps {
  title: string
}

const Heading: React.FC<TitleProps> = ({title}) => {
  return (
    <div className="flex h-12 w-full items-center border-b text-xl border-gray-300 font-bold">
      <span className="m-4">{title}</span>
    </div>
  )
}

export default Heading
