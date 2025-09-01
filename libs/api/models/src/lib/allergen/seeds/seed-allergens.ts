import { DataSource } from 'typeorm';
import { Allergen } from '../allergen.entity'; // Aggiusta il path corretto
import * as fs from 'fs';
import * as path from 'path';

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

  const allergenRepo = dataSource.getRepository(Allergen);

  // Svuota la tabella allergen (usando il nome esatto e rispettando maiuscole/minuscole se serve)
  await dataSource.query('TRUNCATE TABLE "allergen" CASCADE');

  // Leggi il file JSON
  const jsonPath = path.resolve(__dirname, 'allergens.json');
  const allergenData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  for (const item of allergenData) {
    const exists = await allergenRepo.findOneBy({
      allergenId: item.allergenId,
    });

    if (!exists) {
      const allergen = allergenRepo.create({
        allergenId: item.allergenId,
        allergenName: item.allergenName,
      });
      await allergenRepo.save(allergen);
    }
  }

  console.log('Seed Allergen completato.');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Errore nel seed Allergen:', err);
});
