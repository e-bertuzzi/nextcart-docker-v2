import { DataSource } from 'typeorm';
import { NutrientHealthCondition } from '../nutrient-health-conditions.entity';
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
  const repo = dataSource.getRepository(NutrientHealthCondition);

  // 1. Svuota la tabella
  await dataSource.query(
    `TRUNCATE TABLE "nutrient_health_condition" RESTART IDENTITY CASCADE`
  );

  // 2. Carica dati dal file JSON
  const filePath = path.resolve(__dirname, 'nutrient_health_condition_ita.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // 3. Inserisci i record
  for (const item of data) {
    const record = repo.create({
      healthCondition: { healthConditionId: item.healthConditionId }, // FK
      nutrient: { nutrientId: item.nutrientId },                     // FK
      minQuantity: item.minQuantity ?? null,
      maxQuantity: item.maxQuantity ?? null,
      percentKCal: item.percentKCal ?? null,
      uoMperKg: item.uoMperKg ?? null,
    });
    await repo.save(record);
  }

  console.log('✅ Seed NutrientHealthCondition completato!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Errore nel seed NutrientHealthCondition:', err);
});
