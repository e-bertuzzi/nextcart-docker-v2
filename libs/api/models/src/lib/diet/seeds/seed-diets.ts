import { DataSource } from 'typeorm';
import { Diet } from '../diet.entity';

const dietsData = [
  {
    dietId: 'Celiachia',
    description: 'Non sono ammessi prodotti contenenti GLUTINE',
    restrictionLevel: 13,
  },
  {
    dietId: 'Halal',
    description:
      "Non è ammesso il maiale e l'alcol. Macellazione certificata halal",
    restrictionLevel: 14,
  },
  {
    dietId: 'Intolleranza al lattosio',
    description: 'Non sono ammessi prodotti contenenti lattosio',
    restrictionLevel: 15,
  },
  {
    dietId: 'Kosher',
    description:
      'Non sono ammessi maiale, crostacei. Macellazione certificata kosher',
    restrictionLevel: 16,
  },
  {
    dietId: 'Onnivora',
    description: 'Non ci sono restrizioni alimentari',
    restrictionLevel: 17,
  },
  {
    dietId: 'Ovolattovegetariana',
    description: 'Non sono ammessi carne e pesce',
    restrictionLevel: 18,
  },
  {
    dietId: 'Pescovegetariana',
    description: 'Non è ammessa la carne',
    restrictionLevel: 19,
  },
  {
    dietId: 'Reflusso Gastrico',
    description:
      'Non sono ammessi caffeina, teina, agrumi, aceto, pepe, peperoncino, bevande gassate, alcol',
    restrictionLevel: 20,
  },
  {
    dietId: 'Vegana',
    description: 'Non sono ammessi derivati animali',
    restrictionLevel: 21,
  }
];

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'manu123',
    database: 'nextcart',
    entities: ['libs/api/models/src/**/*.entity.{ts,js}'],
    synchronize: false,
    logging: false,
  });

  await dataSource.initialize();

  const dietRepo = dataSource.getRepository(Diet);

  // Svuota la tabella Diet con CASCADE
  await dataSource.query('TRUNCATE TABLE "diet" CASCADE');

  for (const dietData of dietsData) {
    const exists = await dietRepo.findOneBy({
      description: dietData.description,
    });
    if (!exists) {
      const diet = dietRepo.create({
        dietId: dietData.dietId,
        description: dietData.description, // <-- aggiunto qui
        restrictionLevel: dietData.restrictionLevel,
      });
      await dietRepo.save(diet);
    }
  }

  console.log('Seed Diet completato.');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Errore nel seed Diet:', err);
});
