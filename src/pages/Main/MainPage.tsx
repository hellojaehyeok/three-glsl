import useShaderEffectImages from 'hook/useShaderEffectImage';
import Card1 from 'images/card-1.jpg';
import Card2 from 'images/card-2.jpg';
import Card3 from 'images/card-3.jpg';
import Card4 from 'images/card-4.jpg';

const CardList = [Card1, Card2, Card3, Card4];

const MainPage = () => {
  useShaderEffectImages();

  return (
    <main>
      <div className="scrollable">
        {CardList.map(src => (
          <div className="image-container" key={src}>
            <h1>Threeejs</h1>
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </main>
  );
};

export default MainPage;
