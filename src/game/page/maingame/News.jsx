import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function News({ setShow, show, ind, comp, stockInfo }) {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const indKor = {
    food: "식품",
    ship: "조선",
    enter: "엔터테인먼트",
    elec: "전자",
    tech: "테크",
  };

  const [apiKey, setApiKey] = useState("");
  useEffect(() => {
    axios.get("/ncp/aniinc/gpt.txt", { responseType: "text" }).then((res) => {
      // console.log("ncp", res);
      setApiKey(res.data);
    });
  }, []);

  const stockChange = useMemo(() => {
    const res =
      stockInfo[ind + comp].weight[stockInfo[ind + comp].weight.length - 1];
    if (res < 0) {
      return res + "% 하락 할 예정";
    } else {
      return "+" + res + "% 상승 할 예정";
    }
  }, [stockInfo, ind, comp]);

  const handleGenerateNews = async () => {
    console.log(
      "전망",
      stockInfo[ind + comp].weight[stockInfo[ind + comp].weight.length - 1]
    );
    setLoading(true);
    setError("");

    // Create prompt based on input
    const prompt = `
      지금부터 너는 가상의 뉴스를 작성해야 해. 다음 규칙을 지켜서 기사를 작성해줘:

      1. 뉴스는 가상의 특정 기업에 대한 이슈 또는 경제적 상황에 관한 것이어야 해.
      2. 나는 가상의 기업 이름, 해당 기업이 다루는 서비스 종류, 미래의 주가 변화 예측을 제공할 거야.
      3. 너는 이 정보를 바탕으로 해당 기업이나 업종에 관한 기사를 작성해줘. 기사는 주가 변화 예측과 관련된 직접적인 언급 없이 상황을 설명해줘.
      4. 예를 들어, 주가가 크게 변동한다고 하면, 그에 맞는 중요한 이슈를 생각해내서 기사를 작성해줘. 주가 변화가 적다면 그에 맞는 일반적인 이슈를 생성해줘.
      5. 주가 변화가 마이너스, 즉 -가 붙어있으면 부정적인 기사, +가 붙어있으면 증가로 간주하고 긍정적인 기사를 작성해.
      6. 직접적인 숫자 언급이나 주가의 상승/하락 언급은 절대 하지 말고, 오로지 상황과 이슈에 중점을 두어 기사를 작성해줘.
      6-1. 예시를 들어줄게. {기업 이름: aa, 서비스 종류: 식품, 주가 변화 예측: +7.8% 상승 할 예정} > 생성한 기사: "세계적으로 한식 열풍이 도는 가운데 aa기업의 신제품이 해외에서 뜨거운 반응을 보이며..."
      6-2. 예시를 들어줄게. {기업 이름: aa, 서비스 종류: 식품, 주가 변화 예측: -12.8% 하락 할 예정} > 생성한 기사: "최근 aa사의 포항에 위치한 식품 공장에서 불이나며 aa사의 주력 상품이었던 bb의 생산과 유통에 차질이 빚어질 것으로 보이며..."
      7. 주가 변화 예측 자체를 본문에서 절대 언급하지 마. 주가의 상승, 하락, 특정 수치에 대한 직접적인 언급 없이, 상황과 이슈를 설명해줘.
      8. 주가 변화가 너무 미미하다고 판단되면, 포괄적인 업종 관련 기사를 작성해도 괜찮아.
      8-1. 예시를 들어줄게. {기업 이름: aa, 서비스 종류: 식품, 주가 변화 예측: +0.4% 상승 할 예정} > 생성한 기사: "최근 sns를 통해 mz세대들 사이에 새로운 간식 열풍이 불며 관련한 점포가 국내에 3개월 사이 32% 증가하며 이에 따라..."
      9. 다시 강조할게. 주가 변화 예측에 -가 붙으면 그러니까 음수면 부정적인 기사, 무조건 절대 부정적인 기사를 써야해.
      10. 주가 변화 예측에 +가 붙으면 무조건 절대로 긍정적인 기사를 써야해.

      여기서 주어진 정보는 다음과 같아:
      기업 이름: ${ind + comp}
      서비스 종류: ${indKor[ind]}
      주가 변화 예측: ${stockChange}

      이 정보를 바탕으로 한국어로 가상의 뉴스를 작성해줘. 주가 언급은 절대 하지 말고, 이슈와 상황에 중점을 두어 작성해줘.
    `;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "뉴스 기사를 생성하는 역할을 합니다." },
            { role: "user", content: prompt },
          ],
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const generatedNews = response.data.choices[0].message.content.trim();
      setNews(generatedNews);
    } catch (err) {
      setError("뉴스 로딩에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };
  return show ? (
    <div className={"win-news-container"}>
      <div className={` main-window flex`}>
        <div className="window-head">
          News
          <div className=" ml-auto mr-1 flex items-center">
            <button
              className="window-head-btn items-center"
              onClick={() => {
                setShow(false);
              }}
            >
              x
            </button>
          </div>
        </div>
        <div className="main-window-inside flex flex-col">
          <div>
            <button
              onClick={handleGenerateNews}
              disabled={loading}
              style={{ border: "solid 1px black" }}
            >
              {loading ? "로딩 중..." : `${ind + comp}의 뉴스 열람하기`}
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {news && (
            <div
              style={{
                width: "100%",
                height: "180px",
                flexGrow: 1,
                marginTop: "20px",
                overflowY: "scroll",
              }}
            >
              {news}
              <br />
              <span style={{ color: "red" }}>{stockChange}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default News;
