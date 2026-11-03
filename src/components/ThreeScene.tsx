import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Pause, Sparkles, ChevronDown, ChevronUp, Layers, Activity, Cpu } from 'lucide-react';
import type { Language } from '../types/index.ts';

interface ThreeSceneProps {
  language: Language;
  className?: string;
}

type PaletteName = 'cobalt' | 'emerald' | 'amber';

interface PaletteColors {
  primary: number;
  secondary: number;
  core: number;
  ambient: number;
  hexPrimary: string;
  hexSecondary: string;
  hexCore: string;
  label: string;
}

const PALETTES: Record<PaletteName, PaletteColors> = {
  cobalt: {
    primary: 0x2563eb,
    secondary: 0x38bdf8,
    core: 0x60a5fa,
    ambient: 0x0f172a,
    hexPrimary: '#2563eb',
    hexSecondary: '#38bdf8',
    hexCore: '#60a5fa',
    label: 'Cobalt Matrix',
  },
  emerald: {
    primary: 0x059669,
    secondary: 0x34d399,
    core: 0x10b981,
    ambient: 0x064e3b,
    hexPrimary: '#059669',
    hexSecondary: '#34d399',
    hexCore: '#10b981',
    label: 'Terminal Emerald',
  },
  amber: {
    primary: 0xd97706,
    secondary: 0xfbbf24,
    core: 0xf59e0b,
    ambient: 0x451a03,
    hexPrimary: '#d97706',
    hexSecondary: '#fbbf24',
    hexCore: '#f59e0b',
    label: 'Cyber Amber',
  },
};

function safeCheckWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  const originalError = console.error;
  const originalWarn = console.warn;
  try {
    console.error = () => {};
    console.warn = () => {};

    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    if (!gl2) {
      return false;
    }

    const ext = gl2.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      const gpu = String(gl2.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
      if (/SwiftShader|llvmpipe|softpipe|Software|Basic Render|Direct3D9|0x0046/i.test(gpu)) {
        gl2.getExtension('WEBGL_lose_context')?.loseContext();
        return false;
      }
    }

    gl2.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  } finally {
    console.error = originalError;
    console.warn = originalWarn;
  }
}

function createCircuitCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1.5;

    const step = 32;
    for (let x = 0; x <= 512; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const rx = (i * 64 + 32) % 512;
      ctx.beginPath();
      ctx.arc(rx, rx, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.moveTo(rx, rx);
      ctx.lineTo(rx + 32, rx);
      ctx.lineTo(rx + 32, rx + 32);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }

  return new THREE.CanvasTexture(canvas);
}

interface SatelliteData {
  name: string;
  role: string;
  radius: number;
  speed: number;
  angleOffset: number;
  yOffset: number;
}

const TOPOLOGY_NODES: SatelliteData[] = [
  { name: 'API_GW', role: 'Express Routing', radius: 130, speed: 0.9, angleOffset: 0, yOffset: -20 },
  { name: 'AUTH_SRV', role: 'Security / JWT', radius: 155, speed: 0.75, angleOffset: 1.3, yOffset: 25 },
  { name: 'MONGO_CORE', role: 'Database Engine', radius: 180, speed: 0.6, angleOffset: 2.6, yOffset: -15 },
  { name: 'AI_AGENT', role: 'Gemini Telemetry', radius: 140, speed: 1.1, angleOffset: 3.9, yOffset: 18 },
  { name: 'REDIS_CACHE', role: 'In-Memory State', radius: 165, speed: 0.8, angleOffset: 5.1, yOffset: -10 },
];

export function ThreeScene({ language, className = '' }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [pulseEnabled, setPulseEnabled] = useState<boolean>(true);
  const [palette, setPalette] = useState<PaletteName>('cobalt');
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);
  const [activeEngine, setActiveEngine] = useState<'webgl' | 'canvas2d'>('webgl');

  const sceneStateRef = useRef({
    wireframe,
    speedMultiplier,
    pulseEnabled,
    palette,
  });

  useEffect(() => {
    sceneStateRef.current = {
      wireframe,
      speedMultiplier,
      pulseEnabled,
      palette,
    };
  }, [wireframe, speedMultiplier, pulseEnabled, palette]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let cleanupWebGL: (() => void) | null = null;
    let cleanupCanvas2D: (() => void) | null = null;

    const runCanvas2DFallback = (): (() => void) | null => {
      setActiveEngine('canvas2d');
      const canvas = document.createElement('canvas');
      canvas.className = 'w-full h-full block';
      container.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      let animationFrameId: number;
      let rotY = 0;
      let rotX = 0.25;
      let targetRotY = 0;
      let targetRotX = 0.25;
      let isDragging = false;
      let prevX = 0;
      let prevY = 0;

      const handleResize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = container.clientWidth || 600;
        const h = container.clientHeight || 450;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.resetTransform?.();
        ctx.scale(dpr, dpr);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevX;
        const deltaY = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.006;
        targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      canvas.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      let lastTime = performance.now();
      let frameCount = 0;
      let fpsClock = performance.now();

      const render2D = (time: number) => {
        animationFrameId = requestAnimationFrame(render2D);

        const delta = (time - lastTime) * 0.001;
        lastTime = time;

        frameCount++;
        if (time - fpsClock > 500) {
          setFps(Math.round((frameCount * 1000) / (time - fpsClock)));
          frameCount = 0;
          fpsClock = time;
        }

        const { wireframe: wf, speedMultiplier: spd, pulseEnabled: pls, palette: pal } = sceneStateRef.current;
        const palCfg = PALETTES[pal];

        rotY += (targetRotY - rotY) * 0.08;
        rotX += (targetRotX - rotX) * 0.08;
        targetRotY += spd * 0.35 * delta;

        const w = container.clientWidth || 600;
        const h = container.clientHeight || 450;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        const gradBg = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(w, h) * 0.7);
        gradBg.addColorStop(0, '#0c1322');
        gradBg.addColorStop(0.6, '#070b14');
        gradBg.addColorStop(1, '#03060a');
        ctx.fillStyle = gradBg;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = wf ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let gx = 0; gx <= w; gx += gridSize) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }
        for (let gy = 0; gy <= h; gy += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }
        ctx.restore();

        const elapsed = time * 0.001;
        const pulseScale = pls ? 1.0 + Math.sin(elapsed * 4) * 0.09 : 1.0;

        ctx.save();
        ctx.translate(cx, cy);

        const ringRadii = [80, 130, 180];
        ringRadii.forEach((r, idx) => {
          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * (0.45 + rotX * 0.2), rotY * 0.3 * (idx % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
          ctx.strokeStyle = idx === 0 ? `${palCfg.hexSecondary}55` : 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = wf ? 1.5 : 1;
          if (idx === 1) {
            ctx.setLineDash([4, 6]);
          } else {
            ctx.setLineDash([]);
          }
          ctx.stroke();
        });
        ctx.setLineDash([]);

        const projectedNodes = TOPOLOGY_NODES.map((node) => {
          const angle = elapsed * node.speed * spd * 0.5 + node.angleOffset + rotY;
          const tiltFactor = 0.45 + rotX * 0.2;
          const px = Math.cos(angle) * node.radius;
          const pz = Math.sin(angle);
          const py = Math.sin(angle) * node.radius * tiltFactor + node.yOffset + rotX * 40;
          const depth = (pz + 1) / 2;
          return {
            ...node,
            x: px,
            y: py,
            depth,
            angle,
          };
        }).sort((a, b) => a.depth - b.depth);

        projectedNodes.forEach((node) => {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = wf ? `${palCfg.hexSecondary}33` : `${palCfg.hexPrimary}26`;
          ctx.lineWidth = 1;
          ctx.stroke();

          if (spd > 0) {
            const packetT = (elapsed * node.speed * spd + node.angleOffset) % 1;
            const pktx = node.x * (1 - packetT);
            const pkty = node.y * (1 - packetT);
            ctx.beginPath();
            ctx.arc(pktx, pkty, 2, 0, Math.PI * 2);
            ctx.fillStyle = palCfg.hexSecondary;
            ctx.fill();
          }
        });

        const coreRadius = 38 * pulseScale;
        const glowGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, coreRadius * 2);
        glowGrad.addColorStop(0, palCfg.hexCore);
        glowGrad.addColorStop(0.3, `${palCfg.hexPrimary}99`);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, coreRadius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = palCfg.hexSecondary;
        ctx.lineWidth = wf ? 2 : 1.5;
        ctx.stroke();

        ctx.save();
        ctx.rotate(-elapsed * 0.8 * spd);
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = palCfg.hexCore;
        ctx.beginPath();
        ctx.arc(0, 0, coreRadius + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CORE_API', 0, -2);
        ctx.fillStyle = `${palCfg.hexSecondary}`;
        ctx.font = '9px ui-monospace, monospace';
        ctx.fillText('v2.4 ONLINE', 0, 11);

        projectedNodes.forEach((node) => {
          const nodeRadius = 8 + node.depth * 4;
          const alpha = 0.4 + node.depth * 0.6;

          ctx.save();
          ctx.globalAlpha = alpha;

          if (wf) {
            ctx.strokeStyle = palCfg.hexSecondary;
            ctx.lineWidth = 1;
            ctx.strokeRect(node.x - nodeRadius - 4, node.y - nodeRadius - 4, (nodeRadius + 4) * 2, (nodeRadius + 4) * 2);
          }

          const nodeGlow = ctx.createRadialGradient(node.x, node.y, 1, node.x, node.y, nodeRadius * 2.2);
          nodeGlow.addColorStop(0, palCfg.hexSecondary);
          nodeGlow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = nodeGlow;
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = palCfg.hexSecondary;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(node.name, node.x, node.y - nodeRadius - 5);

          ctx.fillStyle = 'rgba(203, 213, 225, 0.7)';
          ctx.font = '8px ui-monospace, monospace';
          ctx.fillText(node.role, node.x, node.y + nodeRadius + 9);

          ctx.restore();
        });

        ctx.restore();
      };

      animationFrameId = requestAnimationFrame(render2D);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        if (container.contains(canvas)) {
          container.removeChild(canvas);
        }
      };
    };

    const runWebGL = (): (() => void) | null => {
      let animationFrameId: number;
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 450;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x090d16, 0.035);

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 3.2, 7.8);

      let renderer: THREE.WebGLRenderer | null = null;
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;

      try {
        console.error = (...args: unknown[]) => {
          const msg = args.map((a) => (typeof a === 'string' ? a : (a as { message?: string })?.message || '')).join(' ');
          if (
            msg.includes('WebGLRenderer') ||
            msg.includes('WebGL') ||
            msg.includes('BindToCurrentSequence')
          ) {
            return;
          }
          originalConsoleError.apply(console, args);
        };

        console.warn = (...args: unknown[]) => {
          const msg = args.map((a) => (typeof a === 'string' ? a : (a as { message?: string })?.message || '')).join(' ');
          if (msg.includes('WebGLRenderer') || msg.includes('WebGL')) {
            return;
          }
          originalConsoleWarn.apply(console, args);
        };

        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'default',
        });
      } catch {
        renderer = null;
      } finally {
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;
      }

      if (!renderer || !renderer.domElement) {
        return null;
      }

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
      setActiveEngine('webgl');

      const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x090d16, 1.2);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
      dirLight.position.set(5, 8, 4);
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(PALETTES.cobalt.primary, 3.5, 10);
      pointLight.position.set(0, 1.5, 0);
      scene.add(pointLight);

      const rimLight = new THREE.PointLight(PALETTES.cobalt.secondary, 2.0, 8);
      rimLight.position.set(-3, -1, -3);
      scene.add(rimLight);

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      const shadowTex = createContactShadowTexture();
      const shadowGeo = new THREE.PlaneGeometry(5, 5);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -1.55;
      scene.add(shadowMesh);

      const circuitTex = createCircuitCanvasTexture();
      const pedestalGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.25, 32);
      const pedestalMat = new THREE.MeshStandardMaterial({
        map: circuitTex,
        roughness: 0.3,
        metalness: 0.7,
        color: 0x1e293b,
      });
      const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestal.position.y = -1.45;
      rootGroup.add(pedestal);

      const pedestalRingGeo = new THREE.TorusGeometry(2.5, 0.04, 16, 64);
      const pedestalRingMat = new THREE.MeshStandardMaterial({
        color: PALETTES.cobalt.secondary,
        emissive: PALETTES.cobalt.secondary,
        emissiveIntensity: 0.8,
      });
      const pedestalRing = new THREE.Mesh(pedestalRingGeo, pedestalRingMat);
      pedestalRing.rotation.x = Math.PI / 2;
      pedestalRing.position.y = -1.33;
      rootGroup.add(pedestalRing);

      const clusterGroup = new THREE.Group();
      clusterGroup.position.y = 0.1;
      rootGroup.add(clusterGroup);

      const coreInnerGeo = new THREE.IcosahedronGeometry(0.7, 2);
      const coreInnerMat = new THREE.MeshStandardMaterial({
        color: PALETTES.cobalt.core,
        emissive: PALETTES.cobalt.core,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.9,
        wireframe: false,
      });
      const coreMesh = new THREE.Mesh(coreInnerGeo, coreInnerMat);
      clusterGroup.add(coreMesh);

      const cageGeo = new THREE.IcosahedronGeometry(0.95, 1);
      const cageMat = new THREE.MeshStandardMaterial({
        color: PALETTES.cobalt.secondary,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      });
      const cageMesh = new THREE.Mesh(cageGeo, cageMat);
      clusterGroup.add(cageMesh);

      const ring1Geo = new THREE.TorusGeometry(1.4, 0.025, 16, 64);
      const ring1Mat = new THREE.MeshStandardMaterial({
        color: PALETTES.cobalt.secondary,
        emissive: PALETTES.cobalt.primary,
        emissiveIntensity: 0.5,
      });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      clusterGroup.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(1.8, 0.02, 16, 64);
      const ring2Mat = new THREE.MeshStandardMaterial({
        color: PALETTES.cobalt.primary,
        emissive: PALETTES.cobalt.secondary,
        emissiveIntensity: 0.4,
      });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI / 3;
      clusterGroup.add(ring2);

      const serverPillars: THREE.Mesh[] = [];
      const pillarCount = 4;
      const pillarRadius = 1.95;
      const pillarGeo = new THREE.BoxGeometry(0.35, 1.8, 0.35);

      for (let i = 0; i < pillarCount; i++) {
        const angle = (i * Math.PI * 2) / pillarCount;
        const pillarMat = new THREE.MeshStandardMaterial({
          color: 0x111827,
          metalness: 0.85,
          roughness: 0.25,
        });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(Math.cos(angle) * pillarRadius, 0, Math.sin(angle) * pillarRadius);
        clusterGroup.add(pillar);
        serverPillars.push(pillar);

        for (let j = 0; j < 3; j++) {
          const ledGeo = new THREE.BoxGeometry(0.08, 0.04, 0.02);
          const ledMat = new THREE.MeshStandardMaterial({
            color: PALETTES.cobalt.secondary,
            emissive: PALETTES.cobalt.secondary,
            emissiveIntensity: 1.2,
          });
          const led = new THREE.Mesh(ledGeo, ledMat);
          led.position.set(
            Math.cos(angle) * pillarRadius,
            -0.5 + j * 0.45,
            Math.sin(angle) * pillarRadius + 0.18
          );
          led.lookAt(0, led.position.y, 0);
          clusterGroup.add(led);
        }
      }

      const satelliteNodes: THREE.Mesh[] = [];
      const satelliteCount = 5;
      const satelliteGeo = new THREE.DodecahedronGeometry(0.18, 0);

      for (let i = 0; i < satelliteCount; i++) {
        const satMat = new THREE.MeshStandardMaterial({
          color: PALETTES.cobalt.secondary,
          emissive: PALETTES.cobalt.primary,
          emissiveIntensity: 0.6,
          roughness: 0.2,
          metalness: 0.8,
        });
        const sat = new THREE.Mesh(satelliteGeo, satMat);
        clusterGroup.add(sat);
        satelliteNodes.push(sat);
      }

      let isDragging = false;
      let prevMouseX = 0;
      let prevMouseY = 0;
      let targetRotationY = 0;
      let targetRotationX = 0;
      let currentRotationY = 0;
      let currentRotationX = 0;

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX));
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      const canvasElem = renderer.domElement;
      canvasElem.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || 600;
        const h = container.clientHeight || 450;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', onResize);

      let lastTime = performance.now();
      let frameCounter = 0;
      let fpsTimer = performance.now();

      const animate = (time: number) => {
        animationFrameId = requestAnimationFrame(animate);

        const delta = (time - lastTime) * 0.001;
        lastTime = time;

        frameCounter++;
        if (time - fpsTimer > 500) {
          setFps(Math.round((frameCounter * 1000) / (time - fpsTimer)));
          frameCounter = 0;
          fpsTimer = time;
        }

        const { wireframe: wf, speedMultiplier: spd, pulseEnabled: pls, palette: pal } = sceneStateRef.current;
        const palColors = PALETTES[pal];

        pointLight.color.setHex(palColors.primary);
        rimLight.color.setHex(palColors.secondary);
        pedestalRingMat.color.setHex(palColors.secondary);
        pedestalRingMat.emissive.setHex(palColors.secondary);
        coreInnerMat.color.setHex(palColors.core);
        coreInnerMat.emissive.setHex(palColors.core);
        cageMat.color.setHex(palColors.secondary);
        ring1Mat.color.setHex(palColors.secondary);
        ring2Mat.color.setHex(palColors.primary);

        coreInnerMat.wireframe = wf;
        pedestalMat.wireframe = wf;
        for (const p of serverPillars) {
          (p.material as THREE.MeshStandardMaterial).wireframe = wf;
        }

        currentRotationY += (targetRotationY - currentRotationY) * 0.05;
        currentRotationX += (targetRotationX - currentRotationX) * 0.05;

        const autoSpin = spd * 0.45 * delta;
        targetRotationY += autoSpin;

        rootGroup.rotation.y = currentRotationY;
        rootGroup.rotation.x = currentRotationX;

        const elapsed = time * 0.001;
        ring1.rotation.x = elapsed * 0.8 * spd;
        ring1.rotation.y = elapsed * 0.4 * spd;
        ring2.rotation.y = -elapsed * 0.6 * spd;
        ring2.rotation.z = elapsed * 0.5 * spd;

        cageMesh.rotation.y = -elapsed * 0.5 * spd;
        cageMesh.rotation.x = elapsed * 0.3 * spd;

        if (pls) {
          const pulse = 1.0 + Math.sin(elapsed * 3.5) * 0.12;
          coreMesh.scale.set(pulse, pulse, pulse);
          coreInnerMat.emissiveIntensity = 0.8 + Math.sin(elapsed * 3.5) * 0.4;
        } else {
          coreMesh.scale.set(1, 1, 1);
          coreInnerMat.emissiveIntensity = 0.8;
        }

        for (let i = 0; i < satelliteNodes.length; i++) {
          const sat = satelliteNodes[i];
          const angle = elapsed * 0.7 * spd + (i * Math.PI * 2) / satelliteNodes.length;
          const orbitR = 1.6 + Math.sin(elapsed + i) * 0.2;
          sat.position.set(
            Math.cos(angle) * orbitR,
            Math.sin(angle * 1.5) * 0.45,
            Math.sin(angle) * orbitR
          );
          sat.rotation.x += delta * 2;
          sat.rotation.y += delta * 2;
        }

        renderer.render(scene, camera);
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', onResize);
        canvasElem.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
        circuitTex.dispose();
        shadowTex.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    };

    if (safeCheckWebGL()) {
      try {
        cleanupWebGL = runWebGL();
        if (!cleanupWebGL) {
          cleanupCanvas2D = runCanvas2DFallback();
        }
      } catch {
        cleanupCanvas2D = runCanvas2DFallback();
      }
    } else {
      cleanupCanvas2D = runCanvas2DFallback();
    }

    return () => {
      if (cleanupWebGL) cleanupWebGL();
      if (cleanupCanvas2D) cleanupCanvas2D();
    };
  }, []);

  const isAr = language === 'ar';

  return (
    <div className={`relative w-full h-[460px] md:h-[540px] rounded-2xl overflow-hidden border dark:border-white/10 border-slate-200 dark:bg-[#070b14] bg-slate-900 shadow-2xl ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        title={isAr ? 'اسحب بالماوس للتدوير التفاعلي' : 'Click & drag to inspect node matrix'}
      />

      <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-2">
          {activeEngine === 'webgl' ? (
            <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          ) : (
            <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          )}
          <span>
            {isAr
              ? activeEngine === 'webgl'
                ? 'مصفوفة معمارية 3D (WebGL)'
                : 'مصفوفة معمارية تفاعلية (Canvas 2D)'
              : activeEngine === 'webgl'
              ? '3D Cluster Topology (WebGL)'
              : '2D Topology Matrix (Canvas 2D)'}
          </span>
        </div>
        <div className="px-2.5 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/5 text-[11px] font-mono text-emerald-400">
          {fps} FPS
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 max-w-[280px] w-full bg-black/75 backdrop-blur-md border border-white/15 rounded-xl shadow-xl overflow-hidden text-xs text-slate-200 font-sans transition-all duration-200">
        <div className="px-3 py-2 flex items-center justify-between border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>{isAr ? 'لوحة تحكم المشهد' : 'Console Topology HUD'}</span>
          </div>
          <button
            onClick={() => setIsDockCollapsed((prev) => !prev)}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={isDockCollapsed ? 'Expand HUD' : 'Collapse HUD'}
          >
            {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {!isDockCollapsed && (
          <div className="p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{isAr ? 'الهيكل الشبكي (Wireframe)' : 'Wireframe'}</span>
              <button
                onClick={() => setWireframe((prev) => !prev)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                  wireframe ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>{wireframe ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">{isAr ? 'السرعة' : 'Speed'}</span>
              <div className="flex items-center gap-1 font-mono text-[11px]">
                {[0, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeedMultiplier(s)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      speedMultiplier === s
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-white/10 hover:bg-white/20 text-slate-300'
                    }`}
                  >
                    {s === 0 ? <Pause className="w-2.5 h-2.5" /> : `${s}x`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">{isAr ? 'نبض النواة (Pulse)' : 'Core Pulse'}</span>
              <button
                onClick={() => setPulseEnabled((prev) => !prev)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                  pulseEnabled ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{pulseEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="pt-1 border-t border-white/10 flex items-center justify-between">
              <span className="text-slate-400">{isAr ? 'نسق الألوان' : 'Color Mode'}</span>
              <div className="flex items-center gap-1.5">
                {(['cobalt', 'emerald', 'amber'] as PaletteName[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPalette(p)}
                    className={`w-4 h-4 rounded-full border transition-transform ${
                      palette === p ? 'scale-125 border-white shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor:
                        p === 'cobalt' ? '#38bdf8' : p === 'emerald' ? '#34d399' : '#fbbf24',
                    }}
                    title={PALETTES[p].label}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
