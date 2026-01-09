import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

let scene, camera, renderer;

init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true });
  renderer.setSize(512, 512);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(3, 5, 4);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
}

document.getElementById("generate").addEventListener("click", async () => {
  const top = await loadTexture(document.getElementById("top").files[0]);
  const side = await loadTexture(document.getElementById("side").files[0]);
  const front = await loadTexture(document.getElementById("front").files[0]);

  const materials = [
    new THREE.MeshBasicMaterial({ map: side }),  // right
    new THREE.MeshBasicMaterial({ map: side }),  // left
    new THREE.MeshBasicMaterial({ map: top }),   // top
    new THREE.MeshBasicMaterial({ map: front }), // bottom（使わない）
    new THREE.MeshBasicMaterial({ map: front }), // front
    new THREE.MeshBasicMaterial({ map: side }),  // back
  ];

  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
  scene.clear();
  scene.add(box);

  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  renderer.render(scene, camera);

  const dataURL = renderer.domElement.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "block_texture.png";
  a.click();
});

function loadTexture(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;
        resolve(texture);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
