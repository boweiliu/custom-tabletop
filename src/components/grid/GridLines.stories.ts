import type { Meta, StoryObj } from '@storybook/svelte';
import GridLines from './GridLines.svelte';
import { px } from '../../lib/types';

const meta = {
  title: 'Components/GridLines',
  component: GridLines,
  tags: ['autodocs'],
  argTypes: {
    gridLines: { control: 'object' }
  }
} satisfies Meta<GridLines>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gridLines: [
      { position: px(0), orientation: 'horizontal', isCenter: false },
      { position: px(50), orientation: 'horizontal', isCenter: true },
      { position: px(100), orientation: 'horizontal', isCenter: false },
      { position: px(0), orientation: 'vertical', isCenter: false },
      { position: px(50), orientation: 'vertical', isCenter: true },
      { position: px(100), orientation: 'vertical', isCenter: false }
    ]
  }
};