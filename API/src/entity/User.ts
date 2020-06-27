import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsOptional, Length } from "class-validator";

@Entity("users")
export class User {
  @PrimaryColumn({ type: "varchar", unique: true })
  mixerId: string;

  @Column({ type: "varchar", unique: true, nullable: true })
  @IsOptional()
  twitchId: string;

  @Column({ type: "varchar", unique: true, nullable: true })
  @IsOptional()
  twitchAccessToken: string;

  @Column({ type: "varchar", unique: true, nullable: true })
  @IsOptional()
  twitchRefreshToken: string;

  @Column({ type: "varchar", unique: true, nullable: true })
  @IsOptional()
  mixerAccessToken: string;

  @Column({ type: "varchar", unique: true, nullable: true })
  @IsOptional()
  mixerRefreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
