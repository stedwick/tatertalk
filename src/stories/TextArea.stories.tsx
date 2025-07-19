import type { Meta, StoryObj } from '@storybook/react';
import TextArea from '../components/atoms/TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Atoms/TextArea',
  component: TextArea,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'text changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onChange: (value) => console.log('Text changed:', value),
  },
};

export const WithText: Story = {
  args: {
    value: 'This is some sample text that has been transcribed.',
    onChange: (value) => console.log('Text changed:', value),
  },
};

export const Disabled: Story = {
  args: {
    value: 'This text area is disabled.',
    onChange: (value) => console.log('Text changed:', value),
    disabled: true,
  },
}; 