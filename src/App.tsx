import CanvasWrapper from "./components/CanvasWrapper"
import useKeyEvents from "./hooks/useKeyEvents"

function App() {
  // 키 이벤트 관리 훅 호출
  useKeyEvents()

  return (
    <>
      <CanvasWrapper />
    </>
  )
}

export default App
