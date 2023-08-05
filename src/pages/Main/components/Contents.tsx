import * as THREE from 'three';
import Card1 from 'images/card-1.jpg';
import Card2 from 'images/card-2.jpg';
import Card3 from 'images/card-3.jpg';
import Card4 from 'images/card-4.jpg';
import { useEffect } from 'react';
import { fragmentShader } from './shader/fragmentShader';
import { vertexShader } from './shader/vertexShader';

const CardList = [Card1, Card2, Card3, Card4];

const Contents = () => {
  useThreejs();

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

export default Contents;

const useThreejs = () => {
  useEffect(() => {
    const scrollable = document.querySelector('.scrollable') as HTMLDivElement;
    const container = document.querySelector('main') as HTMLDivElement;
    const images = document.querySelectorAll('.image-container img') as NodeListOf<HTMLImageElement>;
    const meshItems: Array<{ updateMeshStatus: () => void }> = [];
    let perspective = 1000;
    const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, getViewport().aspectRatio, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    let current = 0;
    let target = 0;
    let ease = 0.07;
    function lerp(start: number, end: number, t: number) {
      return start * (1 - t) + end * t;
    }

    function smoothScroll() {
      target = window.scrollY;
      current = lerp(current, target, ease);
      scrollable.style.transform = `translate3d(0,${-current}px,0)`;
    }

    function getViewport() {
      let width = window.innerWidth;
      let height = window.innerHeight;
      let aspectRatio = width / height;
      return { width, height, aspectRatio };
    }

    function init() {
      document.body.style.height = `${scrollable.getBoundingClientRect().height}px`;
      camera.position.set(0, 0, perspective);
      renderer.setSize(getViewport().width, getViewport().height);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);
      images.forEach(img => {
        const meshItem = createMeshItem(img, scene);
        meshItems.push(meshItem);
      });
      render();
    }

    function onWindowResize() {
      document.body.style.height = `${scrollable.getBoundingClientRect().height}px`;
      camera.aspect = getViewport().aspectRatio;
      camera.updateProjectionMatrix();
      renderer.setSize(getViewport().width, getViewport().height);
    }
    function createMeshItem(element: HTMLImageElement, scene: THREE.Scene) {
      const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
      const texture = new THREE.TextureLoader().load(element.src);
      const uniforms = {
        uTexture: { value: texture },
        uOffset: { value: new THREE.Vector2(0, 0) },
        uAlpha: { value: 1 },
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        side: THREE.DoubleSide,
        fragmentShader,
        vertexShader,
      });

      const mesh = new THREE.Mesh(geometry, material);
      function getDimensions() {
        const { width, height, top, left } = element.getBoundingClientRect();
        const offset = new THREE.Vector2(width, height);
        const sizes = new THREE.Vector2(
          left - window.innerWidth / 2 + width / 2,
          -top + window.innerHeight / 2 - height / 2
        );
        return { offset, sizes };
      }

      const { offset, sizes } = getDimensions();
      mesh.position.set(sizes.x, sizes.y, 0);
      mesh.scale.set(offset.x, offset.y, 1);
      scene.add(mesh);

      function updateMeshStatus() {
        const { offset, sizes } = getDimensions();
        mesh.position.set(sizes.x, sizes.y, 0);
        mesh.scale.set(offset.x, offset.y, 1);
        uniforms.uOffset.value.set(offset.x * 0.0, -(target - current) * 0.0003);
      }

      return { updateMeshStatus };
    }

    function render() {
      smoothScroll();
      for (let i = 0; i < meshItems.length; i++) {
        meshItems[i]?.updateMeshStatus();
      }
      renderer.render(scene, camera);
      requestAnimationFrame(render.bind(render));
    }

    init();
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);
};
