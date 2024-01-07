import { Optional } from "sequelize";
import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import Contact from "./Contact.model";
import Customer from "./Customer.model";

interface ContactCustomerAttributes {
  id: bigint;
  contactId: bigint;
  customerId: bigint;
}

interface ContactCustomerCreationAttributes
  extends Optional<ContactCustomerAttributes, "id"> {}

@Table({
  tableName: "contact_customers",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class ContactCustomer extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  id!: bigint;

  @ForeignKey(() => Contact)
  @Column({ field: "contact_id", type: DataType.BIGINT.UNSIGNED })
  contactId!: bigint;

  @ForeignKey(() => Customer)
  @Column({ field: "customer_id", type: DataType.BIGINT.UNSIGNED })
  customerId!: bigint;
}
