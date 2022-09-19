import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';
import { Validators } from '../shared/utils/validators';

@Injectable()
export class ClubService {

    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ) { }

    async findAll(): Promise<ClubEntity[]> {
        return await this.clubRepository.find({});
    }

    async findOne(id: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({ where: { id } });
        if (!club)
            throw new BusinessLogicException("No se encontró el club con el id indicado", BusinessError.NOT_FOUND);
        return club;
    }

    async create(club: ClubEntity): Promise<ClubEntity> {
        if (!Validators.isValidDescription(club.description))
            throw new BusinessLogicException("El campo description no es válido, debe contener entre 1 y 100 caracteres", BusinessError.BAD_REQUEST);
        return await this.clubRepository.save(club);
    }

    async update(id: string, club: ClubEntity): Promise<ClubEntity> {
        const clubToUpdate: ClubEntity = await this.clubRepository.findOne({ where: { id } });
        if (!clubToUpdate)
            throw new BusinessLogicException("No se encontró el club con el id indicado", BusinessError.NOT_FOUND);

        if (!Validators.isValidDescription(club.description))
            throw new BusinessLogicException("El campo description no es válido, debe contener entre 1 y 100 caracteres", BusinessError.BAD_REQUEST);
        club.id = id;

        return await this.clubRepository.save(club);
    }

    async delete(id: string) {
        const club: ClubEntity = await this.clubRepository.findOne({ where: { id } });
        if (!club)
            throw new BusinessLogicException("No se encontró el club con el id indicado", BusinessError.NOT_FOUND);

        await this.clubRepository.remove(club);
    }

}
