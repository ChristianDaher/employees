import { ContactCustomer } from "@/utils/interfaces/models";

class ContactCustomerService {
  API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact-customers`;

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
}

export default new ContactCustomerService();
