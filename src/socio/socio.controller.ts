import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-error.interceptor';
import { SocioDto } from './socio.dto';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
    constructor(private readonly socioService: SocioService) { }

    @Get()
    async findAll() {
        return await this.socioService.findAll();
    }

    @Get(':socioId')
    async findOne(@Param('socioId') socioId: string) {
        return await this.socioService.findOne(socioId);
    }

    @Post()
    async create(@Body() socioDto: SocioDto) {
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.create(socio);
    }

    @Put(':socioId')
    async update(
        @Param('socioId') socioId: string,
        @Body() socioDto: SocioDto,
    ) {
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.update(socioId, socio);
    }

    @Delete(':paisId')
    @HttpCode(204)
    async delete(@Param('socioId') socioId: string) {
        return await this.socioService.delete(socioId);
    }
}
