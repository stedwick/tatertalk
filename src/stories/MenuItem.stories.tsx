import {
  ArrowRightStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import { PlayCircleIcon } from "@heroicons/react/24/solid"
import type { Meta, StoryObj } from "@storybook/react"
import { MemoryRouter } from "react-router"
import MenuItemComponent, { type MenuItem } from "../components/atoms/MenuItem"

const meta: Meta<typeof MenuItemComponent> = {
  title: "Atoms/MenuItem",
  component: MenuItemComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClose: { action: "closed" },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="w-80 bg-base-100 p-4 rounded-lg shadow-lg">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const defaultItem: MenuItem = {
  id: "default",
  label: "Default Menu Item",
  icon: <UserIcon className="w-5 h-5" />,
  onClick: () => console.log("Default clicked"),
}

const externalItem: MenuItem = {
  id: "external",
  label: "External Link",
  icon: <PlayCircleIcon className="w-5 h-5" />,
  href: "https://example.com",
  isExternal: true,
  rightIcon: <ArrowTopRightOnSquareIcon className="w-4 h-4" />,
}

const navItem: MenuItem = {
  id: "nav",
  label: "Navigation Link",
  icon: <Cog6ToothIcon className="w-5 h-5" />,
  href: "/settings",
}

const dangerItem: MenuItem = {
  id: "danger",
  label: "Danger Action",
  icon: <ArrowRightStartOnRectangleIcon className="w-5 h-5" />,
  onClick: () => console.log("Danger clicked"),
  variant: "danger",
}

const withRightIcon: MenuItem = {
  id: "with-right",
  label: "With Right Icon",
  icon: <InformationCircleIcon className="w-5 h-5" />,
  onClick: () => console.log("With right icon clicked"),
  rightIcon: <ArrowTopRightOnSquareIcon className="w-4 h-4" />,
}

const longTextItem: MenuItem = {
  id: "long-text",
  label: "user.with.very.long.email.address@example-domain.com",
  icon: <UserIcon className="w-5 h-5" />,
  onClick: () => console.log("Long text clicked"),
}

export const Default: Story = {
  args: {
    item: defaultItem,
  },
}

export const ExternalLink: Story = {
  args: {
    item: externalItem,
  },
}

export const NavigationLink: Story = {
  args: {
    item: navItem,
  },
}

export const DangerVariant: Story = {
  args: {
    item: dangerItem,
  },
}

export const WithRightIcon: Story = {
  args: {
    item: withRightIcon,
  },
}

export const LongText: Story = {
  args: {
    item: longTextItem,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-2">
      <MenuItemComponent item={defaultItem} />
      <MenuItemComponent item={externalItem} />
      <MenuItemComponent item={navItem} />
      <MenuItemComponent item={dangerItem} />
      <MenuItemComponent item={withRightIcon} />
      <MenuItemComponent item={longTextItem} />
    </div>
  ),
}
