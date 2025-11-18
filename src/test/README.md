# Testing Suite - Sarident HCO

## Resumen

Este directorio contiene toda la infraestructura de testing para el proyecto Sarident HCO.

## Estructura

```
src/test/
├── setup.ts              # Configuración global de tests
├── utils.tsx             # Utilidades para testing (custom render, etc.)
├── mocks/               # Mocks de dependencias externas
│   ├── supabase.mock.ts
│   ├── indexeddb.mock.ts
│   └── sync-manager.mock.ts
└── README.md            # Este archivo
```

## Ejecución de Tests

### Comandos disponibles

```bash
# Ejecutar tests en modo watch
npm test

# Ejecutar tests con UI interactiva
npm run test:ui

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

## Estructura de Tests

### Services

Los tests de servicios se encuentran en `src/services/__tests__/`

- **pacientes.service.test.ts**: Tests completos para el servicio de pacientes
  - CRUD operations
  - Offline-first behavior
  - Error handling
  - Sync manager integration

### Hooks

Los tests de hooks se encuentran en `src/hooks/__tests__/`

- **use-debounce.test.ts**: Tests para el hook de debounce
  - Delay functionality
  - Timer reset behavior
  - Type compatibility

- **use-online.test.ts**: Tests para detección de conectividad
  - Online/offline state
  - Event listeners
  - State updates

### Components

Los tests de componentes UI se encuentran en `src/components/ui/__tests__/`

- **button.test.tsx**: Tests del componente Button
  - Variants (default, destructive, outline, secondary, ghost, link)
  - Sizes (sm, default, lg, icon)
  - Event handlers
  - Disabled state
  - Ref forwarding

- **input.test.tsx**: Tests del componente Input
  - Different input types
  - Controlled/uncontrolled inputs
  - Validation attributes
  - Event handlers
  - Ref forwarding

## Mocks

### Supabase Mock

Mock completo del cliente de Supabase con todas las operaciones CRUD y auth.

```typescript
import { mockSupabaseClient, resetSupabaseMocks } from '@/test/mocks/supabase.mock'
```

### IndexedDB Mock

Mock de Dexie/IndexedDB para tests offline.

```typescript
import { mockIndexedDB, resetIndexedDBMocks } from '@/test/mocks/indexeddb.mock'
```

### Sync Manager Mock

Mock del administrador de sincronización.

```typescript
import { mockSyncManager, resetSyncManagerMocks } from '@/test/mocks/sync-manager.mock'
```

## Utilidades de Testing

### Custom Render

Renderiza componentes con todos los providers necesarios (Router, etc.)

```typescript
import { render, screen } from '@/test/utils'

test('example', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

## Cobertura de Código

El objetivo es mantener una cobertura del 80% o superior en:
- Statements
- Branches
- Functions
- Lines

### Ver reporte de cobertura

```bash
npm run test:coverage
```

El reporte se genera en `coverage/index.html`

## Buenas Prácticas

1. **Organización**: Un archivo de test por cada archivo de código
2. **Nombres descriptivos**: Los tests deben describir claramente qué están probando
3. **AAA Pattern**: Arrange, Act, Assert
4. **Cleanup**: Usar `beforeEach` y `afterEach` para limpiar estado
5. **Mocks**: Resetear mocks entre tests
6. **Async/Await**: Usar correctamente para operaciones asíncronas
7. **User Events**: Usar `@testing-library/user-event` en lugar de `fireEvent`

## Ejemplo de Test

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, userEvent } from '@/test/utils'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar correctamente', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('debe manejar clicks', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<MyComponent onClick={handleClick} />)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Próximos Tests a Implementar

- [ ] Tests de integración para flows completos
- [ ] Tests E2E con Playwright
- [ ] Tests de performance
- [ ] Tests de accesibilidad
- [ ] Tests visuales con Chromatic

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
