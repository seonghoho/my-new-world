import { useEffect } from "react"
import { useKeyStore } from "../stores/useKeyStore"

const useKeyEvents = () => {
  useEffect(() => {
    const { setKeyDown, setKeyUp, setDefaultXY, setKeyReset, setIsPointerMoving } =
      useKeyStore.getState()

    const handleKeyDown = (event: KeyboardEvent) => {
      setKeyDown(event.code)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeyUp(event.code)
    }

    // 누른 위치 저장
    const controlStickDown = (event: PointerEvent) => {
      if (!(event.target as HTMLElement).classList.contains("control-stick")) return
      setIsPointerMoving(true)
      setDefaultXY(event.clientX, event.clientY)
      window.addEventListener("pointermove", controlStickMove, { passive: false }) // 🔹 스크롤 방지
      window.addEventListener("touchmove", controlStickMove, { passive: false }) // 🔹 모바일 대응
    }

    const controlStickMove = (event: PointerEvent | TouchEvent) => {
      if (!useKeyStore.getState().isPointerMoving) return
      event.preventDefault()

      let cx, cy
      if (event instanceof PointerEvent) {
        cx = event.clientX
        cy = event.clientY
      } else {
        cx = event.touches[0].clientX
        cy = event.touches[0].clientY
      }
      const { x, y } = useKeyStore.getState().defaultXY

      let dx = cx - x // X 이동 거리
      let dy = cy - y // Y 이동 거리

      // 대각선 방향에서 반지름 28에 맞게 조정
      const distance = Math.sqrt(dx * dx + dy * dy) // 현재 이동 거리

      const maxDistance = 28 // 반지름 28

      // 이동 거리가 반지름을 초과하면 비례적으로 조정
      if (distance > maxDistance) {
        const scale = maxDistance / distance
        dx *= scale
        dy *= scale
      }

      const target = document.querySelector(".control-stick") as HTMLElement
      if (target) {
        target.style.left = `${28 + dx}px`
        target.style.top = `${28 + dy}px`
      }

      const threshold = 10 // 최소 이동 감지 거리
      // 좌우 방향 우선 판별
      if (dx > threshold) {
        setKeyUp("ArrowLeft")
        setKeyDown("ArrowRight") // 오른쪽 이동
      } else if (dx < -threshold) {
        setKeyUp("ArrowRight")
        setKeyDown("ArrowLeft") // 왼쪽 이동
      } else {
        setKeyUp("ArrowLeft")
        setKeyUp("ArrowRight")
      }
      // 상하 방향 판별
      if (dy > threshold) {
        setKeyUp("ArrowUp")
        setKeyDown("ArrowDown") // 아래 이동
      } else if (dy < -threshold) {
        setKeyUp("ArrowDown")
        setKeyDown("ArrowUp") // 위 이동
      } else {
        setKeyUp("ArrowUp")
        setKeyUp("ArrowDown")
      }
    }

    const controlStickUp = () => {
      setKeyReset()
      setDefaultXY(0, 0)
      setIsPointerMoving(false)

      const target = document.querySelector(".control-stick") as HTMLElement
      if (target) {
        target.style.left = `${28}px`
        target.style.top = `${28}px`
      }
      window.removeEventListener("pointermove", controlStickMove)
      window.removeEventListener("touchmove", controlStickMove)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    // 컨트롤 스틱 이벤트
    window.addEventListener("pointerdown", controlStickDown)
    window.addEventListener("pointerup", controlStickUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])
}

export default useKeyEvents
