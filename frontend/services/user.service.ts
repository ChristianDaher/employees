import { Service, User } from "@/utils/interfaces/models";

class UserService implements Service<User> {
  API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`;

  async getAll() {
    const result = await fetch(this.API_URL);
    return await result.json();
  }

  async get(id: bigint) {
    const result = await fetch(`${this.API_URL}/${id}`);
    return await result.json();
  }

  async create(user: User) {
    const result = await fetch(this.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.error);
    }

    return await result.json();
  }

  async update(user: User) {
    const result = await fetch(`${this.API_URL}/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
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

export default new UserService();
