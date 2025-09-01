import { DataSource } from 'typeorm';
import { HealthCondition } from '../health-condition.entity';
import { HealthConditionCategory } from '../category/health-condition-category.entity'; 
import { HealthConditionIncompatibility } from '../incompatibility/health-condition-incompatibility.entity'; 

const categoriesData = [
  { code: 'age', label: 'Age Group' },
  { code: 'pathology', label: 'Health Conditions' },
  { code: 'physiological_state', label: 'Physiological States' },
];

// Mappa categoria code => entity (riempita dopo init)
const categoriesMap: Record<string, HealthConditionCategory> = {};

const healthConditionsData = [
  // Fasce di età
  { healthConditionId: 'adolescente_femmina_11_14_anni', description: 'Adolescente Femmina 11-14 anni', categoryCode: 'age' },
  { healthConditionId: 'adolescente_femmina_14_17_anni', description: 'Adolescente Femmina 14-17 anni', categoryCode: 'age' },
  { healthConditionId: 'adolescente_maschio_11_14_anni', description: 'Adolescente Maschio 11-14 anni', categoryCode: 'age' },
  { healthConditionId: 'adolescente_maschio_15_17_anni', description: 'Adolescente Maschio 15-17 anni', categoryCode: 'age' },
  { healthConditionId: 'adulto_femmina_18_29_anni', description: 'Adulto Femmina 18-29 anni', categoryCode: 'age' },
  { healthConditionId: 'adulto_femmina_30_59_anni', description: 'Adulto Femmina 30-59 anni', categoryCode: 'age' },
  { healthConditionId: 'adulto_femmina_60_74_anni', description: 'Adulto Femmina 60-74 anni', categoryCode: 'age' },
  { healthConditionId: 'adulto_maschio_18_29_anni', description: 'Adulto Maschio 18-29 anni', categoryCode: 'age' },
  { healthConditionId: 'adulto_maschio_30_59_anni', description: 'Adulto Maschio 30-59 anni', categoryCode: 'age' },
  { healthConditionId: 'adulto_maschio_60_74_anni', description: 'Adulto Maschio 60-74 anni', categoryCode: 'age' },
  { healthConditionId: 'adulto_sano', description: 'Adulto Sano', categoryCode: 'age' },
  { healthConditionId: 'anziano_femmina_over_74_anni', description: 'Anziano Femmina > 74 anni', categoryCode: 'age' },
  { healthConditionId: 'anziano_maschio_over_74_anni', description: 'Anziano Maschio > 74 anni', categoryCode: 'age' },
  { healthConditionId: 'bambini_1_3_anni', description: 'Bambini 1-3 anni', categoryCode: 'age' },
  { healthConditionId: 'bambini_4_6_anni', description: 'Bambini 4-6 anni', categoryCode: 'age' },
  { healthConditionId: 'bambini_7_10_anni', description: 'Bambini 7-10 anni', categoryCode: 'age' },
  { healthConditionId: 'lattante_6_12_mesi', description: 'Lattante 6-12 mesi', categoryCode: 'age' },

  // Patologie
  { healthConditionId: 'anemia', description: 'Anemia', categoryCode: 'pathology' },
  { healthConditionId: 'celiachia', description: 'Celiachia', categoryCode: 'pathology' },
  { healthConditionId: 'diabete', description: 'Diabete', categoryCode: 'pathology' },
  { healthConditionId: 'intolleranza_lattosio', description: 'Intolleranza al lattosio', categoryCode: 'pathology' },
  { healthConditionId: 'ipercolesterolemia', description: 'Ipercolesterolemia', categoryCode: 'pathology' },
  { healthConditionId: 'ipertensione', description: 'Ipertensione', categoryCode: 'pathology' },
  { healthConditionId: 'ipertiroidismo', description: 'Ipertiroidismo', categoryCode: 'pathology' },
  { healthConditionId: 'ipotiroidismo', description: 'Ipotiroidismo', categoryCode: 'pathology' },
  { healthConditionId: 'obesita', description: 'Obesità', categoryCode: 'pathology' },
  { healthConditionId: 'osteoporosi', description: 'Osteoporosi', categoryCode: 'pathology' },
  { healthConditionId: 'reflusso_gastrico', description: 'Reflusso Gastrico', categoryCode: 'pathology' },

  // Stati fisiologici
  { healthConditionId: 'allattamento', description: 'Allattamento', categoryCode: 'physiological_state' },
  { healthConditionId: 'gravidanza', description: 'Gravidanza', categoryCode: 'physiological_state' },
  { healthConditionId: 'gravidanza_1_trimestre', description: 'Gravidanza 1° trimestre', categoryCode: 'physiological_state' },
  { healthConditionId: 'gravidanza_2_trimestre', description: 'Gravidanza 2° trimestre', categoryCode: 'physiological_state' },
  { healthConditionId: 'gravidanza_3_trimestre', description: 'Gravidanza 3° trimestre', categoryCode: 'physiological_state' },
  { healthConditionId: 'menopausa', description: 'Menopausa', categoryCode: 'physiological_state' },
];


// Definisci incompatibilità
const incompatibilitiesData = [
  { conditionId: 'lattante_6_12_mesi', incompatibleWithId: 'allattamento' },
  { conditionId: 'lattante_6_12_mesi', incompatibleWithId: 'gravidanza' },
  { conditionId: 'lattante_6_12_mesi', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'lattante_6_12_mesi', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'lattante_6_12_mesi', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'lattante_6_12_mesi', incompatibleWithId: 'menopausa' },

  { conditionId: 'adolescente_maschio_11_14_anni', incompatibleWithId: 'allattamento' },
  { conditionId: 'adolescente_maschio_11_14_anni', incompatibleWithId: 'gravidanza' },
  { conditionId: 'adolescente_maschio_11_14_anni', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'adolescente_maschio_11_14_anni', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'adolescente_maschio_11_14_anni', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'adolescente_maschio_11_14_anni', incompatibleWithId: 'menopausa' },

  { conditionId: 'adolescente_maschio_15_17_anni', incompatibleWithId: 'allattamento' },
  { conditionId: 'adolescente_maschio_15_17_anni', incompatibleWithId: 'gravidanza' },
  { conditionId: 'adolescente_maschio_15_17_anni', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'adolescente_maschio_15_17_anni', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'adolescente_maschio_15_17_anni', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'adolescente_maschio_15_17_anni', incompatibleWithId: 'menopausa' },

  { conditionId: 'adulto_maschio_18_29_anni', incompatibleWithId: 'allattamento' },
  { conditionId: 'adulto_maschio_18_29_anni', incompatibleWithId: 'gravidanza' },
  { conditionId: 'adulto_maschio_18_29_anni', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'adulto_maschio_18_29_anni', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'adulto_maschio_18_29_anni', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'adulto_maschio_18_29_anni', incompatibleWithId: 'menopausa' },

  { conditionId: 'adulto_maschio_30_59_anni', incompatibleWithId: 'allattamento' },
  { conditionId: 'adulto_maschio_30_59_anni', incompatibleWithId: 'gravidanza' },
  { conditionId: 'adulto_maschio_30_59_anni', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'adulto_maschio_30_59_anni', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'adulto_maschio_30_59_anni', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'adulto_maschio_30_59_anni', incompatibleWithId: 'menopausa' },

  { conditionId: 'adulto_maschio_60_74_anni', incompatibleWithId: 'allattamento' },
  { conditionId: 'adulto_maschio_60_74_anni', incompatibleWithId: 'gravidanza' },
  { conditionId: 'adulto_maschio_60_74_anni', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'adulto_maschio_60_74_anni', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'adulto_maschio_60_74_anni', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'adulto_maschio_60_74_anni', incompatibleWithId: 'menopausa' },

  { conditionId: 'bambini_1_3_anni', incompatibleWithId: 'allattamento' },
  { conditionId: 'bambini_1_3_anni', incompatibleWithId: 'gravidanza' },
  { conditionId: 'bambini_1_3_anni', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'bambini_1_3_anni', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'bambini_1_3_anni', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'bambini_1_3_anni', incompatibleWithId: 'menopausa' },

  { conditionId: 'bambini_4_6_anni', incompatibleWithId: 'allattamento' },
  { conditionId: 'bambini_4_6_anni', incompatibleWithId: 'gravidanza' },
  { conditionId: 'bambini_4_6_anni', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'bambini_4_6_anni', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'bambini_4_6_anni', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'bambini_4_6_anni', incompatibleWithId: 'menopausa' },

  { conditionId: 'bambini_7_10_anni', incompatibleWithId: 'allattamento' },
  { conditionId: 'bambini_7_10_anni', incompatibleWithId: 'gravidanza' },
  { conditionId: 'bambini_7_10_anni', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'bambini_7_10_anni', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'bambini_7_10_anni', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'bambini_7_10_anni', incompatibleWithId: 'menopausa' },

  { conditionId: 'anziano_maschio_over_74_anni', incompatibleWithId: 'allattamento' },
  { conditionId: 'anziano_maschio_over_74_anni', incompatibleWithId: 'gravidanza' },
  { conditionId: 'anziano_maschio_over_74_anni', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'anziano_maschio_over_74_anni', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'anziano_maschio_over_74_anni', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'anziano_maschio_over_74_anni', incompatibleWithId: 'menopausa' },

  { conditionId: 'anziano_femmina_over_74_anni', incompatibleWithId: 'allattamento' },
  { conditionId: 'anziano_femmina_over_74_anni', incompatibleWithId: 'gravidanza' },
  { conditionId: 'anziano_femmina_over_74_anni', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'anziano_femmina_over_74_anni', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'anziano_femmina_over_74_anni', incompatibleWithId: 'gravidanza_3_trimestre' },

  { conditionId: 'gravidanza_1_trimestre', incompatibleWithId: 'menopausa' },
  { conditionId: 'gravidanza_2_trimestre', incompatibleWithId: 'menopausa' },
  { conditionId: 'gravidanza_3_trimestre', incompatibleWithId: 'menopausa' },
  { conditionId: 'gravidanza', incompatibleWithId: 'menopausa' },
  { conditionId: 'allattamento', incompatibleWithId: 'menopausa' },

  { conditionId: 'gravidanza_1_trimestre', incompatibleWithId: 'gravidanza_2_trimestre' },
  { conditionId: 'gravidanza_1_trimestre', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'gravidanza_2_trimestre', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'gravidanza_2_trimestre', incompatibleWithId: 'gravidanza_3_trimestre' },
  { conditionId: 'gravidanza_3_trimestre', incompatibleWithId: 'gravidanza_1_trimestre' },
  { conditionId: 'gravidanza_3_trimestre', incompatibleWithId: 'gravidanza_2_trimestre' },
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

  const categoryRepo = dataSource.getRepository(HealthConditionCategory);
  const healthConditionRepo = dataSource.getRepository(HealthCondition);
  const incompatibilityRepo = dataSource.getRepository(HealthConditionIncompatibility);

  // Prima tronca la tabella di join con CASCADE
  await dataSource.query('TRUNCATE TABLE "consumer_health_condition" CASCADE');

  // Poi tronca le tabelle collegate in ordine corretto, sempre con CASCADE
  await dataSource.query('TRUNCATE TABLE "health_condition_incompatibility" CASCADE');
  await dataSource.query('TRUNCATE TABLE "health_condition" CASCADE');
  await dataSource.query('TRUNCATE TABLE "health_condition_category" CASCADE');

  // Seed categories (se non esistono)
  for (const catData of categoriesData) {
    let category = await categoryRepo.findOneBy({ code: catData.code });
    if (!category) {
      category = categoryRepo.create(catData);
      await categoryRepo.save(category);
    }
    categoriesMap[catData.code] = category;
  }

  // Seed health conditions associandoli alla categoria corretta
  for (const hcData of healthConditionsData) {
    const exists = await healthConditionRepo.findOneBy({ description: hcData.description });
    if (!exists) {
      const hc = healthConditionRepo.create({
        healthConditionId: hcData.healthConditionId,
        description: hcData.description,
        category: categoriesMap[hcData.categoryCode],
      });
      await healthConditionRepo.save(hc);
    }
  }

  // Seed incompatibilities
  for (const incData of incompatibilitiesData) {
    const condition = await healthConditionRepo.findOneBy({ healthConditionId: incData.conditionId });
    const incompatibleWith = await healthConditionRepo.findOneBy({ healthConditionId: incData.incompatibleWithId });

    if (condition && incompatibleWith) {
      // Controlla se esiste già per evitare duplicati
      const exists = await incompatibilityRepo.findOne({
        where: {
          condition: condition,
          incompatibleWith: incompatibleWith,
        },
        relations: ['condition', 'incompatibleWith'],
      });
      if (!exists) {
        const incompatibility = incompatibilityRepo.create({
          condition,
          incompatibleWith,
        });
        await incompatibilityRepo.save(incompatibility);
      }
    }
  }

  console.log('Seeding completato.');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Errore durante il seeding:', err);
});
