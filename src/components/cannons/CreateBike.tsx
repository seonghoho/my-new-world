import * as CANNON from "cannon-es"
import * as THREE from "three"

const CreateBike = (
  world: CANNON.World,
  model: THREE.Object3D,
  setVehicle: (vehicle: CANNON.RaycastVehicle) => void,
  setWheels: (wheels: THREE.Object3D[]) => void,
  bikeMaterial: CANNON.Material,
) => {
  // 🔹 1️⃣ 오토바이 차체 생성 (chassisBody)
  const bikeBody = new CANNON.Body({
    mass: 150, // 실제 오토바이 무게와 유사한 값
    shape: new CANNON.Box(new CANNON.Vec3(1, 0.5, 2)), // 가로 2, 세로 1, 길이 4
    position: new CANNON.Vec3(0, 2, 0), // 초기 위치
    material: bikeMaterial,
  })
  world.addBody(bikeBody)

  // 🔹 2️⃣ RaycastVehicle 생성
  const vehicle = new CANNON.RaycastVehicle({
    chassisBody: bikeBody,
  })

  // 🔹 3️⃣ 바퀴 찾기 (Three.js에서)
  const wheelRegex = /wheel/i
  const wheelMeshes: THREE.Object3D[] = []
  model.children.forEach((child) => {
    if (wheelRegex.test(child.name)) {
      wheelMeshes.push(child)
    }
  })

  setWheels(wheelMeshes)
  // 🔹 4️⃣ 휠 설정 (오토바이는 2개)
  const wheelOptions = {
    radius: 0.5, // 바퀴 크기
    directionLocal: new CANNON.Vec3(0, -1, 0), // 아래 방향으로 바퀴 위치
    suspensionStiffness: 50, // 서스펜션 강도 (값이 크면 딱딱한 서스펜션)
    suspensionRestLength: 0.3, // 서스펜션 길이
    frictionSlip: 3, // 마찰 계수
    dampingRelaxation: 2.3, // 충격 완화 계수
    dampingCompression: 4.4, // 압축 시 충격 완화 계수
    maxSuspensionForce: 10000, // 최대 서스펜션 힘
    rollInfluence: 0.1, // 회전 영향도
    axleLocal: new CANNON.Vec3(-1, 0, 0), // 휠의 회전축
    chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 1.5), // 차체와 연결되는 지점
  }

  // 🔹 5️⃣ 앞바퀴 추가
  vehicle.addWheel({
    ...wheelOptions,
    chassisConnectionPointLocal: new CANNON.Vec3(0, 1, -3.5), // 앞바퀴 위치
  })

  // 🔹 6️⃣ 뒷바퀴 추가
  vehicle.addWheel({
    ...wheelOptions,
    chassisConnectionPointLocal: new CANNON.Vec3(0, 1, 4), // 뒷바퀴 위치
  })

  // 🔹 7️⃣ 물리 세계에 추가
  vehicle.addToWorld(world)
  console.log(vehicle)
  setVehicle(vehicle)

  // 🔹 8️⃣ Three.js 바퀴와 Cannon.js 바퀴를 동기화하는 함수
  const updateWheels = () => {
    for (let i = 0; i < vehicle.wheelInfos.length; i++) {
      vehicle.updateWheelTransform(i)

      const wheelTransform = vehicle.wheelInfos[i].worldTransform
      const wheelMesh = wheelMeshes[i]

      if (wheelMesh) {
        // Cannon 바퀴 위치를 Three.js 바퀴 위치로 동기화
        wheelMesh.position.set(
          wheelTransform.position.x,
          wheelTransform.position.y,
          wheelTransform.position.z,
        )
        wheelMesh.quaternion.set(
          wheelTransform.quaternion.x,
          wheelTransform.quaternion.y,
          wheelTransform.quaternion.z,
          wheelTransform.quaternion.w,
        )
      }
    }
  }

  return { vehicle, updateWheels }
}

export default CreateBike
