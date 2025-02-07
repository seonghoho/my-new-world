import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as THREE from "three"

const Controls = (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  return controls
}

export default Controls
