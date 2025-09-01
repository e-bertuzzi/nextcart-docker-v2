import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Claim } from '../claim.entity'; // ✅ Assicurati che il path sia corretto

async function seedClaims() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'manu123',
    database: 'nextcart',
    entities: ['libs/api/models/src/**/*.entity.{ts,js}'],
    synchronize: false,
  });

  await dataSource.initialize();
  const claimRepo = dataSource.getRepository(Claim);

  // 🧾 Caricamento del JSON
  const jsonPath = path.resolve(__dirname, 'claims.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ File claims.json non trovato:', jsonPath);
    process.exit(1);
  }

  const claimsData: { claimsId: string; description: string }[] = JSON.parse(
    fs.readFileSync(jsonPath, 'utf-8')
  );

  // ❗ Truncate con CASCADE per evitare vincoli FK su product_claim
  await dataSource.query('TRUNCATE TABLE "product_claim", "claim" CASCADE');

  // ✅ Inserimento dei dati
  for (const claim of claimsData) {
    const c = new Claim();
    c.claimId = claim.claimsId;
    c.description = claim.description;
    await claimRepo.save(c);
  }

  console.log(`✅ Claims seed completato! (${claimsData.length} record inseriti)`);
  await dataSource.destroy();
}

seedClaims().catch((err) => {
  console.error('❌ Errore nel seed:', err);
});
