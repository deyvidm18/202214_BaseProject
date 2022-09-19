import { Module } from '@nestjs/common';
import { ClubSocioService } from './club-socio.service';
import { ClubSocioController } from './club-socio.controller';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity, SocioEntity])],
  providers: [ClubSocioService],
  controllers: [ClubSocioController]
})
export class ClubSocioModule { }
