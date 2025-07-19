import type { Meta, StoryObj } from '@storybook/react';
import SideMenu from '../components/molecules/SideMenu';

const meta: Meta<typeof SideMenu> = {
  title: 'Molecules/SideMenu',
  component: SideMenu,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'menu closed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Menu closed'),
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Menu closed'),
  },
}; 