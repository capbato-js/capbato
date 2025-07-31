import React, { useState } from 'react';
import { Box, TextInput, Button, Table, Title } from '@mantine/core';
import { Icon } from '../common';
import { Patient } from './types';

interface PatientsTableProps {
  patients: Patient[];
  onAddPatient?: () => void;
}

export const PatientsTable: React.FC<PatientsTableProps> = ({
  patients,
  onAddPatient
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patientNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phoneNumber.includes(searchQuery)
  );

  return (
    <Box>
      {/* Header */}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '25px',
          position: 'relative'
        }}
      >
        <Title
          order={1}
          style={{
            color: '#0b4f6c',
            fontSize: '28px',
            fontWeight: 'bold',
            margin: 0,
            flexGrow: 1,
            textAlign: 'center'
          }}
        >
          Patient Records
        </Title>
        <Button
          onClick={onAddPatient}
          leftSection={<Icon icon="fas fa-user-plus" />}
          style={{
            position: 'absolute',
            right: 0,
          }}
        >
          Add New Patient
        </Button>
      </Box>

      {/* Search Bar */}
      <TextInput
        placeholder="Search patients..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        style={{
          marginBottom: '15px'
        }}
        styles={{
          input: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#4db6ac';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#ddd';
        }}
      />

      {/* Table */}
      <Box
        style={{
          borderRadius: '10px',
          overflow: 'hidden',
          marginTop: '10px'
        }}
      >
        <Table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed'
          }}
        >
          <Table.Thead>
            <Table.Tr
              style={{
                background: '#dbeeff',
                color: '#0047ab'
              }}
            >
              <Table.Th
                style={{
                  padding: '14px',
                  textAlign: 'center',
                  borderBottom: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  fontWeight: 600,
                  width: '40%'
                }}
              >
                Patient #
              </Table.Th>
              <Table.Th
                style={{
                  padding: '14px',
                  textAlign: 'left',
                  paddingLeft: '20px',
                  borderBottom: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  fontWeight: 600,
                  width: '60%'
                }}
              >
                Patient's Name
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredPatients.map((patient) => (
              <Table.Tr
                key={patient.id}
                style={{
                  borderBottom: '1px solid #ddd',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <Table.Td
                  style={{
                    padding: '14px',
                    textAlign: 'center',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {patient.patientNumber}
                </Table.Td>
                <Table.Td
                  style={{
                    padding: '14px',
                    paddingLeft: '20px',
                    textAlign: 'left',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word'
                  }}
                >
                  <Box
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'black',
                      textDecoration: 'none',
                      fontSize: 'inherit',
                      padding: 0,
                      textAlign: 'left'
                    }}
                  >
                    {patient.fullName}
                  </Box>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
};
