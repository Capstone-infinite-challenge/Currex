import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../images/currexlogo.png";
import kakaoIcon from "../../images/kakaoicon.svg";
import googleIcon from "../../images/googleicon.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation(); //현재 URL 쿼리 파라미터 가져옴
  const [loginInfo, setLoginInfo] = useState(null);

  console.log("this code is now functioning");    //마운팅 확인용

  // 카카오 로그인 요청 URL
  const KAKAO_AUTH_URL = "http://localhost:5000/auth/kakao";

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const loginId = urlParams.get("loginId");
    const nickname = urlParams.get("nickname");

    if (token && loginId && nickname) {
      setLoginInfo({ token, loginId, nickname });
      console.log("토큰:", token);
      console.log("로그인 ID:", loginId);
      console.log("닉네임:", nickname);

      // 토큰이 이미 쿠키에 저장되어 있다면 이 부분은 제거할 수 있습니다.
      sessionStorage.setItem("token", token);

      navigate("/list");
    } else {
      console.log("로그인 정보가 없습니다.");
    }
  }, [navigate, location]);

  

  const handleKakaoLogin = () => {
    // 백엔드의 카카오 로그인 URL로 리다이렉트
    try {
      window.location.href = KAKAO_AUTH_URL;
    } catch (error) {
      console.error("카카오 로그인 중 오류 발생:", error);
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
