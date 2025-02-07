import type { Meta, StoryObj } from '@storybook/svelte';
import App from './App.svelte';

const meta = {
  title: 'App',
  component: App,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  }
} satisfies Meta<App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const EmptyState: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    // Find and click the reset button to clear all cards
    const resetButton = canvasElement.querySelector('.reset-button') as HTMLButtonElement;
    if (resetButton) {
      resetButton.click();
    }
  }
};

export const WithMultipleCards: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    // Find and click the add card button multiple times
    const addButton = canvasElement.querySelector('.add-card-button') as HTMLButtonElement;
    if (addButton) {
      for (let i = 0; i < 3; i++) {
        addButton.click();
        // Add a small delay between clicks
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
};