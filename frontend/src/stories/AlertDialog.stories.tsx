import { ErpAlertDialog } from '@/components/custom/erp-alert-dialog';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

const meta = {
  title: 'Example/AlertDialog',
  component: ErpAlertDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    buttonType: 'yes-no',
  },
} satisfies Meta<typeof ErpAlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {},
};

export const Secondary: Story = {
  args: {},
};

export const Large: Story = {
  args: {},
};

export const Small: Story = {
  args: {},
};
