// seed-nutritional-information.ts
import { DataSource } from 'typeorm';
import { NutritionalInformation } from '../nutritional-information.entity';
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
  const repo = dataSource.getRepository(NutritionalInformation);

  // 1. Svuota la tabella (e resetta l'identity se presente)
  await dataSource.query(
    `TRUNCATE TABLE "nutritional_information" RESTART IDENTITY CASCADE`
  );

  // 2. Carica il JSON
  const filePath = path.resolve(__dirname, 'nutritional-information.json');
  const items: { nutrientId: string; nutrientIT: string; unitOfMeasure: string }[] =
    JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // 3. Inserisci tutti i record
  for (const item of items) {
    // evita duplicati
    const exists = await repo.findOneBy({ nutrientId: item.nutrientId });
    if (exists) continue;

    const entity = repo.create({
      nutrientId: item.nutrientId,
      nutrientIT: item.nutrientIT,
      unitOfMeasure: item.unitOfMeasure,
    });
    await repo.save(entity);
  }

  console.log('Seed NutritionalInformation completato!');
  await dataSource.destroy();
}

seed().catch(err => {
  console.error('Errore nel seed NutritionalInformation:', err);
});
