import { Router } from 'express';
import axios from 'axios';
import qs from 'querystring';
import { loginOrSignupKakaoUser} from '../services/authService.js'; // 서비스 호출
const router = Router();


const kakao = {
    CLIENT_ID: process.env.REST_API_KEY,
    REDIRECT_URI: process.env.REDIRECT_URI,
  };


const blacklist = new Set();


// 카카오 로그인 요청 처리
router.get('/kakao', (req, res) => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.CLIENT_ID}&redirect_uri=${kakao.REDIRECT_URI}&response_type=code`;
    res.redirect(KAKAO_AUTH_URL);
});
  
router.get('/kakao/callback', async (req, res) => {
    try {
      const tokenResponse = await axios({
        method: 'POST',
        url: 'https://kauth.kakao.com/oauth/token',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
          grant_type: 'authorization_code',
          client_id: kakao.CLIENT_ID,
          redirect_uri: kakao.REDIRECT_URI,
          code: req.query.code,
        }),
      });
  
      const accessToken = tokenResponse.data.access_token;
      console.log('Access Token:', accessToken);                //점검용1

      const userResponse = await axios({
        method: 'GET',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const kakaoUserInfo = {
        id: userResponse.data.id.toString(),
        kakao_account: userResponse.data.kakao_account,
      };

      const { user, token } = await loginOrSignupKakaoUser(kakaoUserInfo);

      // JWT 토큰을 HttpOnly 쿠키에 저장
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 3600000 // 1시간
      });

      console.log('user Data:', user.loginId, user.nickname);           //점검용2

      // 클라이언트 리다이렉션 URL (프론트엔드 주소로 변경해야 함)
      const clientRedirectUrl = `http://localhost:3000/?token=${encodeURIComponent(token)}&loginId=${encodeURIComponent(user.loginId)}&nickname=${encodeURIComponent(user.nickname)}`;

      // 클라이언트로 리다이렉션
      res.redirect(clientRedirectUrl);

    } catch (error) {
      console.error('카카오 로그인 에러:', error);
      console.error(error.message);
      console.error('Error getting Kakao token:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: '카카오 로그인 처리 중 오류가 발생했습니다.',
        data: error.data,
       });
    }
  });


  router.post('/kakaologout', async (req, res) => {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      if (accessToken) {
        // 카카오 로그아웃 API 호출
        await axios.post('https://kapi.kakao.com/v1/user/logout', null, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        // 토큰 블랙리스트 추가 (선택적)
        blacklist.add(accessToken);
      }
      
      // 쿠키 제거
      res.clearCookie('token');
  
      res.status(200).json({ 
        success: true, 
        message: '로그아웃 처리가 완료되었습니다.' 
      });
    } catch (error) {
      console.error('카카오 로그아웃 에러:', error);
      res.status(500).json({ 
        success: false, 
        message: '로그아웃 처리 중 오류가 발생했습니다.' 
      });
    }
});
  

export default router;
