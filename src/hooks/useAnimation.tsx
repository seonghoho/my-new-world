import { useEffect, useRef } from "react"
import { useBikeStore } from "../stores/useBikeStore"
import { useKeyStore } from "../stores/useKeyStore"
import * as THREE from "three"
import updateAnimation from "./updateAnimation"
import updateMovement from "./updateMovement"

const useAnimation = () => {
  const {
    scene,
    camera,
    renderer,
    model,
    mixer,
    controls,
    wheelAnimations,
    setModel,
    setCamera,
    setRenderer,
    setControls,
    setSpeed,
  } = useBikeStore()

  const isJumping = useRef(false)
  const jumpVelocity = useRef(0)
  const velocity = useRef(0)
  const jumpPower = 0.2 // 점프 힘
  const gravity = 0.01 // 중력

  // 🔹 키 입력 감지
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !isJumping.current) {
      isJumping.current = true
      jumpVelocity.current = jumpPower // 점프 힘 적용
    }
  })

  useEffect(() => {
    const clock = new THREE.Clock()

    function animate() {
      requestAnimationFrame(animate)

      controls?.update()

      // 🎯 이동 처리
      if (model)
        updateMovement(
          isJumping,
          jumpVelocity,
          velocity,
          gravity,
          model,
          setModel,
          setSpeed,
        )
      if (mixer && wheelAnimations) updateAnimation(mixer, wheelAnimations)

      const isMoving = useKeyStore.getState().isMoving

      // 🎥 카메라 업데이트
      if (model) {
        if (isMoving) {
          const offset = new THREE.Vector3(0, 6, 8)
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
  }, [
    scene,
    camera,
    renderer,
    model,
    controls,
    setModel,
    setSpeed,
    mixer,
    wheelAnimations,
    setCamera,
    setRenderer,
    setControls,
  ])
}

export default useAnimation
