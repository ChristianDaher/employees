export interface Department {
    id: bigint;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: bigint;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    department: Department;
}