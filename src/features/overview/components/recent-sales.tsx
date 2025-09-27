import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

const transactionData = [
  {
    description: 'Dividend Payment',
    category: 'AAPL Stock',
    icon: '📈',
    fallback: 'DV',
    amount: '+$245.50',
    type: 'income'
  },
  {
    description: 'Mortgage Payment',
    category: 'Real Estate',
    icon: '🏠',
    fallback: 'MG',
    amount: '-$2,850.00',
    type: 'expense'
  },
  {
    description: 'Investment Purchase',
    category: 'S&P 500 ETF',
    icon: '💰',
    fallback: 'IN',
    amount: '-$1,500.00',
    type: 'investment'
  },
  {
    description: 'Salary Deposit',
    category: 'Employment',
    icon: '💼',
    fallback: 'SA',
    amount: '+$4,750.00',
    type: 'income'
  },
  {
    description: 'Bond Interest',
    category: 'Treasury Bonds',
    icon: '📊',
    fallback: 'BO',
    amount: '+$125.75',
    type: 'income'
  }
];

export function RecentSales() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest financial activity this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {transactionData.map((transaction, index) => (
            <div key={index} className='flex items-center'>
              <Avatar className='h-9 w-9'>
                <AvatarFallback className='text-lg'>
                  {transaction.icon}
                </AvatarFallback>
              </Avatar>
              <div className='ml-4 space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {transaction.description}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {transaction.category}
                </p>
              </div>
              <div
                className={`ml-auto font-medium ${
                  transaction.type === 'income'
                    ? 'text-green-600'
                    : transaction.type === 'expense'
                      ? 'text-red-600'
                      : 'text-blue-600'
                }`}
              >
                {transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
