import React from "react"
import { investmentData } from "./investmentData.ts"

interface MyInvestmentProps {
  filteredEvents: investmentData[]
}

const MyInvestment: React.FC<MyInvestmentProps> = ({ filteredEvents }) => {
  return (
    <div>
      <div className="col-span-1">
        <h3 className="font-bold">머니 변동 내역</h3>
        <ul>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <li key={index}>
                {event.companyName} ({event.amount})
              </li>
            ))
          ) : (
            <li>No events</li>
          )}
        </ul>
      </div>
      <div className="col-span-1">
        <h3 className="font-bold"> 투자 기록 </h3>
        <ul>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <li key={index}>
                {event.tradeType} ({event.reason})
              </li>
            ))
          ) : (
            <li>No events</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default MyInvestment

// 73번째 줄 MyInvestMent자리에 있었음
