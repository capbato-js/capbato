# DataTable Components Usage Guide

## Overview

The DataTable system has been separated into two focused components for maximum flexibility:

- **`DataTableHeader`**: Handles the title and action button
- **`DataTable`**: Handles only the table functionality (search + table)

## Components

### DataTableHeader

Renders the page title and optional action button.

```tsx
<DataTableHeader
  title="Patient Records"
  onAddItem={handleAddPatient}
  addButtonText="Add New Patient"
  addButtonIcon="fas fa-user-plus"
/>
```

**Props:**

- `title: string` - The page/section title
- `onAddItem?: () => void` - Optional callback for the action button
- `addButtonText?: string` - Button text (default: "Add New")
- `addButtonIcon?: string` - Font Awesome icon class (default: "fas fa-plus")

### DataTable

Renders just the table with optional search functionality.

```tsx
<DataTable
  data={patients}
  columns={columns}
  searchable={true}
  searchPlaceholder="Search patients..."
  searchFields={['fullName', 'patientNumber']}
  emptyStateMessage="No patients found"
/>
```

**Props:**

- `data: T[]` - Array of data items
- `columns: TableColumn<T>[]` - Column configuration
- `searchable?: boolean` - Enable/disable search (default: false)
- `searchPlaceholder?: string` - Search input placeholder
- `searchFields?: (keyof T)[]` - Specific fields to search in
- `isLoading?: boolean` - Show loading state
- `emptyStateMessage?: string` - Message when no data

## Usage Patterns

### Basic Usage (Header + Table)

```tsx
import { DataTable, DataTableHeader, TableColumn } from '../../../components/common';

export const MyTable: React.FC = () => {
  const columns: TableColumn<MyType>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '20%',
      align: 'center'
    },
    {
      key: 'name',
      header: 'Name',
      width: '80%',
      align: 'left',
      searchable: true
    }
  ];

  return (
    <Box>
      <DataTableHeader
        title="My Records"
        onAddItem={handleAdd}
        addButtonText="Add New"
        addButtonIcon="fas fa-plus"
      />
      
      <DataTable
        data={myData}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search records..."
        emptyStateMessage="No records found"
      />
    </Box>
  );
};
```

### Advanced Usage (Custom Content Between Header and Table)

```tsx
export const AdvancedTable: React.FC = () => {
  return (
    <Box>
      <DataTableHeader
        title="Advanced Records"
        onAddItem={handleAdd}
      />
      
      {/* Custom filters or summary cards */}
      <Box style={{ margin: '20px 0' }}>
        <FilterControls />
        <SummaryCards />
      </Box>
      
      <DataTable
        data={filteredData}
        columns={columns}
        searchable={true}
      />
    </Box>
  );
};
```

### Table Only (No Header)

```tsx
export const SimpleTable: React.FC = () => {
  return (
    <DataTable
      data={data}
      columns={columns}
      searchable={true}
      searchPlaceholder="Search..."
    />
  );
};
```

### Header Only (Custom Table)

```tsx
export const CustomTablePage: React.FC = () => {
  return (
    <Box>
      <DataTableHeader
        title="Custom Table"
        onAddItem={handleAdd}
      />
      
      {/* Your custom table implementation */}
      <CustomTableComponent data={data} />
    </Box>
  );
};
```

## Column Configuration

```tsx
interface TableColumn<T> {
  key: keyof T | string;      // Property key or custom identifier
  header: string;             // Column header text
  width?: string;             // Column width (e.g., '20%', '200px')
  align?: 'left' | 'center' | 'right';  // Text alignment
  render?: (value: any, record: T) => ReactNode;  // Custom renderer
  searchable?: boolean;       // Include in search (default: true)
}
```

### Custom Renderers

```tsx
const columns: TableColumn<Patient>[] = [
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    render: (value, patient) => (
      <Badge color={value === 'active' ? 'green' : 'red'}>
        {value}
      </Badge>
    )
  },
  {
    key: 'actions',
    header: 'Actions',
    align: 'center',
    render: (_, patient) => (
      <Group>
        <Button size="xs" onClick={() => handleEdit(patient.id)}>
          Edit
        </Button>
        <Button size="xs" color="red" onClick={() => handleDelete(patient.id)}>
          Delete
        </Button>
      </Group>
    )
  }
];
```

## Benefits of Separation

1. **Flexibility**: Place custom content between header and table
2. **Reusability**: Use components independently
3. **Maintainability**: Focused single-responsibility components
4. **Customization**: Easy to modify individual parts
5. **Composition**: Build complex layouts by combining components

## Migration from Old DataTable

**Before (monolithic):**
```tsx
<DataTable
  title="Records"
  data={data}
  columns={columns}
  onAddItem={handleAdd}
  searchable={true}
/>
```

**After (separated):**
```tsx
<DataTableHeader
  title="Records"
  onAddItem={handleAdd}
/>
<DataTable
  data={data}
  columns={columns}
  searchable={true}
/>
```

This separation provides much more flexibility for complex page layouts!
