import { Service, Contact } from "@/utils/interfaces/models";

class ContactService implements Service<Contact> {
  API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contacts`;

  async getAll() {
    const result = await fetch(this.API_URL);
    return await result.json();
  }

  async get(id: bigint) {
    const result = await fetch(`${this.API_URL}/${id}`);
    return await result.json();
  }

  async create(contact: Contact) {
    const result = await fetch(this.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.error);
    }

    return await result.json();
  }

  async update(contact: Contact) {
    const result = await fetch(`${this.API_URL}/${contact.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
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

export default new ContactService();
