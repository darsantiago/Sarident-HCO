import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input', () => {
  it('debe renderizar correctamente', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('debe renderizar como textbox por defecto', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('debe aceptar diferentes tipos de input', () => {
    const { rerender } = render(<Input type="email" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    input = document.querySelector('input[type="password"]')!
    expect(input).toHaveAttribute('type', 'password')

    rerender(<Input type="number" />)
    input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('debe manejar cambios de valor', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Hello')

    expect(handleChange).toHaveBeenCalledTimes(5) // Una por cada letra
    expect(input).toHaveValue('Hello')
  })

  it('debe mostrar el placeholder', () => {
    render(<Input placeholder="Enter your name" />)
    const input = screen.getByPlaceholderText('Enter your name')
    expect(input).toBeInTheDocument()
  })

  it('debe estar deshabilitado cuando disabled es true', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input disabled onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')

    await user.type(input, 'Test')
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('debe aceptar className personalizado', () => {
    render(<Input className="custom-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('debe mantener las clases base cuando se agrega className', () => {
    render(<Input className="custom-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input', 'rounded-md', 'border')
  })

  it('debe aceptar un valor controlado', () => {
    const { rerender } = render(<Input value="Initial" onChange={vi.fn()} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Initial')

    rerender(<Input value="Updated" onChange={vi.fn()} />)
    expect(input).toHaveValue('Updated')
  })

  it('debe funcionar como input no controlado', async () => {
    const user = userEvent.setup()
    render(<Input defaultValue="Default" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Default')

    await user.clear(input)
    await user.type(input, 'New value')
    expect(input).toHaveValue('New value')
  })

  it('debe soportar readonly', async () => {
    const user = userEvent.setup()
    render(<Input value="Read only" readOnly onChange={vi.fn()} />)
    const input = screen.getByRole('textbox')

    expect(input).toHaveAttribute('readonly')
    await user.type(input, 'Try to change')
    expect(input).toHaveValue('Read only')
  })

  it('debe soportar required', () => {
    render(<Input required />)
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('debe soportar maxLength', async () => {
    const user = userEvent.setup()
    render(<Input maxLength={5} />)
    const input = screen.getByRole('textbox')

    await user.type(input, 'ThisIsALongText')
    expect(input).toHaveValue('ThisI')
  })

  it('debe soportar name attribute', () => {
    render(<Input name="username" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', 'username')
  })

  it('debe soportar id attribute', () => {
    render(<Input id="email-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'email-input')
  })

  it('debe soportar ref forwarding', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('debe permitir focus programático via ref', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Input ref={ref} />)
    ref.current?.focus()
    expect(ref.current).toHaveFocus()
  })

  it('debe manejar onFocus y onBlur', async () => {
    const user = userEvent.setup()
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)

    const input = screen.getByRole('textbox')
    await user.click(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)

    await user.tab()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })
})
