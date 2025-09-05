import * as THREE from "three"
import { Sky } from "three/examples/jsm/objects/Sky.js"

const SkyComponent = () => {
  const sky = new Sky()
  sky.scale.setScalar(450000)

  const skyUniforms = sky.material.uniforms

  skyUniforms["turbidity"].value = 10
  skyUniforms["rayleigh"].value = 2
  skyUniforms["mieCoefficient"].value = 0.005
  skyUniforms["mieDirectionalG"].value = 0.8

  const sun = new THREE.Vector3()

  // Sun position is set in CanvasWrapper where renderer is available

  return { sky, sun }
}

export default SkyComponent