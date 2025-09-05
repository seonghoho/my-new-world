import * as THREE from "three"
import { useKeyStore } from "../stores/useKeyStore"

const updateMovement = (
  pathProgress: React.RefObject<number>,
  lateralOffset: React.RefObject<number>,
  tiltAngle: React.RefObject<number>,
  pathVelocity: React.RefObject<number>,
  model: THREE.Object3D,
  roadCurve: THREE.CatmullRomCurve3,
  roadMode: number,
  setSpeed: (speed: number) => void,
) => {
  if (!model || !roadCurve) return

  const keyStates = useKeyStore.getState().keyStates
  const roadWidth = 6

  // --- 1. 물리 기반 이동 및 기울기 업데이트 ---
  const acceleration = 0.00001
  const maxSpeed = 0.001
  const friction = 0.98
  const lateralSpeed = 0.05
  const maxTilt = 0.25

  // 속도 업데이트
  if (keyStates["ArrowDown"] || keyStates["KeyS"]) {
    pathVelocity.current += acceleration
  } else if (keyStates["ArrowUp"] || keyStates["KeyW"]) {
    pathVelocity.current -= acceleration
  } else {
    pathVelocity.current *= friction
  }

  pathVelocity.current = Math.max(-maxSpeed, Math.min(maxSpeed, pathVelocity.current))
  pathProgress.current += pathVelocity.current

  // 목표 기울기 설정
  let targetTilt = 0
  if (keyStates["ArrowLeft"] || keyStates["KeyA"]) {
    lateralOffset.current -= lateralSpeed
    targetTilt = maxTilt
  }
  if (keyStates["ArrowRight"] || keyStates["KeyD"]) {
    lateralOffset.current += lateralSpeed
    targetTilt = -maxTilt
  }

  tiltAngle.current = THREE.MathUtils.lerp(tiltAngle.current, targetTilt, 0.1)

  // --- 2. 값 보정 및 제한 ---
  if (roadMode === 1) {
    // 루프 모드: 진행도 순환
    pathProgress.current %= 1
    if (pathProgress.current < 0) pathProgress.current += 1
  } else {
    // 와인딩 모드: 진행도 제한
    pathProgress.current = Math.max(0, Math.min(1, pathProgress.current))
  }

  lateralOffset.current = Math.max(-roadWidth / 2, Math.min(roadWidth / 2, lateralOffset.current))

  // --- 3. 모델 위치 및 회전 계산 ---
  const isClosed = roadMode === 1
  const segments = isClosed ? 100 : 500 // 세그먼트 수를 도로 종류에 맞게 조절
  const { binormals } = roadCurve.computeFrenetFrames(segments, isClosed)
  const progress = pathProgress.current
  const offset = lateralOffset.current

  const centerPoint = roadCurve.getPointAt(progress)
  const frameIndex = Math.floor(progress * segments)
  const sidewaysVec = binormals[frameIndex].clone()
  const finalPosition = centerPoint.add(sidewaysVec.multiplyScalar(offset))
  model.position.copy(finalPosition)

  const nextProgress = isClosed ? (progress + 0.001) % 1 : Math.min(1, progress + 0.001)
  const nextPointOnCurve = roadCurve.getPointAt(nextProgress)
  const nextFrameIndex = Math.floor(nextProgress * segments)
  const nextSidewaysVec = binormals[nextFrameIndex].clone()
  const lookAtPoint = nextPointOnCurve.add(nextSidewaysVec.multiplyScalar(offset))
  model.lookAt(lookAtPoint)

  const forwardAxis = new THREE.Vector3(0, 0, 1)
  forwardAxis.applyQuaternion(model.quaternion)
  const tiltQuaternion = new THREE.Quaternion().setFromAxisAngle(forwardAxis, tiltAngle.current)
  model.quaternion.multiply(tiltQuaternion)

  setSpeed(Math.floor(Math.abs(pathVelocity.current * 50000)))
}

export default updateMovement
