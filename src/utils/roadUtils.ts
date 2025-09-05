import * as THREE from "three"

export const createRoadMesh = (
  curve: THREE.CatmullRomCurve3,
  isClosed: boolean,
) => {
  const roadWidth = 6
  const roadSegments = isClosed ? 500 : 2000
  const points = curve.getPoints(roadSegments)
  // @ts-ignore
  const { binormals } = curve.computeFrenetFrames(roadSegments, isClosed)

  const vertices = []
  const uvs = []

  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    const binormal = binormals[i]

    const p1 = point.clone().add(binormal.clone().multiplyScalar(roadWidth / 2))
    const p2 = point.clone().sub(binormal.clone().multiplyScalar(roadWidth / 2))

    vertices.push(p1.x, p1.y, p1.z)
    vertices.push(p2.x, p2.y, p2.z)

    const u = i / (points.length - 1)
    uvs.push(u, 0)
    uvs.push(u, 1)
  }

  const indices = []
  for (let i = 0; i < points.length - 1; i++) {
    const a = i * 2
    const b = a + 1
    const c = a + 2
    const d = a + 3

    indices.push(a, b, c)
    indices.push(b, d, c)
  }

  const roadGeometry = new THREE.BufferGeometry()
  roadGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  )
  roadGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
  roadGeometry.setIndex(indices)
  roadGeometry.computeVertexNormals()

  const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x3c3c3c,
    side: THREE.DoubleSide,
  })

  const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial)
  roadMesh.receiveShadow = true
  return roadMesh
}
