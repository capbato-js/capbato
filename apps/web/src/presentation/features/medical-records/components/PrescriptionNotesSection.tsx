import React from 'react';
import { Group, Box, Text, Paper, Divider } from '@mantine/core';
import { Icon } from '../../../components/common';

interface PrescriptionNotesSectionProps {
  notes?: string;
}

export const PrescriptionNotesSection: React.FC<PrescriptionNotesSectionProps> = ({
  notes,
}) => {
  if (!notes) {
    return null;
  }

  return (
    <>
      <Divider />
      <Box>
        <Group gap="xs" align="center" mb="sm">
          <Icon icon="fas fa-sticky-note" />
          <Text fw={600}>Additional Notes</Text>
        </Group>
        <Paper p="md" withBorder>
          <Text style={{ whiteSpace: 'pre-wrap' }}>
            {notes}
          </Text>
        </Paper>
      </Box>
    </>
  );
};