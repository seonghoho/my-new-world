import * as CANNON from "cannon-es"
import * as THREE from "three"

const Floor = (
  ground: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>,
  addBody: (body: CANNON.Body) => void,
  groundMaterial: CANNON.Material,
) => {
  const floorBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
    material: groundMaterial,
  })

  // Three.js의 position을 CANNON.js의 Vec3로 변환
  floorBody.position.set(ground.position.x, ground.position.y, ground.position.z)

  // Three.js의 rotation(Euler)을 Quaternion으로 변환
  const quaternion = new THREE.Quaternion()
  quaternion.setFromEuler(ground.rotation)

  // CANNON.js의 Quaternion 타입으로 변환 후 적용
  floorBody.quaternion.copy(
    new CANNON.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w),
  )

  addBody(floorBody)

  return null
}

export default Floor
