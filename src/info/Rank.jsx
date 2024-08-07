import React, { useEffect, useState } from "react";
import "../styles/login/Rank.css";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import axios from "../utils/axios.js";

const Rank = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [rankings, setRankings] = useState([]);
    const [filteredRankings, setFilteredRankings] = useState([]);
    const [selectedTab, setSelectedTab] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            filterRankings(selectedTab);
        } else {
            const filtered = rankings.filter(user =>
                user.userNickname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRankings(filtered);
        }
    };

    const filterRankings = (grade) => {
        if (grade === '') {
            setFilteredRankings(rankings);
        } else {
            const filtered = rankings.filter(user => user.userGrade === grade);
            setFilteredRankings(filtered);
        }
    };

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await axios.get('/api/user/rankings');
                setRankings(response.data);
                setFilteredRankings(response.data); // 초기에는 모든 사용자 표시
            } catch (error) {
                console.error('Error fetching rankings:', error);
            }
        }
        fetchRankings();
    }, []);

    useEffect(() => {
        filterRankings(selectedTab);
    }, [selectedTab, rankings]);

    const handleTabClick = (grade) => {
        if (selectedTab === grade) {
            setSelectedTab(''); // 탭 해제
        } else {
            setSelectedTab(grade); // 탭 선택
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <Header />
            <div className="ranking-page">
                <div className="ranking-header">
                    <div className="tab-section">
                        <button className={`tab-button ${selectedTab === 'Gold' ? 'active' : ''}`} onClick={() => handleTabClick('Gold')}>Gold</button>
                        <button className={`tab-button ${selectedTab === 'Silver' ? 'active' : ''}`} onClick={() => handleTabClick('Silver')}>Silver</button>
                        <button className={`tab-button ${selectedTab === 'Bronze' ? 'active' : ''}`} onClick={() => handleTabClick('Bronze')}>Bronze</button>
                    </div>
                    <div className="search-section">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress} // 엔터키 이벤트 추가
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
                    {filteredRankings.map((user, index) => (
                        <tr key={user.userEmail}>
                            <td>{index + 1}</td>
                            <td>{user.userNickname}</td>
                            <td>{user.userGrade}</td>
                            <td>{user.userPoint}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Footer />
            </div>
        </>
    );
};

export default Rank;
