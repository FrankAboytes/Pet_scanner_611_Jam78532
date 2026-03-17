import { Controller, Post, Body } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Post()
  create(@Body() body: any) {
    return this.lostPetsService.create(body);
  }
}