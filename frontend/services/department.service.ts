import { Service, Department } from "@/utils/interfaces/models";

class DepartmentService implements Service<Department> {
  API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/departments`;

  async getAll() {
    const result = await fetch(this.API_URL);
    return await result.json();
  }

  async get(id: bigint) {
    const result = await fetch(`${this.API_URL}/${id}`);
    return await result.json();
  }

  async create(department: Department) {
    const result = await fetch(this.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(department),
    });
    return await result.json();
  }

  async update(department: Department) {
    const result = await fetch(`${this.API_URL}/${department.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(department),
    });
    return await result.json();
  }

  async delete(id: bigint) {
    const result = await fetch(`${this.API_URL}/${id}`, {
      method: "DELETE",
    });

    return result.ok;
  }
}

export default new DepartmentService();
