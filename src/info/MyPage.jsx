import React, {useState, useEffect, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import Modal from 'react-modal'
import axios from '../utils/axios.js'
import '../styles/login/MyPage.css'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import {Tab, TabBody, Tabs, Window, WindowContent, WindowHeader} from "react95";
import styled from "styled-components";


const StyledTab = styled(Tab)`
    min-width: 120px;
    text-align: center;
    padding: 8px; /* 조정된 패딩 */
    margin-right: 2px; /* 탭 간 간격 */
    position: relative;
    top: 1px; /* 선택된 탭의 위치 조정 */
    z-index: ${props => (props.selected ? 2 : 1)}; /* 선택된 탭이 다른 탭 위에 오도록 */
    background-color: ${props => (props.selected ? '#fff' : '#f1f1f1')};
    border-bottom: none;

    &:hover {
        background-color: #e0e0e0; /* hover 시 색상 변경 */
        cursor: url('https://unpkg.com/nes.css@latest/assets/cursor-click.png'), pointer; /* 커서를 NES 스타일로 변경 */
    }

    &.selected {
        font-weight: bold;
        z-index: 3; /* 선택된 탭이 가장 위로 올라오도록 */
        border: 1px solid #000;
        border-bottom: none; /* 탭 내용 영역과의 경계를 없애기 위해 */
    }
`;

Modal.setAppElement('#root') //모달을 앱 요소로 설정

const Mypage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [selectedPicture, setSelectedPicture] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const [myPosts, setMyPosts] = useState([]);
    const [myComments, setMyComments] = useState([]);
    const [myReports, setMyReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [nickname, setNickname] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
    const [nicknameError, setNicknameError] = useState('');
    const [animals, setAnimals] = useState([]);
    const [ownedAnimals, setOwnedAnimals] = useState([]);
    const [hoveredAnimal, setHoveredAnimal] = useState(null);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const postsPerPage = 5;
    const itemsPerPage = 100;
    const [updatedInfo, setUpdatedInfo] = useState({
        userNickname: '',
        userRealname: '',
        userBirthdate: '',
    });

    const [passwordInfo, setPasswordInfo] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('accessToken')
                if (!token) {
                    alert('로그인을 먼저 해주세요!')
                    navigate('/login')
                    return
                }

                const response = await axios.get('/api/user/get-profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                setUserInfo(response.data)
                setUpdatedInfo({
                    userNickname: response.data.userNickname,
                    userRealname: response.data.userRealname,
                    userBirthdate: response.data.userBirthdate,
                })
            } catch (error) {
                console.error('Error fetching user info:', error)
                alert('로그인을 먼저 해주세요!')
                navigate('/login')
            }
        }

        const fetchMyPosts = async () => {
            try {
                const response = await axios.get('/api/board/my-posts', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setMyPosts(response.data);
            } catch (error) {
                console.error('Error fetching my posts:', error);
            }
        };

        const fetchMyComments = async () => {
            try {
                const response = await axios.get('/api/board/my-comments', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setMyComments(response.data);
            } catch (error) {
                console.error('Error fetching my comments:', error);
            }
        };

        const fetchMyReports = async () => {
            try {
                const response = await axios.get('/api/board/my-reports', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setMyReports(response.data);
            } catch (error) {
                console.error('Error fetching my reports:', error);
            }
        }

        const fetchAnimals = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('/api/animal/encyclopedia', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAnimals(response.data);

                const ownedResponse = await axios.get('/api/animal/owned-animals', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOwnedAnimals(ownedResponse.data.map((animal) => animal.animalId));
            } catch (error) {
                console.error('Error fetching animals:', error);
            }
        };

        fetchUserInfo();
        fetchMyPosts();
        fetchMyComments();
        fetchMyReports();
        fetchAnimals();
    }, [navigate]);

    const groupedItems = userInfo ? userInfo.userItems.reduce((acc, item) => {
        const found = acc.find(i => i.itemId === item.itemId);
        if (found) {
            found.count += 1;
        } else {
            acc.push({ ...item, count: 1 });
        }
        return acc;
    }, []) : [];

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = myPosts.slice(indexOfFirstPost, indexOfLastPost);

    // 아이템 페이지네이션 계산
    let currentItems = [];
    if (userInfo && userInfo.userItems) {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        currentItems = groupedItems.slice(indexOfFirstItem, indexOfLastItem);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (!userInfo) {
        return <div>Loading...</div>
    }

    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => {
        setUpdatedInfo({
            userNickname: userInfo.userNickname,
            userRealname: userInfo.userRealname,
            userBirthdate: userInfo.userBirthdate,
        });
        setIsEditModalOpen(false);
    };

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const openChangePasswordModal = () => setIsChangePasswordModalOpen(true);
    const closeChangePasswordModal = () => {
        setPasswordInfo({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setIsChangePasswordModalOpen(false);
    };

    const openProfilePictureModal = () => setIsProfilePictureModalOpen(true);
    const closeProfilePictureModal = () => setIsProfilePictureModalOpen(false);

    const openItemModal = () => setIsItemModalOpen(true);
    const closeItemModal = () => setIsItemModalOpen(false);

    const handleUpdate = async () => {
        // 필수 입력값 확인
        if (!updatedInfo.userRealname || !updatedInfo.userNickname || !updatedInfo.userBirthdate) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        // 닉네임 중복 확인
        if (isNicknameAvailable === null || isNicknameAvailable === false) {
            alert('닉네임 중복 확인을 해주세요.');
            return;
        }

        // 생년월일 유효성 검사
        if (!isValidBirthdate(updatedInfo.userBirthdate)) {
            alert('유효하지 않은 생년월일 형식입니다.');
            return;
        }

        try {
            const response = await axios.post(
                '/api/user/update-profile',
                {
                    ...updatedInfo,
                    userNickname: nickname,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            )
            setUserInfo(response.data);
            alert('정보가 업데이트되었습니다.');
            closeEditModal();
            navigate('/');
        } catch (error) {
            console.error('Error updating user info:', error);
            alert('정보 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(
                '/api/user/delete',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            )
            alert('회원 탈퇴가 완료되었습니다.');
            localStorage.removeItem('accessToken');
            navigate('/');
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해 주세요.')
        }
    }


    const handleChangePassword = async () => {
        if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
            alert('비밀번호 확인과 일치하지 않습니다. ');
            return;
        }

        try {
            await axios.post('/api/user/change-password', {
                    currentPassword: passwordInfo.currentPassword,
                    newPassword: passwordInfo.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            );
            alert('비밀번호가 성공적으로 변경되었습니다!');
            closeChangePasswordModal();
        } catch (error) {
            console.error('Error changing password:', error);
            if (error.response && error.response.status === 403) {
                alert('현재 비밀번호가 잘못되었습니다. 다시 시도해 주세요.');
            }else {
                alert('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    }

    const getTierIcon = (userGrade) => {
        switch (userGrade) {
            case 'Bronze':
                return 'src/image/Bronze.png';
            case 'Silver':
                return 'src/image/Silver.png';
            case 'Gold':
                return 'src/image/Gold.png';
            default:
                return 'src/image/Default.png';
        }
    };

    const handleProfilePictureSelect = async (animal) => {
        if (ownedAnimals.includes(animal.animalId)) {
            setSelectedAnimal(animal);
            setShowConfirmation(true);
        }
    }

    const handleUpload = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                'api/user/select-animal',
                {
                    animalId: selectedAnimal.animalId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSelectedPicture(selectedAnimal.animal_image);
            setShowConfirmation(false);
            setIsProfilePictureModalOpen(false);
        } catch (error) {
            console.error('Error selecting profile picture:', error);
            alert('프로필 사진 선택 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    }

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    const handleTabChange = (value) => {
        setSelectedTab(value);
    };

    const checkNicknameAvailability = async () => {
        if (nickname.trim() === '') {
            setNicknameError('닉네임을 입력해주세요.');
            setIsNicknameAvailable(null);
            return;
        }

        if (!isValidNickname(nickname)) {
            setNicknameError('유효하지 않은 닉네임입니다.');
            setIsNicknameAvailable(false);
            return;
        }

        try {
            const response = await axios.post('/api/user/check-nickname', { nickname });
            setIsNicknameAvailable(response.data.isAvailable);
            setNicknameError(''); // Clear the error message

            if (response.data.isAvailable) {
                setUpdatedInfo((prevInfo) => ({
                    ...prevInfo,
                    userNickname: nickname,
                }));
            }
        } catch (error) {
            console.error('Nickname check error:', error);
            alert('닉네임 중복 확인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const isValidNickname = (nickname) => {
        const invalidPattern = /^[ㄱ-ㅎㅏ-ㅣ]+$/; // 한글 자음/모음만으로 이루어진 닉네임 방지
        return nickname.length >= 2 && nickname.length <= 12 && !invalidPattern.test(nickname);
    };

    const isValidBirthdate = (date) => {
        if (!/^\d{8}$/.test(date)) return false;
        const year = parseInt(date.slice(0, 4), 10);
        const month = parseInt(date.slice(4, 6), 10);
        const day = parseInt(date.slice(6, 8), 10);

        if (year < 1900 || year > new Date().getFullYear()) return false;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;

        const dateObj = new Date(`${year}-${month}-${day}`);
        return dateObj && dateObj.getMonth() + 1 === month && dateObj.getDate() === day;
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setSelectedAnimal(null);
    }

    const totalAnimals = animals.length;
    const emptySlots = Array(50 - totalAnimals).fill({});
    const filledAnimals = [...animals, ...emptySlots];

    return (
        <>
            <Header/>
            <Window style={{width: '70%', height: '550px', margin: '0 auto', marginTop: '20px'}}>
                <WindowHeader>
                    <span role="img" aria-label="my-page">🗂️ My Page</span>
                </WindowHeader>
                <WindowContent>
                    {!isProfilePictureModalOpen && !isItemModalOpen && (
                    <Tabs value={selectedTab} onChange={handleTabChange}>
                        <StyledTab value={0} style={{minWidth: '120px', textAlign: 'center'}}>내 정보</StyledTab>
                        <StyledTab value={1} style={{minWidth: '120px', textAlign: 'center'}}>내 정보 수정</StyledTab>
                        <StyledTab value={2} style={{minWidth: '120px', textAlign: 'center'}}>회원 탈퇴</StyledTab>
                        <StyledTab value={3} style={{minWidth: '120px', textAlign: 'center'}}>내 글 목록</StyledTab>
                        <StyledTab value={4} style={{minWidth: '120px', textAlign: 'center'}}>내가 쓴 댓글</StyledTab>
                        <StyledTab value={5} style={{minWidth: '120px', textAlign: 'center'}}>내 FAQ</StyledTab>
                        {!userInfo.slogin &&
                            <StyledTab value={6} style={{minWidth: '120px', textAlign: 'center'}}>비밀번호 변경</StyledTab>}
                    </Tabs>
                    )}
                    <TabBody>
                        {selectedTab === 0 && (
                            <div className="mypage-content">
                                <div className="profile-section">
                                    <div className="profile-name">{userInfo.userNickname}</div>
                                    <div className="profile-image-wrapper nes-pointer"
                                         onClick={openProfilePictureModal}>
                                        <img src={selectedPicture || userInfo.userPicture} alt="프로필"
                                             className="profile-image"/>
                                    </div>
                                    <div className="profile-icon-wrapper">
                                        <img src={getTierIcon(userInfo.userGrade)} alt="티어 아이콘"
                                             className="profile-icon"/>
                                    </div>
                                </div>
                                <div className="info-section">
                                    <div className="info-item">
                                        <span className="info-label">이름</span>
                                        <span className="info-value">{userInfo.userRealname}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">이메일</span>
                                        <span className="info-value">{userInfo.userEmail}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">생년월일</span>
                                        <span className="info-value">{userInfo.userBirthdate}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">포인트</span>
                                        <span className="info-value">{userInfo.userPoint} 포인트</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">루비</span>
                                        <span className="info-value">{userInfo.userRuby} 루비</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">아이템</span>
                                        <span className="info-value-item nes-pointer" onClick={openItemModal}>
                                {userInfo.userItems.length} 개
                            </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {selectedTab === 1 && (
                            <div className="modal-content">
                                <div className="modal-item">
                                    <label>이름</label>
                                    <input
                                        type="text"
                                        value={updatedInfo.userRealname}
                                        onChange={(e) => setUpdatedInfo({...updatedInfo, userRealname: e.target.value})}
                                    />
                                </div>
                                <div className="modal-item">
                                    <label className="mypage-nick">닉네임</label>
                                    <div className="mypage-nick-change">
                                        <input type="text" value={updatedInfo.userNickname} className="mypage-nickname" onChange={(e) => setNickname(e.target.value)}
                                               placeholder="닉네임"/>
                                        <button type="button" id="check-nickname-button" className="nes-btn"
                                                onClick={checkNicknameAvailability}>중복 확인
                                        </button>
                                    </div>
                                    {nicknameError && <div id="mypage-nick-error">{nicknameError}</div>}
                                    {!nicknameError && isNicknameAvailable === false && <div id="mypage-nick-error">이미 사용 중인 닉네임입니다...</div>}
                                    {!nicknameError && isNicknameAvailable === true && <div id="mypage-nick-success">사용 가능한 닉네임입니다!!!</div>}
                                </div>
                                <div className="modal-item">
                                    <label>생년월일</label>
                                    <input
                                        type="text"
                                        value={updatedInfo.userBirthdate}
                                        onChange={(e) => setUpdatedInfo({
                                            ...updatedInfo,
                                            userBirthdate: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="modal-buttons">
                                    <button className="nes-btn is-primary" id="mypage-modal-btn"
                                            onClick={openEditModal}>수정
                                    </button>
                                </div>
                            </div>
                        )}
                        {selectedTab === 2 && (
                            <div>
                                <h1 className="delete-notice">회원 탈퇴 시 주의 사항</h1>
                                <div className="delete-content">회원님이 등록하신 개인 정보는 삭제되어 재사용하지 않습니다.</div>
                                <div className="delete-content">회원 탈퇴 시 결제하신 상품과 재화는 복구되지 않습니다.</div>
                                <div className="delete-content">회원 탈퇴하시면 계정을 복구 받으실 수 없습니다.</div>
                                <div className="delete-content">주의 사항을 읽으시고 회원 탈퇴를 결심하셨다면 아래의 회원 탈퇴 버튼을 클릭해주세요.</div>
                                <button className="nes-btn is-error" id="mypage-btn" onClick={openDeleteModal}>
                                    회원 탈퇴
                                </button>
                            </div>
                        )}
                        {selectedTab === 3 && (
                            <div className="mypage-content-page">
                                <table className="mypage-table">
                                    <thead>
                                    <tr>
                                        <th>글 제목</th>
                                        <th>게시판</th>
                                        <th>태그</th>
                                        <th>작성 날짜</th>
                                        <th>댓글 수</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentPosts.map((post) => {
                                        const boardType = post.type === 'free' ? '자유' : post.type === 'notice' ? '공지' : post.type;

                                        return (
                                            <tr key={post.bcId}>
                                                <td><a href={`/board/detail/${post.bcId}`}>{post.title}</a></td>
                                                <td>{boardType}</td>
                                                <td>{post.bcCode}</td>
                                                <td>{post.writeDate}</td>
                                                <td>{post.comments.length}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                                <div className="mypage-pagination">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        이전
                                    </button>
                                    {Array.from({length: Math.ceil(myPosts.length / postsPerPage)}, (_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => paginate(index + 1)}
                                            className={currentPage === index + 1 ? 'active' : ''}
                                            id="page-num"
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(myPosts.length / postsPerPage)}
                                    >
                                        다음
                                    </button>
                                </div>
                            </div>
                        )}
                        {selectedTab === 4 && <div>내가 쓴 댓글 내용</div>}
                        {selectedTab === 5 && <div>FAQ 내용</div>}
                        {selectedTab === 6 && !userInfo.slogin && (
                            <div className="modal-content">
                                <div className="modal-item">
                                    <label>현재 비밀번호</label>
                                    <input
                                        type="password"
                                        value={passwordInfo.currentPassword}
                                        onChange={(e) => setPasswordInfo({
                                            ...passwordInfo,
                                            currentPassword: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="modal-item">
                                    <label>새 비밀번호</label>
                                    <input
                                        type="password"
                                        value={passwordInfo.newPassword}
                                        onChange={(e) => setPasswordInfo({
                                            ...passwordInfo,
                                            newPassword: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="modal-item">
                                    <label>비밀번호 확인</label>
                                    <input
                                        type="password"
                                        value={passwordInfo.confirmPassword}
                                        onChange={(e) => setPasswordInfo({
                                            ...passwordInfo,
                                            confirmPassword: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="modal-buttons">
                                    <button className="nes-btn is-primary" id="mypage-modal-btn"
                                            onClick={openChangePasswordModal}>변경
                                    </button>
                                </div>
                            </div>
                        )}
                    </TabBody>
                </WindowContent>
            </Window>
            <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal} className="modal">
                <div className="modal-content">
                    <p>정말 회원 정보를 수정하시겠습니까?</p>
                    <div className="modal-buttons">
                        <button className="nes-btn is-error" id="mypage-modal-btn" onClick={handleUpdate}>수정</button>
                        <button className="nes-btn" id="mypage-modal-btn" onClick={closeEditModal}>닫기</button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isChangePasswordModalOpen} onRequestClose={closeChangePasswordModal} className="modal">
                <div className="modal-content">
                    <p>정말 비밀번호를 변경하시겠습니까?</p>
                    <div className="modal-buttons">
                        <button className="nes-btn is-error" id="mypage-modal-btn" onClick={handleChangePassword}>변경
                        </button>
                        <button className="nes-btn" id="mypage-modal-btn" onClick={closeChangePasswordModal}>닫기</button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal} className="modal">
                <h2 className="modal-title">회원 탈퇴</h2>
                <div className="modal-content">
                    <p>정말 탈퇴하시겠습니까?</p>
                    <div className="modal-buttons">
                        <button className="nes-btn is-error" id="mypage-modal-btn" onClick={handleDelete}>탈퇴</button>
                        <button className="nes-btn" id="mypage-modal-btn" onClick={closeDeleteModal}>닫기</button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isProfilePictureModalOpen} onRequestClose={closeProfilePictureModal} className="animal-modal">
                <div className="mypage-animal-modal-content">
                    <div className="mypage-animal-list">
                        {filledAnimals.map((animal, index) => (
                            <div
                                key={index}
                                className={`mypage-animal-card ${
                                    ownedAnimals.includes(animal.animalId) ? 'owned' : 'locked'
                                }`}
                                onMouseEnter={() => setHoveredAnimal(animal)}
                                onMouseLeave={() => setHoveredAnimal(null)}
                                onClick={() => handleProfilePictureSelect(animal)}
                            >
                                <div className="mypage-animal-image-container">
                                    {animal.animalImage ? (
                                        <img src={animal.animalImage} alt={animal.animalName} />
                                    ) : (
                                        <div className="placeholder-image">No Image</div>
                                    )}
                                </div>
                                <div className="mypage-animal-id">No.{animal.animalId || '-'}</div>
                                <div className="mypage-animal-name">{animal.animalName || '빈 슬롯'}</div>
                            </div>
                        ))}
                    </div>
                    {hoveredAnimal && (
                        <div className="mypage-animal-alert-container show">
                            <div className="mypage-animal-alert-box">
                                <div className="mypage-animal-alert-title">
                                    {hoveredAnimal.animalName || '빈 슬롯'}
                                </div>
                                <div className="mypage-animal-alert-message">
                                    {hoveredAnimal.animalDescription || '설명 없음'}
                                    <br />
                                    확률: {hoveredAnimal.animalProbability || '미정'}
                                </div>
                            </div>
                        </div>
                    )}
                    {showConfirmation && (
                        <div className="mypage-confirmation-dialog">
                            <div className="mypage-confirmation-dialog-box">
                                <div className="mypage-confirmation-dialog-title">안내</div>
                                <div className="mypage-confirmation-dialog-message">
                                    {selectedAnimal.animalName}을(를) 메인 캐릭터로 선택하시겠습니까?
                                </div>
                                <div className="mypage-confirmation-dialog-buttons">
                                    <button className="nes-btn" onClick={handleUpload}>
                                        확인
                                    </button>
                                    <button className="nes-btn" onClick={handleCancel}>
                                        취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
            <Modal
                isOpen={isItemModalOpen}
                onRequestClose={closeItemModal}
                className="mypage-modal-item"
                appElement={document.getElementById('root')} // 또는 root 요소 설정
            >
                <h2 className="modal-item-title">보유 아이템 목록</h2>
                <div className="modal-item-content">
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <div key={index} className="modal-user-item">
                                <img src={item.itemImage} className="modal-item-image"/>
                                <div className="modal-item-info">
                                    <div className="modal-item-name">{item.itemName} ({item.count}개)</div>
                                    <div className="modal-item-description">{item.itemDescription}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>보유한 아이템이 없습니다.</p>
                    )}
                </div>
                <button className="nes-btn is-error" id="mypage-item-modal-btn" onClick={closeItemModal}>닫기</button>
            </Modal>
            <Footer/>
        </>
    );
};
export default Mypage
