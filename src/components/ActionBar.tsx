import { useBikeStore } from "../stores/useBikeStore"

const ActionBar = () => {
  const { camera, model, speed, currentPointOfView, setCurrentPointOfView } = useBikeStore()

  const changeView = () => {
    if (currentPointOfView !== 3) {
      setCurrentPointOfView(currentPointOfView + 1)
    } else {
      setCurrentPointOfView(0)
    }
  }

  const reset = () => {
    setCurrentPointOfView(0)
    camera?.position.set(8, 3, 5)
    camera?.rotation.set(0, 0, 0)
    model?.position.set(0, 0, 0)
    model?.rotation.set(0, 0, 0)
  }
  console.log(speed)

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
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button onClick={() => changeView()}>시점 변경</button>
      {/* <button>Pause</button> */}
      <button onClick={() => reset()}>Reset</button>
      <a
        style={{
          textAlign: "end",
          width: "100%",
          fontSize: "30px",
        }}
      >
        {speed}km
      </a>
    </div>
  )
}

export default ActionBar
