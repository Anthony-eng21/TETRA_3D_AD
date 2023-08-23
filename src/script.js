import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";
//loading the font le wrongish way
// import typeFaceFont from "three/examples/fonts/helvetiker_regular.typeface.json"
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
/**
 * Base
 */
// Debug GUI
const gui = new dat.GUI({ name: "Link To" });

// Create an object to hold the button function
const buttonFunction = {
  goToWebsite: () => {
    window.open("https://soundcloud.com/tetra-mafia", "_blank");
  },
};

// Add a button control
gui.add(buttonFunction, "goToWebsite").name("TETRA MAFIA EP");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
//loading our material for our textGeo
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
const matcapNormalTexture = textureLoader.load("/textures/matcaps/8.png");
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

//instanciate donuts and bubbles arrray to push objects into
const pyramids = [];
const bubbles = [];
/**Fonts
 *
 */
const fontLoader = new FontLoader();

fontLoader.load(
  "/fonts/helvetiker_regular.typeface.json",
  //success fn() when this ajax call is fulfilled
  (font) => {
    //instanciate the TextGeometry class from THREE
    /**
     *@param text — The text that needs to be shown.
      @param parameters — Object that can contain the following parameters.
     */
    const textGeometry = new TextGeometry("TETRA MAFIA", {
      font: font, // an instance of THREE.Font
      size: 0.6, // Float. Size of the text. Default is 100.
      height: 0.2, // Float. Thickness to extrude text. Default is 50.
      curveSegments: 12, // Integer. Number of points on the curves. Default is 12
      bevelEnabled: true, // Boolean. Turn on bevel. Default is False.
      bevelThickness: 0.03, // bevelThickness — Float. How deep into text bevel goes. Default is 10
      bevelSize: 0.02, // Float. How far from text outline is bevel. Default is 8.
      bevelOffset: 0, //  Float. How far from text outline bevel starts. Default is 0.
      bevelSegments: 5, //  Integer. Number of bevel segments. Default is 3.
    });

    const text = new THREE.Mesh(textGeometry, textMaterial);

    /**Centering the textgeometry with boundingbox
     * we use this bounding to know the size of the geometry and recenter it
     * we can ask Three.js to calculate this box bounding by calling computeBoundingBox() on the geometry:
     * the translate method on our textGeometry is how we can repositon our object sorta like css with it's translate property
     * or we can use the center method on our textgeo instance and center this geometry a lot more easily
     * point of doing it ourselves was to learn about boundings and frustum culling.
     */

    textGeometry.computeBoundingBox();

    textGeometry.translate - (2, 0, 0);
    /**textGeometry.translate(
      -textGeometry.boundingBox.max.x * 0.05,
      -textGeometry.boundingBox.max.y * 0.05,
      -textGeometry.boundingBox.max.z * 0.05
    );

    const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    text.position.x = -textWidth / 2; // Move the text to the left by half of its width
    */

    textGeometry.center();
    const tetra = new THREE.TetrahedronGeometry(0.5);
    const pyramidMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapNormalTexture,
    });

    const sphereGeometry = new THREE.SphereGeometry(0.2, 15, 15);
    // Soap Bubble Material
    const soapBubbleMaterial = new THREE.MeshNormalMaterial({
      side: THREE.DoubleSide, // Make the material double-sided
      transparent: true, // Enable transparency
      opacity: 0.5, // Set opacity for the bubble effect
    });

    for (let i = 0; i <= 300; i++) {
      //pyramids
      const tetraMesh = new THREE.Mesh(tetra, pyramidMaterial);
      tetraMesh.position.x = (Math.random() - 0.5) * 15;
      tetraMesh.position.y = (Math.random() - 0.5) * 15;
      tetraMesh.position.z = (Math.random() - 0.5) * 15;

      // Add randomness to the rotation. No need to rotate all 3 axes, and because the donut is symmetric, half of a revolution is enough:
      tetraMesh.rotation.x = Math.random() * Math.PI;
      tetraMesh.rotation.y = Math.random() * Math.PI;
      // The pyramids should have rotate in all directions. Finally, we can add randomness to the scale. Be careful, though; we need to use the same value for all 3 axes (x, y, z):
      const scale = Math.random();
      tetraMesh.scale.set(scale, scale, scale); //all 3 axes (x, y, z)
      pyramids.push(tetraMesh); //keeping reference to each object we want to animate below on our tick()
      scene.add(tetraMesh);
    }

    for (let i = 0; i <= 300; i++) {
      //bubbles
      const bubble = new THREE.Mesh(sphereGeometry, soapBubbleMaterial);
      bubble.position.x = (Math.random() - 0.5) * 15;
      bubble.position.y = (Math.random() - 0.5) * 15;
      bubble.position.z = (Math.random() - 0.5) * 15;
      const scale = Math.random();
      bubble.scale.set(scale, scale, scale);
      bubbles.push(bubble);
      scene.add(bubble);
    }

    scene.add(text);

    //rotate the text using gsap
    gsap.to(text.rotation, {
      y: Math.PI * 2,
      duration: 10, //animation duration in seconds
      repeat: -1, //repeats infinitely
      ease: "none", //Linear ease
    });

    // Center and position the camera to look at the text geometry
    const textBoundingBox = new THREE.Box3().setFromObject(text);
    const target = textBoundingBox.getCenter(new THREE.Vector3());
    camera.position.copy(target.clone().add(new THREE.Vector3(2, 2, 2))); // Adjust camera position as needed
    camera.lookAt(target);
  }
);

//add light
// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Object
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

// cube.position.x = -2
// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camer
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  pyramids.forEach((pyramid) => {
    // pyramid.rotation.x = elapsedTime * Math.PI * 2;
  });

  bubbles.forEach((bubble) => {
    // Calculate the local position within the local coordinate system
    const localPosition = new THREE.Vector3(
      bubble.position.x, // X position in local space (no change)
      bubble.position.y, // Y position in local space (no change)
      bubble.position.z + Math.sin(elapsedTime) * 0.2 // Z position with vertical oscillation
    );

    // Transform the local position into global coordinates
    const globalPosition = localPosition.applyMatrix4(bubble.matrixWorld);

    // Animate the global position using GSAP
    gsap.to(bubble.position, {
      x: globalPosition.x,
      y: globalPosition.y,
      z: globalPosition.z,
      duration: 2,
      ease: "power1.inOut",
    });
  });

  // Look at the center of the scene
  camera.lookAt(scene.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();