import { create } from 'zustand'

interface ChatState {
  selectedConvId: string | null
  streamingContent: string
  isStreaming: boolean
  chatError: string | null
  setSelectedConvId: (id: string | null) => void
  setStreamingContent: (text: string) => void
  appendStreamingContent: (chunk: string) => void
  setIsStreaming: (v: boolean) => void
  resetStreaming: () => void
  setChatError: (msg: string | null) => void
}

export const useChatStore = create<ChatState>(set => ({
  selectedConvId: null,
  streamingContent: '',
  isStreaming: false,
  chatError: null,

  setSelectedConvId: id => set({ selectedConvId: id }),
  setStreamingContent: text => set({ streamingContent: text }),
  appendStreamingContent: chunk => set(s => ({ streamingContent: s.streamingContent + chunk })),
  setIsStreaming: v => set({ isStreaming: v }),
  resetStreaming: () => set({ streamingContent: '', isStreaming: false }),
  setChatError: msg => set({ chatError: msg }),
}))
