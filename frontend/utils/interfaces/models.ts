export interface Department {
  id?: bigint;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Region {
  id?: bigint;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id?: bigint;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  department?: Department;
  departmentId?: bigint;
  createdAt?: Date;
  updatedAt?: Date;
  password:string;
  active:boolean;
}

export interface Customer {
  id?: bigint;
  name: string;
  phoneNumber: string;
  note?: string;
  customerCode: string;
  accountNumber: string;
  region?: Region;
  regionId?: bigint;
  contacts: Contact[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Contact {
  id?: bigint;
  firstName: string;
  lastName: string;
  fullName: string;
  KOL: boolean;
  phoneNumber: string;
  email: string;
  title?: string;
  note?: string;
  department?: Department;
  departmentId?: bigint;
  customers: Customer[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactCustomer {
  id?: bigint;
  label?: string;
  contact: Contact;
  customer: Customer;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Plan {
  id?: bigint;
  date: Date;
  user: User | null;
  contactCustomer: ContactCustomer;
  how: string;
  objective: string;
  output: string;
  offer: string;
  meeting: string;
  status: string;
  note: string;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Service<T> {
  API_URL: string;
  getAll(): Promise<T[]>;
  get(id: bigint): Promise<T>;
  create(item: T): Promise<T | Error>;
  update(item: T): Promise<T | Error>;
  delete(id: bigint): Promise<Boolean>;
}
