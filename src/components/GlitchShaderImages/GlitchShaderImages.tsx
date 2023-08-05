import * as THREE from 'three';
import { ReactNode, useEffect } from 'react';
import { getViewport } from './utils/getViewport';
import { lerp } from './utils/lerp';
import { createMeshImage } from './utils/createMeshImage';

interface Mesh {
  mesh: THREE.Mesh;
  updateMeshStatus: (targetScroll: number, currentScroll: number) => void;
}

const classNamePrefix = 'glitch-shader-images';

const GlitchShaderImages = ({ children, effectEase = 0.1 }: { children: ReactNode; effectEase?: number }) => {
  useEffect(() => {
    const container = document.querySelector(`.${classNamePrefix}-container`) as HTMLDivElement;
    const scrollable = document.querySelector(`.${classNamePrefix}-scrollable`) as HTMLDivElement;
    const domImages = container.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    const meshImages: Mesh[] = [];

    let perspective = 1000;
    const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, getViewport().aspectRatio, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    let currentScroll = 0;
    let targetScroll = 0;

    function setSmoothScroll() {
      targetScroll = window.scrollY;
      currentScroll = lerp(currentScroll, targetScroll, effectEase);
      scrollable.style.transform = `translate3d(0,${-currentScroll}px,0)`;
    }

    function initCanvas() {
      document.body.style.height = `${scrollable.getBoundingClientRect().height}px`;
      camera.position.set(0, 0, perspective);
      domImages.forEach(img => {
        const meshImage = createMeshImage(img);
        scene.add(meshImage.mesh);
        meshImages.push(meshImage);
      });
      renderer.setSize(getViewport().width, getViewport().height);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);
      updateScrollAndCanvasPerFrame();
    }

    function handleWindowResize() {
      document.body.style.height = `${scrollable.getBoundingClientRect().height}px`;
      camera.aspect = getViewport().aspectRatio;
      camera.updateProjectionMatrix();
      renderer.setSize(getViewport().width, getViewport().height);
    }

    function updateScrollAndCanvasPerFrame() {
      setSmoothScroll();
      meshImages.forEach(mesh => mesh.updateMeshStatus(targetScroll, currentScroll));
      renderer.render(scene, camera);
      requestAnimationFrame(updateScrollAndCanvasPerFrame.bind(updateScrollAndCanvasPerFrame));
    }

    initCanvas();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [effectEase]);

  return (
    <div className={`${classNamePrefix}-container`}>
      <div className={`${classNamePrefix}-scrollable`}>{children}</div>
    </div>
  );
};

export default GlitchShaderImages;
