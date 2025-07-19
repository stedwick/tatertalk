import type { Meta, StoryObj } from '@storybook/react'
import SignupForm from '../components/molecules/SignupForm'

const meta: Meta<typeof SignupForm> = {
  title: 'Molecules/SignupForm',
  component: SignupForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSwitchToLogin: () => console.log('Switch to login clicked'),
  },
} 