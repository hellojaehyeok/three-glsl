import Image from 'next/image';
import styled from '@emotion/styled';
import GlitchShaderImages from './components/GlitchShaderImages/GlitchShaderImages';

const imgList = [
  'https://github.com/hellojaehyeok/three-glsl/assets/62782245/44379426-c5c3-4e77-8350-f6990716a8e5',
  'https://github.com/hellojaehyeok/three-glsl/assets/62782245/b3860b97-f585-4ebe-a902-abac6a43f183',
  'https://github.com/hellojaehyeok/three-glsl/assets/62782245/42d522ce-b9ca-46c2-ad3f-dee3517731b7',
  'https://github.com/hellojaehyeok/three-glsl/assets/62782245/22496ff5-8f28-4a9d-965b-8af1f6c4a461',
];

const GlitchScrollPage = () => {
  return (
    <GlitchShaderImages background="222222">
      <ImageList>
        {imgList.map(src => (
          <Image src={src} alt="" key={src} width={300} height={500} />
        ))}
      </ImageList>
    </GlitchShaderImages>
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
