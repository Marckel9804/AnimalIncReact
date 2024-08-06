import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import axios from '../utils/axios.js'
import '../styles/login/MyPage.css'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

Modal.setAppElement('#root') //모달을 앱 요소로 설정

const Mypage = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [updatedInfo, setUpdatedInfo] = useState({
    userNickname: '',
    userRealname: '',
    userBirthdate: '',
  })
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
      fetchUserInfo()
  }, [navigate])

    if (!userInfo) {
        return <div>Loading...</div>
    }

    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const handleUpdate = async () => {
        try {
            const response = await axios.post(
                '/api/user/update-profile',
                updatedInfo,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            )
            setUserInfo(response.data);
            alert('정보가 업데이트되었습니다.');
            closeEditModal();
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
    const changePassword = async () => {
    }

    return (
        <>
            <Header />
            <div className="mypage">
                <header className="mypage-header">
                    <h1>마이페이지</h1>
                </header>
                <div className="mypage-content">
                    <div className="profile-section">
                        <img src="path/to/profile-image.jpg" alt="프로필" className="profile-image" />
                        <div className="profile-name">{userInfo.userNickname}</div>
                        <img src="path/to/rabbit-image.jpg" alt="토끼" className="profile-icon" />
                        <div className="profile-score">{userInfo.userGrade}</div>
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
                            <span className="info-value">{userInfo.userItem}</span>
                        </div>
                        <div className="button-section">
                            <button className="nes-btn is-primary" onClick={openEditModal}>정보 수정</button>
                            <button className="nes-btn is-warning" onClick={changePassword}>비밀번호 변경</button>
                            <button className="nes-btn is-error" onClick={openDeleteModal}>회원 탈퇴</button>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal} className="modal">
                    <h2>정보 수정</h2>
                    <div className="modal-content">
                        <div className="modal-item">
                            <label>닉네임</label>
                            <input
                                type="text"
                                value={updatedInfo.userNickname}
                                onChange={(e) => setUpdatedInfo({ ...updatedInfo, userNickname: e.target.value })}
                            />
                        </div>
                        <div className="modal-item">
                            <label>생년월일</label>
                            <input
                                type="text"
                                value={updatedInfo.userBirthdate}
                                onChange={(e) => setUpdatedInfo({ ...updatedInfo, userBirthdate: e.target.value })}
                            />
                        </div>
                        <button className="nes-btn is-primary" onClick={handleUpdate}>저장</button>
                        <button className="nes-btn" onClick={closeEditModal}>닫기</button>
                    </div>
                </Modal>
                <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal} className="modal">
                    <h2>회원 탈퇴</h2>
                    <div className="modal-content">
                        <p>정말로 탈퇴하시겠습니까?</p>
                        <button className="nes-btn is-error" onClick={handleDelete}>탈퇴</button>
                        <button className="nes-btn" onClick={closeDeleteModal}>닫기</button>
                    </div>
                </Modal>
            </div>
            <Footer />
        </>
    );
};
export default Mypage
