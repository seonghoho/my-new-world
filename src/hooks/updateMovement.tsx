import * as THREE from "three"
import { useKeyStore } from "../stores/useKeyStore"

const updateMovement = (
  isJumping: React.RefObject<boolean>,
  jumpVelocity: React.RefObject<number>,
  velocity: React.RefObject<number>,
  gravity: number,
  model: THREE.Object3D<THREE.Object3DEventMap>,
  setModel: (model: THREE.Object3D) => void,
  setSpeed: (speed: number) => void,
) => {
  // 🎯 이동 처리
  if (model) {
    const keyStates = useKeyStore.getState().keyStates
    const moveDirection = new THREE.Vector3()
    const rotationMatrix = new THREE.Matrix4()
    rotationMatrix.extractRotation(model.matrixWorld)

    const acceleration = 0.002
    const maxSpeed = 1
    const friction = 0.98
    const rotationSpeed = 0.03

    // 🔹 가속 및 감속
    if (keyStates["ArrowUp"] || keyStates["KeyW"]) {
      velocity.current = Math.max(velocity.current - acceleration, -maxSpeed / 2) // 후진 속도는 절반
    } else if (keyStates["ArrowDown"] || keyStates["KeyS"]) {
      velocity.current = Math.min(velocity.current + acceleration, maxSpeed) // 최대 속도 제한
    } else {
      velocity.current *= friction // 키를 놓으면 점진적 감속
      if (Math.abs(velocity.current) < 0.001) velocity.current = 0 // 너무 느려지면 정지
    }

    // 🔹 브레이크 (Q 키)
    if (keyStates["KeyQ"]) {
      velocity.current *= 0.85 // 브레이크 감속
      if (Math.abs(velocity.current) < 0.002) velocity.current = 0 // 거의 멈추면 정지
    }

    // 🔹 회전
    if (keyStates["ArrowLeft"] || keyStates["KeyA"]) {
      model.rotation.y += rotationSpeed
    }
    if (keyStates["ArrowRight"] || keyStates["KeyD"]) {
      model.rotation.y -= rotationSpeed
    }

    // 🔹 점프
    if (isJumping) {
      model.position.y += jumpVelocity.current // 점프 속도 적용
      jumpVelocity.current -= gravity // 중력 적용

      // 땅에 닿으면 착지
      if (model.position.y <= 0) {
        model.position.y = 0
        isJumping.current = false
        jumpVelocity.current = 0
      }
    }
    moveDirection.z = velocity.current
    moveDirection.applyMatrix4(rotationMatrix)
    model.position.add(moveDirection)
    setModel(model)
    setSpeed(Math.abs(Math.floor(-velocity.current * 200)))
  }
}

export default updateMovement
