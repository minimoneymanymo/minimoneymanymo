import React from "react"

const IndicatorDescriptions: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white p-6">
      <ul className="space-y-8">
        {" "}
        {/* space-y-8을 사용해서 간격을 2rem으로 통일 */}
        <li>
          <h3 className="text-lg font-semibold">현금 비중</h3>
          <p>월말 기준, 보유한 현금의 비중을 나타내요.</p>
        </li>
        <li>
          <h3 className="text-lg font-semibold">매매 횟수</h3>
          <p>
            한 달 동안 몇 번 거래했는지를 나타내요. 거래가 많을수록 유동성이
            높아져요.
          </p>
        </li>
        <li>
          <h3 className="text-lg font-semibold">손익 비율</h3>
          <p>
            수익을 낸 거래 수와 전체 거래 수를 비교해 승률을 계산해요. 수익 및
            손실이 종합되어 점수가 매겨져요.
          </p>
        </li>
        <li>
          <h3 className="text-lg font-semibold">분산 투자 비율</h3>
          <p>
            여러 종목에 나눠서 투자할수록 점수가 높아져요. 투자한 종목 수에 5를
            곱한 값이 점수로 주어져요.
          </p>
        </li>
        <li>
          <h3 className="text-lg font-semibold">안정성</h3>
          <p>
            투자한 주식 시장에 따라 안정성이 평가돼요. 규모가 큰 시장에 투자할
            수록 안정성 수치가 높아져요.
          </p>
        </li>
      </ul>
    </div>
  )
}

export default IndicatorDescriptions
