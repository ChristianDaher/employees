import { ContactCustomer } from "@/utils/interfaces/models";

class ContactCustomerService {
  API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact-customers`;

  async getAll() {
    const result = await fetch(this.API_URL);
    return await result.json();
  }

  async get(id: bigint) {
    const result = await fetch(`${this.API_URL}/${id}`);
    return await result.json();
  }
}

export default new ContactCustomerService();
