import styled from '@emotion/styled';
import GlitchShaderImages from './components/GlitchShaderImages/GlitchShaderImages';

const GlitchScrollPage = () => {
  return (
    <Container>
      <GlitchShaderImages>
        <ImageList>
          {/* {CardList.map(src => (
            <Image src={src} alt="" key={src} width={300} height={500} />
          ))} */}
        </ImageList>
      </GlitchShaderImages>
    </Container>
  );
};

export default GlitchScrollPage;

const ImageList = styled.li`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 200px 0;
  gap: 200px;
`;

const Container = styled.div`
  background: #222222;

  .glitch-shader-images-container {
    position: fixed;
    width: 100%;
    height: 100vh;
  }

  .glitch-shader-images-scrollable {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    will-change: transform;
  }

  .glitch-shader-images-container canvas {
    position: fixed;
    z-index: -10;
    top: 0;
    left: 0;
  }
  .glitch-shader-images-container img {
    visibility: hidden;
  }
`;
