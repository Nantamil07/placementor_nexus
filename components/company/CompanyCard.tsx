import Link from 'next/link';
import type { Company } from '@/types/company';

export default function CompanyCard({company}:{company:Company}){
 return (<Link href={`/companies/${company.slug}`} className='rounded-xl border p-5 hover:border-blue-500 block'>
 <h3 className='font-semibold text-lg'>{company.name}</h3>
 <p className='text-sm text-zinc-400 mt-2'>{company.location}</p>
 <p className='mt-3 text-zinc-300 line-clamp-3'>{company.about}</p></Link>);
}
