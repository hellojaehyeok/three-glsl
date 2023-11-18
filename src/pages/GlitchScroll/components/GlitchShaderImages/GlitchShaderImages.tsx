import * as THREE from 'three';
import { ReactNode, useEffect, useRef } from 'react';
import { getViewport } from './utils/getViewport';
import { lerp } from './utils/lerp';
import { createMeshImage } from './utils/createMeshImage';
import styled from '@emotion/styled';

interface Mesh {
  mesh: THREE.Mesh;
  updateMeshStatus: (targetScroll: number, currentScroll: number) => void;
}

type Hex = string;

const GlitchShaderImages = ({
  children,
  effectEase = 0.1,
  background = 'ffffff',
}: {
  children: ReactNode;
  effectEase?: number;
  background?: Hex;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current == null || scrollableRef.current == null) return;
    const container = containerRef.current;
    const scrollable = scrollableRef.current;

    const domImages = container.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    document.body.style.height = `${scrollable.getBoundingClientRect().height}px`;

    const perspective = 1000;
    const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, getViewport().aspectRatio, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const meshImages: Mesh[] = [];
    scene.background = new THREE.Color(Number(`0x${background}`));

    let currentScroll = 0;
    let targetScroll = 0;

    function setSmoothScroll() {
      targetScroll = window.scrollY;
      currentScroll = lerp(currentScroll, targetScroll, effectEase);
      scrollable.style.transform = `translate3d(0,${-currentScroll}px,0)`;
    }

    function initCanvas() {
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
  }, [background, effectEase, containerRef, scrollableRef]);

  return (
    <Container ref={containerRef}>
      <Scrollable ref={scrollableRef}>{children}</Scrollable>
    </Container>
  );
};

export default GlitchShaderImages;

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
`;

const Scrollable = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  will-change: transform;
  img {
    /* 클릭이벤트를 위해 visibility 대신 opacity를 제어합니다. */
    opacity: 0;
  }
`;
