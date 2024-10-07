export const tooltipInfo: { [key: string]: React.ReactNode } = {
  시가총액: (
    <>
      <b>한 기업의 주식 총액</b>을 말해요.
      <br />
      현재 시장에서 형성되고있는 기업의 가치에요.
      <br />
      계산법은 &apos;주식 가격 × 발행된 주식 수&apos;랍니다.
      <br />
      시가총액이 높으면 큰 회사이고, 낮으면 상대적으로 작은 회사일 가능성이
      커요.
    </>
  ),
  누적거래대금: (
    <>
      <b>주식이 사고팔린 전체 금액</b>이에요.
      <br />
      특정 기간 동안 주식 시장에서 얼마나 많은 돈이 오갔는지를 보여줘요.
      <br />
      누적거래대금이 크면 사람들이 그 주식을 많이 사고판다는 뜻이고, 적으면
      거래가 활발하지 않다는 뜻이에요.
    </>
  ),
  상장주식수: (
    <>
      <b>상장주식수는 주식시장에서 거래될 수 있는 전체 주식 수</b>를 말해요.
      <br />
      기업이 주식 시장에 내놓은 주식의 양을 나타내요.
      <br />
      높으면 그만큼 많은 사람들이 투자할 수 있어요.
      <br />
      주식 수가 많으면 주가 변동이 상대적으로 안정될 수 있어요.
    </>
  ),
  "거래량 회전률": (
    <>
      거래량 회전률은 주식의 거래가 얼마나 활발하게 이뤄졌는지 보여줘요.
      <br />
      &apos;상장주식 수 대비 얼마나 많은 주식이 거래되었나?&apos;를 뜻해요.
      <br />
      높을수록 거래가 자주 이뤄지고 있다는 의미예요.
    </>
  ),
  "52주 최고가": (
    <>
      지난 52주(1년) 동안 해당 주식의 가장 높은 가격을 말해요.
      <br />
      이 수치는 투자자들이 주식의 최근 성과를 파악하는 데 도움이 돼요.
      <br />
      52주 최고가가 높으면 최근에 주식이 인기가 많았다는 뜻이고, 주가가 많이
      올랐을 가능성이 커요.
    </>
  ),
  "52주 최저가": (
    <>
      지난 52주(1년) 동안 주식의 가장 낮은 가격을 의미해요.
      <br />
      52주 최저가가 낮으면 그 주식이 최근에 인기가 없었거나, 주가가 하락했던
      시점이 있었다는 의미예요.
    </>
  ),
  PER: (
    <>
      <b>PER은 주가수익비율로,</b> 주가를 주당순이익(EPS)으로 나눈 수치예요.
      <p className="mt-4">
        <span className="inline-block text-center align-middle">
          <span className="block border-b border-white">주가</span>
          <span className="block">주당순이익</span>
        </span>
      </p>
      이 숫자는 주식이 얼마나 비싼지를 판단하는 데 도움을 줘요.
      <br />
      PER이 낮으면 주식이 상대적으로 저렴하다는 뜻이고, 높으면 비쌀 수 있어요.
    </>
  ),
  PBR: (
    <>
      <b>PBR은 주가순자산비율로,</b> 주가를 주당순자산(BPS)으로 나눈 비율이에요.
      <br />
      이 수치는 기업의 자산 가치를 바탕으로 주식의 가치를 평가하는 데 도움을
      줘요.
      <br />
      PBR이 1보다 작으면 주가가 자산보다 낮다는 뜻이어서, 상대적으로 저평가된
      주식일 수 있어요.
    </>
  ),
  EPS: (
    <>
      <b>EPS는 주당순이익으로,</b> 기업이 벌어들인 순이익을 발행된 주식 수로
      나눈 값이에요.
      <br />
      이 숫자는 주식 한 주당 얼마나 이익을 내고 있는지를 보여줘요.
      <br />
      EPS가 높으면 기업이 잘 운영되고 있다는 뜻일 수 있어요.
    </>
  ),
  BPS: (
    <>
      <b>BPS는 주당순자산으로,</b> 기업의 총 자산에서 총 부채를 뺀 값을 발행된
      주식 수로 나눈 값이에요.
      <br />
      이 수치는 주식 한 주당 기업이 실제로 가진 자산의 가치를 나타내요.
      <br />
      BPS가 높으면 기업의 재정상태가 안정적이라는 뜻일 수 있어요.
    </>
  ),
  재무재표: (
    <>
      재무재표는 기업의 재무 상태를 보여주는 중요한 지표들이에요. <br />
      이 문서는 기업의 재무 건전성을 평가하고 투자 결정을 내리는 데 필수적인
      정보를 제공해요. <br />
      PER, PBR, EPS, BPS와 같은 지표들은 각기 다른 측면에서 기업의 성과와 가치를
      나타내요. <br />
      투자자들은 이러한 지표들을 통해 기업의 재정 상태, 수익성, 성장 가능성을
      판단할 수 있어요. <br />
      재무재표는 기업이 시장에서 경쟁하는 데 있어 매우 중요한 자료로, 주식
      투자와 경영 전략에 큰 영향을 미쳐요.
    </>
  ),
  캔들차트: (
    <div className="flex w-full space-x-2">
      <div className="w-[400px] p-2">
        캔들차트는 금융시장에서 가격 변동을 시각적으로 표현한 도구에요.{" "}
        <br className="h-[3px]" />각 캔들의 색상과 모양은 가격이 상승했는지
        하락했는지를 알려줘요. <br className="h-[3px]" />
        이를 통해 시장 심리와 가격의 흐름을 한눈에 파악할 수 있어요.
        <div className="mb-2.5" />
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-normal">
                양봉 (<span className="text-buy">빨간색</span>)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-normal">
                음봉 (<span className="text-sell">파란색</span>)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                {" "}
                주가의 상승을 의미해요
              </td>
              <td className="border border-gray-300 px-4 py-2">
                주가의 하락을 의미해요
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                <img src="/images/양봉.png" className="w-[150px]" alt="양봉" />
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <img src="/images/음봉.png" className="w-[150px]" alt="음봉" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex-1">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="w-[70px] border border-gray-300 px-3 py-2 text-left">
                용어
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                설명
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">일봉</td>
              <td className="border border-gray-300 px-4 py-2">
                하루 동안의 주식 가격 변화를 나타내는 차트예요.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">주봉</td>
              <td className="border border-gray-300 px-4 py-2">
                일주일 동안의 주식 가격 변화를 보여줘요.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">월봉</td>
              <td className="border border-gray-300 px-4 py-2">
                한 달 동안의 주식 가격 변화를 보여주는 차트예요.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">시작가</td>
              <td className="border border-gray-300 px-4 py-2">
                거래가 시작될 때 처음 거래된 가격이에요.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">종가 </td>
              <td className="border border-gray-300 px-4 py-2">
                거래가 끝날 때 마지막으로 거래된 가격이에요.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">최고가</td>
              <td className="border border-gray-300 px-4 py-2">
                거래 중 가장 높았던 가격이에요.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">최저가</td>
              <td className="border border-gray-300 px-4 py-2">
                거래 중 가장 낮았던 가격이에요.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">거래량</td>
              <td className="border border-gray-300 px-4 py-2">
                얼마나 많은 주식이 거래되었는지를 나타내요.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
  일: (
    <>
      막대기 하나하나는 <b>하루동안</b>의 주가가 어떻게 움직였는지가 담겨있어요
    </>
  ),
  주: (
    <>
      막대기 하나하나는 <b>일주일동안</b>의 주가가 어떻게 움직였는지가
      담겨있어요. 실질적으로는 장이 열리는 <b>월화수목금</b>의 주가가
      담겨있어요.
    </>
  ),
  월: (
    <>
      막대기 하나하나는 <b>한달동안</b>의 주가가 어떻게 움직였는지가 담겨있어요.
    </>
  ),
  이동평균: (
    <div>
      일정 기간 동안의 주가들이 평균선이에요.
      <br />
      이동평균선은 <b>보조지표</b>입니다.
      <br />
      5일선과 20일선은 단기 / 60일선은 중기 / 120일선은 장기 추세를 파악하기
      위해서 봅니다.
    </div>
  ),
  거래량: (
    <>
      실제 주식 거래는 &apos;살려고 하는 사람 A&apos;와 &apos;팔려고 하는
      사람B&apos;의 가격이 일치할때 거래됩니다. <br />
      이렇게 거래가 체결될 때가 <b>1거래량</b>이 됩니다. 거래량이 많을수록 그
      주식이 <b>활발하고 관심이 많다</b>라는 뜻이에요.
    </>
  ),
  "5일": <>해당날짜 이전 5일동안 주가의 평균을 이어놓은 선을 말해요</>,
  "20일": <>해당날짜 이전 20일동안 주가의 평균을 이어놓은 선을 말해요</>,

  주가: <>시가총액 / 발행주식수</>,
  KOSPI: (
    <>
      한국에 상장된 모든 기업의 주가를 종합한 지수입니다. 모든 기업이 포함되어
      있습니다.
    </>
  ),
  KOSPI200: (
    <>
      한국의 주식 시장에서 가장 큰 200개 회사의 주가를 모은 지수입니다.
      <br />
      이 지수는 한국 경제의 상태를 나타내는 중요한 지표로 사용됩니다. <br />
      KOSPI200의 숫자가 상승하면, 일반적으로 많은 기업이 잘 운영되고 있다는
      의미입니다.
      <br /> 이는 한국 경제가 좋은 방향으로 가고 있다는 신호일 수 있습니다.
      <br />
      반대로 KOSPI200의 숫자가 하락하면, 많은 기업이 어려움을 겪고 있다는 의미로
      해석될 수 있습니다. <br /> 이는 경제가 힘든 상황에 처해 있다는 신호일 수
      있습니다.
    </>
  ),
  KOSDAQ: (
    <>
      한국의 중소기업 및 벤처기업이 주식 시장에 상장되는 시장입니다. <br />
      KOSDAQ은 한국 거래소(KRX)의 두 번째 시장으로, 주로 고성장 기업이나
      스타트업이 상장됩니다.
      <br />
      높은 변동성을 가지고 있습니다. 중소기업의 특성상 성장 가능성이나 경영
      성과에 따라 주가가 급변할 수 있습니다. <br />
      이런 특성 때문에 고위험 고수익의 특성을 가지고 있어요.
    </>
  ),
  // 매매 컴포넌트 부분
  // 매수
  매수: (
    <>
      매수란 주식을 사는 것으로, 주식을 사면 그 회사의 지분을 가진 사람이 되고
      나중에 주식의 가격이 오르면 팔아서 이익을 얻을 수 있어요.
    </>
  ),
  현재가: <></>,
  최대매수가능주수: <>내가 가진 머니로 매수할 수 있는 최대 주 수를 알려줘요.</>,
  반환주수: <></>,
  매도: (
    <>
      매도란 가지고 있던 주식을 파는 것으로 <br /> 매도 시 현재가에 따라
      이익이나 손실을 볼 수 있어요. <br />
      이전에 구매한 매수 가격보다 현재가가 올랐다면 이익을 볼 수 있고 <br />그
      반대라면 손실을 봅니다.
    </>
  ),
}
