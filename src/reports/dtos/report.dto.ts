import { ModuleMetadata } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;

  // what we are doing is we are not adding the user and instead of user :{id:'', email:'', password:''}
  // we include userId where where we use user id only instead of whole object
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
