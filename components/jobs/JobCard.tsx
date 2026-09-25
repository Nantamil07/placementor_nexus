import Link from 'next/link'; import type {Job} from '@/types/job';
export default function JobCard({job}:{job:Job}){return(<Link href={`/jobs/${job.id}`} className='block rounded-xl border p-5 hover:border-blue-500'>
<h3 className='font-semibold text-xl'>{job.title}</h3><p className='text-zinc-400'>{job.company}</p>
<p className='mt-2 text-sm'>{job.location} • {job.type}</p></Link>);}