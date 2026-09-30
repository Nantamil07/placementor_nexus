import { getJob } from '@/services/jobs/get-job';
import ApplyButton from '@/components/jobs/ApplyButton';
export default async function JobPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params; const job=await getJob(id);
 return (<main className='p-8 max-w-3xl mx-auto'><h1 className='text-4xl font-bold'>{job.title}</h1>
 <p className='text-zinc-400 mt-2'>{job.company}</p>
 <p className='mt-6'>{job.description}</p>
 <ApplyButton jobId={job.id}/></main>);
}