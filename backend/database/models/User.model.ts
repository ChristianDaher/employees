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
} from "sequelize-typescript";
import Department from "./Department.model";

interface UserAttributes {
  id: bigint;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  departmentId?: bigint;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  id!: bigint;

  @Column({ field: "first_name", type: DataType.STRING })
  firstName!: string;

  @Column({ field: "last_name", type: DataType.STRING })
  lastName!: string;

  @Column({ field: "phone_number", type: DataType.STRING })
  phoneNumber!: string;

  @Unique
  @Column(DataType.STRING)
  email!: string;

  @ForeignKey(() => Department)
  @Column({ field: "department_id", type: DataType.BIGINT.UNSIGNED })
  departmentId!: bigint;

  @BelongsTo(() => Department)
  department!: Department;
}
