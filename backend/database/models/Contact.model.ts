import { Optional } from "sequelize";
import {
  Table,
  Model,
  PrimaryKey,
  Unique,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import Department from "./Department.model";
import Customer from "./Customer.model";
import ContactCustomer from "./ContactCustomer.model";

interface ContactAttributes {
  id: bigint;
  firstName?: string;
  lastName?: string;
  KOL?: boolean;
  phoneNumber?: string;
  email?: string;
  title?: string;
  note?: string;
  departmentId?: bigint;
}

interface ContactCreationAttributes extends Optional<ContactAttributes, "id"> {}

@Table({
  tableName: "contacts",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Contact extends Model<
  ContactAttributes,
  ContactCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  id!: bigint;

  @Column({ field: "first_name", type: DataType.STRING })
  firstName!: string;

  @Column({ field: "last_name", type: DataType.STRING })
  lastName!: string;

  @Column(DataType.BOOLEAN)
  KOL!: boolean;

  @Column({ field: "phone_number", type: DataType.STRING })
  phoneNumber!: string;

  @Unique
  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  note!: string;

  @ForeignKey(() => Department)
  @Column({ field: "department_id", type: DataType.BIGINT.UNSIGNED })
  departmentId!: bigint;

  @BelongsTo(() => Department)
  department!: Department;

  @BelongsToMany(() => Customer, () => ContactCustomer)
  customers!: Customer[];
}
