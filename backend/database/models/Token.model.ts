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
import User from "./User.model";

interface TokenAttributes {
  id: bigint;
  token?:string;
  expiry_date?:Date;
  user_id?:bigint;
}

interface TokenCreationAttributes extends Optional<TokenAttributes, "id"> {}

@Table({
  tableName: "tokens",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Token extends Model<
  TokenAttributes,
  TokenCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  id!: bigint;

  @Column({ field: "token", type: DataType.STRING })
  token!: string;

  @Column({ field: "expiry_date", type: DataType.DATE })
  expiry_date!: Date;

  @ForeignKey(() => User)
  @Column({ field: "user_id", type: DataType.BIGINT.UNSIGNED })
  user_id!: bigint;
}
