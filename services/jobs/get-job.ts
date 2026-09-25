import {getJobs} from './get-jobs';
export async function getJob(id:string){const jobs=await getJobs(); return jobs.find(j=>j.id===id)??jobs[0];}