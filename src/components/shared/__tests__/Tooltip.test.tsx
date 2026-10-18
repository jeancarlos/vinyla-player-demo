import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from '../Tooltip'

describe('Tooltip', () => {
  it('renders children correctly', () => {
    render(
      <Tooltip content="Texto de ajuda">
        <button>Hover</button>
      </Tooltip>
    )
    expect(screen.getByText('Hover')).toBeInTheDocument()
  })

  it('renders tooltip content in the document (hidden via css)', () => {
    render(
      <Tooltip content="Texto de ajuda">
        <button>Hover</button>
      </Tooltip>
    )
    expect(screen.getByText('Texto de ajuda')).toBeInTheDocument()
  })

  it('applies start alignment when align="start"', () => {
    render(
      <Tooltip content="Nota" align="start">
        <span>trigger</span>
      </Tooltip>
    )
    const tip = screen.getByText('Nota')
    expect(tip.className).toContain('left-0')
    expect(tip.className).not.toContain('-translate-x-1/2')
  })

  it('applies whitespace-normal and maxWidth when maxWidth provided', () => {
    render(
      <Tooltip content="Nota longa" maxWidth="max-w-xs">
        <span>trigger</span>
      </Tooltip>
    )
    const tip = screen.getByText('Nota longa')
    expect(tip.className).toContain('whitespace-normal')
    expect(tip.className).toContain('max-w-xs')
  })

  it('applies className to wrapper when provided', () => {
    render(
      <Tooltip content="Nota" className="flex-1 min-w-0 block">
        <span>trigger</span>
      </Tooltip>
    )
    const wrapper = screen.getByText('trigger').parentElement
    expect(wrapper?.className).toContain('flex-1')
  })
  it('shows the content when a child has keyboard focus', async () => {
    render(
      <Tooltip content="Texto de ajuda">
        <button>Foco</button>
      </Tooltip>
    )
    await userEvent.tab()
    expect(screen.getByText('Foco')).toHaveFocus()
    const tip = screen.getByRole('tooltip')
    expect(tip).toHaveTextContent('Texto de ajuda')
    expect(tip.className).toContain('group-focus-within/tooltip:opacity-100')
  })

  it('slides with transform so the centering translate utility is kept', async () => {
    const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(200)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      right: 20,
      top: 100,
      bottom: 120,
      width: 20,
      height: 20,
    } as DOMRect)
    render(
      <Tooltip content="Nota">
        <button>edge</button>
      </Tooltip>
    )
    await userEvent.hover(screen.getByText('edge'))
    const tip = screen.getByRole('tooltip')
    expect(tip.style.transform).toBe('translateX(98px)')
    expect(tip.style.translate).toBe('')
    expect(tip.className).toContain('-translate-x-1/2')
    width.mockRestore()
    vi.restoreAllMocks()
  })
})
