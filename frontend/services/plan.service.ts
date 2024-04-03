import { Service, Plan } from "@/utils/interfaces/models";

class PlanService implements Service<Plan> {
  API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/plans`;

  async getAll() {
    const token = localStorage.getItem('token');
    const result = await fetch(this.API_URL,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if(result.status == 401) window.location.href = '/login'
    return await result.json();
  }

  async get(id: bigint) {
    const token = localStorage.getItem('token');

    const result = await fetch(`${this.API_URL}/${id}`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if(result.status == 401) window.location.href = '/login'
    return await result.json();
  }

  async create(plan: Plan) {
    
    const token = localStorage.getItem('token');
    const result = await fetch(this.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json",'Authorization': `Bearer ${token}` },
      body: JSON.stringify(plan),
    });

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.error);
    }

    if(result.status == 401) window.location.href = '/login'
    return await result.json();
  }

  async update(plan: Plan) {
    const token = localStorage.getItem('token');
    const result = await fetch(`${this.API_URL}/${plan.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json",'Authorization': `Bearer ${token}` },

      body: JSON.stringify(plan),
    });

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.error);
    }

    if(result.status == 401) window.location.href = '/login'
    return await result.json();
  }

  async delete(id: bigint) {
    const token = localStorage.getItem('token');
    const result = await fetch(`${this.API_URL}/${id}`, {
      headers: { "Content-Type": "application/json",'Authorization': `Bearer ${token}` },
      method: "DELETE",
    });

    if(result.status == 401) window.location.href = '/login'
    return result.ok;
  }

  async search(query: string, page:string, fromDate?: string|null, toDate?: string|null) {
    let ourQuery = new URLSearchParams({q:query, fromDate: fromDate||"", toDate: toDate||"", page:page }).toString()
    const token = localStorage.getItem('token');
    const result = await fetch(`${this.API_URL}/search?${ourQuery}`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if(result.status == 401) window.location.href = '/login'
    return await result.json();
    
  }
}

export default new PlanService();
