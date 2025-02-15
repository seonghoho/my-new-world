import * as CANNON from "cannon-es"
import * as THREE from "three"

const updateBikeMovement = (
  vehicle: CANNON.RaycastVehicle,
  keyStates: Record<string, boolean>,
  wheels: THREE.Object3D[],
) => {
  const engineForce = 5000 // 🚀 가속력 증가
  const brakeForce = 10 // 🏁 브레이크 힘
  const steerAmount = 0.5 // 🔄 회전 정도

  // 🔹 가속 및 감속
  if (keyStates["ArrowUp"] || keyStates["KeyW"]) {
    vehicle.wheelInfos.forEach((_, index) => {
      vehicle.applyEngineForce(-engineForce, index) // 모든 바퀴에 힘 적용
    })
  } else if (keyStates["ArrowDown"] || keyStates["KeyS"]) {
    vehicle.wheelInfos.forEach((_, index) => {
      vehicle.applyEngineForce(engineForce, index)
    })
  } else {
    vehicle.wheelInfos.forEach((_, index) => {
      vehicle.applyEngineForce(0, index) // 가속 중지
    })
  }

  // 🔹 브레이크
  if (keyStates["KeyQ"]) {
    vehicle.wheelInfos.forEach((_, index) => {
      vehicle.setBrake(brakeForce, index) // 모든 바퀴에 브레이크 적용
    })
  } else {
    vehicle.wheelInfos.forEach((_, index) => {
      vehicle.setBrake(0, index) // 브레이크 해제
    })
  }

  // 🔹 회전
  if (keyStates["ArrowLeft"] || keyStates["KeyA"]) {
    vehicle.setSteeringValue(steerAmount, 0) // 앞바퀴 회전
  } else if (keyStates["ArrowRight"] || keyStates["KeyD"]) {
    vehicle.setSteeringValue(-steerAmount, 0)
  } else {
    vehicle.setSteeringValue(0, 0)
  }

  for (let i = 0; i < vehicle.wheelInfos.length; i++) {
    vehicle.updateWheelTransform(i)

    const wheelTransform = vehicle.wheelInfos[i].worldTransform
    const wheelMesh = wheels[i]
    const chassisMesh = vehicle.chassisBody // 바이크 몸체

    if (wheelMesh) {
      // 🚀 Three.js의 바이크(chassisBody) 기준으로 바퀴 위치를 맞추기
      wheelMesh.position.set(
        chassisMesh.position.x + wheelTransform.position.x,
        chassisMesh.position.y + wheelTransform.position.y,
        chassisMesh.position.z + wheelTransform.position.z,
      )

      // 🔄 바퀴 회전 적용 (Cannon.js에서 계산된 quaternion을 그대로 반영)
      wheelMesh.quaternion.set(
        wheelTransform.quaternion.x,
        wheelTransform.quaternion.y,
        wheelTransform.quaternion.z,
        wheelTransform.quaternion.w,
      )
    }
  }
}

export default updateBikeMovement
