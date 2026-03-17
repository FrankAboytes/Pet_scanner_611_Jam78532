import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { MailService } from '../mail.service';

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private foundPetRepository: Repository<FoundPet>,
    private mailService: MailService,
  ) {}

  async create(data: any) {
    // 1. Guardar la mascota encontrada
    const newFoundPet = this.foundPetRepository.create({
      ...data,
      location: {
        type: 'Point',
        coordinates: [data.lng, data.lat],
      },
    });
    await this.foundPetRepository.save(newFoundPet);

    // 2. LA BÚSQUEDA POR RADIO (500 metros)
    const lostPetsInRange = await this.foundPetRepository.query(`
      SELECT *,
        ST_X(location::geometry) AS lost_lng,
        ST_Y(location::geometry) AS lost_lat,
        ST_Distance(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance
      FROM lost_pets
      WHERE is_active = true
        AND ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          500
        )
      ORDER BY distance ASC;
    `, [data.lng, data.lat]);

    // 3. Notificación por Correo
    for (const lostPet of lostPetsInRange) {
      if (lostPet.species.toLowerCase() === data.species.toLowerCase()) {
         // AQUÍ LE PASAMOS LAS COORDENADAS DIRECTAMENTE DESDE EL 'data'
         await this.mailService.sendMatchNotification(lostPet, newFoundPet, data.lng, data.lat);
      }
    }

    return {
      message: 'Mascota registrada con éxito',
      foundPet: newFoundPet,
      matchesEncontrados: lostPetsInRange.length,
      matches: lostPetsInRange
    };
  }
}