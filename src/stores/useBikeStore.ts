import { create } from "zustand"
import * as THREE from "three"

const initialState = {
  bike: { model: undefined, mixer: undefined },
  bikePosition: new THREE.Vector3(0, 0, 0),
  bikeRotation: new THREE.Euler(0, 0, 0),
  cameraPosition: new THREE.Vector3(8, 3, 5),
  speed: 0,
}

interface Store {
  bike: { model?: THREE.Object3D; mixer?: THREE.AnimationMixer }
  setBike: (bike: { model: THREE.Object3D; mixer: THREE.AnimationMixer }) => void

  bikePosition: THREE.Vector3
  setBikePosition: (position: THREE.Vector3) => void

  bikeRotation: THREE.Euler
  setBikeRotation: (rotation: THREE.Euler) => void

  cameraPosition: THREE.Vector3
  setCameraPosition: (position: THREE.Vector3) => void

  speed: number
  setSpeed: (speed: number) => void

  reset: () => void
}

// useStore 훅 정의
export const useBikeStore = create<Store>((set) => ({
  ...initialState,

  setBike: (bike) => set(() => ({ bike })),
  setBikePosition: (position) => set(() => ({ bikePosition: position.clone() })),
  setBikeRotation: (rotation) =>
    set(() => ({
      bikeRotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
    })),
  setCameraPosition: (position) => set(() => ({ cameraPosition: position.clone() })),
  setSpeed: (speed) => set(() => ({ speed })),

  reset: () =>
    set(() => ({
      bikePosition: initialState.bikePosition.clone(),
      bikeRotation: new THREE.Euler(
        initialState.bikeRotation.x,
        initialState.bikeRotation.y,
        initialState.bikeRotation.z,
      ),
      cameraPosition: initialState.cameraPosition.clone(),
      speed: initialState.speed,
    })),
}))
