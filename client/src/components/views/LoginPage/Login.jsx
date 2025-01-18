import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import logo from "../../images/currexlogo.png";
import kakaoIcon from "../../images/kakaoicon.svg";
import googleIcon from "../../images/googleicon.png";

function Login() {
  const navigate = useNavigate();

  // 카카오 로그인 요청 URL
  const KAKAO_AUTH_URL = "http://localhost:5000/auth/kakao";

  useEffect(() => {
    // 로그인 후 리다이렉션된 URL에서 token, loginId, nickname 추출
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const loginId = urlParams.get("loginId");
    const nickname = urlParams.get("nickname");

    if (token) {
      // JWT 토큰을 로컬 스토리지에 저장
      localStorage.setItem("token", token);

      // 유저 정보를 저장하거나 사용할 수 있음
      console.log("로그인 ID:", loginId);
      console.log("닉네임:", nickname);

      // 판매 목록 페이지로 이동
      navigate("/list");
    }
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("토큰:", urlParams.get("token"));
    console.log("로그인 ID:", urlParams.get("loginId"));
    console.log("닉네임:", urlParams.get("nickname"));
  }, []);
  

  const handleKakaoLogin = () => {
    // 백엔드의 카카오 로그인 URL로 리다이렉트
    window.location.href = KAKAO_AUTH_URL;
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
          <SocialIcon src={kakaoIcon} alt="Kakao Login" onClick={handleKakaoLogin} />
          <SocialIcon src={googleIcon} alt="Google Login" />
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
