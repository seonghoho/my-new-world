import * as THREE from "three"

const Clouds = () => {
  const cloudsGroup = new THREE.Group()

  const cloudVertices = []
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 2000 - 1000
    const y = Math.random() * 100 + 150 // Position clouds higher up
    const z = Math.random() * 2000 - 1000
    cloudVertices.push(x, y, z)
  }

  const cloudsGeometry = new THREE.BufferGeometry()
  cloudsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(cloudVertices, 3),
  )

  const cloudMaterial = new THREE.PointsMaterial({
    size: 100,
    sizeAttenuation: true,
    color: 0xffffff,
    transparent: true,
    opacity: 0.7,
    alphaTest: 0.5, // To avoid sharp edges
  })

  const clouds = new THREE.Points(cloudsGeometry, cloudMaterial)
  cloudsGroup.add(clouds)

  // Add more cloud layers for depth
  for (let i = 0; i < 5; i++) {
    const layer = new THREE.Points(
      cloudsGeometry,
      new THREE.PointsMaterial({
        size: Math.random() * 150 + 50,
        sizeAttenuation: true,
        color: 0xf0f0f0,
        transparent: true,
        opacity: Math.random() * 0.3 + 0.2,
        alphaTest: 0.5,
      }),
    )
    layer.position.set(
      (Math.random() - 0.5) * 500,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 500,
    )
    cloudsGroup.add(layer)
  }

  return cloudsGroup
}

export default Clouds
