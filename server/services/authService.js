import { generateToken } from '../utils/jwt.js';
import User from '../models/user.js';

// 카카오 로그인 또는 회원가입 처리
async function loginOrSignupKakaoUser(kakaoUserInfo) {
  const { id: kakaoId, kakao_account } = kakaoUserInfo;
  const nickname = kakao_account.profile.nickname || null;

  try {
    let user = await User.findOne({ loginId: kakaoId });
    
    if (!user) {
      user = new User({
        loginId: kakaoId,
        nickname
      });
      await user.save();
    }
    
    const token = generateToken({ id: user.loginId, nickname: user.nickname });
    return { user, token };
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

    if(!user){
      user = new User({
        loginId: google_account,
        nickname: name
      });
      await user.save();
    }
    const token = generateToken({id: user.loginId, nickname: user.nickname});
    return { user, token };
  }catch(error){
    console.error('구글 로그인/회원가입 에러:', error);
    throw new Error('구글 로그인/회원가입 처리 중 오류가 발생했습니다.');
  }
}


export {
  loginOrSignupKakaoUser,
  loginOrSignupGoogleUser,
};
