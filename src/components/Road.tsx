import * as THREE from "three"
import { createRoadMesh } from "../utils/roadUtils"

// --- 도로 생성 로직 ---

const createLoopRoad = () => {
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 0.1, 100),
      new THREE.Vector3(100, 0.1, 100),
      new THREE.Vector3(100, 0.1, -100),
      new THREE.Vector3(-100, 0.1, -100),
      new THREE.Vector3(-100, 0.1, 100),
    ],
    true,
    "catmullrom",
    0.5,
  )
  const roadMesh = createRoadMesh(curve, true)
  return { roadMesh, curve }
}

// 이 함수는 이제 항상 주어진 포인트 배열 '앞에' 새로운 포인트를 생성합니다.
export const createWindingRoad = (existingPoints: THREE.Vector3[] = []) => {
  const points = [...existingPoints]
  const isInitialCreation = existingPoints.length === 0

  if (isInitialCreation) {
    // 처음 생성 시: 0,0,0을 중심으로 양방향으로 도로 생성
    const initialSegmentCount = 100
    for (let i = -initialSegmentCount / 2; i < initialSegmentCount / 2; i++) {
      const x = Math.sin(i * 0.1) * 30
      const y = 0.1
      const z = i * 20
      points.push(new THREE.Vector3(x, y, z))
    }
  } else {
    // 재생성 시: 기존 경로 앞에 새로운 경로 포인트 추가
    const pointsToAdd = 50
    const firstPoint = existingPoints[0]
    const segmentLength = 20
    const frequency = 0.1
    const amplitude = 30

    const firstI = Math.round(firstPoint.z / segmentLength)

    for (let i = 1; i <= pointsToAdd; i++) {
      const currentI = firstI - i
      const x = Math.sin(currentI * frequency) * amplitude
      const y = 0.1
      const z = currentI * segmentLength
      points.unshift(new THREE.Vector3(x, y, z)) // 배열의 맨 앞에 추가
    }
  }

  points.sort((a, b) => a.z - b.z)

  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5)
  const roadMesh = createRoadMesh(curve, false)
  return { roadMesh, curve, points }
}

// --- 메인 컴포넌트 ---

const Road = (roadMode: number) => {
  if (roadMode === 2) {
    return createWindingRoad()
  }
  return createLoopRoad()
}

export default Road
