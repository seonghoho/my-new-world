import { useEffect, useRef } from "react"
import * as THREE from "three"
import Lights from "./Lights"
import Controls from "./Controls"
import Ground from "./Ground"
import { GLTFLoader } from "three/examples/jsm/Addons.js"

const CanvasWrapper = () => {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current || canvasRef.current.children.length > 0) return

    // 🚀 Three.js 기본 설정
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    camera.position.set(8, 3, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    canvasRef.current.appendChild(renderer.domElement)

    // 🌟 Scene 초기화
    const ground = Ground()
    const lights = Lights()
    const controls = Controls(camera, renderer)

    // 🌅 배경을 푸른 하늘 색으로 설정
    scene.background = new THREE.Color(0x87ceeb) // 밝은 하늘색
    scene.add(ground, ...lights)

    // 🎨 GLB 파일 로드
    const gltfLoader = new GLTFLoader()
    let model: THREE.Object3D
    let mixer: THREE.AnimationMixer
    let animations: THREE.AnimationClip[] = [] // 애니메이션 클립을 전역으로 저장

    // const moveSpeed = 0.1
    const rotationSpeed = 0.05
    const keyStates: Record<string, boolean> = {}
    let velocity = 0 // 현재 속도

    const acceleration = 0.002 // 가속도
    const maxSpeed = 1 // 최대 속도
    const friction = 0.98 // 감속 계수 (0~1 사이 값)

    let isJumping = false
    let jumpVelocity = 0
    const gravity = 0.01 // 중력
    const jumpPower = 0.2 // 점프 힘

    gltfLoader.load("/models/Bike.glb", (gltf) => {
      model = gltf.scene
      model.scale.set(0.5, 0.5, 0.5)
      model.position.set(0, 0, 0)
      animations = gltf.animations // 애니메이션 클립을 전역 배열로 저장
      scene.add(model)
      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model)
        animations.forEach((animation) => {
          const action = mixer.clipAction(animation)
          action.play()
        })
      }
    })

    // 🔄 반응형 처리
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight - 65, false)
    }
    window.addEventListener("resize", onWindowResize)

    // 🔹 키 입력 감지
    window.addEventListener("keydown", (event) => {
      keyStates[event.code] = true

      if (event.code === "Space" && !isJumping) {
        isJumping = true
        jumpVelocity = jumpPower // 점프 힘 적용
      }
    })

    window.addEventListener("keyup", (event) => {
      keyStates[event.code] = false
    })

    // 🚀 바이크 이동 처리
    function updateMovement() {
      if (!model) return

      const moveDirection = new THREE.Vector3()
      const rotationMatrix = new THREE.Matrix4()
      rotationMatrix.extractRotation(model.matrixWorld)

      // 🔹 가속 및 감속
      if (keyStates["ArrowUp"] || keyStates["KeyW"]) {
        velocity = Math.max(velocity - acceleration, -maxSpeed / 2) // 후진 속도는 절반
      } else if (keyStates["ArrowDown"] || keyStates["KeyS"]) {
        velocity = Math.min(velocity + acceleration, maxSpeed) // 최대 속도 제한
      } else {
        velocity *= friction // 키를 놓으면 점진적 감속
        if (Math.abs(velocity) < 0.001) velocity = 0 // 너무 느려지면 정지
      }

      // 🔹 브레이크 (Q 키)
      if (keyStates["KeyQ"]) {
        velocity *= 0.85 // 브레이크 감속
        if (Math.abs(velocity) < 0.002) velocity = 0 // 거의 멈추면 정지
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
        model.position.y += jumpVelocity // 점프 속도 적용
        jumpVelocity -= gravity // 중력 적용

        // 땅에 닿으면 착지
        if (model.position.y <= 0) {
          model.position.y = 0
          isJumping = false
          jumpVelocity = 0
        }
      }

      // 🔹 속도를 적용한 이동
      moveDirection.z = velocity
      moveDirection.applyMatrix4(rotationMatrix)
      model.position.add(moveDirection)
    }

    // 🎥 카메라 따라가기
    function updateCamera() {
      if (!model) return

      const offset = new THREE.Vector3(0, 4, 8) // 바이크 뒤쪽 위치
      offset.applyMatrix4(model.matrixWorld) // 모델의 회전 반영

      camera.position.lerp(offset, 0.1) // 부드럽게 이동
      camera.lookAt(model.position) // 모델을 바라보게 설정
    }

    function updateAnimation() {
      if (!mixer) return

      const isMoving =
        keyStates["ArrowUp"] || keyStates["KeyW"] || keyStates["ArrowDown"] || keyStates["KeyS"]

      // 애니메이션이 없는 경우, 애니메이션 액션을 생성하거나 다시 가져오기
      const moveAction = mixer.clipAction(animations[0])

      if (isMoving) {
        if (!moveAction.isRunning()) {
          moveAction.play() // 이동 중이면 애니메이션 실행
        }
      } else {
        if (moveAction.isRunning()) {
          moveAction.stop() // 멈추면 애니메이션 정지
        }
      }
    }

    // 🌀 애니메이션 루프
    const clock = new THREE.Clock()
    function animate() {
      requestAnimationFrame(animate)
      controls.update() // 카메라 조작 적용
      updateMovement() // 키보드 입력에 따라 바이크 이동
      updateAnimation() // 애니메이션 실행 여부 결정
      updateCamera()
      if (mixer) mixer.update(clock.getDelta())
      renderer.render(scene, camera)
    }
    animate()

    return
  }, [])

  return <div ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />
}

export default CanvasWrapper
