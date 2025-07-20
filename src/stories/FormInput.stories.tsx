import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import FormInput from "../components/atoms/FormInput"

interface FormInputWrapperProps {
  field: string
  label: string
  type?: string
  placeholder?: string
  showError?: boolean
}

// Wrapper component to provide form context
const FormInputWrapper = ({
  field,
  showError = false,
  ...props
}: FormInputWrapperProps) => {
  const schema = z.object({
    [field]: z.string().min(1, "This field is required"),
  })

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      [field]: "",
    },
  })

  // Trigger validation to show error
  if (showError) {
    methods.trigger(field)
  }

  return (
    <FormProvider {...methods}>
      <form>
        <FormInput name={field} {...props} />
      </form>
    </FormProvider>
  )
}

const meta: Meta<typeof FormInputWrapper> = {
  title: "Atoms/FormInput",
  component: FormInputWrapper,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    field: { control: "text" },
    label: { control: "text" },
    type: { control: "select", options: ["text", "email", "password"] },
    placeholder: { control: "text" },
    showError: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    field: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
}

export const Password: Story = {
  args: {
    field: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
  },
}

export const WithError: Story = {
  args: {
    field: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    showError: true,
  },
}
