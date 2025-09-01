// seed-product-categories.ts
import { DataSource } from 'typeorm';
import { ProductCategory } from '../product-category.entity';
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
  const categoryRepo = dataSource.getRepository(ProductCategory);

  // 1. Svuota la tabella
  await dataSource.query(`TRUNCATE TABLE "product_category" RESTART IDENTITY CASCADE`);

  // 2. Leggi il file JSON
  const filePath = path.resolve(__dirname, 'products_category.json');
  const categoriesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // 3. Inserisci le categorie
  for (const item of categoriesData) {
    const category = categoryRepo.create({
      productCategoryId: item.productCategoryId,
      group: item.group,
      category: item.category,
      standardPortion: item.standardPortion?.replace(',', '.'), // converte "0,1" → "0.1"
    });

    await categoryRepo.save(category);
  }

  console.log('✅ Seed ProductCategory completato!');
  await dataSource.destroy();
}

seed().catch(err => {
  console.error('❌ Errore nel seed ProductCategory:', err);
});
