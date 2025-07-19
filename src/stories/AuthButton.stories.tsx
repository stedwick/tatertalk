import type { Meta, StoryObj } from '@storybook/react';
import AuthButton from '../components/atoms/AuthButton';

const meta: Meta<typeof AuthButton> = {
  title: 'Atoms/AuthButton',
  component: AuthButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'accent'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
  },
}; 