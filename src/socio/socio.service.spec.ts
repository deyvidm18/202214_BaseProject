import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('SocioService', () => {
  let service: SocioService;
  let socioRepository: Repository<SocioEntity>;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });


  const seedDatabase = async () => {
    socioRepository.clear();
    socioList = [];
    for (let i = 0; i < 5; ++i) {
      const socio: SocioEntity = await socioRepository.save({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        birthdate: faker.date.birthdate()
      });
      socioList.push(socio);
    }
  }

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas los socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(socioList.length);
  });

  it('findOne debe retormar un socio por su id', async () => {
    const socio: SocioEntity = socioList[0];
    const socioFound: SocioEntity = await service.findOne(socio.id);
    expect(socioFound).not.toBeNull();
    expect(socioFound.name).toEqual(socio.name);
    expect(socioFound.email).toEqual(socio.email);
    expect(socioFound.birthdate).toEqual(socio.birthdate);
  });

  it('findOne debe lanzar una excepción para un socio inválido', async () => {
    await expect(() => service.findOne("0"))
      .rejects.toHaveProperty("message", "No se encontró el socio con el id indicado")
  });

  it('create debe retornar un nuevo socio', async () => {
    const socio: SocioEntity = {
      id: "",
      name: faker.name.fullName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate()
    }

    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const foundSocio: SocioEntity = await socioRepository
      .findOne({ where: { id: `${newSocio.id}` } })
    expect(foundSocio).not.toBeNull();
    expect(foundSocio.name).toEqual(newSocio.name)
    expect(foundSocio.email).toEqual(newSocio.email)
    expect(foundSocio.birthdate).toEqual(newSocio.birthdate)
  });

  it('create debe lanzar una excepción para un nuevo socio con correo inválido', async () => {
    const socio: SocioEntity = {
      id: "",
      name: faker.name.fullName(),
      email: faker.name.fullName(),
      birthdate: faker.date.birthdate()
    }

    await expect(() => service.create(socio))
      .rejects.toHaveProperty("message", "El campo email no es válido")
  });

  it('update debe modificar un socio', async () => {
    const socio: SocioEntity = socioList[0];
    socio.name = faker.name.fullName();
    socio.email = faker.internet.email();
    socio.birthdate = faker.date.birthdate();

    const updatedSocio: SocioEntity = await service
      .update(socio.id, socio);

    expect(updatedSocio).not.toBeNull();
    const savedSocio: SocioEntity = await socioRepository
      .findOne({ where: { id: `${updatedSocio.id}` } })
    expect(savedSocio).not.toBeNull();
    expect(savedSocio.name).toEqual(updatedSocio.name)
    expect(savedSocio.email).toEqual(updatedSocio.email)
    expect(savedSocio.birthdate).toEqual(updatedSocio.birthdate)
  });

  it('update debe lanzar una excepción para un socio inválido', async () => {
    let socio: SocioEntity = socioList[0];
    socio = {
      ...socio, name: faker.name.fullName()
    }
    await expect(() => service.update("0", socio))
      .rejects.toHaveProperty("message", "No se encontró el socio con el id indicado")
  });

  it('update debe lanzar una excepción para un socio con correo inválido', async () => {
    let socio: SocioEntity = socioList[0];
    socio = {
      ...socio, email: faker.name.fullName()
    }
    await expect(() => service.update(socio.id, socio))
      .rejects.toHaveProperty("message", "El campo email no es válido")
  });

  it('delete debe eliminar el socio', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
    const socioDeleted: SocioEntity = await socioRepository
      .findOne({ where: { id: `${socio.id}` } })
    expect(socioDeleted).toBeNull();
  });

  it('delete debe lanzar una excepción para un socio inválido', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
    await expect(() => service.delete("0"))
      .rejects.toHaveProperty("message", "No se encontró el socio con el id indicado")
  });

});
