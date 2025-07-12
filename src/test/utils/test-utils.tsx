import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { AllProviders } from './AllProviders';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export { render as originalRender, screen, waitFor, fireEvent, within } from '@testing-library/react';
export { customRender as render }; 