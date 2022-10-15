import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

import { IconButton } from './ToolMenu';

afterEach(() => {
  cleanup();
});

describe('ToolMenu.js', () => {
  describe('<IconButton />', () => {
    it('renders with title attribute', () => {
      const { container } = render(<IconButton isActive alt="Lasso" />);
      expect(container.querySelectorAll('[title="Lasso"]').length).toEqual(1);
    });
  });
});
