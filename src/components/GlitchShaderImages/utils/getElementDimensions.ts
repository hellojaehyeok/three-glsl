import * as THREE from 'three';

export function getElementDimensions(element: HTMLElement) {
  const { width, height, top, left } = element.getBoundingClientRect();
  const offset = new THREE.Vector2(width, height);
  const sizes = new THREE.Vector2(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
  return { offset, sizes };
}
