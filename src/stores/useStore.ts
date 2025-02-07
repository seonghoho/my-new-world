import { create } from "zustand"
import * as THREE from "three"

interface Store {
  bike: { model?: THREE.Object3D; mixer?: THREE.AnimationMixer }
  setBike: (bike: { model: THREE.Object3D; mixer: THREE.AnimationMixer }) => void
}

export const useStore = create<Store>((set) => ({
  bike: {}, // bike 상태 추가
  setBike: (bike) => set(() => ({ bike })),
}))
