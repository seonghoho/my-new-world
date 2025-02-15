import * as THREE from "three"
import Grass from "/textures/Grass.jpg"

// 시각적인 바닥을 생성하는 함수
export const Ground = () => {
  const textureLoader = new THREE.TextureLoader()
  const groundTexture = textureLoader.load(Grass)

  groundTexture.wrapS = THREE.RepeatWrapping
  groundTexture.wrapT = THREE.RepeatWrapping
  groundTexture.repeat.set(100, 100)

  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    side: THREE.DoubleSide,
  })

  // Three.js에서 시각적인 바닥을 생성
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true

  return ground
}
