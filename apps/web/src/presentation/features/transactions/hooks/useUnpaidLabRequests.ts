import { useState, useEffect } from 'react';
import { container } from 'tsyringe';
import { TOKENS } from '@nx-starter/application-shared';
import type { ILaboratoryApiService } from '../../../../infrastructure/api/ILaboratoryApiService';

interface LabRequestOption {
  value: string;
  label: string;
  testCount: number;
  requestDate: string;
}

export const useUnpaidLabRequests = (patientId: string | null) => {
  const [labRequests, setLabRequests] = useState<LabRequestOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnpaidLabRequests = async () => {
      if (!patientId) {
        setLabRequests([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const laboratoryApiService = container.resolve<ILaboratoryApiService>(
          TOKENS.LaboratoryApiService
        );

        const response = await laboratoryApiService.getUnpaidLabRequestsByPatientId(patientId);

        if (response.success && response.data) {
          // Transform lab requests into select options
          const options = Array.isArray(response.data)
            ? response.data.map((labRequest: any) => {
                // Count how many tests are selected (from selectedTests array)
                const testCount = Array.isArray(labRequest.selectedTests)
                  ? labRequest.selectedTests.length
                  : 0;

                // Build test category and names label
                let testLabel = 'Lab Request';
                if (Array.isArray(labRequest.selectedTests) && labRequest.selectedTests.length > 0) {
                  // Get unique categories from the tests
                  const categories = new Set<string>();
                  labRequest.selectedTests.forEach((test: string) => {
                    // Extract category from test name (e.g., "CBC with Platelet" -> "HEMATOLOGY")
                    if (test.toLowerCase().includes('cbc') || test.toLowerCase().includes('platelet')) {
                      categories.add('HEMATOLOGY');
                    } else if (test.toLowerCase().includes('fbs') || test.toLowerCase().includes('bun') ||
                               test.toLowerCase().includes('creatinine') || test.toLowerCase().includes('uric acid') ||
                               test.toLowerCase().includes('lipid') || test.toLowerCase().includes('sgot') ||
                               test.toLowerCase().includes('sgpt') || test.toLowerCase().includes('hba1c')) {
                      categories.add('BLOOD CHEMISTRY');
                    } else if (test.toLowerCase().includes('urinalysis')) {
                      categories.add('ROUTINE');
                    } else if (test.toLowerCase().includes('fecalysis') || test.toLowerCase().includes('occult')) {
                      categories.add('FECALYSIS');
                    } else if (test.toLowerCase().includes('hepatitis') || test.toLowerCase().includes('dengue') ||
                               test.toLowerCase().includes('vdrl') || test.toLowerCase().includes('psa')) {
                      categories.add('SEROLOGY');
                    } else if (test.toLowerCase().includes('t3') || test.toLowerCase().includes('t4') ||
                               test.toLowerCase().includes('tsh')) {
                      categories.add('THYROID');
                    }
                  });

                  const categoryLabel = Array.from(categories).join(', ');
                  const testsLabel = labRequest.selectedTests.join(', ');
                  testLabel = categoryLabel ? `${categoryLabel}: ${testsLabel}` : testsLabel;
                }

                // Format date
                const dateStr = new Date(labRequest.requestDate).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric'
                });

                // Only show count for multiple tests (2+)
                const countLabel = testCount > 1 ? ` (${testCount} tests)` : '';

                return {
                  value: labRequest.id,
                  label: `${testLabel} - ${dateStr}${countLabel}`,
                  testCount,
                  requestDate: labRequest.requestDate,
                };
              })
            : [];

          setLabRequests(options);
        } else {
          setLabRequests([]);
        }
      } catch (err) {
        console.error('Error fetching unpaid lab requests:', err);
        setError('Failed to fetch unpaid lab requests');
        setLabRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnpaidLabRequests();
  }, [patientId]);

  return { labRequests, isLoading, error };
};
