// Dependencies: three.js, gsap. And 1 plugin to import .glsl to your project, e.g. glslify, ...
import * as THREE from "./node_modules/three/build/three";
import gsap from "./node_modules/gsap/dist/gsap";

// Shaders
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosphereVertex from "./shaders/atmosphereVertex.glsl";
import atmosphereFragment from "./shaders/atmosphereFragment.glsl";

// ! Set scene.
const scene = new THREE.Scene();

// ! Create a sphere.
const imageUrl = `./assets/earth-night.png`; // ? Put your image's relative path here (earth UV map).
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),

    // * With no shaders.
    // new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load(imageUrl),
    // })

    // * With shader created with .glsl.
    new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            globeTexture: {
                value: new THREE.TextureLoader().load(imageUrl),
            },
        },
    })
);
scene.add(sphere);

// ! Create an atmosphere with .glsl.
const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
    })
);
atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);

// ! Wrap the globe inside a group.
const group = new THREE.Group();
group.add(sphere);
scene.add(group);

// ! Create stars (optional).
// const starGeometry = new THREE.BufferGeometry();
// const starMaterial = new THREE.PointsMaterial({
//     color: 0xffffff,
// });
// const starVertices = [];
// for (let i = 0; i < 10000; i++) {
//     const x = (Math.random() - 0.5) * 2000;
//     const y = (Math.random() - 0.5) * 2000;
//     const z = -Math.random() * 2000;
//     starVertices.push(x, y, z);
// }
// starGeometry.setAttribute(
//     "position",
//     new THREE.Float32BufferAttribute(starVertices, 3)
// );
// const stars = new THREE.Points(starGeometry, starMaterial);
// scene.add(stars);

// ! Listen to mouse movements.
const mouse = {
    x: undefined,
    y: undefined,
};
addEventListener("mousemove", () => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});

// ! Rendering everything.
const renderGlobe = () => {
    // * Create renderer & container and set camera.
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector("canvas"),
        alpha: true, // ? Add this to have transparent background.
    });

    // ? In your html, make a div with id="canvas-container", with a canvas element inside.
    const canvasContainer = document.querySelector("#canvas-container");

    const camera = new THREE.PerspectiveCamera(
        71,
        canvasContainer.offsetWidth / canvasContainer.offsetHeight,
        0.1,
        1000
    );
    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 13; // ? Change this value to zoom in/out.

    // * Animation.
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        sphere.rotation.y += 0.01; // ? Change this value to adjust rotating speed.
        mouse.x &&
            gsap.to(group.rotation, {
                x: -mouse.y,
                y: mouse.x,
                duration: 2,
            });
    }
    animate();
};

export default renderGlobe;
// ! NOTE: if you use frameworks (React, ...), call this fn after the page has mounted.
