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
  phoneNumber: string;
  email: string;
  department: Department;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Customer {
  id?: bigint;
  name: string;
  phoneNumber: string;
  note?: string;
  customerCode: string;
  accountNumber: string;
  region: Region;
  contacts: Contact[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Contact {
  id?: bigint;
  firstName: string;
  lastName: string;
  KOL: boolean;
  phoneNumber: string;
  email: string;
  title?: string;
  note?: string;
  department: Department;
  customers: Customer[];
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
