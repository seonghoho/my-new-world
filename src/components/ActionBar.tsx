import { useBikeStore } from "../stores/useBikeStore"

const ActionBar = () => {
  const { camera, model, currentPointOfView, setCurrentPointOfView } = useBikeStore()

  const changeView = () => {
    if (currentPointOfView !== 3) {
      setCurrentPointOfView(currentPointOfView + 1)
    } else {
      setCurrentPointOfView(0)
    }
  }

  const reset = () => {
    camera?.position.set(8, 3, 5)
    camera?.rotation.set(0, 0, 0)
    model?.position.set(0, 0, 0)
    model?.rotation.set(0, 0, 0)
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 10, // 3D 씬보다 위에 표시되도록 설정
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <button onClick={() => changeView()}>시점 변경</button>
      {/* <button>Pause</button> */}
      <button onClick={() => reset()}>Reset</button>
    </div>
  )
}

export default ActionBar
