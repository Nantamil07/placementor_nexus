import type { Company } from '@/types/company';
export default function CompanyHeader({company}:{company:Company}){
 return (<header className='rounded-2xl bg-zinc-900 p-6 border border-zinc-800'>
 <h1 className='text-4xl font-bold'>{company.name}</h1>
 <p className='mt-2 text-zinc-400'>{company.location}</p></header>);
}
