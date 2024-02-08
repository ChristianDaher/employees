import { Service, Customer } from "@/utils/interfaces/models";

class CustomerService implements Service<Customer> {
  API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/customers`;

  async getAll() {
    const result = await fetch(this.API_URL);
    return await result.json();
  }

  async get(id: bigint) {
    const result = await fetch(`${this.API_URL}/${id}`);
    return await result.json();
  }

  async create(customer: Customer) {
    const result = await fetch(this.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.error);
    }

    return await result.json();
  }

  async update(customer: Customer) {
    const result = await fetch(`${this.API_URL}/${customer.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
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

  async search(query: string) {
    const result = await fetch(`${this.API_URL}/search?q=${query}`);
    return await result.json();
  }
}

export default new CustomerService();
