import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from '../components/atoms/FormInput'
import { z } from 'zod'

// Create a simple schema for the story
const testSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
})

type TestFormData = z.infer<typeof testSchema>

// Wrapper component to provide form context
const FormInputWrapper = ({ field, ...props }: any) => {
  const {
    register,
    formState: { errors },
  } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
  })

  return (
    <FormInput
      {...props}
      register={register(field)}
      error={errors[field as keyof TestFormData]}
    />
  )
}

const meta: Meta<typeof FormInputWrapper> = {
  title: 'Atoms/FormInput',
  component: FormInputWrapper,
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
    field: {
      control: { type: 'select' },
      options: ['email', 'password', 'name'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    required: true,
    field: 'email',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    required: true,
    field: 'email',
  },
  parameters: {
    docs: {
      description: {
        story: 'This story shows the input with validation error styling.',
      },
    },
  },
}

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
    field: 'password',
  },
}

export const Text: Story = {
  args: {
    label: 'Name',
    type: 'text',
    placeholder: 'Enter your name',
    required: false,
    field: 'name',
  },
} 