import axios from 'axios';
import type { CompanyData, ProcessedShareholderData } from '../types';

export const fetchShareholderData = async (): Promise<
  ProcessedShareholderData[]
> => {
  try {
    await axios.get('https://jsonplaceholder.typicode.com/posts/1');

    const response = await axios.get<CompanyData>('/data.json');
    const data = response.data;

    const holderMap = new Map<string, number>();

    Object.entries(data).forEach(([, shareholders]) => {
      shareholders.forEach((shareholder) => {
        const currentValue = holderMap.get(shareholder.holder) || 0;
        holderMap.set(
          shareholder.holder,
          currentValue + parseFloat(shareholder.share_percent)
        );
      });
    });

    const totalPercentage = Array.from(holderMap.values()).reduce(
      (sum, value) => sum + value,
      0
    );

    const processedData: ProcessedShareholderData[] = Array.from(
      holderMap.entries()
    ).map(([holder, share], index) => ({
      holder,
      share_percent: ((share / totalPercentage) * 100).toFixed(2),
      share_percent_number: (share / totalPercentage) * 100,
      id: `shareholder-${index}`,
    }));

    return processedData;
  } catch (error) {
    console.error('Error fetching shareholder data:', error);
    throw error;
  }
};
