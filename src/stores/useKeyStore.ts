import { create } from "zustand"

interface KeyStore {
  keyStates: Record<string, boolean> // 현재 키 상태
  setKeyDown: (key: string) => void // 키를 눌렀을 때 실행
  setKeyUp: (key: string) => void // 키를 뗐을 때 실행
  isMoving: boolean // 현재 움직이고 있는지 여부
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

  isMoving: false, // 초기 상태는 false
}))
