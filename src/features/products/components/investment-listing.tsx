import { Investment } from '@/constants/data';
import { fakeInvestments } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { ProductTable } from './product-tables';
import { investmentColumns } from './product-tables/investment-columns';

export default async function InvestmentListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const types = searchParamsCache.get('category');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(types && { types: types })
  };

  const data = await fakeInvestments.getInvestments(filters);
  const totalInvestments = data.total_investments;
  const investments: Investment[] = data.investments;

  return (
    <ProductTable
      data={investments}
      totalItems={totalInvestments}
      columns={investmentColumns}
    />
  );
}
