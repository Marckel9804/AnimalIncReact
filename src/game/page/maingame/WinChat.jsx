import React, { useState } from "react";
import axios from "axios";

function WinChat({ show, setShow }) {
  const [companyName, setCompanyName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [priceChange, setPriceChange] = useState("");
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = "dd";

  const handleGenerateNews = async () => {
    setLoading(true);
    setError("");

    // Create prompt based on input
    const prompt = `
      지금부터 너는 가상의 뉴스를 작성해야 해. 다음 규칙을 지켜서 기사를 작성해줘:

      1. 뉴스는 가상의 특정 기업에 대한 이슈 또는 경제적 상황에 관한 것이어야 해.
      2. 나는 가상의 기업 이름, 해당 기업이 다루는 서비스 종류, 미래의 주가 변화 예측을 제공할 거야.
      3. 너는 이 정보를 바탕으로 해당 기업이나 업종에 관한 기사를 작성해줘. 기사는 주가 변화 예측과 관련된 직접적인 언급 없이 상황을 설명해줘.
      4. 예를 들어, 주가가 크게 변동한다고 하면, 그에 맞는 중요한 이슈를 생각해내서 기사를 작성해줘. 주가 변화가 적다면 그에 맞는 일반적인 이슈를 생성해줘.
      5. 직접적인 숫자 언급이나 주가의 상승/하락 언급은 절대 하지 말고, 오로지 상황과 이슈에 중점을 두어 기사를 작성해줘.
      6. 주가 변화 예측 자체를 본문에서 절대 언급하지 마. 주가의 상승, 하락, 특정 수치에 대한 직접적인 언급 없이, 상황과 이슈를 설명해줘.
      7. 기업 이름이 아닌 업종만 주어지고 주가의 전반적인 변화가 언급된 경우, 업종에 대한 포괄적인 기사를 작성해줘.
      8. 주가 변화가 너무 미미하다고 판단되면, 포괄적인 업종 관련 기사를 작성해도 괜찮아.

      여기서 주어진 정보는 다음과 같아:
      기업 이름: ${companyName}
      서비스 종류: ${serviceType}
      주가 변화 예측: ${priceChange}

      이 정보를 바탕으로 한국어로 가상의 뉴스를 작성해줘. 주가의 상승, 하락 언급은 절대 하지 말고, 이슈와 상황에 중점을 두어 작성해줘.
    `;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: "뉴스 기사를 생성하는 역할을 합니다." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
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
      setError("뉴스 생성에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={"win-chat-container"}>
      <div className={` main-window ${show ? "flex" : "hidden"} `}>
        <div className="window-head">
          Chat
          <div className=" ml-auto mr-1 flex items-center">
            <button
              className="window-head-btn items-end"
              onClick={() => {
                setShow(false);
              }}
            >
              _
            </button>
            <button className="window-head-btn-disabled items-center">
              ㅁ
            </button>
            <button className="window-head-btn-disabled items-center">x</button>
          </div>
        </div>
        <div className="main-window-inside flex flex-col">
          <h1>가상의 뉴스 생성기</h1>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="기업 이름 입력"
          />
          <input
            type="text"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            placeholder="서비스 종류 입력"
          />
          <div>
            <input
              type="text"
              value={priceChange}
              onChange={(e) => setPriceChange(e.target.value)}
              placeholder="주가 변화 예측 입력"
            />
            <button onClick={handleGenerateNews} disabled={loading}>
              {loading ? "생성 중..." : "뉴스 생성"}
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {news && (
            <div
              style={{
                width: "100%",
                height: "180px",
                marginTop: "20px",
                overflowY: "scroll",
              }}
            >
              {news}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WinChat;
