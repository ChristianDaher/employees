import { Service,User } from "@/utils/interfaces/models";


class LoginService {
    API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`;

  async login(email:string, password:string) {
    console.log(email, password)
    let credentials = {email:email, password:password}
    const result = await fetch(this.API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
    return await result.json();
    }

}

export default new LoginService();