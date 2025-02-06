import User from '../models/user.js';

//사용자 찾아서 사용자 정보(닉네임, 프로필사진, 내주소, 거래주소) 반환
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
        name: user.nickname, 
        img: user.profile_img, 
        address: user.address, 
        tradeAddress: user.tradeAddress 
      };
  
      return userInfo;
    }catch(error){
      console.log(error);
      throw new Error('사용자를 찾는 도중 문제가 발생하였습니다.');
    }
  };
  

//사용자의 주소 업데이트
const updateAddress = async(userId, addr1, addr2, lat, lon) => {
    try{
        const user = await User.findOne({loginId: userId});

        if(addr1 !== user.address || !user.address){
            await User.updateOne(
              { loginId: userId },
              { address: addr1 }
            );
        }else if((!addr2) || (addr2 !== user.tradeAddress) || (lat !== user.tradeAddress_latitude) || (lon !== user.tradeAddress_longtitude)){
            await User.updateOne(
              { loginId: userId },
              { tradeAddress: addr2,
                tradeAddress_latitude: lat,
                tradeAddress_longtitude: lon
              }
            );        
        }
        return '주소가 성공적으로 업데이트 되었습니다.';
    }catch{
      throw new Error('주소 업데이트 도중 에러가 발생하였습니다.');
    }
};

export {
    findUserInfo,
    updateAddress
}