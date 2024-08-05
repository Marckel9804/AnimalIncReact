import React, { useState } from "react";
import Modal from "react-modal";
import "../styles/login/MyPage.css"

const Mypage = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    return (
        <div className="mypage">
            <header className="mypage-header">
                <h1>마이페이지</h1>
            </header>
            <div className="mypage-content">
                <div className="profile-section">
                    <img src="path/to/profile-image.jpg" alt="프로필" className="profile-image" />
                    <div className="profile-name">hide on bush</div>
                    <img src="path/to/rabbit-image.jpg" alt="토끼" className="profile-icon" />
                    <div className="profile-score">280</div>
                </div>
                <div className="info-section">
                    <div className="info-item">
                        <span className="info-label">Name</span>
                        <span className="info-value">홍길동</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">abc@gmail.com</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Birth</span>
                        <span className="info-value">24-06-19</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Points</span>
                        <span className="info-value">0 point</span>
                    </div>
                    <div className="button-section">
                        <button className="nes-btn is-primary" onClick={openEditModal}>정보 수정</button>
                        <button className="nes-btn is-error" onClick={openDeleteModal}>회원 탈퇴</button>
                    </div>
                </div>
            </div>
            <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal} className="modal">
                <h2>정보 수정</h2>
                {/* 정보 수정 폼 */}
                <button onClick={closeEditModal}>닫기</button>
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal} className="modal">
                <h2>회원 탈퇴</h2>
                {/* 회원 탈퇴 확인 폼 */}
                <button onClick={closeDeleteModal}>닫기</button>
            </Modal>
        </div>
    );
};

export default Mypage;
