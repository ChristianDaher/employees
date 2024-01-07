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
import Customer from "./Customer.model";

interface RegionAttributes {
  id: bigint;
  name: string;
}

interface RegionCreationAttributes extends Optional<RegionAttributes, "id"> {}

@Table({
  tableName: "regions",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Region extends Model<
  RegionAttributes,
  RegionCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  id!: bigint;

  @Unique
  @Column(DataType.STRING)
  name!: string;

  @HasMany(() => Customer)
  customers!: Customer[];
}
