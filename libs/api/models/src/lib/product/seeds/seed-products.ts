import { DataSource } from 'typeorm';
import { Product } from '../product.entity'; // correggi se serve
import { ProductCategory } from '../product-category/product-category.entity'; // aggiunto
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
    entities: ['libs/api/models/src/**/*.entity.{ts,js}'], // correggi se serve
    synchronize: false,
    logging: false,
  });

  await dataSource.initialize();

  const productRepo = dataSource.getRepository(Product);
  const categoryRepo = dataSource.getRepository(ProductCategory);

  // Svuota la tabella Product (e relative tramite CASCADE)
  await dataSource.query('TRUNCATE TABLE "product" CASCADE');

  // Leggi i dati dal JSON
  const jsonPath = path.resolve(__dirname, 'products.json');
  const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  for (const productData of productsData) {
    const exists = await productRepo.findOneBy({
      productId: productData.productId,
    });

    if (!exists) {
      const product = productRepo.create({
        productId: productData.productId, // deve essere stringa
        name: productData.name,
        itName: productData.itName,
        productCategory: productData.productCategory
          ? { productCategoryId: productData.productCategory } // usa la chiave giusta
          : undefined, // meglio undefined che null
      });

      await productRepo.save(product);
    }
  }

  console.log('✅ Seed Product completato.');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Errore nel seed Product:', err);
});
