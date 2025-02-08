import type { Meta, StoryObj } from '@storybook/svelte';
import CardList from './CardList.svelte';
import { screenPos, px } from '../../lib/types';

const meta = {
  title: 'Components/CardList',
  component: CardList,
  tags: ['autodocs'],
  argTypes: {
    cards: { control: 'object' },
    centerPosition: { control: 'object' },
    gridSpacing: { control: 'number' },
    cardWidth: { control: 'number' },
    cardHeight: { control: 'number' }
  }
} satisfies Meta<CardList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    cards: [],
    centerPosition: screenPos(500, 500),
    gridSpacing: px(50),
    cardWidth: px(200),
    cardHeight: px(300)
  }
};

export const WithOneCard: Story = {
  args: {
    cards: [{
      id: '1',
      text: 'Example Card',
      position: screenPos(500, 500),
      gridPosition: { x: 0.5, y: 0.5 }
    }],
    centerPosition: screenPos(500, 500),
    gridSpacing: px(50),
    cardWidth: px(200),
    cardHeight: px(300)
  }
};