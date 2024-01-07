import { Optional } from "sequelize";
import {
  Table,
  Model,
  PrimaryKey,
  Unique,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
} from "sequelize-typescript";
import User from "./User.model";
import Contact from "./Contact.model";

interface DepartmentAttributes {
  id: bigint;
  name: string;
}

interface DepartmentCreationAttributes
  extends Optional<DepartmentAttributes, "id"> {}

@Table({
  tableName: "departments",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Department extends Model<
  DepartmentAttributes,
  DepartmentCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  id!: bigint;

  @Unique
  @Column(DataType.STRING)
  name!: string;

  @HasMany(() => User)
  users!: User[];

  @HasMany(() => Contact)
  contacts!: Contact[];
}
