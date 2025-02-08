import { useEffect } from "react"
import { useKeyStore } from "../stores/useKeyStore"

const useKeyEvents = () => {
  useEffect(() => {
    const { setKeyDown, setKeyUp } = useKeyStore.getState()

    const handleKeyDown = (event: KeyboardEvent) => {
      setKeyDown(event.code)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeyUp(event.code)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])
}

export default useKeyEvents
