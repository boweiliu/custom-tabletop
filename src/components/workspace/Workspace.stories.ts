import type { Meta, StoryObj } from '@storybook/svelte';
import Workspace from './Workspace.svelte';
import { screenPos, px } from '../../lib/types';

const meta = {
  title: 'Components/Workspace',
  component: Workspace,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    gridLines: { control: 'object' },
    cards: { control: 'object' },
    centerPosition: { control: 'object' },
    gridSpacing: { control: 'number' },
    cardWidth: { control: 'number' },
    cardHeight: { control: 'number' }
  }
} satisfies Meta<Workspace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    gridLines: [
      { position: px(0), orientation: 'horizontal', isCenter: false },
      { position: px(50), orientation: 'horizontal', isCenter: true },
      { position: px(100), orientation: 'horizontal', isCenter: false },
      { position: px(0), orientation: 'vertical', isCenter: false },
      { position: px(50), orientation: 'vertical', isCenter: true },
      { position: px(100), orientation: 'vertical', isCenter: false }
    ],
    cards: [],
    centerPosition: screenPos(500, 500),
    gridSpacing: px(50),
    cardWidth: px(200),
    cardHeight: px(300)
  }
};

export const WithCards: Story = {
  args: {
    ...Empty.args,
    cards: [
      {
        id: '1',
        text: 'Example Card 1',
        position: screenPos(500, 500),
        gridPosition: { x: 0.5, y: 0.5 }
      },
      {
        id: '2',
        text: 'Example Card 2',
        position: screenPos(700, 500),
        gridPosition: { x: 2.5, y: 2.5 }
      }
    ]
  }
};