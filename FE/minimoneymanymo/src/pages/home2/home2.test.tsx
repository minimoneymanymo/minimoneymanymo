import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import Home2 from './home2';

test('renders Home2 component', () => {
  const wrapper = render(<Home2 />);
  expect(wrapper).toBeTruthy();
});
