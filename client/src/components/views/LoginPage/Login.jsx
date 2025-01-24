import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../images/currexlogo.png";
import kakaoIcon from "../../images/kakaoicon.svg";
import googleIcon from "../../images/googleicon.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 쿼리 파라미터 가져옴
  const [loginInfo, setLoginInfo] = useState(null);

  console.log("this code is now functioning"); // 마운팅 확인용

  // 카카오 로그인 요청 URL
  const KAKAO_AUTH_URL = "http://localhost:5000/auth/kakao";

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const loginId = urlParams.get("loginId");
    const nickname = urlParams.get("nickname");
    const state = urlParams.get("state");
    const storedState = sessionStorage.getItem("oauthState");

    // state 값 검증
    if (state && storedState !== state) {
      console.error("State 값이 일치하지 않습니다. 보안 문제가 발생했습니다.");
      alert("로그인 과정에서 오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    if (token && loginId && nickname) {
      setLoginInfo({ token, loginId, nickname });
      console.log("토큰:", token);
      console.log("로그인 ID:", loginId);
      console.log("닉네임:", nickname);

      // 토큰 저장
      sessionStorage.setItem("token", token);

      navigate("/list");
    } else {
      console.log("로그인 정보가 없습니다.");
    }
  }, [navigate, location]);

  const generateState = () => {
    return [...Array(16)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  };

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
      // Google OAuth 요청 URL 생성
      const state = generateState();
      sessionStorage.setItem("oauthState", state); // 브라우저에 state 값 저장
      const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // .env에서 클라이언트 ID 가져오기
      const GOOGLE_REDIRECT_URI = "http://localhost:5000/auth/google/callback";
      const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email&state=${state}`;

      window.location.href = GOOGLE_AUTH_URL; // Google OAuth로 리다이렉트
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
