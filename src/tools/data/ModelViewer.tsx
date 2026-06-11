import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

type ModelKind = "turbine" | "cell" | "axis";

const modelPresets: Record<ModelKind, { name: string; hint: string; nodes: string[] }> = {
  turbine: {
    name: "Turbine Housing",
    hint: "工业数字孪生设备外壳预览",
    nodes: ["Rotor", "Bearing", "Thermal shell", "Flow inlet"],
  },
  cell: {
    name: "Factory Cell",
    hint: "产线工位与传感点布局",
    nodes: ["PLC rack", "Robot arm", "Vision gate", "Conveyor"],
  },
  axis: {
    name: "Motion Axis",
    hint: "运动控制轴与负载状态",
    nodes: ["Servo", "Encoder", "Load", "Limit sensor"],
  },
};

function applyWireframe(object: THREE.Object3D, wireframe: boolean) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mats = Array.isArray((child as THREE.Mesh).material)
        ? ((child as THREE.Mesh).material as THREE.Material[])
        : [(child as THREE.Mesh).material as THREE.Material];
      mats.forEach((m) => {
        if ("wireframe" in m) (m as THREE.MeshStandardMaterial).wireframe = wireframe;
      });
    }
  });
}

export default function ModelViewer() {
  const [model, setModel] = useState<ModelKind>("turbine");
  const [speed, setSpeed] = useState(18);
  const [wireframe, setWireframe] = useState(true);
  const [glow, setGlow] = useState(72);
  const [fileName, setFileName] = useState("");
  const [loadError, setLoadError] = useState("");

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneObjRef = useRef<THREE.Object3D | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const preset = modelPresets[model];

  // 上传模型后初始化/复用 three.js 场景
  useEffect(() => {
    if (!fileName || !mountRef.current) return;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.01, 1000);
    camera.position.set(2.4, 1.8, 2.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0x37f5c5, 1.4);
    dir.position.set(3, 5, 2);
    scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0x37a5ff, 0.8);
    dir2.position.set(-3, -2, -2);
    scene.add(dir2);
    const grid = new THREE.GridHelper(10, 24, 0x37f5c5, 0x1c2733);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    grid.position.y = -1;
    scene.add(grid);

    if (sceneObjRef.current) scene.add(sceneObjRef.current);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (sceneObjRef.current) sceneObjRef.current.rotation.y += speedRef.current * 0.0006;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, [fileName]);

  useEffect(() => {
    if (sceneObjRef.current) applyWireframe(sceneObjRef.current, wireframe);
  }, [wireframe, fileName]);

  const fitAndAdd = (object: THREE.Object3D) => {
    // 归一化尺寸并居中，保证任何模型都在视野内
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    object.scale.multiplyScalar(2 / maxDim);
    box.setFromObject(object);
    box.getCenter(center);
    object.position.sub(center);
    applyWireframe(object, wireframe);
    if (sceneObjRef.current && sceneRef.current) sceneRef.current.remove(sceneObjRef.current);
    sceneObjRef.current = object;
    if (sceneRef.current) sceneRef.current.add(object);
  };

  const handleFile = async (file: File) => {
    setLoadError("");
    const ext = file.name.split(".").pop()?.toLowerCase();
    try {
      const buffer = await file.arrayBuffer();
      if (ext === "glb" || ext === "gltf") {
        const gltf = await new GLTFLoader().parseAsync(buffer, "");
        fitAndAdd(gltf.scene);
      } else if (ext === "obj") {
        const text = new TextDecoder().decode(buffer);
        fitAndAdd(new OBJLoader().parse(text));
      } else if (ext === "stl") {
        const geometry = new STLLoader().parse(buffer);
        geometry.computeVertexNormals();
        const mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({ color: 0x37f5c5, metalness: 0.35, roughness: 0.45 })
        );
        fitAndAdd(mesh);
      } else {
        setLoadError(`不支持的格式 .${ext}，请上传 .glb / .gltf / .obj / .stl`);
        return;
      }
      setFileName(file.name);
    } catch (e) {
      setLoadError(`模型解析失败：${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const clearModel = () => {
    sceneObjRef.current = null;
    setFileName("");
    setLoadError("");
  };

  return (
    <div className="model-viewer tool-section">
      <div className="model-stage">
        {fileName ? (
          <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />
        ) : (
          <>
            <div className="model-grid-floor" />
            <div
              className={`css-model ${wireframe ? "is-wireframe" : ""} model-${model}`}
              style={{
                ["--spin-speed" as string]: `${Math.max(6, 38 - speed)}s`,
                ["--model-glow" as string]: `${glow}%`,
              }}
            >
              <div className="cube face-a" />
              <div className="cube face-b" />
              <div className="cube face-c" />
              <div className="model-ring model-ring-a" />
              <div className="model-ring model-ring-b" />
              <div className="model-spine" />
            </div>
          </>
        )}
        <div className="model-hud top-left">
          <span>MODEL</span>
          <strong>{fileName || preset.name}</strong>
        </div>
        <div className="model-hud bottom-right">
          <span>{fileName ? "拖动旋转 · 滚轮缩放" : "SIGNAL"}</span>
          <strong>{fileName ? "已加载模型" : `${Math.round(glow * 1.7)} nodes`}</strong>
        </div>
      </div>

      <aside className="model-controls">
        <div>
          <span className="eyebrow">3D Viewer</span>
          <h3>{fileName ? "上传模型预览" : preset.hint}</h3>
        </div>

        <label className="btn btn-primary" style={{ cursor: "pointer", textAlign: "center" }}>
          上传模型（.glb / .obj / .stl）
          <input
            type="file"
            accept=".glb,.gltf,.obj,.stl"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </label>
        {fileName && (
          <button className="btn btn-secondary" onClick={clearModel}>
            清除模型，返回演示
          </button>
        )}
        {loadError && <div style={{ color: "var(--error)", fontSize: 12 }}>{loadError}</div>}

        {!fileName && (
          <div className="segmented-control">
            {(Object.keys(modelPresets) as ModelKind[]).map((key) => (
              <button key={key} className={model === key ? "active" : ""} onClick={() => setModel(key)}>
                {modelPresets[key].name}
              </button>
            ))}
          </div>
        )}

        <label>
          Rotation speed {speed}
          <input type="range" min={1} max={32} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </label>

        {!fileName && (
          <label>
            Signal glow {glow}%
            <input type="range" min={20} max={100} value={glow} onChange={(e) => setGlow(Number(e.target.value))} />
          </label>
        )}

        <label className="check-item">
          <input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} />
          Wireframe overlay
        </label>

        {!fileName && (
          <div className="node-list">
            {preset.nodes.map((node, index) => (
              <div key={node} className="node-row">
                <span>0{index + 1}</span>
                <strong>{node}</strong>
                <em>{index % 2 === 0 ? "Online" : "Idle"}</em>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
