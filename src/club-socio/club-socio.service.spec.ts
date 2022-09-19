import { Test, TestingModule } from '@nestjs/testing';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { ClubSocioService } from './club-socio.service';
import { TypeOrmTestingConfig } from '../testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let socio: SocioEntity;
  let socios: SocioEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });


  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    socios = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        birthdate: faker.date.birthdate()
      })
      socios.push(socio);
    }

    club = await clubRepository.save({
      name: faker.company.name(),
      foundationDate: faker.date.birthdate(),
      image: faker.image.imageUrl(),
      description: faker.company.bs(),
      socios: socios
    });

    socio = await socioRepository.save({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate()
    })


  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub debe agregar un nuevo socio al club', async () => {
    const newSocio = await socioRepository.save({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate()
    });

    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundationDate: faker.date.birthdate(),
      image: faker.image.imageUrl(),
      description: faker.company.bs()
    });


    const result: ClubEntity = await service.addMemberToClub(newClub.id, newSocio.id);

    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].name).toBe(newSocio.name);
    expect(result.socios[0].email).toBe(newSocio.email);
    expect(result.socios[0].birthdate).toStrictEqual(newSocio.birthdate);
  });

  it('addMemberToClub debe lanzar una excepción para un socio inválid0', async () => {
    await expect(() => service.addMemberToClub(club.id, "0"))
      .rejects.toHaveProperty("message", "No se encontró el socio con el id indicado");
  });

  it('addMemberToClub debe lanzar una excepción para un club inválido', async () => {
    await expect(() => service.addMemberToClub("0", socio.id))
      .rejects.toHaveProperty("message", "No se encontró el club con el id indicado");
  });

  it('findMembersFromClub debe lanzar una excepción para un club inválido', async () => {
    await expect(() => service.findMembersFromClub("0"))
      .rejects.toHaveProperty("message", "No se encontró el club con el id indicado");
  });

  it('findMembersFromClub debe retornar los socios relacionadas al club indicada', async () => {
    const socios: SocioEntity[] = await service.findMembersFromClub(club.id);
    expect(socios.length).toBe(5);
  });


  it('findMemberFromClub debe lanzar una excepción por un club inválido', async () => {
    await expect(() => service.findMemberFromClub("0", socio.id))
      .rejects.toHaveProperty("message", "No se encontró el club con el id indicado");
  });

  it('findMemberFromClub debe lanzar una excepción por un socio inválido', async () => {
    await expect(() => service.findMemberFromClub(club.id, "0"))
      .rejects.toHaveProperty("message", "No se encontró el socio con el id indicado");
  });

  it('findMemberFromClub debe lanzar una excepción para un socio no relacionada al club', async () => {
    await expect(() => service.findMemberFromClub(club.id, socio.id))
      .rejects.toHaveProperty("message", "El socio no es miembro del club")
  })

  it('findMemberFromClub debe retornar el socio por el club indicado', async () => {
    const relatedSocio: SocioEntity = socios[0];
    const foundSocio: SocioEntity = await service.findMemberFromClub(club.id, relatedSocio.id);

    expect(foundSocio).not.toBeNull();
    expect(foundSocio.name).toBe(relatedSocio.name)
    expect(foundSocio.birthdate).toStrictEqual(relatedSocio.birthdate)
    expect(foundSocio.email).toBe(relatedSocio.email)
  });

  it('updateMembersFromClub debe lanzar una excepción para un club inválido', async () => {
    await expect(() => service.updateMembersFromClub("0", [socio]))
      .rejects.toHaveProperty("message", "No se encontró el club con el id indicado");
  });

  it('updateMembersFromClub debe lanzar una excepción por un socio inválido', async () => {
    socio.id = "0";

    await expect(() => service.updateMembersFromClub(club.id, [socio]))
      .rejects.toHaveProperty("message", "No se encontró el socio con el id indicado");
  });

  it('updateMembersFromClub debe actualizar la lista de miembros de un club', async () => {

    const newSocio = await socioRepository.save({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate()
    });

    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundationDate: faker.date.birthdate(),
      image: faker.image.imageUrl(),
      description: faker.company.bs()
    });

    const updatedClub = await service.updateMembersFromClub(newClub.id, [newSocio]);

    expect(updatedClub.socios.length).toBe(1);
    expect(updatedClub.socios[0].name).toBe(newSocio.name);
    expect(updatedClub.socios[0].birthdate).toBe(newSocio.birthdate);
    expect(updatedClub.socios[0].email).toBe(newSocio.email);
  });

  it('deleteMemberFromClub debe lanzar una excepción para un club inválido', async () => {
    const socio = club.socios[0];
    await expect(() => service.deleteMemberFromClub("0", socio.id))
      .rejects.toHaveProperty("message", "No se encontró el club con el id indicado");
  });

  it('deleteMemberFromClub debe lanzar una excepción para un socio inválido', async () => {
    await expect(() => service.deleteMemberFromClub(club.id, "0"))
      .rejects.toHaveProperty("message", "No se encontró el socio con el id indicado");
  });

  it('deleteMemberFromClub debe lanzar una excepción por un socio no relacionado al club', async () => {
    await expect(() => service.deleteMemberFromClub(club.id, socio.id))
      .rejects.toHaveProperty("message", "El socio no es miembro del club")
  });

  it('deleteMemberFromClub debe eliminar el socio del club', async () => {
    const socio: SocioEntity = socios[0];

    await service.deleteMemberFromClub(club.id, socio.id);

    const foundClub: ClubEntity =
      await clubRepository.findOne({
        where: { id: `${club.id}` }, relations: ["socios"]
      });
    const socioDeleted: SocioEntity = foundClub.socios.find(r => r.id === socio.id);

    expect(socioDeleted).toBeUndefined();
  })

});
