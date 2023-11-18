import * as THREE from 'three';
import fragmentShader from '../shader/fragmentShader.glsl';
import vertexShader from '../shader/vertexShader.glsl';
import { getElementDimensions } from './getElementDimensions';

const curvedNormalization = 0.0003;

export function createMeshImage(imageElement: HTMLImageElement) {
  const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
  const texture = new THREE.TextureLoader().load(imageElement.src);
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

  function updateMeshStatus(targetScroll: number, currentScroll: number) {
    const { position, scale } = getElementDimensions(imageElement);
    mesh.position.set(0, position.y, 0);
    mesh.scale.set(scale.x, scale.y, 1);
    uniforms.uOffset.value.set(0, -(targetScroll - currentScroll) * curvedNormalization);
  }

  return { mesh, updateMeshStatus };
}
