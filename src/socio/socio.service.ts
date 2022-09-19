import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { Validators } from '../shared/utils/validators';

@Injectable()
export class SocioService {

    constructor(
        @InjectRepository(SocioEntity)
        private readonly SocioRepository: Repository<SocioEntity>
    ) { }

    async findAll(): Promise<SocioEntity[]> {
        return await this.SocioRepository.find({});
    }

    async findOne(id: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.SocioRepository.findOne({ where: { id } });
        if (!socio)
            throw new BusinessLogicException("No se encontró el socio con el id indicado", BusinessError.NOT_FOUND);
        return socio;
    }

    async create(socio: SocioEntity): Promise<SocioEntity> {
        if (!Validators.isValidEmail(socio.email))
            throw new BusinessLogicException("El campo email no es válido", BusinessError.BAD_REQUEST);
        return await this.SocioRepository.save(socio);
    }

    async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
        const socioToUpdate: SocioEntity = await this.SocioRepository.findOne({ where: { id } });
        if (!socioToUpdate)
            throw new BusinessLogicException("No se encontró el socio con el id indicado", BusinessError.NOT_FOUND);

        if (!Validators.isValidEmail(socio.email))
            throw new BusinessLogicException("El campo email no es válido", BusinessError.BAD_REQUEST);
        socio.id = id;

        return await this.SocioRepository.save(socio);
    }

    async delete(id: string) {
        const socio: SocioEntity = await this.SocioRepository.findOne({ where: { id } });
        if (!socio)
            throw new BusinessLogicException("No se encontró el socio con el id indicado", BusinessError.NOT_FOUND);

        await this.SocioRepository.remove(socio);
    }


}
