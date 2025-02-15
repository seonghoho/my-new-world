import * as CANNON from "cannon-es"

const ContactMaterial = ({
  world,
  setBikeMaterial,
  setGroundMaterial,
}: {
  world: CANNON.World
  setBikeMaterial: (material: CANNON.Material) => void
  setGroundMaterial: (material: CANNON.Material) => void
}) => {
  const bikeMaterial = new CANNON.Material("bikeMaterial")
  const groundMaterial = new CANNON.Material("groundMaterial")
  setBikeMaterial(bikeMaterial)
  setGroundMaterial(groundMaterial)

  const contactMaterial = new CANNON.ContactMaterial(bikeMaterial, groundMaterial, {
    friction: 0.5,
    restitution: 0.1,
  })

  world.addContactMaterial(contactMaterial)
  return null
}

export default ContactMaterial
