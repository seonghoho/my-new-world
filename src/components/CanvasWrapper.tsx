import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import * as CANNON from "cannon-es"
import Lights from "./Lights"
import Controls from "./Controls"
import { Ground } from "./Ground"
import { GLTFLoader } from "three/examples/jsm/Addons.js"
import { useBikeStore } from "../stores/useBikeStore"
import { useCannonStore } from "../stores/useCannonStore"
import Floor from "./cannons/Floor"
import CreateBike from "./cannons/CreateBike"
import { useMaterialStore } from "../stores/useMaterialStore"
import ContactMaterial from "./cannons/ContactMaterial"
import useAnimation from "../hooks/useAnimation"

const CanvasWrapper = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [newModel, setNewModel] = useState<THREE.Object3D<THREE.Object3DEventMap> | null>(null)
  const [ground, setGround] = useState<THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshStandardMaterial,
    THREE.Object3DEventMap
  > | null>(null) // ground 상태 관리

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

  // 🏗️ Zustand 스토어에서 물리 엔진 가져오기
  const { world, setWorld, setVehicle, setWheels, addBody } = useCannonStore()
  const { bikeMaterial, groundMaterial, setBikeMaterial, setGroundMaterial } = useMaterialStore()

  // 🚀 Cannon 물리 엔진 초기화
  useEffect(() => {
    const world = new CANNON.World({
      allowSleep: true,
      gravity: new CANNON.Vec3(0, -9.82, 0),
    })
    world.defaultContactMaterial.restitution = 0.3
    setWorld(world)
    // ContactMaterial이 물리 엔진과 관련된 설정이므로 여기서 호출
    if (world) ContactMaterial({ world, setBikeMaterial, setGroundMaterial })
  }, [])

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
    setGround(ground)
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
      setNewModel(model)

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

  // 물리 엔진과 재질 설정
  useEffect(() => {
    if (!bikeMaterial && !ground) return

    if (groundMaterial && ground) Floor(ground, addBody, groundMaterial)
    if (bikeMaterial && world && newModel) {
      CreateBike(world, newModel, setVehicle, setWheels, bikeMaterial)
    }
  }, [ground, world, bikeMaterial, groundMaterial, newModel])

  // 애니메이션 실행
  useAnimation()

  return (
    <div>
      <div ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />
    </div>
  )
}

export default CanvasWrapper
