import { useEffect, useRef } from "react"
import { useBikeStore } from "../stores/useBikeStore"
import * as THREE from "three"
import * as CANNON from "cannon-es"
import updateAnimation from "./updateAnimation"
import { useKeyStore } from "../stores/useKeyStore"
import { useCannonStore } from "../stores/useCannonStore"
import updateBikeMovement from "./updateBikeMovement"

const useAnimation = () => {
  const {
    scene,
    camera,
    renderer,
    model,
    mixer,
    controls,
    wheelAnimations,
    currentPointOfView,
    setCamera,
    setRenderer,
    setControls,
  } = useBikeStore()
  const { keyStates } = useKeyStore()
  const isJumping = useRef(false)
  const jumpVelocity = useRef(0)
  const jumpPower = 0.2 // 점프 힘

  // 애니메이션 상태 관리용 ref
  const pointOfView = useRef(0)

  const { world, vehicle, wheels } = useCannonStore()

  // 🔹 키 입력 감지
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !isJumping.current) {
      isJumping.current = true
      jumpVelocity.current = jumpPower // 점프 힘 적용
    }
  })

  useEffect(() => {
    pointOfView.current = currentPointOfView
  }, [currentPointOfView])

  // useRef로 model과 vehicle을 최신 상태로 관리
  const modelRef = useRef<THREE.Object3D | null>(null)
  const vehicleRef = useRef<CANNON.RaycastVehicle | null>(null)
  const keyStatesRef = useRef<Record<string, boolean> | null>(null)
  const wheelsRef = useRef<THREE.Object3D[] | null>(null)

  useEffect(() => {
    modelRef.current = model
  }, [model])
  useEffect(() => {
    vehicleRef.current = vehicle
    console.log(vehicleRef.current)
  }, [vehicle])

  useEffect(() => {
    keyStatesRef.current = keyStates
  }, [keyStates])

  useEffect(() => {
    wheelsRef.current = wheels
  }, [wheels])

  useEffect(() => {
    const clock = new THREE.Clock()

    function animate() {
      requestAnimationFrame(animate)

      controls?.update()

      if (world) world.step(1 / 60) // 🏗️ 물리 엔진 업데이트
      // 🎯 이동 처리
      if (vehicleRef.current && keyStatesRef.current && wheelsRef.current)
        updateBikeMovement(vehicleRef.current, keyStatesRef.current, wheelsRef.current)

      if (modelRef.current && vehicleRef.current) {
        modelRef.current.position.copy(vehicleRef.current.chassisBody.position)
        modelRef.current.quaternion.copy(vehicleRef.current.chassisBody.quaternion)
      }

      if (mixer && wheelAnimations) updateAnimation(mixer, wheelAnimations)
      const isMoving = useKeyStore.getState().isMoving

      // 🎥 카메라 업데이트
      if (model) {
        let offset: THREE.Vector3
        if (pointOfView.current === 0) {
          if (isMoving) {
            offset = new THREE.Vector3(0, 6, 8)
            offset.applyMatrix4(model.matrixWorld)
            camera?.position.lerp(offset, 0.1)
          }
        } else if (pointOfView.current === 1) {
          offset = new THREE.Vector3(0, 6, 8)
          offset.applyMatrix4(model.matrixWorld)
          camera?.position.lerp(offset, 0.1)
        } else if (pointOfView.current === 2) {
          offset = new THREE.Vector3(0, 12, 16)
          offset.applyMatrix4(model.matrixWorld)
          camera?.position.lerp(offset, 0.1)
        } else if (pointOfView.current === 3) {
          offset = new THREE.Vector3(20, 10, 0)
          offset.applyMatrix4(model.matrixWorld)
          camera?.position.lerp(offset, 0.1)
        }
        camera?.lookAt(model.position)
      }

      if (mixer) mixer.update(clock.getDelta())

      if (renderer && scene && camera) {
        renderer.render(scene, camera)
      }
      if (camera) setCamera(camera)
      if (renderer) setRenderer(renderer)
      if (controls) setControls(controls)
    }

    animate()
  }, [scene, camera, renderer, model, controls, mixer, wheelAnimations])
}

export default useAnimation
