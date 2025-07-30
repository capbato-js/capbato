import React from 'react';
import { Box, Title } from '@mantine/core';

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  contactNumber: string;
}

interface DoctorsTableProps {
  doctors: Doctor[];
}

export const DoctorsTable: React.FC<DoctorsTableProps> = ({ doctors }) => {
  return (
    <Box style={{ marginBottom: '35px' }}>
      <Box style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Title 
          order={2}
          style={{
            color: '#0b4f6c',
            fontSize: '28px',
            fontWeight: 'bold',
            margin: 0
          }}
        >
          Doctors
        </Title>
      </Box>
      
      <Box 
        style={{ 
          overflowX: 'auto',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        <table 
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <thead>
            <tr>
              <th 
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  paddingLeft: '20px',
                  width: '40%',
                  borderBottom: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  background: '#dbeeff',
                  color: '#0047ab',
                  fontWeight: 600
                }}
              >
                Doctor's Name
              </th>
              <th 
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  width: '35%',
                  borderBottom: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  background: '#dbeeff',
                  color: '#0047ab',
                  fontWeight: 600
                }}
              >
                Specialization
              </th>
              <th 
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  width: '25%',
                  borderBottom: '1px solid #ddd',
                  background: '#dbeeff',
                  color: '#0047ab',
                  fontWeight: 600
                }}
              >
                Contact Number
              </th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr 
                key={doctor.id}
                style={{
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td 
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    paddingLeft: '20px',
                    borderBottom: index === doctors.length - 1 ? 'none' : '1px solid #ddd',
                    borderRight: '1px solid #ddd'
                  }}
                >
                  {doctor.name}
                </td>
                <td 
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    borderBottom: index === doctors.length - 1 ? 'none' : '1px solid #ddd',
                    borderRight: '1px solid #ddd'
                  }}
                >
                  {doctor.specialization}
                </td>
                <td 
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    borderBottom: index === doctors.length - 1 ? 'none' : '1px solid #ddd'
                  }}
                >
                  {doctor.contactNumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};
