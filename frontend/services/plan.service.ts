import { Service, Plan } from "@/utils/interfaces/models";

class PlanService implements Service<Plan> {
  API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/plans`;

  async getAll() {
    const result = await fetch(this.API_URL);
    return await result.json();
  }

  async get(id: bigint) {
    const result = await fetch(`${this.API_URL}/${id}`);
    return await result.json();
  }

  async create(plan: Plan) {
    const result = await fetch(this.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plan),
    });

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.error);
    }

    return await result.json();
  }

  async update(plan: Plan) {
    const result = await fetch(`${this.API_URL}/${plan.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plan),
    });

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.error);
    }

    return await result.json();
  }

  async delete(id: bigint) {
    const result = await fetch(`${this.API_URL}/${id}`, {
      method: "DELETE",
    });

    return result.ok;
  }

  async search(query: string, fromDate?: string|null, toDate?: string|null) {
    let ourQuery = new URLSearchParams({q:query, fromDate: fromDate||"", toDate: toDate||"" }).toString()
    const result = await fetch(`${this.API_URL}/search?${ourQuery}`);
    return await result.json();
  }
}

export default new PlanService();
