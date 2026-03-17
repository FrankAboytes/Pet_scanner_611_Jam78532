import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPetsService } from './found-pets.service';
import { FoundPetsController } from './found-pets.controller';
import { FoundPet } from './entities/found-pet.entity';
import { MailService } from '../mail.service'; // Inyectamos el servicio de correos aquí

@Module({
  imports: [TypeOrmModule.forFeature([FoundPet])],
  controllers: [FoundPetsController],
  providers: [FoundPetsService, MailService], // Agregamos MailService
})
export class FoundPetsModule {}