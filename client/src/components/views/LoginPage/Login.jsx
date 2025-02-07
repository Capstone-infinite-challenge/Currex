import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../images/currexlogo.png";
import kakaoIcon from "../../images/kakaoicon.svg";
import googleIcon from "../../images/googleicon.png";
import api from "../../utils/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const accessToken = urlParams.get("token"); 
    const loginId = urlParams.get("loginId");
    const nickname = urlParams.get("nickname");

    if (accessToken) {
        console.log("프론트에서 받은 accessToken:", accessToken);
        sessionStorage.setItem("accessToken", accessToken);
        navigate("/list"); 
    } else {
        console.log("accessToken 없음, 로그인 필요");
    }
  }, [location, navigate]);

  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/kakao";
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
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
          <SocialIcon src={googleIcon} alt="Google Login" onClick={handleGoogleLogin} />
        </IconsWrapper>
      </SocialLoginContainer>
    </Container>
  );
}

export default Login;

// 스타일 코드 생략

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
