import type { Meta, StoryObj } from '@storybook/react'
import FormInput from '../components/atoms/FormInput'

const meta: Meta<typeof FormInput> = {
  title: 'Atoms/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password'],
    },
    required: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Email',
    type: 'email',
    value: '',
    onChange: (value: string) => console.log('Value changed:', value),
    placeholder: 'Enter your email',
    required: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    value: 'invalid-email',
    onChange: (value: string) => console.log('Value changed:', value),
    placeholder: 'Enter your email',
    required: true,
    error: 'Please enter a valid email address',
  },
}

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    value: '',
    onChange: (value: string) => console.log('Value changed:', value),
    placeholder: 'Enter your password',
    required: true,
  },
}

export const Text: Story = {
  args: {
    label: 'Name',
    type: 'text',
    value: '',
    onChange: (value: string) => console.log('Value changed:', value),
    placeholder: 'Enter your name',
    required: false,
  },
} 