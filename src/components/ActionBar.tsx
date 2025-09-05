import { useEffect, useState } from "react"
import { useBikeStore } from "../stores/useBikeStore"

const ActionBar = () => {
  const { camera, model, speed, currentPointOfView, setCurrentPointOfView, roadMode, setRoadMode } = useBikeStore()
  const [isControlStick, setIsControlStick] = useState(true)

  const changeView = () => {
    if (currentPointOfView !== 3) {
      setCurrentPointOfView(currentPointOfView + 1)
    } else {
      setCurrentPointOfView(0)
    }
  }

  const changeRoad = () => {
    const newMode = roadMode === 1 ? 2 : 1
    setRoadMode(newMode)
    window.location.reload()
  }

  const reset = () => {
    setCurrentPointOfView(0)
    camera?.position.set(8, 3, 5)
    camera?.rotation.set(0, 0, 0)
    model?.position.set(0, 0, 0)
    model?.rotation.set(0, 0, 0)
  }
  // console.log(speed)
  useEffect(() => {
    if (window.innerWidth < 600) {
      setIsControlStick(true)
    }
  }, [])

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
      <button onClick={() => changeView()}>시점 변경 ({currentPointOfView + 1})</button>
      <button onClick={() => changeRoad()}>도로 변경 ({roadMode})</button>
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
      {isControlStick && (
        <div
          className="fixed left-[5vw] bottom-[5vw] "
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(217, 217, 217)",
          }}
        >
          <div
            className="control-stick bg-[#c4c4c4] border-2 border-[#c1c1c1]"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "100%",
              position: "absolute",
              left: `28px`,
              top: `28px`,
              transition: "transform 0.1s ease-out",
            }}
          ></div>
        </div>
      )}
    </div>
  )
}

export default ActionBar
