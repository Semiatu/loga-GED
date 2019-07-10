import {Deserializable} from 'src/@externals/loga/_utility';


export abstract class Entity<T> implements Deserializable<T> {
  id: number;
  createdBy: string;
  lastModifiedBy: string;
  createdDate: Date;
  lastModifiedDate: Date;

  deserialize(input: any): T {
    return Object.assign(this, input);
  }
}
