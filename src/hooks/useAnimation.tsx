import { useEffect, useRef } from "react"
import { useBikeStore } from "../stores/useBikeStore"
import * as THREE from "three"
import updateMovement from "./updateMovement"
import updateAnimation from "./updateAnimation"
import { createWindingRoad } from "../components/Road"

const useAnimation = () => {
  const {
    scene,
    camera,
    renderer,
    model,
    mixer,
    wheelAnimations,
    currentPointOfView,
    ground,
    roadCurve,
    roadMesh,
    setCamera,
    setRenderer,
    setControls,
    setSpeed,
    sunLight,
    sunPosition,
    roadMode,
    setRoadAssets,
  } = useBikeStore()

  const pathProgress = useRef(roadMode === 1 ? 0 : 0.5)
  const lateralOffset = useRef(0)
  const tiltAngle = useRef(0)
  const pathVelocity = useRef(0)

  const pointOfView = useRef(0)

  // 도로 재생성 함수
  const regenerateRoad = () => {
    if (!roadCurve || !scene || !roadMesh) return

    const oldPoints = roadCurve.points
    const pointsToKeep = 50 // 뒤에 남길 포인트 수

    // 현재 경로의 뒷부분 50개 포인트를 가져옴
    const lastSegment = oldPoints.slice(-pointsToKeep)

    // 새로운 도로 생성
    const { roadMesh: newMesh, curve: newCurve } = createWindingRoad(lastSegment)

    // 장면에서 이전 도로 제거하고 새 도로 추가
    scene.remove(roadMesh)
    scene.add(newMesh)

    // 스토어 업데이트
    setRoadAssets({ curve: newCurve, mesh: newMesh })

    // 진행도 재계산
    // (이전 경로의 끝부분 = 새 경로의 시작부분)
    const newProgress = (pointsToKeep - 1) / (newCurve.points.length - 1)
    pathProgress.current = newProgress
  }

  useEffect(() => {
    pointOfView.current = currentPointOfView
  }, [currentPointOfView])

  useEffect(() => {
    const clock = new THREE.Clock()

    function animate() {
      requestAnimationFrame(animate)

      // 도로 모드 2일 때, 경로의 시작점에 가까워지면 도로 재생성
      if (roadMode === 2 && pathProgress.current < 0.25) {
        regenerateRoad()
      }

      if (model && roadCurve) {
        updateMovement(
          pathProgress,
          lateralOffset,
          tiltAngle,
          pathVelocity,
          model,
          roadCurve,
          roadMode,
          setSpeed,
        )
      }

      if (sunLight && sunPosition) {
        sunLight.position.copy(sunPosition).multiplyScalar(5)
      }

      if (mixer && wheelAnimations) updateAnimation(mixer, wheelAnimations)

      if (model && ground) {
        const modelPosition = model.position
        const groundChildren = ground.children
        const tileSize = 100
        const numTiles = 3

        groundChildren.forEach((tile) => {
          const tilePosition = tile.position
          const dx = modelPosition.x - tilePosition.x
          const dz = modelPosition.z - tilePosition.z

          if (dx > (tileSize * numTiles) / 2) tile.position.x += tileSize * numTiles
          else if (dx < (-tileSize * numTiles) / 2) tile.position.x -= tileSize * numTiles

          if (dz > (tileSize * numTiles) / 2) tile.position.z += tileSize * numTiles
          else if (dz < (-tileSize * numTiles) / 2) tile.position.z -= tileSize * numTiles
        })
      }

      if (model && camera) {
        let offset: THREE.Vector3
        if (pointOfView.current === 0) offset = new THREE.Vector3(0, 4, 12)
        else if (pointOfView.current === 1) offset = new THREE.Vector3(0, 8, 20)
        else if (pointOfView.current === 2) offset = new THREE.Vector3(0, 30, 0)
        else offset = new THREE.Vector3(0, 1.5, -0.5)

        offset.applyMatrix4(model.matrixWorld)
        camera.position.lerp(offset, 0.1)
        camera.lookAt(model.position)
      }

      if (mixer) mixer.update(clock.getDelta())

      if (renderer && scene && camera) {
        renderer.render(scene, camera)
      }
    }

    animate()
  }, [scene, camera, renderer, model, roadCurve, roadMesh, ground, mixer, wheelAnimations, sunLight, sunPosition, roadMode, setRoadAssets, setSpeed, setCamera, setRenderer, setControls])
}

export default useAnimation