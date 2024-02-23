import { Optional } from "sequelize";
import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import User from "./User.model";
import ContactCustomer from "./ContactCustomer.model";

interface PlanAttributes {
  id: bigint;
  date?: Date;
  userId?: bigint;
  contactCustomerId?: bigint;
  how?: string;
  objective?: string;
  output?: string;
  offer?: string;
  meeting?: string;
  status?: string;
  note?: string;
  completedAt?: Date;
}

interface PlanCreationAttributes extends Optional<PlanAttributes, "id"> {}

@Table({
  tableName: "plans",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Plan extends Model<
  PlanAttributes,
  PlanCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  id!: bigint;

  @Column(DataType.DATE)
  date!: Date;

  @ForeignKey(() => User)
  @Column({ field: "user_id", type: DataType.BIGINT.UNSIGNED })
  userId!: bigint;

  @ForeignKey(() => ContactCustomer)
  @Column({ field: "contact_customer_id", type: DataType.BIGINT.UNSIGNED })
  contactCustomerId!: bigint;

  @Column(DataType.STRING)
  how!: string;

  @Column(DataType.STRING)
  objective!: string;

  @Column(DataType.STRING)
  output!: string;

  @Column(DataType.STRING)
  offer!: string;

  @Column(DataType.STRING)
  meeting!: string;

  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  note!: string;

  @Column({ field: "completed_at", type: DataType.DATE })
  completedAt!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => ContactCustomer)
  contactCustomer!: ContactCustomer;
}
