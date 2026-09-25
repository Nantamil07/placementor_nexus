import { getCompanies } from './get-companies';
export async function getCompany(slug:string){
 const companies=await getCompanies();
 return companies.find(c=>c.slug===slug)??companies[0];
}
