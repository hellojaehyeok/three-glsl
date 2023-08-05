import * as THREE from 'three';
import { fragmentShader } from '../shader/fragmentShader';
import { vertexShader } from '../shader/vertexShader';
import { getElementDimensions } from './getElementDimensions';

export function createMeshImage(element: HTMLImageElement) {
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

  const { offset, sizes } = getElementDimensions(element);
  mesh.position.set(sizes.x, sizes.y, 0);
  mesh.scale.set(offset.x, offset.y, 1);

  function updateMeshStatus(targetScroll: number, currentScroll: number) {
    const { offset, sizes } = getElementDimensions(element);
    mesh.position.set(sizes.x, sizes.y, 0);
    mesh.scale.set(offset.x, offset.y, 1);
    uniforms.uOffset.value.set(offset.x * 0.0, -(targetScroll - currentScroll) * 0.0003);
  }

  return { mesh, updateMeshStatus };
}
