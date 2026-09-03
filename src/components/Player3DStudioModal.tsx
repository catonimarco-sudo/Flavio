import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PlacedPlayer } from '../types';
import {
  X,
  RotateCcw,
  RotateCw,
  Eye,
  Camera,
  Check,
  Palette,
  Play,
  Pause,
  Compass,
  Sparkles,
  Shirt,
} from 'lucide-react';

interface Player3DStudioModalProps {
  isOpen: boolean;
  player: PlacedPlayer | null;
  onClose: () => void;
  onApplyOrientation: (playerId: string, rotationDeg: number) => void;
  onApplyPhotoAvatar?: (playerId: string, photoDataUrl: string) => void;
  onUpdatePlayerColor?: (playerId: string, primaryColor: string, secondaryColor: string) => void;
}

export const Player3DStudioModal: React.FC<Player3DStudioModalProps> = ({
  isOpen,
  player,
  onClose,
  onApplyOrientation,
  onApplyPhotoAvatar,
  onUpdatePlayerColor,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const playerGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Rotation state in degrees (0 to 360)
  const [rotationDeg, setRotationDeg] = useState<number>(() => player?.rotation ?? 0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [capturedNotice, setCapturedNotice] = useState(false);

  // Kit styling
  const [primaryColor, setPrimaryColor] = useState<string>(() => player?.customColor || '#eab308'); // Default yellow like reference photo
  const [secondaryColor, setSecondaryColor] = useState<string>(() => player?.secondaryColor || '#1e3a8a'); // Dark navy collar/trim
  const [playerName, setPlayerName] = useState<string>(() => player?.name || 'J. DOE');
  const [playerNumber, setPlayerNumber] = useState<number>(() => player?.number ?? 7);

  // Sync with player prop when opened
  useEffect(() => {
    if (player) {
      setRotationDeg(player.rotation ?? 0);
      setPrimaryColor(player.customColor || (player.team === 'home' ? '#eab308' : player.team === 'away' ? '#f8fafc' : '#861726'));
      setSecondaryColor(player.secondaryColor || (player.team === 'home' ? '#1e3a8a' : '#861726'));
      setPlayerName(player.name || 'J. DOE');
      setPlayerNumber(player.number ?? 7);
    }
  }, [player]);

  // Pointer drag state for smooth rotation
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);

  // Function to create jersey texture with number & name
  const createJerseyTexture = useCallback(
    (isBack: boolean, mainColorHex: string, textColorHex: string, num: number, nameText: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Base jersey fabric
      ctx.fillStyle = mainColorHex;
      ctx.fillRect(0, 0, 512, 512);

      // Subtle fabric weave texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      for (let y = 0; y < 512; y += 4) {
        ctx.fillRect(0, y, 512, 2);
      }

      if (isBack) {
        // Back: Player Surname + Big Number
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Surname arched/straight on upper back
        ctx.fillStyle = textColorHex;
        ctx.font = '900 46px "Inter", "Segoe UI", sans-serif';
        const cleanName = nameText.replace(/^[A-Z]\.\s*/, '').toUpperCase() || 'DOE';
        ctx.fillText(cleanName, 256, 120);

        // Big Back Number
        ctx.font = '900 190px "Inter", "Segoe UI", sans-serif';
        ctx.fillText(String(num), 256, 290);
      } else {
        // Front: Centered Chest Number (as in reference photo #7)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColorHex;
        ctx.font = '900 160px "Inter", "Segoe UI", sans-serif';
        ctx.fillText(String(num), 256, 280);

        // Technical Chest Crest on Left
        ctx.fillStyle = textColorHex;
        ctx.beginPath();
        ctx.arc(140, 160, 22, 0, Math.PI * 2);
        ctx.fill();

        // Brand logo on Right
        ctx.lineWidth = 8;
        ctx.strokeStyle = textColorHex;
        ctx.beginPath();
        ctx.moveTo(350, 165);
        ctx.lineTo(385, 145);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    },
    []
  );

  // Function to create sock texture with black diamond shin-pad graphics
  const createSockTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // White base sock
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 512);

    // Top cuff ribbing
    ctx.fillStyle = '#e2e8f0';
    for (let y = 0; y < 60; y += 8) {
      ctx.fillRect(0, y, 256, 4);
    }

    // Black diamond pattern (As in reference image!)
    ctx.fillStyle = '#0f172a';
    const drawDiamond = (cx: number, cy: number, w: number, h: number) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy - h / 2);
      ctx.lineTo(cx + w / 2, cy);
      ctx.lineTo(cx, cy + h / 2);
      ctx.lineTo(cx - w / 2, cy);
      ctx.closePath();
      ctx.fill();
    };

    // Front Shin Diamonds
    drawDiamond(128, 160, 80, 75);
    drawDiamond(128, 260, 75, 70);

    // Vertical joining stripe
    ctx.fillRect(123, 160, 10, 100);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (Eye-level portrait angle)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.45, 4.3);
    camera.lookAt(0, 1.1, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights (Daytime stadium lighting with soft shadows)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x14532d, 0.6);
    scene.add(hemiLight);

    // Key sunlight
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
    sunLight.position.set(2.5, 4.5, 3.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Subtle rim backlight
    const rimLight = new THREE.DirectionalLight(0xbae6fd, 0.5);
    rimLight.position.set(-2, 3, -3);
    scene.add(rimLight);

    // 5. Pitch Ground (Grass with Field Line marking)
    const pitchGroup = new THREE.Group();

    // Grass plane
    const grassGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.08, 48);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x228b22,
      roughness: 0.85,
      metalness: 0.05,
    });
    const grassMesh = new THREE.Mesh(grassGeo, grassMat);
    grassMesh.position.y = -0.04;
    grassMesh.receiveShadow = true;
    pitchGroup.add(grassMesh);

    // White Pitch Line (Passing under player's feet as in reference photo)
    const lineGeo = new THREE.BoxGeometry(4.2, 0.01, 0.08);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lineMesh = new THREE.Mesh(lineGeo, lineMat);
    lineMesh.position.set(0, 0.005, 0.05);
    lineMesh.receiveShadow = true;
    pitchGroup.add(lineMesh);

    scene.add(pitchGroup);

    // 6. Realistic 3D Full-Body Player Group
    const playerGroup = new THREE.Group();
    playerGroupRef.current = playerGroup;

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xf3c49a,
      roughness: 0.6,
      metalness: 0.05,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x3d2314, // Dark brown athletic fade
      roughness: 0.85,
      metalness: 0.1,
    });

    const collarMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(secondaryColor),
      roughness: 0.7,
      metalness: 0.1,
    });

    const shortsMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(primaryColor),
      roughness: 0.7,
      metalness: 0.1,
    });

    const cleatMat = new THREE.MeshStandardMaterial({
      color: 0x09090b, // Black cleats
      roughness: 0.4,
      metalness: 0.3,
    });

    const whiteStripeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });

    // Front Jersey Texture & Material
    const frontTex = createJerseyTexture(false, primaryColor, secondaryColor, playerNumber, playerName);
    const backTex = createJerseyTexture(true, primaryColor, secondaryColor, playerNumber, playerName);

    const frontJerseyMat = new THREE.MeshStandardMaterial({
      map: frontTex || undefined,
      color: 0xffffff,
      roughness: 0.65,
    });

    const backJerseyMat = new THREE.MeshStandardMaterial({
      map: backTex || undefined,
      color: 0xffffff,
      roughness: 0.65,
    });

    const sideJerseyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(primaryColor),
      roughness: 0.7,
    });

    // Jersey materials array for box/torso geometry: [right, left, top, bottom, front, back]
    const jerseyMaterials = [
      sideJerseyMat,
      sideJerseyMat,
      collarMat,
      sideJerseyMat,
      frontJerseyMat,
      backJerseyMat,
    ];

    // Sock Material with diamond texture
    const sockTex = createSockTexture();
    const sockMat = new THREE.MeshStandardMaterial({
      map: sockTex || undefined,
      color: 0xffffff,
      roughness: 0.7,
    });

    // --- BUILD ATHLETIC 3D BODY MESHES ---

    // A. Torso / Jersey (Athletic V-Taper Shape)
    const torsoGeo = new THREE.BoxGeometry(0.52, 0.68, 0.28, 4, 4, 4);
    const torsoMesh = new THREE.Mesh(torsoGeo, jerseyMaterials);
    torsoMesh.position.y = 1.42;
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    playerGroup.add(torsoMesh);

    // B. Crew Neck Collar
    const collarGeo = new THREE.TorusGeometry(0.12, 0.024, 12, 24);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.position.set(0, 1.77, 0);
    playerGroup.add(collarMesh);

    // C. Neck
    const neckGeo = new THREE.CylinderGeometry(0.085, 0.095, 0.12, 16);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.set(0, 1.8, 0);
    neckMesh.castShadow = true;
    playerGroup.add(neckMesh);

    // D. Head & Face
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.95, 0);

    // Cranium
    const headGeo = new THREE.SphereGeometry(0.14, 24, 20);
    headGeo.scale(1, 1.2, 1.05);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Hair (Modern Short Athletic Fade)
    const hairGeo = new THREE.SphereGeometry(0.145, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.58);
    hairGeo.scale(1.02, 1.16, 1.06);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.02, -0.01);
    headGroup.add(hairMesh);

    // Ears
    const earGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.018, 12);
    earGeo.rotateZ(Math.PI / 2);
    const leftEar = new THREE.Mesh(earGeo, skinMat);
    leftEar.position.set(-0.142, 0, 0);
    headGroup.add(leftEar);

    const rightEar = leftEar.clone();
    rightEar.position.x = 0.142;
    headGroup.add(rightEar);

    playerGroup.add(headGroup);

    // E. Shoulders & Arms
    const createArm = (isLeft: boolean) => {
      const armGroup = new THREE.Group();
      const sign = isLeft ? -1 : 1;
      armGroup.position.set(sign * 0.32, 1.72, 0);

      // Sleeve (Jersey Color)
      const sleeveGeo = new THREE.CylinderGeometry(0.095, 0.088, 0.22, 16);
      sleeveGeo.rotateZ(sign * 0.12);
      const sleeveMesh = new THREE.Mesh(sleeveGeo, sideJerseyMat);
      sleeveMesh.position.set(sign * 0.03, -0.08, 0);
      sleeveMesh.castShadow = true;
      armGroup.add(sleeveMesh);

      // Sleeve Trim Ring (Dark Navy)
      const trimGeo = new THREE.TorusGeometry(0.09, 0.018, 10, 20);
      trimGeo.rotateX(Math.PI / 2);
      const trimMesh = new THREE.Mesh(trimGeo, collarMat);
      trimMesh.position.set(sign * 0.045, -0.19, 0);
      armGroup.add(trimMesh);

      // Muscular Bare Bicep/Forearm
      const armSkinGeo = new THREE.CylinderGeometry(0.068, 0.052, 0.44, 16);
      armSkinGeo.rotateZ(sign * 0.05);
      const armSkinMesh = new THREE.Mesh(armSkinGeo, skinMat);
      armSkinMesh.position.set(sign * 0.06, -0.42, 0);
      armSkinMesh.castShadow = true;
      armGroup.add(armSkinMesh);

      // Hand & Knuckles
      const handGeo = new THREE.BoxGeometry(0.06, 0.11, 0.07);
      const handMesh = new THREE.Mesh(handGeo, skinMat);
      handMesh.position.set(sign * 0.075, -0.66, 0);
      armGroup.add(handMesh);

      return armGroup;
    };

    playerGroup.add(createArm(true));
    playerGroup.add(createArm(false));

    // F. Soccer Shorts (Yellow matching jersey)
    const shortsGroup = new THREE.Group();
    shortsGroup.position.set(0, 1.02, 0);

    // Waist / Pelvis
    const pelvisGeo = new THREE.BoxGeometry(0.48, 0.22, 0.26);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, shortsMat);
    pelvisMesh.castShadow = true;
    shortsGroup.add(pelvisMesh);

    // Left Short Leg
    const shortLegGeo = new THREE.CylinderGeometry(0.13, 0.14, 0.26, 16);
    const leftShort = new THREE.Mesh(shortLegGeo, shortsMat);
    leftShort.position.set(-0.13, -0.12, 0);
    leftShort.castShadow = true;
    shortsGroup.add(leftShort);

    // Right Short Leg
    const rightShort = new THREE.Mesh(shortLegGeo, shortsMat);
    rightShort.position.set(0.13, -0.12, 0);
    rightShort.castShadow = true;
    shortsGroup.add(rightShort);

    playerGroup.add(shortsGroup);

    // G. Legs, Knee Caps, Socks & Cleats
    const createLeg = (isLeft: boolean) => {
      const legGroup = new THREE.Group();
      const sign = isLeft ? -1 : 1;
      legGroup.position.set(sign * 0.13, 0.78, 0);

      // Thigh & Bare Knee
      const kneeGeo = new THREE.CylinderGeometry(0.08, 0.075, 0.22, 16);
      const kneeMesh = new THREE.Mesh(kneeGeo, skinMat);
      kneeMesh.position.y = -0.06;
      kneeMesh.castShadow = true;
      legGroup.add(kneeMesh);

      // High Sock with Black Diamond Graphics
      const sockLegGeo = new THREE.CylinderGeometry(0.078, 0.065, 0.44, 16);
      const sockMesh = new THREE.Mesh(sockLegGeo, sockMat);
      sockMesh.position.y = -0.36;
      sockMesh.castShadow = true;
      legGroup.add(sockMesh);

      // Cleat / Football Boot (Black with White Stripes)
      const bootGroup = new THREE.Group();
      bootGroup.position.set(0, -0.62, 0.05);

      const bootGeo = new THREE.BoxGeometry(0.11, 0.09, 0.27);
      const bootMesh = new THREE.Mesh(bootGeo, cleatMat);
      bootMesh.position.y = 0.02;
      bootMesh.castShadow = true;
      bootGroup.add(bootMesh);

      // Cleat White Stripes
      const stripeGeo = new THREE.BoxGeometry(0.114, 0.02, 0.02);
      for (let s = -1; s <= 1; s++) {
        const stripe = new THREE.Mesh(stripeGeo, whiteStripeMat);
        stripe.position.set(0, 0.03, s * 0.04);
        bootGroup.add(stripe);
      }

      // Cleat Studs
      const studGeo = new THREE.CylinderGeometry(0.015, 0.012, 0.02, 8);
      for (const [sx, sz] of [[-0.03, -0.08], [0.03, -0.08], [-0.03, 0.08], [0.03, 0.08]]) {
        const stud = new THREE.Mesh(studGeo, whiteStripeMat);
        stud.position.set(sx, -0.03, sz);
        bootGroup.add(stud);
      }

      legGroup.add(bootGroup);
      return legGroup;
    };

    playerGroup.add(createLeg(true));
    playerGroup.add(createLeg(false));

    // Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(1.0, 0.6);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x07150a,
      transparent: true,
      opacity: 0.55,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, 0.008, 0.05);
    playerGroup.add(shadowMesh);

    scene.add(playerGroup);

    // Initial rotation sync
    const initialRad = (rotationDeg * Math.PI) / 180;
    playerGroup.rotation.y = initialRad;

    // Animation Render Loop
    let currentRad = initialRad;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (isAutoRotating && playerGroupRef.current) {
        playerGroupRef.current.rotation.y += 0.015;
        const deg = Math.round(((playerGroupRef.current.rotation.y * 180) / Math.PI) % 360);
        const normalizedDeg = deg < 0 ? deg + 360 : deg;
        setRotationDeg(normalizedDeg);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      renderer.dispose();
      container.replaceChildren();
    };
  }, [isOpen, primaryColor, secondaryColor, playerNumber, playerName, createJerseyTexture, createSockTexture]);

  // Update rotation when rotationDeg state changes (manual slider / buttons)
  useEffect(() => {
    if (playerGroupRef.current && !isAutoRotating) {
      playerGroupRef.current.rotation.y = (rotationDeg * Math.PI) / 180;
    }
  }, [rotationDeg, isAutoRotating]);

  // Pointer drag to smoothly orient left/right
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPointerXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !playerGroupRef.current) return;
    const deltaX = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;

    // 1 pixel = ~0.6 degrees of yaw rotation
    const newDeg = (rotationDeg + deltaX * 0.7) % 360;
    const normalized = Math.round(newDeg < 0 ? newDeg + 360 : newDeg);
    setRotationDeg(normalized);
    playerGroupRef.current.rotation.y = (normalized * Math.PI) / 180;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Quick Turn Presets
  const handleRotateBy = (deltaDeg: number) => {
    setIsAutoRotating(false);
    const newDeg = (rotationDeg + deltaDeg) % 360;
    const normalized = Math.round(newDeg < 0 ? newDeg + 360 : newDeg);
    setRotationDeg(normalized);
  };

  const handleSetExactAngle = (deg: number) => {
    setIsAutoRotating(false);
    setRotationDeg(deg);
  };

  // Capture current 3D viewport as player avatar
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current || !player) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    onApplyPhotoAvatar?.(player.id, dataUrl);
    setCapturedNotice(true);
    setTimeout(() => setCapturedNotice(false), 2500);
  };

  // Apply orientation to tactical pitch player
  const handleApplyToPitch = () => {
    if (!player) return;
    onApplyOrientation(player.id, rotationDeg);
    if (onUpdatePlayerColor) {
      onUpdatePlayerColor(player.id, primaryColor, secondaryColor);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1120] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span>Studio Giocatore 3D HD</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  Alta Definizione
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Visualizza la figura completa in 3D e orienta il calciatore a sinistra o a destra
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 sm:p-4 overflow-y-auto">
          {/* Left: 3D Viewport with interactive drag */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#07131e] via-[#091b16] to-[#041009] rounded-xl border border-slate-800 overflow-hidden shadow-inner min-h-[380px] sm:min-h-[440px]">
            {/* 3D WebGL Canvas Container */}
            <div
              ref={mountRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-full cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
              title="Trascina con il mouse o il dito per orientare il giocatore a destra e a sinistra"
            />

            {/* Broadcast Nameplate Overlay (Identical to reference photo!) */}
            <div className="absolute bottom-3 left-0 right-0 pointer-events-none flex flex-col items-center select-none text-center">
              <span className="text-white font-extrabold text-base sm:text-lg tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase font-sans">
                {playerName}
              </span>
              <span className="text-amber-400 font-black text-xs sm:text-sm tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-sans">
                NUMBER {playerNumber}
              </span>
            </div>

            {/* Drag Hint Pill */}
            <div className="absolute top-3 left-3 bg-slate-950/70 border border-slate-700/60 rounded-full px-2.5 py-1 text-[10px] text-slate-300 backdrop-blur-sm pointer-events-none flex items-center gap-1.5 shadow">
              <Compass size={11} className="text-amber-400 animate-spin-slow" />
              <span>Trascina per ruotare 360°</span>
            </div>

            {/* Current Angle Pill */}
            <div className="absolute top-3 right-3 bg-slate-950/70 border border-slate-700/60 rounded-full px-2.5 py-1 text-[10.5px] font-mono font-bold text-amber-300 backdrop-blur-sm shadow">
              {rotationDeg}° • {rotationDeg < 45 || rotationDeg >= 315 ? 'Fronte' : rotationDeg < 135 ? 'Destra' : rotationDeg < 225 ? 'Di Spalle' : 'Sinistra'}
            </div>

            {/* Snapshot Notice */}
            {capturedNotice && (
              <div className="absolute inset-x-4 top-12 mx-auto max-w-xs bg-emerald-600/90 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl text-center animate-in fade-in flex items-center justify-center gap-1.5 backdrop-blur-sm">
                <Check size={14} />
                <span>Foto 3D impostata come avatar!</span>
              </div>
            )}
          </div>

          {/* Right: Controls & Presets */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 bg-slate-900/50 p-3 sm:p-4 rounded-xl border border-slate-800">
            <div className="space-y-3.5">
              {/* 1. Direct Left / Right Orientation Controls */}
              <div>
                <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                  <span>Orientamento (Gira a Destra / Sinistra)</span>
                  <span className="font-mono text-slate-400 text-[10px]">{rotationDeg}°</span>
                </label>

                {/* Left / Right Big Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => handleRotateBy(-45)}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-xs active:scale-95 transition-all shadow-sm"
                  >
                    <RotateCcw size={14} className="text-amber-400" />
                    <span>◀ Gira Sinistra (-45°)</span>
                  </button>

                  <button
                    onClick={() => handleRotateBy(45)}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-xs active:scale-95 transition-all shadow-sm"
                  >
                    <span>Gira Destra (+45°) ▶</span>
                    <RotateCw size={14} className="text-amber-400" />
                  </button>
                </div>

                {/* 4 Cardinal Perspectives */}
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  <button
                    onClick={() => handleSetExactAngle(0)}
                    className={`py-1.5 rounded-lg border text-[10.5px] font-semibold transition-all ${
                      rotationDeg === 0
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Fronte (0°)
                  </button>

                  <button
                    onClick={() => handleSetExactAngle(90)}
                    className={`py-1.5 rounded-lg border text-[10.5px] font-semibold transition-all ${
                      rotationDeg === 90
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Destra (90°)
                  </button>

                  <button
                    onClick={() => handleSetExactAngle(180)}
                    className={`py-1.5 rounded-lg border text-[10.5px] font-semibold transition-all ${
                      rotationDeg === 180
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Retro (180°)
                  </button>

                  <button
                    onClick={() => handleSetExactAngle(270)}
                    className={`py-1.5 rounded-lg border text-[10.5px] font-semibold transition-all ${
                      rotationDeg === 270
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Sinistra (270°)
                  </button>
                </div>

                {/* Continuous Rotation Slider */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={rotationDeg}
                    onChange={(e) => {
                      setIsAutoRotating(false);
                      setRotationDeg(Number(e.target.value));
                    }}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <button
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`p-1.5 rounded-lg border text-[10px] flex items-center gap-1 transition-colors ${
                      isAutoRotating
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                    title="Attiva/disattiva rotazione continua 360°"
                  >
                    {isAutoRotating ? <Pause size={12} /> : <Play size={12} />}
                  </button>
                </div>
              </div>

              {/* 2. Kit & Color Presets */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Shirt size={12} className="text-amber-400" />
                  <span>Divisa & Colori Squadra</span>
                </label>

                <div className="grid grid-cols-2 gap-1.5">
                  {/* Photo Match Preset: Yellow #7 */}
                  <button
                    onClick={() => {
                      setPrimaryColor('#eab308');
                      setSecondaryColor('#1e3a8a');
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                      primaryColor === '#eab308'
                        ? 'bg-amber-950/40 border-amber-500 text-white'
                        : 'bg-slate-800/70 border-slate-700 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-yellow-400 border border-blue-900 flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-blue-900">
                      7
                    </div>
                    <div className="truncate">
                      <span className="text-[10.5px] font-bold block truncate">Giallo #7 (Foto)</span>
                      <span className="text-[8.5px] text-slate-400">Giallo & Blu Navy</span>
                    </div>
                  </button>

                  {/* AS Roma Home */}
                  <button
                    onClick={() => {
                      setPrimaryColor('#861726');
                      setSecondaryColor('#facc15');
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                      primaryColor === '#861726'
                        ? 'bg-amber-950/40 border-amber-500 text-white'
                        : 'bg-slate-800/70 border-slate-700 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#861726] border border-amber-400 flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-amber-300">
                      RM
                    </div>
                    <div className="truncate">
                      <span className="text-[10.5px] font-bold block truncate">AS Roma Casa</span>
                      <span className="text-[8.5px] text-slate-400">Bordeaux & Oro</span>
                    </div>
                  </button>

                  {/* Away White */}
                  <button
                    onClick={() => {
                      setPrimaryColor('#f8fafc');
                      setSecondaryColor('#861726');
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                      primaryColor === '#f8fafc'
                        ? 'bg-slate-800 border-amber-500 text-white'
                        : 'bg-slate-800/70 border-slate-700 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white border border-slate-300 flex-shrink-0" />
                    <div className="truncate">
                      <span className="text-[10.5px] font-bold block truncate">Seconda Divisa</span>
                      <span className="text-[8.5px] text-slate-400">Bianco & Dettagli</span>
                    </div>
                  </button>

                  {/* Keeper Green */}
                  <button
                    onClick={() => {
                      setPrimaryColor('#059669');
                      setSecondaryColor('#ffffff');
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                      primaryColor === '#059669'
                        ? 'bg-emerald-950/40 border-amber-500 text-white'
                        : 'bg-slate-800/70 border-slate-700 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-600 border border-emerald-400 flex-shrink-0" />
                    <div className="truncate">
                      <span className="text-[10.5px] font-bold block truncate">Portiere</span>
                      <span className="text-[8.5px] text-slate-400">Verde Smeraldo</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. Name & Number Editor */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Nome Calciatore</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">N° Maglia</label>
                  <input
                    type="number"
                    value={playerNumber}
                    onChange={(e) => setPlayerNumber(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold text-xs text-center focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              {/* Snapshot as Avatar button */}
              <button
                onClick={handleCaptureSnapshot}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                title="Cattura questo render 3D e impostalo come foto del giocatore sul campo"
              >
                <Camera size={13} className="text-amber-400" />
                <span>Salva Render 3D come Avatar</span>
              </button>

              {/* Main Apply Button */}
              <button
                onClick={handleApplyToPitch}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
              >
                <Check size={15} strokeWidth={3} />
                <span>Applica Orientamento ({rotationDeg}°) al Campo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
