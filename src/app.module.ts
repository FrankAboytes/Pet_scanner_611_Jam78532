import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from './lost-pets/entities/lost-pet.entity';
import { FoundPet } from './found-pets/entities/found-pet.entity';
import { LostPetsModule } from './lost-pets/lost-pets.module';
import { FoundPetsModule } from './found-pets/found-pets.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER || 'petuser',
      password: process.env.DB_PASS || 'petpassword',
      database: process.env.DB_NAME || 'petradar_db',
      entities: [LostPet, FoundPet],
      synchronize: true, // NOTA: Útil para desarrollo, apagar en producción
    }),
    LostPetsModule,
    FoundPetsModule,
  ],
})
export class AppModule {}