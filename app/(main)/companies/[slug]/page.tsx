import { getCompany } from '@/services/company/get-company';
import CompanyHeader from '@/components/company/CompanyHeader';

export default async function CompanyPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const company=await getCompany(slug);
 return (<main className='p-8'><CompanyHeader company={company}/>
 <section className='mt-8'><h2 className='text-xl font-semibold'>About</h2>
 <p className='mt-2 text-zinc-300'>{company.about}</p></section></main>);
}
