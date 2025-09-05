import { create } from "zustand"
import * as THREE from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

interface Store {
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  currentPointOfView: number
  renderer: THREE.WebGLRenderer | null
  model: THREE.Object3D<THREE.Object3DEventMap> | null
  mixer: THREE.AnimationMixer | null
  controls: OrbitControls | null
  gltf: GLTF | null
  wheelAnimations: THREE.AnimationClip[] | null
  speed: number

  setScene: (scene: THREE.Scene) => void
  setCamera: (camera: THREE.PerspectiveCamera) => void
  setRenderer: (renderer: THREE.WebGLRenderer) => void
  setModel: (model: THREE.Object3D) => void
  setMixer: (mixer: THREE.AnimationMixer) => void
  setControls: (controls: OrbitControls) => void

  setSpeed: (speed: number) => void
  setGltf: (gltf: GLTF) => void
  setWheelAnimations: (wheelAnimations: THREE.AnimationClip[]) => void
  setCurrentPointOfView: (currentPointOfView: number) => void
  ground: THREE.Group | null
  setGround: (ground: THREE.Group) => void
  roadCurve: THREE.CatmullRomCurve3 | null
  setRoadCurve: (roadCurve: THREE.CatmullRomCurve3) => void
  roadMesh: THREE.Mesh | null
  setRoadMesh: (roadMesh: THREE.Mesh) => void
  setRoadAssets: (assets: { curve: THREE.CatmullRomCurve3; mesh: THREE.Mesh }) => void
  sunPosition: THREE.Vector3 | null
  setSunPosition: (sunPosition: THREE.Vector3) => void
  sunLight: THREE.DirectionalLight | null
  setSunLight: (sunLight: THREE.DirectionalLight) => void
  roadMode: number
  setRoadMode: (roadMode: number) => void
}

// localStorage에서 roadMode를 읽어오거나 기본값 1로 설정
const initialRoadMode = () => {
  try {
    const item = window.localStorage.getItem("roadMode")
    return item ? parseInt(item, 10) : 1
  } catch (error) {
    // localStorage 접근이 불가능한 경우 (e.g. SSR, 시크릿 모드)
    console.error("localStorage is not available", error)
    return 1
  }
}

// useStore 훅 정의
export const useBikeStore = create<Store>((set) => ({
  scene: null,
  camera: null,
  renderer: null,
  model: null,
  mixer: null,
  controls: null,
  gltf: null,
  wheelAnimations: null,
  speed: 0,
  currentPointOfView: 0,
  ground: null,
  roadCurve: null,
  roadMesh: null,
  sunPosition: null,
  sunLight: null,
  roadMode: initialRoadMode(),

  setScene: (scene) => set({ scene }),
  setCamera: (camera) => set({ camera }),
  setRenderer: (renderer) => set({ renderer }),
  setModel: (model) => set({ model }),
  setMixer: (mixer) => set({ mixer }),
  setControls: (controls) => set({ controls }),
  setSpeed: (speed) => set({ speed }),
  setGltf: (gltf) => set({ gltf }),
  setWheelAnimations: (wheelAnimations) => set({ wheelAnimations }),
  setCurrentPointOfView: (currentPointOfView) => set({ currentPointOfView }),
  setGround: (ground) => set({ ground }),
  setRoadCurve: (roadCurve) => set({ roadCurve }),
  setRoadMesh: (roadMesh) => set({ roadMesh }),
  setRoadAssets: (assets) => set({ roadCurve: assets.curve, roadMesh: assets.mesh }),
  setSunPosition: (sunPosition) => set({ sunPosition }),
  setSunLight: (sunLight) => set({ sunLight }),
  setRoadMode: (roadMode) => {
    try {
      window.localStorage.setItem("roadMode", roadMode.toString())
    } catch (error) {
      console.error("localStorage is not available", error)
    }
    set({ roadMode })
  },
}))