import { create } from "zustand"

interface KeyStore {
  keyStates: Record<string, boolean> // 현재 키 상태
  setKeyDown: (key: string) => void // 키를 눌렀을 때 실행
  setKeyUp: (key: string) => void // 키를 뗐을 때 실행
  setKeyReset: () => void
  isMoving: boolean // 현재 움직이고 있는지 여부
  defaultXY: { x: number; y: number }
  setDefaultXY: (x: number, y: number) => void
  isPointerMoving: boolean
  setIsPointerMoving: (isPointerMoving: boolean) => void
}

export const useKeyStore = create<KeyStore>((set) => ({
  keyStates: {},

  setKeyDown: (key) =>
    set((state) => {
      const newKeyStates = { ...state.keyStates, [key]: true }
      return {
        keyStates: newKeyStates,
        isMoving: Object.values(newKeyStates).some((v) => v), // 하나라도 true면 이동 중
      }
    }),

  setKeyUp: (key) =>
    set((state) => {
      const newKeyStates = { ...state.keyStates, [key]: false }
      return {
        keyStates: newKeyStates,
        isMoving: Object.values(newKeyStates).some((v) => v), // 하나라도 true면 이동 중
      }
    }),
  setKeyReset: () =>
    set((state) => {
      const resetKeyStates: Record<string, boolean> = Object.keys(state.keyStates).reduce(
        (acc, key) => {
          acc[key] = false
          return acc
        },
        {} as Record<string, boolean>,
      )

      return {
        keyStates: resetKeyStates,
        isMoving: false, // 초기화 시 이동 상태를 false로 설정
      }
    }),

  isMoving: false, // 초기 상태는 false
  defaultXY: { x: 0, y: 0 },

  setDefaultXY: (x: number, y: number) =>
    set(() => {
      return {
        defaultXY: { x, y },
      }
    }),
  isPointerMoving: false,
  setIsPointerMoving: (isPointerMoving: boolean) =>
    set(() => {
      return { isPointerMoving }
    }),
}))
