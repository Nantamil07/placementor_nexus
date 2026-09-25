import type {Job} from '@/types/job';
export async function getJobs():Promise<Job[]>{return[
{id:'1',title:'SDE Intern',company:'Google',location:'Bengaluru',type:'Internship',description:'Backend internship'},
{id:'2',title:'Member Technical',company:'DE Shaw',location:'Hyderabad',type:'Full Time',description:'Systems engineering role'}]}