import type { Meta, StoryObj } from '@storybook/react';
import { MicrophoneIcon, ScissorsIcon } from '@heroicons/react/24/outline';
import ActionButton from '../components/atoms/ActionButton';

const meta: Meta<typeof ActionButton> = {
  title: 'Atoms/ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'button clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Start Dictation',
    onClick: () => console.log('Button clicked'),
    icon: <MicrophoneIcon className="w-6 h-6" />,
  },
};

export const Secondary: Story = {
  args: {
    children: 'Stop Dictation',
    onClick: () => console.log('Button clicked'),
    variant: 'secondary',
    icon: <MicrophoneIcon className="w-6 h-6" />,
  },
};

export const Accent: Story = {
  args: {
    children: 'Cut Text',
    onClick: () => console.log('Button clicked'),
    variant: 'accent',
    icon: <ScissorsIcon className="w-6 h-6" />,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Cut Text',
    onClick: () => console.log('Button clicked'),
    variant: 'accent',
    disabled: true,
    icon: <ScissorsIcon className="w-6 h-6" />,
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    onClick: () => console.log('Button clicked'),
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    onClick: () => console.log('Button clicked'),
    size: 'md',
  },
}; 