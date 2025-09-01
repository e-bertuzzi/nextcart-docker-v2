// seed-product-nutrition-info.ts
import { DataSource } from 'typeorm';
import { ProductNutritionalInfo } from '../product-nutritional-info.entity';
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
  const nutritionRepo = dataSource.getRepository(ProductNutritionalInfo);

  // 1. Svuota la tabella (ATTENZIONE: cancella anche le relazioni se presenti)
  await dataSource.query(
    `TRUNCATE TABLE "product_nutritional_info" RESTART IDENTITY CASCADE`
  );

  // 2. Leggi il file JSON con i dati nutrizionali
  const filePath = path.resolve(__dirname, 'product_nutrition_info.json');
  const nutritionData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Funzione per ripulire il nutrientId
  function cleanNutrientId(nutrientId: string): string {
    return nutrientId.replace(/\s*\(.*?\)/g, '').trim();
  }

  // 3. Inserisci i dati
  for (const item of nutritionData) {
    if (!item.productId || !item.nutrientId) {
      console.warn(`⚠️  Dati incompleti, salto l'item:`, item);
      continue;
    }

    const record = nutritionRepo.create({
      product: { productId: item.productId },
      nutrient: { nutrientId: cleanNutrientId(item.nutrientId) }, // 👈 pulizia qui
      value: item.value ?? null,
    });

    await nutritionRepo.save(record);
  }

  console.log('✅ Seed ProductNutritionInfo completato!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Errore nel seed ProductNutritionInfo:', err);
});
