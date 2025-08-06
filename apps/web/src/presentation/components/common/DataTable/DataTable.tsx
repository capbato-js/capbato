import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Box, TextInput, Table, Skeleton, useMantineTheme, ActionIcon, Tooltip, ScrollArea } from '@mantine/core';
import { DataTableProps, SearchableItem } from './types';
import { useTableHeight } from './useTableHeight';

export function DataTable<T extends SearchableItem>({
  data,
  columns,
  actions,
  onRowClick,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchFields,
  isLoading = false,
  emptyStateMessage = 'No data available',
  skeletonRowCount = 5,
  cursor = 'default',
  maxHeight = '400px',
  scrollAreaProps,
  useViewportHeight = false,
  bottomPadding = 20
}: DataTableProps<T>) {
  const theme = useMantineTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const [actualHeaderHeight, setActualHeaderHeight] = useState<number>(60);

  // Measure actual header height dynamically
  useEffect(() => {
    const measureHeaderHeight = () => {
      if (headerRef.current) {
        const measuredHeight = headerRef.current.offsetHeight;
        const safeHeight = Math.max(measuredHeight, 50); // Minimum 50px
        console.log('[DataTable] Header height measured:', {
          measuredHeight,
          safeHeight,
          previousHeight: actualHeaderHeight
        });
        setActualHeaderHeight(safeHeight);
      }
    };

    // Initial measurement
    measureHeaderHeight();

    // Set up ResizeObserver to watch for header changes
    if (headerRef.current && window.ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newHeight = Math.max(entry.contentRect.height, 50);
          console.log('[DataTable] Header resized:', {
            oldHeight: actualHeaderHeight,
            newHeight,
            contentRect: entry.contentRect
          });
          setActualHeaderHeight(newHeight);
        }
      });

      resizeObserver.observe(headerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }

    // Fallback: Re-measure on window resize
    const handleResize = () => measureHeaderHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]); // Re-run when columns change

  const dynamicHeight = useTableHeight(tableContainerRef, {
    enabled: useViewportHeight,
    bottomPadding,
    minHeight: 200,
    fallbackHeight: maxHeight
  });

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery) return data;

    const query = searchQuery.toLowerCase();
    
    return data.filter(item => {
      // If specific search fields are provided, search only those fields
      if (searchFields && searchFields.length > 0) {
        return searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(query);
        });
      }
      
      // Otherwise, search all searchable columns
      return columns.some(column => {
        if (column.searchable === false) return false;
        
        const value = item[column.key as keyof T];
        return value && String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchFields, columns, searchable]);

  // Estimate content height for scroll decision (using dynamic header height)
  const estimatedRowHeight = 80; // pixels per row including padding (increased from 60)
  const estimatedContentHeight = filteredData.length * estimatedRowHeight + actualHeaderHeight;
  const availableHeight = typeof dynamicHeight === 'number' ? dynamicHeight : parseInt(String(dynamicHeight)) || 400;
  const needsScrolling = useViewportHeight && estimatedContentHeight > availableHeight;

  console.log('[DataTable] Content analysis:', {
    rowCount: filteredData.length,
    estimatedRowHeight,
    actualHeaderHeight,
    estimatedContentHeight,
    availableHeight,
    dynamicHeight,
    needsScrolling,
    useViewportHeight,
    maxHeight,
    bottomPadding,
    renderingMode: needsScrolling ? 'ScrollArea with fixed height' : 'Natural height (no ScrollArea)'
  });
  
  console.log('[DataTable] Scroll decision:', {
    needsScrolling,
    willUseScrollArea: needsScrolling,
    contentFitsInViewport: estimatedContentHeight <= availableHeight
  });

  // Create skeleton rows for loading state
  const skeletonRows = Array.from({ length: skeletonRowCount }, (_, index) => (
    <Table.Tr key={`skeleton-${index}`}>
      {columns.map((column) => (
        <Table.Td
          key={`skeleton-${index}-${String(column.key)}`}
          style={{
            padding: '16px 24px',
            // textAlign: column.align || 'left',
            textAlign: 'center',
            borderBottom: index < skeletonRowCount - 1 ? `1px solid ${theme.colors.customGray[1]}` : 'none'
          }}
        >
          <Skeleton height={16} radius="sm" />
        </Table.Td>
      ))}
      {actions && (
        <Table.Td
          key={`skeleton-${index}-actions`}
          style={{
            padding: '16px 24px',
            textAlign: 'center',
            borderBottom: index < skeletonRowCount - 1 ? `1px solid ${theme.colors.customGray[1]}` : 'none',
            width: '100px'
          }}
        >
          <Skeleton height={16} radius="sm" />
        </Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <Box>
      {/* Search Bar - Always visible */}
      {searchable && (
        <TextInput
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          style={{
            marginBottom: '20px'
          }}
          styles={{
            input: {
              border: `1px solid ${theme.colors.customGray[3]}`,
              borderRadius: '6px',
              fontSize: '14px',
              padding: '10px 12px',
              '&:focus': {
                borderColor: theme.colors.customGray[6],
                boxShadow: 'none'
              }
            }
          }}
        />
      )}

      {/* Table - Always visible with headers */}
      <Box
        ref={tableContainerRef}
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
          marginTop: '16px',
          border: `1px solid ${theme.colors.customGray[2]}`,
          background: 'white'
        }}
      >
        {/* Fixed Header Table */}
        <Table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed'
          }}
        >
          <Table.Thead ref={headerRef}>
            <Table.Tr
              style={{
                background: theme.colors.customGray[9],
                borderBottom: `1px solid ${theme.colors.customGray[3]}`
              }}
            >
              {columns.map((column) => (
                <Table.Th
                  key={String(column.key)}
                  style={{
                    padding: '16px 24px',
                    // textAlign: column.align || 'left',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: theme.colors.customGray[8],
                    width: column.width,
                    borderBottom: 'none'
                  }}
                >
                  {column.header}
                </Table.Th>
              ))}
              {actions && (
                <Table.Th
                  style={{
                    padding: '16px 24px',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: theme.colors.customGray[8],
                    width: '100px',
                    borderBottom: 'none'
                  }}
                >
                  Actions
                </Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
        </Table>

        {/* Conditional Scrollable Body */}
        {(() => {
          console.log('[DataTable] Rendering decision: needsScrolling =', needsScrolling);
          return needsScrolling;
        })() ? (
          <ScrollArea
            h={dynamicHeight}
            {...scrollAreaProps}
          >
            <Table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                tableLayout: 'fixed'
              }}
            >
              <Table.Tbody>
                {isLoading ? (
                  skeletonRows
                ) : filteredData.length === 0 ? (
                  <Table.Tr>
                    <Table.Td
                      colSpan={columns.length + (actions ? 1 : 0)}
                      style={{
                        padding: '48px 24px',
                        textAlign: 'center',
                        color: theme.colors.customGray[8],
                        fontSize: '16px',
                        fontWeight: 400,
                        background: theme.colors.customGray[9]
                      }}
                    >
                      {emptyStateMessage}
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredData.map((item, rowIndex) => (
                    <Table.Tr
                      key={rowIndex}
                      onMouseEnter={() => setHoveredRow(rowIndex)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => onRowClick?.(item)}
                      style={{
                        borderBottom: rowIndex < filteredData.length - 1 ? `1px solid ${theme.colors.customGray[1]}` : 'none',
                        transition: 'background-color 0.15s ease',
                        backgroundColor: hoveredRow === rowIndex ? theme.colors.customGray[0] : 'transparent',
                        cursor: cursor
                      }}
                    >
                      {columns.map((column) => {
                        const value = item[column.key as keyof T];
                        const displayValue = column.render ? column.render(value, item) : String(value || '');
                        
                        return (
                          <Table.Td
                            key={String(column.key)}
                            style={{
                              padding: '16px 24px',
                              // textAlign: column.align || 'left',
                            textAlign: 'center',
                              whiteSpace: column.align === 'center' ? 'nowrap' : 'normal',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              wordWrap: column.align !== 'center' ? 'break-word' : 'normal',
                              fontSize: '16px',
                              fontWeight: 400,
                              color: theme.colors.customGray[8],
                              width: column.width
                            }}
                          >
                            {displayValue}
                          </Table.Td>
                        );
                      })}
                      {actions && (
                        <Table.Td
                          style={{
                            padding: '16px 24px',
                            textAlign: 'center',
                            width: '100px'
                          }}
                        >
                          <Box
                            style={{
                              display: 'flex',
                              gap: '4px',
                              justifyContent: 'center'
                            }}
                          >
                            {actions.buttons.map((action, actionIndex) => (
                              <Tooltip
                                key={actionIndex}
                                label={action.tooltip}
                                withArrow
                                position="top"
                              >
                                <ActionIcon
                                  variant="subtle"
                                  color="gray"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(item);
                                  }}
                                  style={{
                                    color: theme.colors.customGray[5],
                                    transition: 'all 0.15s ease',
                                    minWidth: '28px',
                                    minHeight: '28px'
                                  }}
                                  styles={{
                                    root: {
                                      '&:hover': {
                                        backgroundColor: theme.colors.customGray[1],
                                        color: theme.colors.customGray[8]
                                      }
                                    }
                                  }}
                                >
                                  <i className={action.icon} style={{ fontSize: '16px' }} />
                                </ActionIcon>
                              </Tooltip>
                            ))}
                          </Box>
                        </Table.Td>
                      )}
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        ) : (() => {
          console.log('[DataTable] Rendering natural height (no ScrollArea)');
          return (
          <Table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'fixed'
            }}
          >
            <Table.Tbody>
              {isLoading ? (
                skeletonRows
              ) : filteredData.length === 0 ? (
                <Table.Tr>
                  <Table.Td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    style={{
                      padding: '48px 24px',
                      textAlign: 'center',
                      color: theme.colors.customGray[8],
                      fontSize: '16px',
                      fontWeight: 400,
                      background: theme.colors.customGray[9]
                    }}
                  >
                    {emptyStateMessage}
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredData.map((item, rowIndex) => (
                  <Table.Tr
                    key={rowIndex}
                    onMouseEnter={() => setHoveredRow(rowIndex)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onRowClick?.(item)}
                    style={{
                      borderBottom: rowIndex < filteredData.length - 1 ? `1px solid ${theme.colors.customGray[1]}` : 'none',
                      transition: 'background-color 0.15s ease',
                      backgroundColor: hoveredRow === rowIndex ? theme.colors.customGray[0] : 'transparent',
                      cursor: cursor
                    }}
                  >
                    {columns.map((column) => {
                      const value = item[column.key as keyof T];
                      const displayValue = column.render ? column.render(value, item) : String(value || '');
                      
                      return (
                        <Table.Td
                          key={String(column.key)}
                          style={{
                            padding: '16px 24px',
                            // textAlign: column.align || 'left',
                            textAlign: 'center',
                            whiteSpace: column.align === 'center' ? 'nowrap' : 'normal',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            wordWrap: column.align !== 'center' ? 'break-word' : 'normal',
                            fontSize: '16px',
                            fontWeight: 400,
                            color: theme.colors.customGray[8],
                            width: column.width
                          }}
                        >
                          {displayValue}
                        </Table.Td>
                      );
                    })}
                    {actions && (
                      <Table.Td
                        style={{
                          padding: '16px 24px',
                          textAlign: 'center',
                          width: '100px'
                        }}
                      >
                        <Box
                          style={{
                            display: 'flex',
                            gap: '4px',
                            justifyContent: 'center'
                          }}
                        >
                          {actions.buttons.map((action, actionIndex) => (
                            <Tooltip
                              key={actionIndex}
                              label={action.tooltip}
                              withArrow
                              position="top"
                            >
                              <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(item);
                                }}
                                style={{
                                  color: theme.colors.customGray[5],
                                  transition: 'all 0.15s ease',
                                  minWidth: '28px',
                                  minHeight: '28px'
                                }}
                                styles={{
                                  root: {
                                    '&:hover': {
                                      backgroundColor: theme.colors.customGray[1],
                                      color: theme.colors.customGray[8]
                                    }
                                  }
                                }}
                              >
                                <i className={action.icon} style={{ fontSize: '16px' }} />
                              </ActionIcon>
                            </Tooltip>
                          ))}
                        </Box>
                      </Table.Td>
                    )}
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
          );
        })()}
      </Box>
    </Box>
  );
}
