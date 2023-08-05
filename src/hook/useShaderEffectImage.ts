import * as THREE from 'three';
import { useEffect } from 'react';
import { fragmentShader } from '../shader/fragmentShader';
import { vertexShader } from '../shader/vertexShader';

interface Mesh {
  mesh: THREE.Mesh;
  updateMeshStatus: (target: number, current: number) => void;
}

const useShaderEffectImages = () => {
  useEffect(() => {
    const scrollable = document.querySelector('.scrollable') as HTMLDivElement;
    const container = document.querySelector('main') as HTMLDivElement;
    const domImages = document.querySelectorAll('.image-container img') as NodeListOf<HTMLImageElement>;
    const meshImages: Mesh[] = [];

    let perspective = 1000;
    const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, getViewport().aspectRatio, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    let current = 0;
    let target = 0;
    let ease = 0.07;

    function setSmoothScroll() {
      target = window.scrollY;
      current = lerp(current, target, ease);
      scrollable.style.transform = `translate3d(0,${-current}px,0)`;
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
      meshImages.forEach(mesh => mesh.updateMeshStatus(target, current));
      renderer.render(scene, camera);
      requestAnimationFrame(updateScrollAndCanvasPerFrame.bind(updateScrollAndCanvasPerFrame));
    }

    initCanvas();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
};

export default useShaderEffectImages;

function createMeshImage(element: HTMLImageElement) {
  const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
  const texture = new THREE.TextureLoader().load(element.src);
  const uniforms = {
    uTexture: { value: texture },
    uOffset: { value: new THREE.Vector2(0, 0) },
    uAlpha: { value: 1 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    fragmentShader,
    vertexShader,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);

  const { offset, sizes } = getDimensions(element);
  mesh.position.set(sizes.x, sizes.y, 0);
  mesh.scale.set(offset.x, offset.y, 1);

  function updateMeshStatus(target: number, current: number) {
    const { offset, sizes } = getDimensions(element);
    mesh.position.set(sizes.x, sizes.y, 0);
    mesh.scale.set(offset.x, offset.y, 1);
    uniforms.uOffset.value.set(offset.x * 0.0, -(target - current) * 0.0003);
  }

  return { mesh, updateMeshStatus };
}

function lerp(start: number, end: number, time: number) {
  return start * (1 - time) + end * time;
}

function getDimensions(element: HTMLElement) {
  const { width, height, top, left } = element.getBoundingClientRect();
  const offset = new THREE.Vector2(width, height);
  const sizes = new THREE.Vector2(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
  return { offset, sizes };
}

function getViewport() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let aspectRatio = width / height;
  return { width, height, aspectRatio };
}
