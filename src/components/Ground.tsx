import * as THREE from "three"
import Grass from "../../public/textures/Grass.jpg"

const Ground = () => {
  const textureLoader = new THREE.TextureLoader()
  const groundTexture = textureLoader.load(Grass)
  groundTexture.wrapS = THREE.RepeatWrapping
  groundTexture.wrapT = THREE.RepeatWrapping
  groundTexture.repeat.set(10, 10)

  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    side: THREE.DoubleSide,
  })
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true

  return ground
}

export default Ground
