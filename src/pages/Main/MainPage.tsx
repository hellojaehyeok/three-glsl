import styled from '@emotion/styled';
import GlitchShaderImages from 'components/GlitchShaderImages/GlitchShaderImages';
import Card1 from 'images/card-1.jpg';
import Card2 from 'images/card-2.jpg';
import Card3 from 'images/card-3.jpg';
import Card4 from 'images/card-4.jpg';

const CardList = [Card1, Card2, Card3, Card4];

const MainPage = () => {
  return (
    <GlitchShaderImages>
      <ImageContainer>
        {CardList.map(src => (
          <Image src={src} alt="" key={src} />
        ))}
      </ImageContainer>
    </GlitchShaderImages>
  );
};

export default MainPage;

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 200px 0;
  gap: 200px;
`;

const Image = styled.img``;
