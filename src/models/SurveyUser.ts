import { Column, CreateDateColumn, Entity, JoinColumn, PrimaryColumn, ManyToOne } from "typeorm";
import { v4 as uuid } from 'uuid';
import { User } from "./User";
import { Surveys } from "./Surveys";

@Entity("surveys_users")
class SurveyUser {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  survey_id: string;

  @ManyToOne(() => Surveys)
  @JoinColumn({ name: "survey_id" })
  survey: Surveys;

  @Column()
  value: number;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { SurveyUser }