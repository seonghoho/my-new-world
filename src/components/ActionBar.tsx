import { useBikeStore } from "../stores/useBikeStore"

const ActionBar = () => {
  const reset = useBikeStore((state) => state.reset)

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
      <button>시점 변경</button>
      <button>Pause</button>
      <button
        onClick={() => {
          reset() // 상태 초기화
        }}
      >
        Reset
      </button>
    </div>
  )
}

export default ActionBar
