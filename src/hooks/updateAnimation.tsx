import { useKeyStore } from "../stores/useKeyStore"
import * as THREE from "three"

const updateAnimation = (mixer: THREE.AnimationMixer, wheelAnimations: THREE.AnimationClip[]) => {
  if (!mixer) return

  const isMoving = useKeyStore.getState().isMoving

  // 애니메이션이 없는 경우, 애니메이션 액션을 생성하거나 다시 가져오기
  wheelAnimations.forEach((animation) => {
    const moveAction = mixer.clipAction(animation)

    if (isMoving) {
      if (!moveAction.isRunning()) {
        moveAction.play() // 이동 중이면 애니메이션 실행
      }
    } else {
      if (moveAction.isRunning()) {
        moveAction.stop() // 멈추면 애니메이션 정지
      }
    }
  })
}

export default updateAnimation
