import React, { useState } from "react";
import "../styles/login/Rank.css";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";

const Rank = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        // 검색 기능 구현
        console.log("Searching for:", searchTerm);
    };

    return (
        <>
            <Header />
            <div className="ranking-page">
                <div className="ranking-header">
                    <div className="tab-section">
                        <button className="tab-button">KR</button>
                        <button className="tab-button">ALL</button>
                    </div>
                    <div className="search-section">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="검색"
                            className="search-input"
                        />
                        <button onClick={handleSearch} className="nes-btn is-primary">검색</button>
                    </div>
                </div>
                <table className="ranking-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>유저</th>
                        <th>티어</th>
                        <th>point</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* 데이터가 여기에 들어갑니다. */}
                    <tr>
                        <td>1</td>
                        <td>hide on bush</td>
                        <td>골드</td>
                        <td>90 p</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>canyon</td>
                        <td>골드</td>
                        <td>30 p</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>chovy</td>
                        <td>골드</td>
                        <td>20 p</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>khan</td>
                        <td>골드</td>
                        <td>10 p</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>teddy</td>
                        <td>실버</td>
                        <td>90 p</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>oner</td>
                        <td>실버</td>
                        <td>50 p</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>bang</td>
                        <td>실버</td>
                        <td>30 p</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>dopa</td>
                        <td>실버</td>
                        <td>10 p</td>
                    </tr>
                    </tbody>
                </table>
                <Footer />
            </div>
        </>
    );
};

export default Rank;
