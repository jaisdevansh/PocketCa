import { Bill } from './schemas';

// Generate some future dates for mock
const getFutureDate = (daysAhead: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString();
};

const MOCK_BILLS: Bill[] = [
  { id: 'b1', title: 'Internet', amount: 89.99, dueDate: getFutureDate(3), isPaid: false, iconName: 'Wifi' },
  { id: 'b2', title: 'Electricity', amount: 145.50, dueDate: getFutureDate(12), isPaid: false, iconName: 'Zap' },
  { id: 'b3', title: 'Car Insurance', amount: 110.00, dueDate: getFutureDate(20), isPaid: false, iconName: 'Car' },
];

export const billsApi = {
  getUpcomingBills: async (): Promise<Bill[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_BILLS]);
      }, 700);
    });
  },
};
