import * as THREE from "three"
import Grass from "/textures/Grass.jpg"

const InfiniteGround = () => {
  const groundGroup = new THREE.Group()
  const textureLoader = new THREE.TextureLoader()
  const groundTexture = textureLoader.load(Grass)
  const tileSize = 100
  const numTiles = 3

  groundTexture.wrapS = THREE.RepeatWrapping
  groundTexture.wrapT = THREE.RepeatWrapping
  groundTexture.repeat.set(10, 10)

  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    side: THREE.DoubleSide,
  })

  const groundGeometry = new THREE.PlaneGeometry(tileSize, tileSize)

  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      const tile = new THREE.Mesh(groundGeometry, groundMaterial)
      tile.position.set(
        (i - Math.floor(numTiles / 2)) * tileSize,
        0,
        (j - Math.floor(numTiles / 2)) * tileSize,
      )
      tile.rotation.x = -Math.PI / 2
      tile.receiveShadow = true
      groundGroup.add(tile)
    }
  }

  return groundGroup
}

export default InfiniteGround