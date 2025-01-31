import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../images/currexlogo.png";
import kakaoIcon from "../../images/kakaoicon.svg";
import googleIcon from "../../images/googleicon.png";
import axios from 'axios'; 
import api from "../../utils/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 쿼리 파라미터 가져옴
  const [loginInfo, setLoginInfo] = useState(null);

  console.log("this code is now functioning"); // 마운팅 확인용

  // 카카오 로그인 요청 URL
  const KAKAO_AUTH_URL = "http://localhost:5000/auth/kakao";

  // 구글 로그인 요청 URL
  const GOOGLE_AUTH_URL = "http://localhost:5000/auth/google";

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const accessToken = urlParams.get("token"); // 백엔드에서 JWT 토큰을 쿼리 스트링으로 전달
    const loginId = urlParams.get("loginId");
    const nickname = urlParams.get("nickname");

    if (accessToken) {
        console.log("프론트에서 받은 accessToken:", accessToken);
        sessionStorage.setItem("accessToken", accessToken);

        navigate("/list"); // 로그인 성공 후 /list 페이지로 이동
    } else {
        console.log("accessToken 없음, 로그인 필요");
    }
}, [location, navigate]);




  const handleKakaoLogin = () => {
    try {
      window.location.href = KAKAO_AUTH_URL;
    } catch (error) {
      console.error("카카오 로그인 중 오류 발생:", error);
      alert("로그인 시도 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleGoogleLogin = () => {
    try {
      window.location.href = GOOGLE_AUTH_URL;
    } catch (error) {
      console.error("구글 로그인 중 오류 발생:", error);
      alert("로그인 시도 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };
  

  return (
    <Container>
      <LogoContainer>
        <Logo src={logo} alt="Logo" />
        <AppName>CURREX</AppName>
      </LogoContainer>
      <SocialLoginContainer>
        <LoginText>Sign up with Social Networks</LoginText>
        <IconsWrapper>
          <SocialIcon
            src={kakaoIcon}
            alt="Kakao Login"
            onClick={handleKakaoLogin}
          />
          <SocialIcon
            src={googleIcon}
            alt="Google Login"
            onClick={handleGoogleLogin}
          />
        </IconsWrapper>
      </SocialLoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Pretendard", sans-serif;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const Logo = styled.img`
  width: 90%;
  height: 90%;
  margin-bottom: 20px;
`;

const AppName = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #e63946;
`;

const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginText = styled.p`
  font-size: 14px;
  color: #c4c4c4;
  margin-bottom: 20px;
`;

const IconsWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const SocialIcon = styled.img`
  width: 100%;
  height: 100%;
  cursor: pointer;
`;
