import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from './entities/lost-pet.entity';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private lostPetRepository: Repository<LostPet>,
  ) {}

  async create(data: any) {
    const newPet = this.lostPetRepository.create({
      ...data,
      location: {
        type: 'Point',
        coordinates: [data.lng, data.lat], // Guardamos como GeoJSON
      },
    });
    return await this.lostPetRepository.save(newPet);
  }
}