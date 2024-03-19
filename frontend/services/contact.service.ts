import { Service, Contact } from "@/utils/interfaces/models";

class ContactService implements Service<Contact> {
  API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contacts`;

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

  async create(contact: Contact) {
    const token = localStorage.getItem('token');
    const result = await fetch(this.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json",'Authorization': `Bearer ${token}` },
      body: JSON.stringify(contact),
    });

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.error);
    }

    if(result.status == 401) window.location.href = '/login'
    return await result.json();
  }

  async update(contact: Contact) {
    const token = localStorage.getItem('token');
    const result = await fetch(`${this.API_URL}/${contact.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json",'Authorization': `Bearer ${token}` },

      body: JSON.stringify(contact),
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

  async search(query: string) {
    const token = localStorage.getItem('token');
    const result = await fetch(`${this.API_URL}/search?q=${query}`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if(result.status == 401) window.location.href = '/login'
    return await result.json();
  }
}

export default new ContactService();
