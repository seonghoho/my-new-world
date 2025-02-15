import { create } from "zustand"
import * as CANNON from "cannon-es"
import * as THREE from "three"

interface CannonStore {
  world: CANNON.World | null
  bikeBody: CANNON.Body | null
  vehicle: CANNON.RaycastVehicle | null
  wheels: THREE.Object3D[] | null
  initPhysics: () => void
  addBody: (body: CANNON.Body) => void
  setWorld: (world: CANNON.World) => void
  setBikeBody: (body: CANNON.Body) => void
  setVehicle: (vehicle: CANNON.RaycastVehicle) => void
  setWheels: (wheels: THREE.Object3D[]) => void
}

export const useCannonStore = create<CannonStore>((set) => ({
  world: null,
  bikeBody: null,
  vehicle: null,
  wheels: null,
  setWorld: (world) => set({ world }),
  // 🚲 자전거 바디 설정
  setBikeBody: (body) => set({ bikeBody: body }),
  setVehicle: (vehicle) => set({ vehicle }),
  setWheels: (wheels) => set({ wheels }),

  // 🌍 물리 엔진 초기화
  initPhysics: () => {
    const world = new CANNON.World({
      allowSleep: true,
      gravity: new CANNON.Vec3(0, -9.82, 0),
    })
    world.defaultContactMaterial.restitution = 0.3
    set({ world: world })
  },

  // 📌 다른 물리 오브젝트 추가 (ex: 충돌 감지, 장애물 등)
  addBody: (body) => {
    set((state) => {
      if (state.world) {
        state.world.addBody(body)
      }
      return {}
    })
  },
}))
