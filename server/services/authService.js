import jwt from '../utils/jwt.js';
import User from '../models/user.js';

// 카카오 로그인 또는 회원가입 처리
async function loginOrSignupKakaoUser(kakaoUserInfo) {
  const { id: kakaoId, kakao_account } = kakaoUserInfo;
  const nickname = kakao_account.profile.nickname || '익명의사용자';

  try {
    let user = await User.findOne({ loginId: kakaoId });
    
    //리프레시 토큰 만료시간 설정(7일)
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshToken.getDate()+7);

    if (!user) {
      user = new User({
        loginId: kakaoId,
        nickname,
        refreshToken: jwt.generateRefreshToken(),  //처음 가입 시 저장
        refreshTokenExpiresAt,
      });
      await user.save();
    }else{
      // 기존 유저의 리프레시 토큰이 만료되었는지 확인
      if(!user.refreshToken || user.refreshTokenExpiresAt < new Date()) {
        user.refreshToken = jwt.generateRefreshToken();
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;
        await user.save();
      }
    }
    
    const token = jwt.generateToken({ id: user.loginId, nickname: user.nickname });

    return { user, token, refreshToken: user.refreshToken };
  } catch (error) {
    console.error('카카오 로그인/회원가입 에러:', error);
    throw new Error('카카오 로그인/회원가입 처리 중 오류가 발생했습니다.');
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

    //리프레시 토큰 만료시간 설정(7일)
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshToken.getDate()+7);

    if(!user){
      user = new User({
        loginId: google_account,
        nickname: name,
        refreshToken: jwt.generateRefreshToken(),  //처음 가입 시 저장
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
    const token = generateToken({id: user.loginId, nickname: user.nickname});
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
