// scripts/seed.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

// Import your schema entrypoint that re-exports all tables
import * as schema from "./schema"; // adjust path as needed
import { USER_ROLES } from "./schema/users"; // adjust path as needed

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

// Helpers
const randItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randSample = <T>(arr: T[], count: number): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.max(0, Math.min(count, copy.length)));
};

async function main() {
  console.log("🌱 Seeding start...");

  // CLEANUP: reverse dependency order
  // Junctions (many-to-many) first
  console.log("🧹 Cleaning...");

  // Helper to safely delete from tables that may not exist
  const safeDelete = async (table: any, tableName: string) => {
    try {
      await db.delete(table);
    } catch (err: any) {
      // Ignore "relation does not exist" errors (table hasn't been created yet)
      if (err?.code === "42P01") {
        console.log(`⚠️  Table ${tableName} does not exist, skipping cleanup`);
      } else {
        throw err;
      }
    }
  };

  await safeDelete(schema.giftspacesGiftcards, "giftspacesGiftcards");
  await safeDelete(schema.giftspacesUsers, "giftspacesUsers");
  await safeDelete(schema.brandsGiftcards, "brandsGiftcards");
  await safeDelete(schema.categoriesBrands, "categoriesBrands");

  // Dependents
  await safeDelete(schema.giftcards, "giftcards");
  await safeDelete(schema.giftspaces, "giftspaces");
  await safeDelete(schema.brands, "brands");

  // Bases
  await safeDelete(schema.users, "users");
  await safeDelete(schema.categories, "categories");

  // BASE TABLES
  // Categories
  console.log("📚 Seeding categories...");
  const categoryData = [
    { name: "Food & Dining", color: "#E67E22", iconUrl: faker.image.url() },
    { name: "Retail", color: "#2ECC71", iconUrl: faker.image.url() },
    { name: "Entertainment", color: "#9B59B6", iconUrl: faker.image.url() },
    { name: "Travel", color: "#3498DB", iconUrl: faker.image.url() },
    { name: "Tech", color: "#34495E", iconUrl: faker.image.url() },
  ];

  // NOTE: your categories schema has color: varchar("name"...). Fix to varchar("color"...).
  const createdCategories = await db
    .insert(schema.categories)
    .values(categoryData)
    .returning();

  // Users
  console.log("👤 Seeding users...");
  const saltRounds = 10;
  const plainPassword = process.env.FAKE_USERS_PASSWORD ?? "Password123!"; // stable for local login
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  const usersCount = 40;
  const createdUsers = await db
    .insert(schema.users)
    .values(
      Array.from({ length: usersCount }, (_, i) => ({
        username: faker.internet
          .username({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
          })
          .toLowerCase()
          .slice(0, 50),
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        displayName: faker.person.fullName().slice(0, 100),
        avatarUrl: faker.image.avatar(),
        role:
          i === 0
            ? USER_ROLES.ADMIN
            : i < 3
              ? USER_ROLES.MODERATOR
              : USER_ROLES.USER,
        // lastLoginAt left null or random
        lastLoginAt: faker.date.recent({ days: 30 }),
      }))
    )
    .returning();

  const adminUsers = createdUsers.filter((u) => u.role === USER_ROLES.ADMIN);

  // BRANDS
  console.log("🏷️ Seeding brands...");
  const brandNames = [
    "Amazon",
    "Apple",
    "Starbucks",
    "Netflix",
    "Spotify",
    "Uber",
    "Airbnb",
    "Steam",
    "Target",
    "Walmart",
    "IKEA",
    "Nike",
    "Adidas",
    "Best Buy",
    "DoorDash",
  ];

  const createdBrands = await db
    .insert(schema.brands)
    .values(
      brandNames.map((name) => {
        const category = randItem(createdCategories);
        return {
          name,
          imageUrl: faker.image.url(),
          category: category.id, // FK one-to-many
        };
      })
    )
    .returning();

  // categoriesBrands junction (even if redundant with brands.category)
  console.log("🔗 Seeding categoriesBrands...");
  const categoriesBrandsRows = createdBrands.flatMap((brand) => {
    // Link each brand to 1-2 categories for discoverability
    const extraCats = randSample(
      createdCategories,
      faker.number.int({ min: 1, max: 2 })
    );
    return extraCats.map((cat) => ({
      categoryId: cat.id,
      brandId: brand.id,
    }));
  });
  if (categoriesBrandsRows.length) {
    await db.insert(schema.categoriesBrands).values(categoriesBrandsRows);
  }

  // GIFTSPACES
  console.log("🎁 Seeding giftspaces...");

  const giftspaceCount = 25;
  const giftspaceRows: Array<typeof schema.giftspaces.$inferInsert> = [];

  for (let i = 0; i < giftspaceCount; i++) {
    const owner = randItem(createdUsers);
    const maybePw = faker.datatype.boolean()
      ? faker.internet.password({ length: 12 })
      : null;

    giftspaceRows.push({
      name: faker.commerce.department().slice(0, 100),
      owner: owner.id,
      password: maybePw ? await bcrypt.hash(maybePw, saltRounds) : null,
      // createdAt defaults to now()
    });
  }

  // Since we used async in values, refactor to sequential creation
  // Recreate giftspaces seeding synchronously to avoid unresolved promises

  const createdGiftspaces2 = await db
    .insert(schema.giftspaces)
    .values(giftspaceRows)
    .returning();

  // GIFTSPACES USERS (members)
  console.log("👥 Seeding giftspacesUsers...");
  const giftspacesUsersRows: Array<typeof schema.giftspacesUsers.$inferInsert> =
    [];
  for (const gs of createdGiftspaces2) {
    const members = randSample(
      createdUsers,
      faker.number.int({ min: 2, max: 10 })
    );
    for (const m of members) {
      giftspacesUsersRows.push({
        giftspaceId: gs.id,
        userId: m.id,
      });
    }
  }
  if (giftspacesUsersRows.length) {
    await db.insert(schema.giftspacesUsers).values(giftspacesUsersRows);
  }

  // GIFTCARDS
  console.log("💳 Seeding giftcards...");
  const giftcardCount = 120;

  // NOTE: your giftcards schema has balance: decimal("pin") which is likely wrong.
  // Ideally fix to: decimal("balance", { precision: 10, scale: 2 })
  // Below we still set the property name "balance" per TypeScript typing.
  const giftcardRows: Array<typeof schema.giftcards.$inferInsert> = [];
  for (let i = 0; i < giftcardCount; i++) {
    const brand = randItem(createdBrands);
    const gs = randItem(createdGiftspaces2);
    const value = faker.number.float({ min: 0, max: 250, fractionDigits: 2 });

    giftcardRows.push({
      name: faker.commerce.productName().slice(0, 255),
      code: faker.string.alphanumeric({ length: 16 }).toUpperCase(),
      pin: faker.datatype.boolean() ? faker.string.numeric(6) : null,
      // Cast as string for decimal
      // If your column is misnamed, this still compiles but may fail at runtime.
      // Fix schema if needed.
      // @ts-ignore
      balance: value.toFixed(2),
      favorite: faker.datatype.boolean({ probability: 0.2 }),
      giftspace: gs.id,
      brand: brand.id,
      // createdAt / updatedAt default now()
    });
  }

  const createdGiftcards = await db
    .insert(schema.giftcards)
    .values(giftcardRows)
    .returning();

  // giftspacesGiftcards junction (if you intend many-to-many alongside giftcards.giftspace)
  // If giftcards.giftspace is authoritative, consider skipping this to avoid duplication.
  console.log("🔗 Seeding giftspacesGiftcards...");
  const giftspacesGiftcardsRows: Array<
    typeof schema.giftspacesGiftcards.$inferInsert
  > = [];

  // Link each card to 0-2 additional giftspaces for shared spaces, avoiding duplicate primary link
  for (const gc of createdGiftcards) {
    const extraSpaces = randSample(
      createdGiftspaces2.filter((gs) => gs.id !== gc.giftspace),
      faker.number.int({ min: 0, max: 2 })
    );
    for (const gs of extraSpaces) {
      giftspacesGiftcardsRows.push({
        giftspaceId: gs.id,
        giftcardId: gc.id,
      });
    }
  }
  if (giftspacesGiftcardsRows.length) {
    await db.insert(schema.giftspacesGiftcards).values(giftspacesGiftcardsRows);
  }

  // brandsGiftcards junction (if you want discoverability by brand; note giftcards.brand already exists)
  console.log("🔗 Seeding brandsGiftcards...");
  const brandsGiftcardsRows: Array<typeof schema.brandsGiftcards.$inferInsert> =
    [];
  for (const gc of createdGiftcards) {
    const extraBrands = randSample(
      createdBrands.filter((b) => b.id !== gc.brand),
      faker.number.int({ min: 0, max: 1 })
    );
    for (const b of extraBrands) {
      brandsGiftcardsRows.push({
        brandId: b.id,
        giftcardId: gc.id,
      });
    }
  }
  if (brandsGiftcardsRows.length) {
    await db.insert(schema.brandsGiftcards).values(brandsGiftcardsRows);
  }

  console.log("✅ Seed complete.");

  await pool.end();
}

// Run
main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
