import jwt from '../utils/jwt.js';
import User from '../models/user.js';

// 카카오 로그인 또는 회원가입 처리
async function loginOrSignupKakaoUser(kakaoUserInfo) {
  try {
    console.log("🔍 카카오에서 받은 유저 정보:", kakaoUserInfo);

    const { id: kakaoId, kakao_account } = kakaoUserInfo;
    const nickname = kakao_account?.profile?.nickname || '익명의사용자';

    let user = await User.findOne({ loginId: kakaoId });

    // 리프레시 토큰 만료시간 설정 (7일)
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // ✅ 수정됨

    if (!user) {
      console.log("새로운 유저 생성");
      user = new User({
        loginId: kakaoId,
        nickname,
        refreshToken: jwt.generateRefreshToken(),
        refreshTokenExpiresAt,
      });
      await user.save();
    } else {
      console.log("기존 유저 로그인");
      if (!user.refreshToken || user.refreshTokenExpiresAt < new Date()) {
        console.log("리프레시 토큰 재발급");
        user.refreshToken = jwt.generateRefreshToken();
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;
        await user.save();
      }
    }

    const token = jwt.generateToken({ id: user.loginId, nickname: user.nickname }); // ✅ 수정됨

    console.log("로그인 성공, 발급된 토큰:", token);
    return { user, token, refreshToken: user.refreshToken };

  } catch (error) {
    console.error('카카오 로그인/회원가입 에러:', error);
    console.error('상세 오류:', error.stack);
    throw new Error(`카카오 로그인 처리 중 오류: ${error.message}`);
  }
}



//구글 로그인 또는 회원가입 처리
async function loginOrSignupGoogleUser(googleUserInfo){
  const { google_account, name } = googleUserInfo;

  try{
    if (!google_account) {
      throw new Error('Invalid Google Account: loginId is missing.');
    }

    let user = await User.findOne({ loginId: google_account });

    // 리프레시 토큰 만료시간 설정 (7일)
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); 

    if(!user){
      user = new User({
        loginId: google_account,
        nickname: name,
        refreshToken: jwt.generateRefreshToken(),
        refreshTokenExpiresAt,
      });
      await user.save();
    }else{
      if(!user.refreshToken || user.refreshTokenExpiresAt < new Date()) {
        user.refreshToken = jwt.generateRefreshToken();
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;
        await user.save();
      }
    }
    const token = jwt.generateToken({id: user.loginId, nickname: user.nickname}); 
    return { user, token, refreshToken: user.refreshToken };
  }catch(error){
    console.error('구글 로그인/회원가입 에러:', error);
    throw new Error('구글 로그인/회원가입 처리 중 오류가 발생했습니다.');
  }
}



export {
  loginOrSignupKakaoUser,
  loginOrSignupGoogleUser,
};
