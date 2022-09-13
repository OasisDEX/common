import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'dynamic_config' })
export class DynamicConfigEntry {
  @PrimaryColumn('varchar')
  key!: string;

  @Column('varchar', { nullable: true })
  value!: string | null;

  constructor(opts?: DynamicConfigEntry) {
    if (opts) {
      this.key = opts.key;
      this.value = opts.value;
    }
  }
}
