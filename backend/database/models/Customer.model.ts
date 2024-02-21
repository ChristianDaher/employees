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
import Region from "./Region.model";
import Contact from "./Contact.model";
import ContactCustomer from "./ContactCustomer.model";

interface CustomerAttributes {
  id: bigint;
  name?: string;
  phoneNumber?: string;
  note?: string;
  customerCode?: string;
  accountNumber?: string;
  regionId?: bigint;
}

interface CustomerCreationAttributes
  extends Optional<CustomerAttributes, "id"> {}

@Table({
  tableName: "customers",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Customer extends Model<
  CustomerAttributes,
  CustomerCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  id!: bigint;

  @Column(DataType.STRING)
  name!: string;

  @Unique
  @Column({ field: "phone_number", type: DataType.STRING })
  phoneNumber!: string;

  @Column(DataType.STRING)
  note!: string;

  @Unique
  @Column({ field: "customer_code", type: DataType.STRING })
  customerCode!: string;

  @Unique
  @Column({ field: "account_number", type: DataType.STRING })
  accountNumber!: string;

  @ForeignKey(() => Region)
  @Column({ field: "region_id", type: DataType.BIGINT.UNSIGNED })
  regionId!: bigint;

  @BelongsTo(() => Region)
  region!: Region;

  @BelongsToMany(() => Contact, () => ContactCustomer)
  contacts!: Contact[];

  async addContact(contact: Contact) {
    await ContactCustomer.create({
      customerId: this.id,
      contactId: contact.id,
    });
  }
}
