import { render } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { BorderBeam } from '@/components/magicui/border-beam'

describe('BorderBeam', () => {
  test('renders with correct CSS variables', () => {
    const { container } = render(
      <BorderBeam size={300} duration={10} colorFrom="#ff0000" colorTo="#00ff00" />
    )
    
    const beamDiv = container.firstChild as HTMLElement
    expect(beamDiv).toBeInTheDocument()
    
    // Check if the styles are applied as variables
    const styles = window.getComputedStyle(beamDiv)
    // In JSDOM, custom properties might be harder to query directly,
    // but we can check the inline style attribute:
    const styleAttr = beamDiv.getAttribute('style') || ''
    expect(styleAttr).toContain('--size: 300')
    expect(styleAttr).toContain('--duration: 10')
    expect(styleAttr).toContain('--color-from: #ff0000')
    expect(styleAttr).toContain('--color-to: #00ff00')
  })

  test('applies custom className', () => {
    const { container } = render(<BorderBeam className="test-beam" />)
    const beamDiv = container.firstChild as HTMLElement
    expect(beamDiv).toHaveClass('test-beam')
  })
})
