import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { OrbitControls } from "three/examples/jsm/Addons.js";
gsap.registerPlugin(ScrollTrigger);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const light = new THREE.AmbientLight(0x404040, 100); // Soft white light
scene.add(light);

const loader = new GLTFLoader();
let mixer;
let plane;

// Load a glTF resource
loader.load("./assets/plane.glb", function (gltf) {
  plane = gltf.scene;
  plane.traverse((node) => {
    if (node.isMesh) {
      if (node.name && node.name.includes("Sphere")) {
        node.visible = false;
        node.castShadow = true;
        node.receiveShadow = true;
      }
    }
  });
  plane.scale.set(1.2, 1.2, 1.2);
  plane.position.y = -0.1;
  plane.rotation.y = Math.PI;
  plane.rotation.x = 0.2;
  scene.add(plane);

  mixer = new THREE.AnimationMixer(plane);
  if (gltf.animations && gltf.animations.length) {
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
  }
  setupScrollAnimations();
  // GSAP animation after plane is loaded
});
function setupScrollAnimations() {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-sec",
      start: "top center",
      end: "center center",
      scrub: true,
      
    },
  });

  timeline
    .to(plane.position, {
      x: -5,
      onEnter: () => console.log("ScrollTrigger Entered .about-sec"),
    })
    .to(
      plane.rotation,
      {
        z: Math.PI * 2,
        y: Math.PI * 2 - 1,
        onEnter: () => console.log("ScrollTrigger Entered .about-sec"),
      },
      "<" // Sync this animation with the previous one
    )
    .to(
      plane.scale,
      {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        onEnter: () => console.log("ScrollTrigger Entered .about-sec"),
      },
      "<" // Sync this animation with the previous one
    );

  const timelineFeatures = gsap.timeline({
    scrollTrigger: {
      trigger: ".features-sec",
      start: "top center",
      end: "center center",
      scrub: true,
      
    },
  });

  timelineFeatures
    .to(plane.position, {
      x: 2, // Move forward
      onEnter: () => console.log("ScrollTrigger Entered .features-sec"),
    })

    .to(
      plane.rotation,
      {
        z: Math.PI - 10, // Tilt the plane diagonally
        y: Math.PI, // Rotate the plane 180 degrees
        onEnter: () =>
          console.log("ScrollTrigger Entered .features-sec mainrotate"),
      },
      "<" // Sync this animation with the previous one
    )
    .to(
      plane.scale,
      {
        x: 1.5, // Scale up for emphasis
        y: 1.5,
        z: 1.5,
        onEnter: () => console.log("ScrollTrigger Entered .features-sec"),
      },
      "<" // Sync this animation with the previous one
    );

  const timelineExplore = gsap.timeline({
    scrollTrigger: {
      trigger: ".explore-sec",
      start: "top center",
      end: "center center",
      scrub: true,
      
    },
  });

  timelineExplore
    .to(plane.position, {
      x: 0, // Move plane to center
      y: 0,
      z: 0,
      onStart: () => {
        console.log("ScrollTrigger Entered .explore-sec");
      },
    })
    .to(
      plane.scale,
      {
        x: 1, // Keep plane at normal size
        y: 1,
        z: 1,
        onEnter: () => console.log("ScrollTrigger Entered .features-sec"),
      },
      "<" // Sync this animation with the previous one
    )
    .to(
      plane.rotation,
      {
        z: Math.PI * 2,
        x: 0, // No tilt on X-axis
        y: Math.PI, // Keep plane facing toward the screen
        onEnter: () =>
          console.log("ScrollTrigger Entered .explore-sec rotation"),
      },
      "<" // Sync this animation with the previous one
    );
}
// Define controls globally
let controls;
let orbitControls = false;
const exploreBtn = document.querySelector("#exploreBtn");
const body = document.querySelector("body");
const exploreSec = document.querySelector(".explore-sec");
const close = document.querySelector(".closeBtn");
const closeBtn = document.querySelector(".closeBtn button");

exploreBtn.addEventListener("click", () => {
  enableOrbitControls();
});
// Enable Orbit Controls
function enableOrbitControls() {
  gsap.to(canvas, {
    duration: 1,
    zIndex: 199,
    ease: "power2.out", // Smooth ease-out animation
  });

  gsap.to(close, {
    duration: 0.5,
    display: "flex",
    opacity: 1,
    ease: "power2.out",
  });

  gsap.to(exploreSec, {
    duration: 0.5,
    opacity: 0,
    ease: "power2.out", // Fade out
  });

  gsap.to(body, {
    duration: 0.5,
    overflow: "hidden",
    ease: "power2.out",
  });

  orbitControls = true;
  controls = new OrbitControls(camera, renderer.domElement); // Assign to global variable
}
closeBtn.addEventListener("click", () => {
  removeControls();
});
function removeControls() {
  // Start the animation for hiding the explore section and showing the close button
  gsap.to(close, {
    duration: 0.5,
    opacity: 0,
    onComplete: () => {
      close.style.display = "none"; // Hide the close button after animation completes
    },
  });

  // Animate opacity of the explore section to fade in
  gsap.to(exploreSec, {
    duration: 1,
    opacity: 1,
  });

  // Set orbitControls flag to false
  orbitControls = false;

  // If controls exist, dispose of them properly
  if (controls) {
    gsap.to(controls.target, {
      duration: 1,
      x: 0, // Reset target position
      y: 0,
      z: 0,
      onComplete: () => {
        controls.dispose(); // Dispose after animation
        controls = null; // Set controls to null
      },
    });
  }

  // Animate the canvas z-index back to 1
  gsap.to(canvas, {
    duration: 1,
    zIndex: 1,
    ease: "power2.inOut",
  });

  // Reset body overflow with animation for smooth transition
  gsap.to(body, {
    duration: 1,
    overflow: "",
    ease: "power2.inOut",
  });

  // Stop any active GSAP animations on the plane
  gsap.killTweensOf(plane); // This will stop any active GSAP animations tied to the plane

  // Animate the plane's reset position, scale, and rotation
  gsap.to(plane.position, {
    duration: 1,
    x: 0,
    y: 0,
    z: 0,
    ease: "power2.inOut",
  });

  gsap.to(plane.scale, {
    duration: 1,
    x: 1,
    y: 1,
    z: 1,
    ease: "power2.inOut",
  });

  gsap.to(plane.rotation, {
    duration: 1,
    x: 0,
    y: Math.PI,
    z: Math.PI * 2,
    ease: "power2.inOut",
  });
}
camera.position.z = 7;

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Animation controls
let playAnimation = true;
let animationSpeed = 0.01;

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(animationSpeed);
  if (orbitControls == true) {
    console.log("contrls");

    controls.update();
  } else {
  }
  renderer.render(scene, camera);
}

animate();

// Update canvas size on window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
