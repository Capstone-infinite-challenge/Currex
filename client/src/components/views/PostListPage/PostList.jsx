import React from "react";
import styled from "styled-components";


function PostList() {
  const posts = [
    {
      id: 1,
      currency: "JPY",
      amount: "$4,010",
      distance: "120m",
      won: "37,436.56원",
      location: "마포구 대흥동",
      reserved: false,
      image: "../../images/post1.jpg",
    },
    {
      id: 2,
      currency: "USD",
      amount: "$205.32",
      distance: "450m",
      won: "159,630.48원",
      location: "서대문구 대현동",
      reserved: true,
      image: "../../images/post2.jpg",
    },
    {
      id: 3,
      currency: "EUR",
      amount: "€108",
      distance: "972m",
      won: "159,630.48원",
      location: "마포구 대흥동",
      reserved: false,
      image: "../../images/post3.jpg",
    },
    {
      id: 4,
      currency: "TWD",
      amount: "$23,977",
      distance: "1.3km",
      won: "1,031,970.08원",
      location: "서대문구 대현동",
      reserved: false,
      image: "../../images/post4.jpg",
    },
  ];

  return (
    <Container>
      <Header>
        <Title>목록</Title>
        <Filters>
          <Filter>국가 전체</Filter>
          <Filter selected>금액 범위 20 - 30만원</Filter>
          <Filter>거래장소 전체</Filter>
        </Filters>
        <Total>Total <span>412</span></Total>
      </Header>

      <PostListContainer>
        {posts.map((post) => (
          <Post key={post.id}>
            <ImageContainer>
              <PostImage src={post.image} alt={`${post.currency} image`} />
              {post.reserved && <ReservedLabel>예약중</ReservedLabel>}
            </ImageContainer>
            <PostInfo>
              <Amount>{post.amount}</Amount>
              <Details>
                <Distance>{post.distance}</Distance>
                <Won>{post.won}</Won>
                <Location>{post.location}</Location>
              </Details>
            </PostInfo>
          </Post>
        ))}
      </PostListContainer>

      <Footer>
    
      </Footer>
    </Container>
  );
}

export default PostList;

const Container = styled.div`
  width: 375px;
  margin: 0 auto;
  font-family: "Pretendard", sans-serif;
`;

const Header = styled.div`
  padding: 16px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
`;

const Filters = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 0;
`;

const Filter = styled.button`
  padding: 8px 12px;
  border-radius: 16px;
  border: 1px solid ${(props) => (props.selected ? "#CA2F28" : "#ccc")};
  color: ${(props) => (props.selected ? "#CA2F28" : "#333")};
  background: ${(props) => (props.selected ? "#fff5f5" : "#fff")};
`;

const Total = styled.div`
  font-size: 14px;
  color: #666;
  span {
    font-weight: bold;
    color: #CA2F28;
  }
`;

const PostListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Post = styled.div`
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #eee;
  padding: 16px 0;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const PostImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

const ReservedLabel = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  background: #00aaff;
  color: #fff;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
`;

const PostInfo = styled.div`
  flex: 1;
`;

const Amount = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const Details = styled.div`
  font-size: 12px;
  color: #666;
`;

const Distance = styled.div`
  color: #CA2F28;
  margin-bottom: 4px;
`;

const Won = styled.div`
  margin-bottom: 4px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
  border-top: 1px solid #eee;
`;

const NavItem = styled.img`
  width: 24px;
  height: 24px;
`;
