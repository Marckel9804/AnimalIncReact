import React, { useState } from 'react'
import './Privacy.css'
import Header from './Header'
import Footer from './Footer'

const Privacy = () => {
  const [activeTab, setActiveTab] = useState('privacy')

  const renderContent = () => {
    switch (activeTab) {
      case 'privacy':
        return (
          <div className="privacy-content-text">
            <p>
              (주)Animal 주식회사는 이용자의 자유와 권리 보호를 위해 「개인정보
              보호법」 및 관계 법령이 정한 바를 준수하며, 적법하게 개인정보를
              처리하고 안전하게 관리하고 있습니다. <br />
              이에 「개인정보 보호법」 제30조에 따라 이용자에게 개인정보 처리에
              관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게
              처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을
              수립·공개합니다. <br />본 개인정보처리방침은 넥슨이 제공하는 게임
              및 제반 서비스에 적용됩니다.
            </p>
            <br />

            <h4>목차</h4>
            <p>
              <br />
              1. 수집하는 개인정보의 항목
              <br />
              2. 개인정보의 처리 목적
              <br />
              3. 14세 미만 아동의 개인정보 처리에 관한 사항
              <br />
              4. 개인정보의 제3자 제공
              <br />
              5. 개인정보의 처리 위탁
              <br />
              6. 개인정보의 국외이전
              <br />
              7. 개인정보의 추가적인 이용 또는 제공의 기준
              <br />
              8. 개인정보의 보유기간 및 파기
              <br />
              9. 가명정보의 처리
              <br />
              10. 이용자 및 법정대리인의 권리와 그 행사 방법
              <br />
              11. 개인정보 자동수집 장치의 설치?운영 및 그 거부에 관한 사항
              <br />
              12. 개인정보보호를 위한 넥슨의 노력
              <br />
              13. 개인정보보호책임자 및 고충처리 부서
              <br />
              14. 기타
            </p>
            <br />
            <h4>1. 수집하는 개인정보의 항목</h4>

            <h3>
              Animal 주식회사는 서비스 이용 시 필요한 개인정보만을 수집하며,
              수집하는 개인정보의 항목을 이용자에게 상세히 안내하고 있습니다.
            </h3>
            <br />
            <h2>■ 필수정보란?</h2>
            <br />
            <p>기본적인 서비스를 제공하기 위해 수집하는 개인정보</p>
            <br />
            <h2>■ 선택정보란?</h2>
            <br />
            <p>
              기본적인 서비스 이외에 부가적인 서비스를 제공하기 위해 수집하는
              개인정보
            </p>
          </div>
        )
      case 'terms':
        return (
          <div className="privacy-content-text">
            <h4>&lt;제1장 총칙&gt;</h4>
            <br />
            <br />
            <h4>제1조 (목적)</h4>
            <br />
            <p>
              이 약관은 (주)Animal 주식회사가 제공하는 게임 및 제반 서비스의
              이용과 관련하여 회사와 회원의 권리, 의무 및 기타 필요한 사항을
              규정함을 목적으로 합니다.
            </p>
            <br />
            <h4>제2조 (용어의 정의)</h4>
            <br />
            <p>
              ① 이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
              <br />
              <br />
              1.“회원”이라 함은 이 약관에 동의하여 회사와 서비스 등에 대한
              이용계약을 체결하고 회사에서 제공하는 모든 게임서비스 등을 이용할
              수 있는 권한을 획득한 자를 의미합니다.
              <br />
              <br />
              2. “플랫폼”이라 함은 PC, 휴대폰, 태블릿, 휴대용 게임기, 콘솔
              게임기, VR 등의 기기를 통해서 콘텐츠를 다운로드 받거나 설치하여
              사용할 수 있도록 제공하는 제반 프로그램과 서비스를 의미합니다.
              <br />
              <br />
              3 “게임서비스 등”이라 함은 회사가 회원에게 플랫폼을 통하여
              제공하는 게임 및 이에 부수된 제반 서비스를 의미합니다.
              <br />
              <br />
              4 “콘텐츠”라 함은 회사가 게임서비스 등의 제공과 관련하여 디지털
              방식으로 제작된 유료 또는 무료의 내용물 일체(캐릭터, 게임머니,
              아이템 등)를 의미합니다.
              <br />
              <br />
              5 “계정정보”라 함은 회원의 계정, 비밀번호, 성명 등 회원이 회사에
              제공한 개인정보, 기기정보, 게임 이용정보(캐릭터 정보, 아이템, 레벨
              등), 이용대금 결제정보 등 계정 또는 넥슨 ID에 대한 일체의 정보를
              의미합니다.
              <br />
              <br />
              6 “게임 ID”라 함은 넥슨 ID 또는 계정에 수반하여 특정 게임서비스
              등에서만 사용하기 위해 회원이 별도로 생성하고 회사가 승인하는
              문자, 특수문자, 숫자 등의 조합을 의미합니다.
              <br />
              <br />
              7 “비밀번호”라 함은 회원이 자신의 계정을 사용하고, 계정에 대한
              접근 권한을 통제하며, 자신의 정보 및 권익보호를 위해 스스로
              선정하여 비밀로 관리하는 문자, 특수문자, 숫자 등의 조합을
              의미합니다.
              <br />
              <br />
              8 “게시물”이라 함은 회원이 게임서비스 등을 이용함에 있어 회원이
              게시한 문자, 문서, 그림, 음성, 영상 또는 이들의 조합으로 이루어진
              정보를 의미합니다.
              <br />
              <br />
              9 “회원탈퇴”라 함은 회원이 회사와의 게임서비스 등에 대한
              이용계약을 해지하는 것을 의미합니다.
              <br />
              <br />
              ② 이 약관에서 사용하는 용어의 정의는 제1항에서 정하는 것을
              제외하고는 관련 법령, 가이드라인 및 운영정책에서 정하는 바에
              따릅니다. 관련 법령과 운영정책에서 정하지 않는 것은 일반적인
              상관례에 따릅니다.
              <br />
            </p>
          </div>
        )
      case 'youth':
        return <p>청소년보호정책 내용</p>
      case 'verification':
        return <p>실명확인안내 내용</p>
      case 'protection':
        return <p>정보보호활동 내용</p>
      case 'guide':
        return <p>게임IP사용가이드 내용</p>
      case 'previous':
        return <p>여기에 이전약관 내용을 작성하세요...</p>
      default:
        return null
    }
  }

  return (
    <div className="privacy-page-container">
      <Header />
      <div className="privacy-content-wrapper">
        <div className="privacy-tabs">
          <button
            className={activeTab === 'privacy' ? 'active' : ''}
            onClick={() => setActiveTab('privacy')}
          >
            개인정보처리방침
          </button>
          <button
            className={activeTab === 'terms' ? 'active' : ''}
            onClick={() => setActiveTab('terms')}
          >
            이용약관
          </button>
          <button
            className={activeTab === 'youth' ? 'active' : ''}
            onClick={() => setActiveTab('youth')}
          >
            청소년보호정책
          </button>
          <button
            className={activeTab === 'verification' ? 'active' : ''}
            onClick={() => setActiveTab('verification')}
          >
            실명확인안내
          </button>
          <button
            className={activeTab === 'protection' ? 'active' : ''}
            onClick={() => setActiveTab('protection')}
          >
            정보보호활동
          </button>
          <button
            className={activeTab === 'guide' ? 'active' : ''}
            onClick={() => setActiveTab('guide')}
          >
            게임IP사용가이드
          </button>
          <button
            className={activeTab === 'previous' ? 'active' : ''}
            onClick={() => setActiveTab('previous')}
          >
            이전약관
          </button>
        </div>
        <div className="privacy-content">{renderContent()}</div>
      </div>
      <Footer />
    </div>
  )
}

export default Privacy
