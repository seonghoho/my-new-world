import { create } from "zustand"
import * as CANNON from "cannon-es"

interface MaterialStore {
  bikeMaterial: CANNON.Material | null
  groundMaterial: CANNON.Material | null
  setBikeMaterial: (material: CANNON.Material) => void
  setGroundMaterial: (material: CANNON.Material) => void
}

export const useMaterialStore = create<MaterialStore>((set) => ({
  bikeMaterial: null,
  groundMaterial: null,
  setBikeMaterial: (material) => set({ bikeMaterial: material }),
  setGroundMaterial: (material) => set({ groundMaterial: material }),
}))
