import {useEffect, useState} from "react"

import{
    Card,
    Input,
    Button,
} from "@material-tailwind/react"

import { postTrade, getChildMoney } from "@/api/trade-api"

import { tradeData } from "./tradeData"
import { moneyData } from "./moneyData"

// interface moneyData{
//     balance: number; // 보유 머니
// }

// export interface tradeData {
//     stockCode: string;
//     amount: number;
//     tradeSharesCount: number;
//     reason: string;
//     tradeType: string;
//   }

function BuyForm(): JSX.Element{
    const [money, setMoney] = useState<number | null>(null); // 보유머니
    const [inputMoney, setInputMoney] = useState<number>(0); // 구매머니
    const [tradeShares, setTradeShares] = useState<number>(0); // 머니 환산 주수
    const [remainingMoney, setRemainingMoney] = useState<number | null>(null); // 구매 후 잔액 (남은 머니)
    const [reason, setReason] = useState<string>(''); // 매매 이유

    // API 호출하여 보유 머니 가져오기
  const loadMoney = async () => {
    try {
      const data = await getChildMoney();
      setMoney(data.balance);
    } catch (error) {
      console.error('Failed to load money:', error);
    }
  };

  useEffect(() => {
    loadMoney();
  }, []);

  // 입력된 금액에 따른 주 수와 잔액 계산
  useEffect(() => {
    const shares = Math.floor((inputMoney / 30300) * 1e7) / 1e7; // 소수점 7자리에서 버림
    setTradeShares(shares);
    if (money !== null) {
      setRemainingMoney(money - inputMoney);
    }
  }, [inputMoney, money]);

  // 매수 처리 함수
  const handleTrade = async () => {
    const tradeDataObj : tradeData = {
      stockCode: '462870', // ***** 주식 가격 값 어디서 가져오는지 물어보기...?
      amount: inputMoney,
      tradeSharesCount: Number(tradeShares.toFixed(6)), // 소수점 6자리로 표시
      reason,
      tradeType :'4', 
    };

    try {
      const result = await postTrade(tradeDataObj);
      console.log('Trade successful:', result);
    } catch (error) {
      console.error('Trade failed:', error);
    }
  };

    return (
            <Card className="shadow-blue-gray-900/5 w-fit p-0 px-1 py-4">
              <h2>보유 머니: {money !== null ? money.toLocaleString() : '로딩 중...'}</h2>
                    <Input
                      type="number"
                      value={inputMoney}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMoney(Number(e.target.value))}
                      placeholder="매수할 머니"
                    />
                    <p>{tradeShares.toFixed(6)} 주</p> {/* 소수점 6자리로 표시 */}
                    // 최대 00 주 구매 가능
                    <p>투자의 책임은 본인에게 있습니다.</p>
                    {remainingMoney !== null && <p>구매 후 잔액: {remainingMoney.toLocaleString()}</p>}
                    <Input
                      type="text"
                      value={reason}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}       
                      placeholder="구매를 생각하게 된 이유를 적어주세요!"
                    />
                    <Button onClick={() => handleTrade()}>매수</Button> {/* 매수 버튼 */}
            </Card>
          );
}

export default BuyForm



