import { vi } from 'vitest'

export const mockSyncManager = {
  addPendingOperation: vi.fn(() => Promise.resolve()),
  sync: vi.fn(() => Promise.resolve()),
  startAutoSync: vi.fn(),
  stopAutoSync: vi.fn(),
  getPendingOperations: vi.fn(() => Promise.resolve([])),
}

export const resetSyncManagerMocks = () => {
  Object.values(mockSyncManager).forEach((fn) => {
    if (typeof fn === 'function') {
      fn.mockClear()
    }
  })
}
