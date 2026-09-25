import JobCard from '@/components/jobs/JobCard';
import { getJobs } from '@/services/jobs/get-jobs';
export default async function JobsPage(){
 const jobs=await getJobs();
 return (<main className='p-8'><h1 className='text-3xl font-bold mb-6'>Jobs & Internships</h1>
 <div className='space-y-4'>{jobs.map(j=><JobCard key={j.id} job={j}/>)}</div></main>);
}