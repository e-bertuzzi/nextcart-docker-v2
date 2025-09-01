// seed-product-diet.ts
import { DataSource } from 'typeorm';
import { ProductDiet } from '../product-diet.entity'; // aggiorna path se necessario
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
  const productDietRepo = dataSource.getRepository(ProductDiet);

  // 1. Svuota la tabella (ATTENZIONE: cancella anche le relazioni se presenti)
  await dataSource.query(`TRUNCATE TABLE "product_diet" RESTART IDENTITY CASCADE`);

  // 2. Leggi il file JSON
  const filePath = path.resolve(__dirname, 'product_diet.json');
  const dietData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // 3. Inserisci i dati
  for (const item of dietData) {
    if (!item.productId || !item.dietId) {
      console.warn(`Dati incompleti, salto l'item:`, item);
      continue;
    }

    const record = productDietRepo.create({
      productId: item.productId,
      dietId: item.dietId,
      product: { productId: item.productId },
      diet: { dietId: item.dietId },
    });

    await productDietRepo.save(record);
  }

  console.log('✅ Seed ProductDiet completato!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Errore nel seed ProductDiet:', err);
});
