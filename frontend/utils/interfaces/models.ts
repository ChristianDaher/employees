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
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    department: Department;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Customer {
    id?: bigint;
    name?: string;
    phoneNumber?: string;
    note?: string;
    customerCode?: string;
    accountNumber?: number;
    region: Region;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Contact {
    id?: bigint;
    firstName?: string;
    lastName?: string;
    KOL?: boolean;
    phoneNumber?: string;
    email?: string;
    title?: string;
    note?: string;
    department: Department;
    customers: Customer[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  