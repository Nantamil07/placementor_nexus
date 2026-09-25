import type { Company } from '@/types/company';
export async function getCompanies():Promise<Company[]>{
 return [{id:'1',slug:'google',name:'Google',location:'Bengaluru, India',about:'Build products for billions.'},
 {id:'2',slug:'de-shaw',name:'DE Shaw',location:'Hyderabad, India',about:'Quantitative research and engineering.'}];
}
