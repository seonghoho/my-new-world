import * as THREE from "three"

const Lights = () => {
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.2)
  sunLight.position.set(5, 10, 5) // Initial position, will be updated
  sunLight.castShadow = true

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  const pointLight = new THREE.PointLight(0xffaa55, 1.5, 10)
  pointLight.position.set(2, 3, 2)

  const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x3d2b1f, 0.8)

  return { sunLight, otherLights: [ambientLight, pointLight, hemiLight] }
}

export default Lights