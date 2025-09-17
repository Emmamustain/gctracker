import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
// Ensure USER_ROLES is explicitly imported if it's in the users schema file
import { USER_ROLES } from "./schema/users"; // Import users for USER_ROLES type
import * as schema from "./schema"; // Import all exports, including relations
import "dotenv/config";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

// Helper to get a random item from an array
const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Helper to get random items from an array
const getRandomElements = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

async function main() {
  console.log("🌱 Starting seed...");

  // ----------------------------------------------------------------
  // 1. CLEANUP: Delete data in reverse order of creation
  // Make sure to delete tables with foreign keys first!
  // ----------------------------------------------------------------
  console.log("🧹 Cleaning database...");
  await db.delete(schema.curatedShowcases); // New: Added
  await db.delete(schema.curatedCollections); // New: Added
  await db.delete(schema.collectionShowcases);
  await db.delete(schema.reports);
  await db.delete(schema.commentLikes);
  await db.delete(schema.comments);
  await db.delete(schema.downloads);
  await db.delete(schema.purchases);
  await db.delete(schema.showcaseImages);
  await db.delete(schema.showcaseLikes);
  await db.delete(schema.showcaseTags);
  await db.delete(schema.notifications);
  await db.delete(schema.collections);
  await db.delete(schema.showcases);
  await db.delete(schema.userFollows); // New: Added, before users
  await db.delete(schema.users);
  await db.delete(schema.tags);
  await db.delete(schema.categories);

  // ----------------------------------------------------------------
  // 2. SEED INDEPENDENT TABLES (Users, Categories, Tags)
  // ----------------------------------------------------------------
  console.log("👤 Seeding users...");
  const saltRounds = 10;
  const plainPassword =
    process.env.FAKE_USERS_PASSWORD ?? faker.internet.password();
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  const userRoles = Object.values(USER_ROLES); // Get all roles
  const createdUsers = await db
    .insert(schema.users)
    .values(
      Array.from({ length: 50 }, (_, i) => ({
        username: faker.internet.username().toLowerCase(),
        email: `user${i + 1}@example.com`, // Unique emails
        password: hashedPassword,
        displayName: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        avatarUrl: faker.image.avatar(),
        githubUsername: faker.internet.username().toLowerCase(),
        // Assign roles: make 2 users ADMIN, 3 MODERATOR, rest USER
        role:
          i === 0
            ? USER_ROLES.ADMIN
            : i === 1
            ? USER_ROLES.ADMIN
            : i > 1 && i <= 4
            ? USER_ROLES.MODERATOR
            : USER_ROLES.USER,
      }))
    )
    .returning();

  const adminUsers = createdUsers.filter((u) => u.role === USER_ROLES.ADMIN);

  console.log("📚 Seeding categories...");
  const categoryData = [
    { name: "OpenBox", slug: "openbox", color: "#7f8c8d" },
    { name: "HyperLand", slug: "hyperland", color: "#88C0D0" },
    { name: "KDE", slug: "kde", color: "#FABD2F" },
    { name: "I3wm", slug: "i3wm", color: "#3498DB" },
    { name: "DWM", slug: "dwm", color: "#9B59B6" },
    { name: "Xmonad", slug: "xmonad", color: "#F1C40F" },
    { name: "BSPWM", slug: "bspwm", color: "#2ECC71" },
    { name: "KDE Plasma", slug: "kde-plasma", color: "#FE980F" },
  ];
  const createdCategories = await db
    .insert(schema.categories)
    .values(categoryData)
    .returning();

  console.log("🏷️ Seeding tags...");
  const tagData = [
    { name: "Neovim", slug: "neovim", color: "#57A143" },
    { name: "VS Code", slug: "vscode", color: "#007ACC" },
    { name: "Zsh", slug: "zsh", color: "#F15A24" },
    { name: "Fish", slug: "fish", color: "#D4A35D" },
    { name: "Window Managers", slug: "wm", color: "#8E44AD" },
    { name: "Terminals", slug: "terminals", color: "#2C3E50" },
  ];
  const createdTags = await db.insert(schema.tags).values(tagData).returning();

  // ----------------------------------------------------------------
  // 3. SEED DEPENDENT TABLES (Showcases and related)
  // ----------------------------------------------------------------
  console.log("✨ Seeding showcases...");
  const createdShowcases = await db
    .insert(schema.showcases)
    .values(
      Array.from({ length: 100 }, () => {
        const author = getRandomItem(createdUsers);
        const category = getRandomItem(createdCategories);
        const title = faker.lorem.words({ min: 3, max: 7 });
        return {
          userId: author.id,
          categoryId: category.id,
          title: title,
          slug:
            faker.helpers.slugify(title).toLowerCase() +
            "-" +
            faker.string.uuid().slice(0, 8), // Ensure unique slug
          description: faker.lorem.paragraphs(3),
          thumbnailUrl: faker.image.urlPicsumPhotos({
            height: 1080 / 2,
            width: 1920 / 2,
          }),
          zipFileUrl: faker.system.filePath(),
          price: faker.helpers.arrayElement(["0.00", "4.99", "9.99"]),
          osCompatibility: "linux,macos",
          shellCompatibility: "zsh,bash",
          difficultyLevel: faker.helpers.arrayElement([
            "beginner",
            "intermediate",
            "advanced",
          ]),
          isPublished: true,
          publishedAt: faker.date.past(),
        };
      })
    )
    .returning();

  console.log("🖼️ Seeding showcase images, tags, and likes...");
  for (const showcase of createdShowcases) {
    // Add 1-3 extra images per showcase
    await db.insert(schema.showcaseImages).values(
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        showcaseId: showcase.id,
        imageUrl: faker.image.urlPicsumPhotos({
          height: 1080 / 2,
          width: 1920 / 2,
        }),
        altText: "Showcase screenshot",
      }))
    );

    // Add 2-4 tags per showcase
    const tagsToAssign = faker.helpers.arrayElements(createdTags, {
      min: 2,
      max: 4,
    });
    await db.insert(schema.showcaseTags).values(
      tagsToAssign.map((tag) => ({
        showcaseId: showcase.id,
        tagId: tag.id,
      }))
    );

    // Add some likes/dislikes
    const likers = faker.helpers.arrayElements(createdUsers, {
      min: 5,
      max: 20,
    });
    await db.insert(schema.showcaseLikes).values(
      likers.map((user) => ({
        showcaseId: showcase.id,
        userId: user.id,
        isLike: faker.datatype.boolean(0.9), // 90% chance of a like
      }))
    );
  }

  // ----------------------------------------------------------------
  // 4. SEED INTERACTIONS & COMMUNITY TABLES
  // ----------------------------------------------------------------

  console.log("💬 Seeding comments...");
  const createdComments = [];
  for (const showcase of createdShowcases) {
    const commenters = faker.helpers.arrayElements(createdUsers, {
      min: 1,
      max: 5,
    });
    for (const user of commenters) {
      const comment = await db
        .insert(schema.comments)
        .values({
          showcaseId: showcase.id,
          userId: user.id,
          content: faker.lorem.sentence(),
        })
        .returning();
      createdComments.push(comment[0]);
    }
  }

  console.log("↪️ Seeding comment replies...");
  // Make sure createdComments has items before trying to create replies
  if (createdComments.length > 0) {
    for (let i = 0; i < 50; i++) {
      const parentComment = getRandomItem(createdComments);
      const user = getRandomItem(createdUsers);
      await db.insert(schema.comments).values({
        showcaseId: parentComment.showcaseId,
        userId: user.id,
        parentCommentId: parentComment.id,
        content: faker.lorem.sentence(),
      });
    }
  }

  console.log("👍 Seeding comment likes..."); // New: Seed comment likes
  if (createdComments.length > 0) {
    for (const comment of createdComments) {
      const likers = getRandomElements(
        createdUsers,
        faker.number.int({ min: 0, max: 10 })
      );
      for (const user of likers) {
        await db.insert(schema.commentLikes).values({
          commentId: comment.id,
          userId: user.id,
        });
      }
    }
  }

  console.log("⬇️ Seeding downloads..."); // New: Seed downloads
  for (let i = 0; i < 200; i++) {
    await db.insert(schema.downloads).values({
      showcaseId: getRandomItem(createdShowcases).id,
      userId: faker.datatype.boolean(0.8)
        ? getRandomItem(createdUsers).id
        : null, // 80% chance of a registered user
      ipAddress: faker.internet.ipv4(),
      userAgent: faker.internet.userAgent(),
      createdAt: faker.date.past(),
    });
  }

  console.log("💰 Seeding purchases..."); // New: Seed purchases
  for (let i = 0; i < 50; i++) {
    const user = getRandomItem(createdUsers);
    const showcase = getRandomItem(createdShowcases);
    // Only purchase if showcase has a price greater than 0
    if (parseFloat(showcase.price) > 0) {
      await db.insert(schema.purchases).values({
        userId: user.id,
        showcaseId: showcase.id,
        amount: parseFloat(showcase.price).toString(),
        paymentMethod: faker.helpers.arrayElement(["credit_card", "paypal"]),
        paymentId: faker.string.uuid(),
        status: "completed",
        createdAt: faker.date.recent(),
      });
    }
  }

  console.log("🔔 Seeding notifications..."); // New: Seed notifications
  for (let i = 0; i < 150; i++) {
    await db.insert(schema.notifications).values({
      userId: getRandomItem(createdUsers).id,
      type: faker.helpers.arrayElement([
        "comment",
        "like",
        "follow",
        "purchase",
      ]),
      title: faker.lorem.sentence(3),
      message: faker.lorem.sentence(10),
      isRead: faker.datatype.boolean(0.7), // 70% chance of being read
      createdAt: faker.date.past(),
    });
  }

  console.log("🗂️ Seeding collections...");
  const createdCollections = [];
  for (const user of createdUsers) {
    if (faker.datatype.boolean(0.3)) {
      // 30% of users will have a collection
      const collection = await db
        .insert(schema.collections)
        .values({
          userId: user.id,
          name: faker.lorem.words(3),
          description: faker.lorem.sentence(),
          isPublic: faker.datatype.boolean(),
        })
        .returning();
      createdCollections.push(collection[0]);

      const showcasesToCollect = faker.helpers.arrayElements(createdShowcases, {
        min: 3,
        max: 10,
      });
      await db.insert(schema.collectionShowcases).values(
        showcasesToCollect.map((showcase) => ({
          collectionId: collection[0].id,
          showcaseId: showcase.id,
        }))
      );
    }
  }

  console.log("🐛 Seeding reports..."); // New: Seed reports
  for (let i = 0; i < 30; i++) {
    const reporter = getRandomItem(createdUsers);
    const reportType = faker.helpers.arrayElement(["showcase", "comment"]);
    let showcaseId = null;
    let commentId = null;

    if (reportType === "showcase" && createdShowcases.length > 0) {
      showcaseId = getRandomItem(createdShowcases).id;
    } else if (reportType === "comment" && createdComments.length > 0) {
      commentId = getRandomItem(createdComments).id;
    }

    if (showcaseId || commentId) {
      // Only create if there's something to report
      await db.insert(schema.reports).values({
        reporterId: reporter.id,
        showcaseId: showcaseId,
        commentId: commentId,
        reason: faker.helpers.arrayElement([
          "Spam",
          "Inappropriate Content",
          "Copyright Infringement",
          "Broken Link",
        ]),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(["pending", "reviewed"]),
        createdAt: faker.date.past(),
      });
    }
  }

  console.log("🤝 Seeding user follows..."); // New: Seed user follows
  for (let i = 0; i < 100; i++) {
    const follower = getRandomItem(createdUsers);
    const following = getRandomItem(createdUsers);
    if (follower.id !== following.id) {
      // Users cannot follow themselves
      await db
        .insert(schema.userFollows)
        .values({
          followerId: follower.id,
          followingId: following.id,
          createdAt: faker.date.past(),
        })
        .onConflictDoNothing(); // Prevent duplicate follows
    }
  }

  console.log("⭐ Seeding curated showcases..."); // New: Seed curated showcases
  if (adminUsers.length > 0 && createdShowcases.length > 0) {
    const adminUser = getRandomItem(adminUsers); // Use an admin user
    const showcasesToCurate = getRandomElements(
      createdShowcases,
      faker.number.int({ min: 20, max: 40 })
    );
    let positionCounter = 1;
    for (const showcase of showcasesToCurate) {
      await db.insert(schema.curatedShowcases).values({
        userId: adminUser.id,
        showcaseId: showcase.id,
        title: `Curated: ${showcase.title}`,
        thumbnailUrl: showcase.thumbnailUrl,
        position: positionCounter++,
        isVisible: true,
        createdAt: faker.date.recent(),
      });
    }
  }

  console.log("💎 Seeding curated collections..."); // New: Seed curated collections
  if (adminUsers.length > 0 && createdCollections.length > 0) {
    const adminUser = getRandomItem(adminUsers); // Use an admin user
    const collectionsToCurate = getRandomElements(
      createdCollections,
      faker.number.int({ min: 2, max: 5 })
    );
    let positionCounter = 1;
    for (const collection of collectionsToCurate) {
      await db.insert(schema.curatedCollections).values({
        userId: adminUser.id,
        collectionId: collection.id,
        title: `Curated Collection: ${collection.name}`,
        position: positionCounter++,
        isVisible: true,
        createdAt: faker.date.recent(),
      });
    }
  }

  await pool.end();
  console.log("✅ Seed completed successfully!");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
