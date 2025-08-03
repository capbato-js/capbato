# Modal Component

A reusable Modal component built on top of Mantine's Modal with consistent styling and behavior across the application.

## Features

- **Consistent Styling**: Matches the design patterns used throughout the application
- **Flexible Content**: Accepts any React node as children
- **Customizable**: Supports custom styles and properties
- **TypeScript Support**: Full TypeScript interface support
- **Responsive**: Works across different screen sizes
- **Proper Z-Index**: Automatically renders above header and sidebar with z-index 2000

## Usage

```tsx
import { Modal } from '../../../components/common/Modal';
import { useDisclosure } from '@mantine/hooks';

const MyComponent = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open}>Open Modal</Button>
      
      <Modal
        opened={opened}
        onClose={close}
        title="My Modal Title"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opened` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Close handler function |
| `title` | `string` | - | Modal title text |
| `children` | `ReactNode` | - | Modal content |
| `size` | `MantineModalProps['size']` | `'md'` | Modal size |
| `withCloseButton` | `boolean` | `true` | Show/hide close button |
| `centered` | `boolean` | `true` | Center modal on screen |
| `customStyles` | `object` | `{}` | Custom style overrides |
| `className` | `string` | - | Additional CSS class |

## Custom Styles

You can override default styles by passing a `customStyles` object:

```tsx
<Modal
  opened={opened}
  onClose={close}
  title="Custom Styled Modal"
  customStyles={{
    content: { backgroundColor: '#f5f5f5' },
    title: { color: '#333' }
  }}
>
  Content here
</Modal>
```

## Default Styling

The component comes with pre-configured styles that match the application's design system:

- **Border Radius**: 16px rounded corners
- **Padding**: 32px top/bottom, 24px left/right
- **Title Color**: #0b4f6c (brand blue)
- **Title Size**: 20px, bold, centered using Mantine's Styles API
- **Close Button**: Light gray (#888) with 22px font size
- **Header Layout**: Centered using flexbox justify-content

### Title Centering Implementation

The title is properly centered using Mantine's Styles API by:

1. Setting `justifyContent: 'center'` on the header element
2. Applying `textAlign: 'center'` and `width: '100%'` to the title element
3. Using Mantine's internal title rendering instead of custom Text component

This ensures the title is always perfectly centered regardless of modal size.

## Examples

### Basic Modal

```tsx
<Modal opened={opened} onClose={close} title="Basic Modal">
  <p>Simple modal content</p>
</Modal>
```

### Form Modal

```tsx
<Modal opened={opened} onClose={close} title="Create Account">
  <form onSubmit={handleSubmit}>
    <Stack gap="md">
      <TextInput label="Name" />
      <Button type="submit">Submit</Button>
    </Stack>
  </form>
</Modal>
```

### Custom Sized Modal

```tsx
<Modal 
  opened={opened} 
  onClose={close} 
  title="Large Modal" 
  size="lg"
>
  <p>Large modal content</p>
</Modal>
```
