import { vi } from 'vitest'

const createMockTable = () => ({
  toArray: vi.fn(() => Promise.resolve([])),
  get: vi.fn(() => Promise.resolve(null)),
  put: vi.fn(() => Promise.resolve()),
  bulkPut: vi.fn(() => Promise.resolve()),
  delete: vi.fn(() => Promise.resolve()),
  clear: vi.fn(() => Promise.resolve()),
  where: vi.fn().mockReturnThis(),
  equals: vi.fn().mockReturnThis(),
  filter: vi.fn().mockReturnThis(),
})

export const mockIndexedDB = {
  pacientes: createMockTable(),
  historias: createMockTable(),
  procedimientos: createMockTable(),
  fotos: createMockTable(),
  pendingOperations: createMockTable(),
}

export const resetIndexedDBMocks = () => {
  Object.values(mockIndexedDB).forEach((table) => {
    Object.values(table).forEach((fn) => {
      if (typeof fn === 'function' && 'mockClear' in fn) {
        fn.mockClear()
      }
    })
  })
}
