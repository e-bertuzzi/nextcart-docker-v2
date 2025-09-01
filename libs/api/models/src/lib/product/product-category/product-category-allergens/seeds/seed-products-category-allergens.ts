import { DataSource } from 'typeorm';
import { ProductCategory } from '../../product-category.entity';
import { Allergen } from '../../../../allergen';
import { ProductCategoryAllergen } from '../product-category-allergen.entity';
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
  const allergenRepo = dataSource.getRepository(Allergen);
  const pivotRepo = dataSource.getRepository(ProductCategoryAllergen);

  // 1. Svuota la tabella pivot
  await dataSource.query(`TRUNCATE TABLE "product_category_allergen" CASCADE`);

  // 2. Carica il file JSON
  const relationsPath = path.resolve(__dirname, 'products-category-allergens.json');
  const relationsData: { productCategoryId: string; allergenId: string }[] = JSON.parse(
    fs.readFileSync(relationsPath, 'utf-8')
  );

  for (const rel of relationsData) {
    const category = await categoryRepo.findOneBy({ productCategoryId: rel.productCategoryId });
    if (!category) {
      console.warn(`Categoria non trovata: ${rel.productCategoryId}`);
      continue;
    }

    const allergen = await allergenRepo.findOneBy({ allergenId: rel.allergenId });
    if (!allergen) {
      console.warn(`Allergene non trovato: ${rel.allergenId}`);
      continue;
    }

    const relation = pivotRepo.create({
      productCategoryId: category.productCategoryId,
      allergenId: allergen.allergenId,
      productCategory: category,
      allergen: allergen,
    });

    await pivotRepo.save(relation);
  }

  console.log('Seed associazioni ProductCategory <-> Allergen completato!');

  await dataSource.destroy();
}

seed().catch(err => {
  console.error('Errore nel seed:', err);
});
