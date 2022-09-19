import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('ClubService', () => {
  let service: ClubService;
  let clubRepository: Repository<ClubEntity>
  let clubList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    clubList = [];
    for (let i = 0; i < 5; ++i) {
      const club: ClubEntity = await clubRepository.save({
        name: faker.company.name(),
        foundationDate: faker.date.birthdate(),
        image: faker.image.imageUrl(),
        description: faker.company.bs()
      });
      clubList.push(club);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas los clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubList.length);
  });

  it('findOne debe retormar un club por su id', async () => {
    const club: ClubEntity = clubList[0];
    const clubFound: ClubEntity = await service.findOne(club.id);
    expect(clubFound).not.toBeNull();
    expect(clubFound.name).toEqual(club.name);
    expect(clubFound.foundationDate).toEqual(club.foundationDate);
    expect(clubFound.image).toEqual(club.image);
    expect(clubFound.description).toEqual(club.description);
  });

  it('findOne debe lanzar una excepción para un club inválido', async () => {
    await expect(() => service.findOne("0"))
      .rejects.toHaveProperty("message", "No se encontró el club con el id indicado")
  });


  it('create debe retornar un nuevo club', async () => {
    const club: ClubEntity = {
      id: "",
      name: faker.name.fullName(),
      foundationDate: faker.date.birthdate(),
      image: faker.image.imageUrl(),
      description: faker.company.bs()
    }

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const foundClub: ClubEntity = await clubRepository
      .findOne({ where: { id: `${newClub.id}` } })
    expect(foundClub).not.toBeNull();
    expect(foundClub.name).toEqual(newClub.name);
    expect(foundClub.foundationDate).toEqual(newClub.foundationDate);
    expect(foundClub.image).toEqual(newClub.image);
    expect(foundClub.description).toEqual(newClub.description);
  });

  it('create debe lanzar una excepción para un nuevo club con unas descripcion inválida', async () => {
    const club: ClubEntity = {
      id: "",
      name: faker.name.fullName(),
      foundationDate: faker.date.birthdate(),
      image: faker.image.imageUrl(),
      description: faker.lorem.paragraph(25)
    }

    await expect(() => service.create(club))
      .rejects.toHaveProperty("message", "El campo description no es válido, debe contener entre 1 y 100 caracteres")
  });

  it('update debe modificar un club', async () => {
    const club: ClubEntity = clubList[0];
    club.name = faker.name.fullName();
    club.foundationDate = faker.date.birthdate(),
      club.image = faker.image.imageUrl(),
      club.description = faker.company.bs();

    const updatedClub: ClubEntity = await service
      .update(club.id, club);

    expect(updatedClub).not.toBeNull();
    const savedClub: ClubEntity = await clubRepository
      .findOne({ where: { id: `${updatedClub.id}` } })
    expect(savedClub).not.toBeNull();
    expect(savedClub.name).toEqual(updatedClub.name);
    expect(savedClub.foundationDate).toEqual(updatedClub.foundationDate);
    expect(savedClub.image).toEqual(updatedClub.image);
    expect(savedClub.description).toEqual(updatedClub.description);
  });

  it('update debe lanzar una excepción para un club inválido', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club, name: faker.name.fullName()
    }
    await expect(() => service.update("0", club))
      .rejects.toHaveProperty("message", "No se encontró el club con el id indicado")
  });

  it('update debe lanzar una excepción para un club con una descripción inválida', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club, description: faker.lorem.paragraph(25)
    }
    await expect(() => service.update(club.id, club))
      .rejects.toHaveProperty("message", "El campo description no es válido, debe contener entre 1 y 100 caracteres")
  });

  it('delete debe eliminar el club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
    const clubDeleted: ClubEntity = await clubRepository
      .findOne({ where: { id: `${club.id}` } })
    expect(clubDeleted).toBeNull();
  });

  it('delete debe lanzar una excepción para un club inválido', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
    await expect(() => service.delete("0"))
      .rejects.toHaveProperty("message", "No se encontró el club con el id indicado")
  });

});
