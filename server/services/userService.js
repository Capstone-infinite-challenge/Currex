import User from '../models/user.js';

//사용자 로그인 아이디로 찾아서 사용자 정보(닉네임, 프로필사진, 내주소, 거래주소) 반환
const findUserInfo = async(userId) => {
    if(!userId){
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    try{
      const user = await User.findOne({loginId: userId});
  
      if (!user) {
        throw new Error("해당 사용자 정보가 없습니다.");
      }
      
      const userInfo = {
        id: user._id,
        name: user.nickname, 
        img: user.profile_img, 
        address: user.address, 
        tradeAddress: user.tradeAddress,
        latitude: user.tradeAddress_latitude,
        longitude: user.tradeAddress_longitude 
      };
  
      return userInfo;
    }catch(error){
      console.log(error);
      throw new Error('사용자를 찾는 도중 문제가 발생하였습니다.');
    }
  };

//사용자의 주소 업데이트 - 마이페이지
const updateAddress = async (userId, addr1, addr2, lat, lon) => {
  try {
    const user = await User.findOne({ loginId: userId });

    const updateFields = {};
    if (addr1 !== user.address) updateFields.address = addr1;
    if (addr2 !== user.tradeAddress) updateFields.tradeAddress = addr2;
    if (lat !== user.tradeAddress_latitude) updateFields.tradeAddress_latitude = lat;
    if (lon !== user.tradeAddress_longitude) updateFields.tradeAddress_longitude = lon;

    if (Object.keys(updateFields).length > 0) {
      await User.updateOne({ loginId: userId }, { $set: updateFields });
    }

    return '주소가 성공적으로 업데이트 되었습니다.';
  } catch (error) {
    console.error(error);
    throw new Error('주소 업데이트 도중 에러가 발생하였습니다.');
  }
};

//사용자의 거래주소만 업데이트
const updateTradeAddress = async(userId, addr, lat, lon) => {
  try{
    const user = await User.findOne({ loginId: userId });

    //사용자 정보 업데이트
    user.tradeAddress = addr;
    user.tradeAddress_latitude = lat;
    user.tradeAddress_longitude = lon;

    await user.save();
    return '구매자의 거래주소가 성공적으로 업데이트 되었습니다.';
  }catch(error){
    console.error(error);
    throw new Error('거래 주소 업데이트 중 에러가 발생하였습니다.');
  }
};

export default{
    findUserInfo,
    updateAddress,
    updateTradeAddress
};