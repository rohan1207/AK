import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "./Contactus.scss";
import { useToggleRoomStore } from "../../stores/toggleRoomStore";

const ContactUs = () => {
  const navigate = useNavigate();
  const { isDarkRoom, setDarkRoom } = useToggleRoomStore();
  const containerRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [currentPlanet, setCurrentPlanet] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);
  const [showMailbox, setShowMailbox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    handleRocketLaunch();

    setTimeout(() => {
      window.location.href = `mailto:contact@thesocialcollab.com?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(formData.message)}`;
      setIsSubmitting(false);
    }, 1300);
  };

  // Contact information to display on planets
  const contactInfo = [
    {
      type: "address",
      content: "123 Cosmic Avenue, Universe City, Space 42 Katraj Pune-411043",
      color: 0x5acdff, // Blue planet
    },
    {
      type: "phone",
      content: "+91 86000 73706",
      color: 0xff5a5a, // Red planet
    },
    {
      type: "email",
      content: "contact@thesocialcollab.com",
      color: 0xa7ff5a, // Green planet
    },
  ];

  useEffect(() => {
    setDarkRoom(true);
    initThreeJS();

    // Add event listeners with passive: false to allow preventDefault()
    window.addEventListener("keydown", handleKeyNavigation);
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyNavigation);
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (scene) {
        scene.cleanup?.();
      }
    };
  }, []);

  useEffect(() => {
    if (scene && currentPlanet !== null) {
      if (showMailbox) {
        navigateToRocket();
      } else {
        navigateToPlanet(currentPlanet);
      }
    }
  }, [currentPlanet, scene, showMailbox]);

  // Load rocket model on scene initialization
  const loadMailboxModel = (scene) => {
    if (!scene) return;

    const loader = new GLTFLoader();
    loader.load("/models/rocket.glb", (gltf) => {
      const model = gltf.scene;
      // Position it behind the last planet (green planet)
      model.position.set(-5, 2, -140); // Placing it further back on z-axis
      model.scale.set(0.5, 0.5, 0.5);
      model.userData.isMailbox = true;
      model.rotation.set(0, Math.PI * 0.3, 0);

      // Add lighting specific to the mailbox
      const spotLight = new THREE.SpotLight(0xffffff, 1.5);
      spotLight.position.set(0, 10, 0);
      spotLight.target = model;
      spotLight.angle = Math.PI / 4;
      spotLight.penumbra = 0.1;
      spotLight.castShadow = true;
      model.add(spotLight);

      scene.scene.add(model);
    });
  };

  // New function to handle navigation to rocket
  const navigateToRocket = () => {
    if (!scene || isTransitioning) return;

    setIsTransitioning(true);

    const rocketModel = scene.scene.children.find(
      (child) => child.userData.isMailbox
    );
    if (!rocketModel) return;

    const startPosition = new THREE.Vector3(
      scene.camera.position.x,
      scene.camera.position.y,
      scene.camera.position.z
    );

    const targetPosition = new THREE.Vector3(5, 4, -130);

    animateCameraToPosition(
      startPosition,
      targetPosition,
      rocketModel.position
    );
  };

  const animateCameraToPosition = (
    startPosition,
    targetPosition,
    lookAtTarget
  ) => {
    if (!scene || isTransitioning) return;

    setIsTransitioning(true);

    // Calculate duration based on distance
    const distance = startPosition.distanceTo(targetPosition);
    const duration = Math.min(1.5, Math.max(0.8, distance * 0.03));

    let startTime = null;
    let warpIntensity = 0;

    const animateCamera = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Custom easing for more dynamic movement
      const easedProgress = easeInOutCubic(progress);

      // Update camera position
      scene.camera.position.x =
        startPosition.x + (targetPosition.x - startPosition.x) * easedProgress;
      scene.camera.position.y =
        startPosition.y + (targetPosition.y - startPosition.y) * easedProgress;
      scene.camera.position.z =
        startPosition.z + (targetPosition.z - startPosition.z) * easedProgress;

      // Set camera to look at the target
      scene.camera.lookAt(lookAtTarget);

      // Calculate warp effect intensity
      warpIntensity = Math.sin(progress * Math.PI) * 2;

      // Dynamic camera shake and warp effect during transition
      if (progress > 0.1 && progress < 0.9) {
        const shakeIntensity = 0.03 * warpIntensity;
        scene.camera.position.x += (Math.random() - 0.5) * shakeIntensity;
        scene.camera.position.y += (Math.random() - 0.5) * shakeIntensity;

        // Warp stars effect - creates a "zooming through space" effect
        scene.scene.children.forEach((child) => {
          if (child.userData.isStarfield) {
            const layer = child.userData.layer;
            const speed = 0.1 * (3 - layer) * warpIntensity;
            const positions = child.geometry.attributes.position.array;
            const initialPositions = child.userData.initialPositions;

            for (let i = 0; i < positions.length; i += 3) {
              const stretch = speed * (scrollDirection === "down" ? -1 : 1);
              positions[i + 2] =
                initialPositions[i + 2] +
                stretch * Math.abs(positions[i] / 100);
            }
            child.geometry.attributes.position.needsUpdate = true;
          }
        });
      }

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        // Set a small delay before allowing new transitions
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);

        // Reset star positions
        scene.scene.children.forEach((child) => {
          if (child.userData.isStarfield) {
            const positions = child.geometry.attributes.position.array;
            const initialPositions = child.userData.initialPositions;
            positions.set(initialPositions);
            child.geometry.attributes.position.needsUpdate = true;
          }
        });
      }
    };

    requestAnimationFrame(animateCamera);
  };

  // Animate rocket launch on form submit
  const handleRocketLaunch = () => {
    if (!scene) return;

    const rocket = scene.scene.children.find(
      (child) => child.userData.isMailbox
    );

    if (!rocket) return;

    let start = null;
    const startPos = rocket.position.clone();

    // Modified target position for diagonal top-left trajectory
    // Negative X = left, Positive Y = up, Negative Z = away from camera
    const endPos = new THREE.Vector3(-200, 150, -100);

    const duration = 1500; // ms

    // Enhanced trail effect with fog-like appearance
    const createTrail = () => {
      if (!rocket || !scene) return;

      // Create multiple particles for a more volumetric trail
      const particleCount = 3;

      for (let i = 0; i < particleCount; i++) {
        // Use a cloud-like geometry
        const trailGeometry = new THREE.SphereGeometry(
          0.8 + Math.random() * 0.7,
          8,
          8
        );

        // Use a gradient from bright yellow-orange to a softer color for more realism
        const trailMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(
            0.8 + Math.random() * 0.1, // Red
            0.8 + Math.random() * 0.1, // Green
            0.8 + Math.random() * 0.1 // Blue
          ),
          transparent: true,
          opacity: 0.5 + Math.random() * 0.2,
        });

        const particle = new THREE.Mesh(trailGeometry, trailMaterial);

        // Position with slight randomness for volume effect
        particle.position.copy(rocket.position);
        particle.position.y -= 1.5 + Math.random();
        particle.position.x += (Math.random() - 0.5) * 1.5;
        particle.position.z += (Math.random() - 0.5) * 1.5;

        scene.scene.add(particle);

        // Fade out and expand for smoke-like effect
        gsap.to(particle.material, {
          opacity: 0,
          duration: 1.2 + Math.random() * 0.8,
          onComplete: () => {
            scene.scene.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
          },
        });

        // Make the particle expand slightly for dissipation effect
        gsap.to(particle.scale, {
          x: 1.5 + Math.random() * 1.0,
          y: 1.5 + Math.random() * 1.0,
          z: 1.5 + Math.random() * 1.0,
          duration: 1.2 + Math.random() * 0.5,
        });
      }
    };

    // Trail effect timer - increase frequency for denser trail
    let trailTimer = null;

    function animateRocketLaunch(ts) {
      if (!start) {
        start = ts;
        // Start creating trail particles
        trailTimer = setInterval(createTrail, 30); // Higher frequency for denser trail
      }

      const elapsed = ts - start;
      const t = Math.min(elapsed / duration, 1);

      // Improved easing for realistic launch
      // Slow start, fast middle, slight slowdown at end
      const ease = t < 0.2 ? 3 * t * t : t > 0.8 ? 1 - Math.pow(1 - t, 2) : t;

      rocket.position.lerpVectors(startPos, endPos, ease);

      // Adjust rotation for diagonal flight
      rocket.rotation.x = 0.3 + t * 0.3; // Pitch
      rocket.rotation.z = -0.6 - t * 0.5; // Roll in direction of flight

      if (t < 1) {
        requestAnimationFrame(animateRocketLaunch);
      } else {
        // Animation complete, clear the trail timer
        if (trailTimer) clearInterval(trailTimer);

        // Optional: Remove rocket from scene when it's far enough away
        setTimeout(() => {
          if (rocket && scene) {
            rocket.visible = false;
          }
        }, 500);
      }
    }

    requestAnimationFrame(animateRocketLaunch);
  };

  const initThreeJS = () => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene
    const newScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 15; // Start further back
    camera.position.y = 2; // Slight elevation for better view

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false; // Disable regular orbit controls as we'll handle camera movement

    // Add stars background with more stars
    createStars(newScene);

    // Create planets in specific positions for better visibility
    const planets = createPlanets(newScene);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    newScene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 3, 5);
    newScene.add(directionalLight);

    // Add point lights near planets for dramatic effect
    planets.forEach((planet) => {
      const pointLight = new THREE.PointLight(0xffffff, 1, 20);
      pointLight.position.copy(planet.position);
      pointLight.position.z += 2;
      newScene.add(pointLight);
    });

    // Load mailbox model
    loadMailboxModel(newScene);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate); // Rotate stars slightly
      newScene.children.forEach((child) => {
        if (child.userData.isStarfield) {
          child.rotation.y += 0.0002;
        }
      });

      // Rotate planets
      planets.forEach((planet) => {
        planet.rotation.y += planet.userData.rotationSpeed;
      });

      renderer.render(newScene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize); // Load the rocket model
    loadMailboxModel({ scene: newScene });

    // Set the initial planet view
    setTimeout(() => {
      navigateToPlanet(0);
    }, 100);

    setScene({
      scene: newScene,
      camera,
      renderer,
      planets,
      cleanup: () => {
        window.removeEventListener("resize", handleResize);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        planets.forEach((planet) => {
          planet.geometry.dispose();
          planet.material.dispose();
        });
      },
    });

    return () => {
      if (newScene) {
        window.removeEventListener("resize", handleResize);
        if (container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  };

  const createStars = (scene) => {
    // Create multiple star layers for parallax effect
    for (let i = 0; i < 3; i++) {
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 2000 * (i + 1); // More stars in outer layers
      const positions = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);
      const colors = new Float32Array(starCount * 3);

      for (let j = 0; j < starCount * 3; j += 3) {
        // Distribute stars in a sphere
        const radius = 100 + i * 100; // Larger radius for outer layers
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[j] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j + 2] = radius * Math.cos(phi);

        // Randomize star sizes
        sizes[j / 3] = Math.random() * 2;

        // Add color variation
        const colorVar = 0.3 + Math.random() * 0.7;
        colors[j] = colorVar;
        colors[j + 1] = colorVar;
        colors[j + 2] = colorVar + Math.random() * 0.3;
      }

      starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      starGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const starMaterial = new THREE.PointsMaterial({
        size: 0.15,
        transparent: true,
        opacity: i === 0 ? 0.9 : 0.5,
        vertexColors: true,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      });

      const stars = new THREE.Points(starGeometry, starMaterial);
      stars.userData.isStarfield = true;
      stars.userData.layer = i;
      stars.userData.initialPositions = positions.slice();
      scene.add(stars);
    }
  };

  const createPlanets = (scene) => {
    const planets = [];

    // Position planets in a curved line for better scrolling experience
    contactInfo.forEach((info, i) => {
      const geometry = new THREE.SphereGeometry(2, 64, 64); // Larger, more detailed planets
      const planetTexture = createPlanetTexture(info.color);

      const material = new THREE.MeshStandardMaterial({
        map: planetTexture,
        metalness: 0.2,
        roughness: 0.8,
        envMapIntensity: 1.0,
      });

      const planet = new THREE.Mesh(geometry, material);

      // Position planets in a curved path along the z-axis with increasing distance
      // This creates a "path" through space that looks good when scrolling
      const zOffset = -i * 40; // Increase distance between planets
      planet.position.set(
        i === 1 ? 5 : i === 2 ? -5 : 0, // Slight offset on x-axis for variety
        i === 1 ? -2 : i === 2 ? 2 : 0, // Slight offset on y-axis for variety
        zOffset - 20 // Place along z-axis
      );

      // Add rotation animation
      planet.userData.index = i;
      planet.userData.rotationSpeed = 0.005 + Math.random() * 0.005;

      // Add atmosphere glow effect
      const atmosphere = createAtmosphere(info.color);
      atmosphere.scale.set(1.2, 1.2, 1.2);
      planet.add(atmosphere);

      scene.add(planet);
      planets.push(planet);
    });

    return planets;
  };

  const createAtmosphere = (color) => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        color: { value: new THREE.Color(color) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 color;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(color, intensity * 0.5);
        }
      `,
      side: THREE.BackSide,
    });
    return new THREE.Mesh(geometry, material);
  };

  const createPlanetTexture = (baseColor) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Fill background with base color
    ctx.fillStyle = `#${baseColor.toString(16).padStart(6, "0")}`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise and features to make it look like a planet
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 2;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);

      // Create craters or features with slightly different shade
      const shade = Math.random() > 0.5 ? 30 : -30;
      const color = adjustColor(baseColor, shade);
      ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
      ctx.fill();
    }

    // Create a few larger features
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 20 + Math.random() * 40;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);

      const shade = Math.random() > 0.5 ? 50 : -50;
      const color = adjustColor(baseColor, shade);
      ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  const adjustColor = (hex, amount) => {
    // Convert hex to RGB
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;

    // Adjust
    const newR = Math.max(0, Math.min(255, r + amount));
    const newG = Math.max(0, Math.min(255, g + amount));
    const newB = Math.max(0, Math.min(255, b + amount));

    // Convert back to hex
    return (newR << 16) | (newG << 8) | newB;
  };

  const navigateToPlanet = (index) => {
    if (!scene || isTransitioning) return;

    setIsTransitioning(true);

    const planet = scene.planets[index];
    const startPosition = new THREE.Vector3(
      scene.camera.position.x,
      scene.camera.position.y,
      scene.camera.position.z
    );

    // Calculate target position to view the planet from an optimal angle
    const planetPos = planet.position;
    const targetPosition = new THREE.Vector3(
      planetPos.x * 0.5, // Offset from planet center on x-axis
      planetPos.y + 1, // Slightly above planet
      planetPos.z + 10 // In front of planet for better viewing
    );

    // Calculate duration based on distance
    const distance = startPosition.distanceTo(targetPosition);
    const duration = Math.min(1.5, Math.max(0.8, distance * 0.03));

    let startTime = null;
    let warpIntensity = 0;

    const animateCamera = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Custom easing for more dynamic movement
      const easedProgress = easeInOutCubic(progress);

      // Update camera position
      scene.camera.position.x =
        startPosition.x + (targetPosition.x - startPosition.x) * easedProgress;
      scene.camera.position.y =
        startPosition.y + (targetPosition.y - startPosition.y) * easedProgress;
      scene.camera.position.z =
        startPosition.z + (targetPosition.z - startPosition.z) * easedProgress;

      // Set camera to look at the planet
      scene.camera.lookAt(planetPos);

      // Calculate warp effect intensity
      warpIntensity = Math.sin(progress * Math.PI) * 2;

      // Dynamic camera shake and warp effect during transition
      if (progress > 0.1 && progress < 0.9) {
        const shakeIntensity = 0.03 * warpIntensity;
        scene.camera.position.x += (Math.random() - 0.5) * shakeIntensity;
        scene.camera.position.y += (Math.random() - 0.5) * shakeIntensity;

        // Warp stars effect - creates a "zooming through space" effect
        scene.scene.children.forEach((child) => {
          if (child.userData.isStarfield) {
            const layer = child.userData.layer;
            const speed = 0.1 * (3 - layer) * warpIntensity;
            const positions = child.geometry.attributes.position.array;
            const initialPositions = child.userData.initialPositions;

            for (let i = 0; i < positions.length; i += 3) {
              const stretch = speed * (scrollDirection === "down" ? -1 : 1);
              positions[i + 2] =
                initialPositions[i + 2] +
                stretch * Math.abs(positions[i] / 100);
            }
            child.geometry.attributes.position.needsUpdate = true;
          }
        });
      }

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        // Set a small delay before allowing new transitions
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);

        // Reset star positions
        scene.scene.children.forEach((child) => {
          if (child.userData.isStarfield) {
            const positions = child.geometry.attributes.position.array;
            const initialPositions = child.userData.initialPositions;
            positions.set(initialPositions);
            child.geometry.attributes.position.needsUpdate = true;
          }
        });
      }
    };

    requestAnimationFrame(animateCamera);
  };

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  const handleScroll = (e) => {
    e.preventDefault(); // Prevent default scroll behavior

    if (isTransitioning) return;

    // Determine scroll direction
    // deltaY > 0 means scrolling down/backward, < 0 means scrolling up/forward
    const direction = e.deltaY > 0 ? "down" : "up";
    setScrollDirection(direction);

    if (showMailbox) {
      // If showing mailbox, any down scroll goes back to the last planet
      if (direction === "down") {
        setShowMailbox(false);
        setCurrentPlanet(contactInfo.length - 1);
      }
      return;
    }

    // Calculate next state based on current scroll direction
    if (direction === "up") {
      // Scrolling up means moving forward
      if (currentPlanet < contactInfo.length - 1) {
        // Smooth transition to next planet with dot highlight
        setShowMailbox(false);
        setCurrentPlanet(currentPlanet + 1);
      } else if (currentPlanet === contactInfo.length - 1) {
        // We're at the last planet, show mailbox on scroll up
        setShowMailbox(true);
        setScrollDirection("up");
      }
    } else if (direction === "down") {
      // Scrolling down means moving backward
      if (currentPlanet > 0) {
        // Smooth transition to previous planet with dot highlight
        setShowMailbox(false);
        setCurrentPlanet(currentPlanet - 1);
      }
    }

    // Add haptic feedback if supported
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50); // Short vibration for feedback
    }
  };
  const handleKeyNavigation = (event) => {
    if (isTransitioning) return;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      setScrollDirection("down");

      if (showMailbox) {
        // Go back to last planet from mailbox
        setShowMailbox(false);
        setCurrentPlanet(contactInfo.length - 1);
      } else if (currentPlanet > 0) {
        // Move backward through planets
        setShowMailbox(false);
        setCurrentPlanet(currentPlanet - 1);
      }
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      setScrollDirection("up");

      if (showMailbox) {
        // Already at mailbox, stay here
        return;
      } else if (currentPlanet < contactInfo.length - 1) {
        // Move forward through planets
        setShowMailbox(false);
        setCurrentPlanet(currentPlanet + 1);
      } else if (currentPlanet === contactInfo.length - 1) {
        // At last planet, show mailbox
        setShowMailbox(true);
      }
    }

    // Add haptic feedback if supported
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const handleMouseMove = (event) => {
    if (!scene || isTransitioning) return;

    // Subtle camera movement based on mouse position
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const offsetX = (event.clientX - centerX) / centerX;
    const offsetY = (event.clientY - centerY) / centerY;

    // Apply subtle tilt to the camera (only when not transitioning)
    scene.camera.position.x += offsetX * 0.01 - scene.camera.position.x * 0.05;
    scene.camera.position.y += -offsetY * 0.01 - scene.camera.position.y * 0.05;
  };

  const handleBack = () => {
    navigate("/");
  };

  const getIcon = (type) => {
    switch (type) {
      case "address":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        );
      case "phone":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        );
      case "email":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`space-contact-page${!isDarkRoom ? " light" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className="back-button"
        onClick={handleBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
      <div className="universe-title">
        <h1>Universe of TheSocialCollab</h1>
        <p className="scroll-instruction">
          {showMailbox
            ? "our team is ready to assist you"
            : `Scroll to explore ${currentPlanet + 1}/${contactInfo.length}`}
        </p>
      </div>
      <div className="space-container" ref={containerRef}>
        {/* 3D space will be rendered here */}
      </div>
      {/* Contact info cards that appear when near planets */}
      {contactInfo.map((info, index) => (
        <motion.div
          key={index}
          className={`contact-card ${
            currentPlanet === index && !showMailbox ? "visible" : ""
          }`}
          initial={{ opacity: 0, x: 100 }}
          animate={{
            opacity: currentPlanet === index && !showMailbox ? 1 : 0,
            x: currentPlanet === index && !showMailbox ? 0 : 100,
          }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="contact-icon"
            style={{
              backgroundColor: `rgba(${(info.color >> 16) & 0xff}, ${
                (info.color >> 8) & 0xff
              }, ${info.color & 0xff}, 0.2)`,
              borderColor: `rgba(${(info.color >> 16) & 0xff}, ${
                (info.color >> 8) & 0xff
              }, ${info.color & 0xff}, 0.5)`,
            }}
          >
            {getIcon(info.type)}
          </div>
          <div className="contact-content">
            <h3>
              {info.type === "address"
                ? "Our Location"
                : info.type === "phone"
                ? "Call Us"
                : "Email Us"}
            </h3>
            <p>{info.content}</p>
          </div>
        </motion.div>
      ))}
      {/* Mailbox info card */}{" "}
      <motion.div
        className={`contact-card contact-form-card ${
          showMailbox ? "visible" : ""
        }`}
        initial={{ opacity: 0, x: 100 }} // Start from right side
        animate={{
          opacity: showMailbox ? 1 : 0,
          x: showMailbox ? 0 : 100, // Animate from right side
        }}
        style={{
          right: "18rem",
          left: "auto",
          top: "30%",
          width: "400px",
          opacity: "1",
          transform: " none",
        }} // Position on right side of screen
        transition={{ duration: 0.5 }}
      >
        <div
          className="contact-icon"
          style={{
            backgroundColor: `rgba(255, 215, 0, 0.2)`,
            borderColor: `rgba(255, 215, 0, 0.5)`,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V8l6.94 4.34c.65.41 1.47.41 2.12 0L20 8v9c0 .55-.45 1-1 1zm-7-7L4 6h16l-8 5z" />
          </svg>
        </div>
        <div className="contact-content">
          <h3>Send Us a Message</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="contact-input"
              value={formData.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="contact-input"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              className="contact-input"
              value={formData.subject}
              onChange={handleInputChange}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              className="contact-input contact-textarea"
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
            <button
              type="submit"
              className="mailbox-action-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </motion.div>
      <div className="navigation-dots">
        {contactInfo.map((_, index) => (
          <div
            key={index}
            className={`dot ${
              currentPlanet === index && !showMailbox ? "active" : ""
            }`}
            onClick={() => {
              if (!isTransitioning) {
                setShowMailbox(false);
                setScrollDirection(index > currentPlanet ? "up" : "down");
                setCurrentPlanet(index);
              }
            }}
          />
        ))}
        {/* Add an extra dot for the mailbox state */}
        <div
          className={`dot ${showMailbox ? "active" : ""}`}
          onClick={() => {
            if (!isTransitioning) {
              setShowMailbox(true);
              setScrollDirection("up");
            }
          }}
        />
      </div>
    </motion.div>
  );
};

export default ContactUs;
