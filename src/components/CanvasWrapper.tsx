import { useEffect, useRef } from "react"
import * as THREE from "three"
import Lights from "./Lights"
import Controls from "./Controls"
import Ground from "./Ground"
import { GLTFLoader } from "three/examples/jsm/Addons.js"
import { useBikeStore } from "../stores/useBikeStore"
import useAnimation from "../hooks/useAnimation"

const CanvasWrapper = () => {
  const canvasRef = useRef<HTMLDivElement>(null)

  const {
    setScene,
    setModel,
    setMixer,
    setGltf,
    setCamera,
    setRenderer,
    setControls,
    setWheelAnimations,
  } = useBikeStore()

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
    // 바퀴 애니메이션
    const wheelAnimations: THREE.AnimationClip[] = []
    const wheelRegex = /wheelAction/i

    gltfLoader.load("/models/Bike.glb", (gltf) => {
      model = gltf.scene
      model.scale.set(0.5, 0.5, 0.5)
      setModel(model)
      setGltf(gltf)

      animations = gltf.animations // 애니메이션 클립을 전역 배열로 저장
      scene.add(model)
      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model)
        setMixer(mixer)
        animations.forEach((animation) => {
          const action = mixer.clipAction(animation)
          if (wheelRegex.test(animation.name)) wheelAnimations.push(animation)
          action.play()
        })
        setWheelAnimations(wheelAnimations)
      }
    })

    // 🔄 반응형 처리
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight, false)
    }

    window.addEventListener("resize", onWindowResize)
    renderer.render(scene, camera)
    setScene(scene)
    setControls(controls)
    setCamera(camera)
    setRenderer(renderer)

    return
  }, [])

  // 애니메이션 실행
  useAnimation()

  return (
    <div>
      <div ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />
    </div>
  )
}

export default CanvasWrapper
