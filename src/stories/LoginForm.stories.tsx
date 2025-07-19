import type { Meta, StoryObj } from '@storybook/react'
import LoginForm from '../components/molecules/LoginForm'

const meta: Meta<typeof LoginForm> = {
  title: 'Molecules/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSwitchToSignup: () => console.log('Switch to signup clicked'),
  },
} 