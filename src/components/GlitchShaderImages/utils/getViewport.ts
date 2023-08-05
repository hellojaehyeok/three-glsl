export function getViewport() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let aspectRatio = width / height;
  return { width, height, aspectRatio };
}
