import CompanyCard from '@/components/company/CompanyCard';
import { getCompanies } from '@/services/company/get-companies';

export default async function CompaniesPage(){
 const companies = await getCompanies();
 return (<main className='p-8'><h1 className='text-3xl font-bold mb-6'>Companies</h1>
 <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
 {companies.map((c)=> <CompanyCard key={c.slug} company={c}/>)}
 </div></main>);
}
