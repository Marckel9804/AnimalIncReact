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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            filterRankings(selectedTab);
        } else {
            const filtered = rankings.filter(user =>
                user.userNickname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRankings(filtered);
            setCurrentPage(1);
        }
    };

    const filterRankings = (grade) => {
        if (grade === '') {
            setFilteredRankings(rankings);
        } else {
            const filtered = rankings.filter(user => user.userGrade === grade);
            setFilteredRankings(filtered);
        }
        setCurrentPage(1);
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
        setCurrentPage(1);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRankings.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredRankings.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage -1);
    }

    const handleNextPage = () => {
        if (currentPage < pageNumbers.length) setCurrentPage(currentPage + 1);
    }

    // 빈 행 채우기
    const emptyRows = itemsPerPage - currentItems.length;
    const emptyData = { userNickname: '-', userGrade: '-', userPoint: '-' };

    return (
        <>
            <Header />
            <div className="ranking-page">
                <div className="ranking-header">
                    <div className="tab-section">
                        <button className={`rank-tab-button nes-pointer ${selectedTab === 'Gold' ? 'active' : ''}`}
                                onClick={() => handleTabClick('Gold')}>Gold
                        </button>
                        <button className={`rank-tab-button nes-pointer ${selectedTab === 'Silver' ? 'active' : ''}`}
                                onClick={() => handleTabClick('Silver')}>Silver
                        </button>
                        <button className={`rank-tab-button nes-pointer ${selectedTab === 'Bronze' ? 'active' : ''}`}
                                onClick={() => handleTabClick('Bronze')}>Bronze
                        </button>
                    </div>
                    <div className="search-section">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress} // 엔터키 이벤트 추가
                            placeholder="닉네임으로 검색"
                            className="rank-search-input"
                        />
                        <button onClick={handleSearch} className="nes-btn" id="rank-search-btn">검색</button>
                    </div>
                </div>
                <table className="ranking-table">
                    <thead>
                    <tr>
                        <th>순위</th>
                        <th>유저</th>
                        <th>티어</th>
                        <th>포인트</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((user, index) => (
                        <tr key={user.userEmail}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{user.userNickname}</td>
                            <td>{user.userGrade}</td>
                            <td>{user.userPoint}</td>
                        </tr>
                    ))}
                    {[...Array(emptyRows)].map((_, index) => (
                        <tr key={`empty-${index}`}>
                            <td>{indexOfFirstItem + currentItems.length + index + 1}</td>
                            <td>{emptyData.userNickname}</td>
                            <td>{emptyData.userGrade}</td>
                            <td>{emptyData.userPoint}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="rank-pagination">
                    <button onClick={() => paginate(1)} disabled={currentPage === 1} className="nes-pointer">{'<<'}</button>
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="nes-pointer">{'<'}</button>
                    {pageNumbers.map(number => (
                        <button key={number} onClick={() => paginate(number)}
                                className={`nes-pointer ${currentPage === number ? 'active' : ''}`}
                                id="rank-page-num"
                        >
                            {number}
                        </button>
                    ))}
                    <button onClick={handleNextPage} disabled={currentPage >= pageNumbers.length} className="nes-pointer">{'>'}</button>
                    <button onClick={() => paginate(pageNumbers.length)}
                            disabled={currentPage >= pageNumbers.length} className="nes-pointer">{'>>'}</button>
                </div>
            </div>
            <div className="rank-back"/>
            <Footer/>
        </>
    );
};

export default Rank;
