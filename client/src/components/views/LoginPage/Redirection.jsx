import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Redirection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 Authorization Code 추출
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      // 백엔드로 Authorization Code 전달
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/auth/kakao/callback`, { code })
        .then((response) => {
          console.log('로그인 성공:', response.data);

          // 받은 정보를 로컬 스토리지에 저장 (또는 세션 스토리지)
          const { token, loginId, nickname } = response.data;
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('loginId', loginId);
          sessionStorage.setItem('nickname', nickname);

          // 로그인 성공 페이지로 이동
          navigate('/loginSuccess');
        })
        .catch((error) => {
          console.error('로그인 실패:', error);
          alert('로그인 중 오류가 발생했습니다.');
        });
    }
  }, [navigate]);

  return <div>로그인 중입니다. 잠시만 기다려 주세요...</div>;
};

export default Redirection;
