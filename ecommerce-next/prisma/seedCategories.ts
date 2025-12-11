// prisma/seedCategories.ts
import { prisma } from "../src/lib/prisma"; // adjust path if needed

async function main() {
  const categorySeed = [
    {
      name: "Pant",
      description: "Designer pants collection",
      subcategories: [
        "Astral navy chandi pant",
        "Galaxy edge chandi pant",
        "Lovry regal lace pant",
        "Moonline chandi pant",
      ],
    },
    {
      name: "Gold shirt",
      description: "Gold accent shirts",
      subcategories: [
        "Auric nightfall",
        "G stripe black gold shirt",
        "Star mist",
        "Stellar noir shirt",
      ],
    },
    {
      name: "Chandi shirt",
      description: "Silver / chandi themed shirts",
      subcategories: [
        "Blooming heritage",
        "Blush harmony",
        "Regal paisley",
        "Royal tapestry",
        "Silver petals",
        "Silver weave black chandi shirt",
        "Stellar florals chandi shirt",
      ],
    },
    {
      name: "Indo western",
      description: "Indo western fusion fits",
      subcategories: [
        "Celestial ash",
        "Midnight majesty",
        "Sapphire skyline",
        "Royal heritage",
      ],
    },
    {
      name: "Kurtas",
      description: "Kurta collection",
      subcategories: [
        "Elephant crest",
        "Galaxy Edge",
        "Shadow Gold work kurta",
      ],
    },
  ];

  for (const cat of categorySeed) {
    // 🔹 Check if category exists by name
    let category = await prisma.category.findFirst({
      where: { name: cat.name },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: cat.name,
          description: cat.description,
        },
      });
      console.log(`✅ Created category: ${category.name}`);
    } else {
      console.log(`ℹ️ Category already exists: ${category.name}`);
    }

    // 🔹 Subcategories
    for (const subName of cat.subcategories) {
      const existingSub = await prisma.subcategory.findFirst({
        where: {
          name: subName,
          categoryId: category.id,
        },
      });

      if (!existingSub) {
        await prisma.subcategory.create({
          data: {
            name: subName,
            description: `${subName} in ${cat.name}`,
            categoryId: category.id,
          },
        });
        console.log(`   ↳ Created subcategory: ${subName}`);
      } else {
        console.log(`   ↳ Subcategory already exists: ${subName}`);
      }
    }
  }

  console.log("🎉 Done seeding categories & subcategories");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
