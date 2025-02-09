import { create } from "zustand"
import * as THREE from "three"
import { GLTF, OrbitControls } from "three/examples/jsm/Addons.js"

interface Store {
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
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

  setScene: (scene) => set({ scene }),
  setCamera: (camera) => set({ camera }),
  setRenderer: (renderer) => set({ renderer }),
  setModel: (model) => set({ model }),
  setMixer: (mixer) => set({ mixer }),
  setControls: (controls) => set({ controls }),
  setSpeed: (speed) => set({ speed }),
  setGltf: (gltf) => set({ gltf }),
  setWheelAnimations: (wheelAnimations) => set({ wheelAnimations }),
}))
