import { relations } from "drizzle-orm";
import { userFollows, users } from "./users";
import {
  showcases,
  showcaseImages,
  showcaseTags,
  showcaseLikes,
} from "./showcases";
import { categories, tags } from "./content";
import { commentLikes, comments, downloads, purchases } from "./interactions";
import { collections, collectionShowcases, reports } from "./community";
import { notifications } from "./notifications";
import { curatedCollections, curatedShowcases } from "./curations";

export const usersRelations = relations(users, ({ many }) => ({
  showcases: many(showcases),
  comments: many(comments),
  collections: many(collections),
  notifications: many(notifications),
  reports: many(reports),
}));

export const showcasesRelations = relations(showcases, ({ one, many }) => ({
  user: one(users, {
    fields: [showcases.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [showcases.categoryId],
    references: [categories.id],
  }),
  images: many(showcaseImages),
  showcaseTags: many(showcaseTags),
  likes: many(showcaseLikes),
  comments: many(comments),
  purchases: many(purchases),
  downloads: many(downloads),
  collectionShowcases: many(collectionShowcases),
  reports: many(reports),
}));

export const showcaseImagesRelations = relations(showcaseImages, ({ one }) => ({
  showcase: one(showcases, {
    fields: [showcaseImages.showcaseId],
    references: [showcases.id],
  }),
}));

export const showcaseTagsRelations = relations(showcaseTags, ({ one }) => ({
  showcase: one(showcases, {
    fields: [showcaseTags.showcaseId],
    references: [showcases.id],
  }),
  tag: one(tags, {
    fields: [showcaseTags.tagId],
    references: [tags.id],
  }),
}));

export const showcaseLikesRelations = relations(showcaseLikes, ({ one }) => ({
  showcase: one(showcases, {
    fields: [showcaseLikes.showcaseId],
    references: [showcases.id],
  }),
  user: one(users, {
    fields: [showcaseLikes.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  showcases: many(showcases),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  showcaseTags: many(showcaseTags),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
  collectionShowcases: many(collectionShowcases),
}));

export const collectionShowcasesRelations = relations(
  collectionShowcases,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionShowcases.collectionId],
      references: [collections.id],
    }),
    showcase: one(showcases, {
      fields: [collectionShowcases.showcaseId],
      references: [showcases.id],
    }),
  })
);

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
  }),
  showcase: one(showcases, {
    fields: [reports.showcaseId],
    references: [showcases.id],
  }),
  comment: one(comments, {
    fields: [reports.commentId],
    references: [comments.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  showcase: one(showcases, {
    fields: [comments.showcaseId],
    references: [showcases.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: "replies",
  }),
  replies: many(comments, { relationName: "replies" }),
  likes: many(commentLikes),
  reports: many(reports),
}));

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
  user: one(users, {
    fields: [commentLikes.userId],
    references: [users.id],
  }),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
  showcase: one(showcases, {
    fields: [purchases.showcaseId],
    references: [showcases.id],
  }),
}));

export const downloadsRelations = relations(downloads, ({ one }) => ({
  user: one(users, {
    fields: [downloads.userId],
    references: [users.id],
  }),
  showcase: one(showcases, {
    fields: [downloads.showcaseId],
    references: [showcases.id],
  }),
}));

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, {
    fields: [userFollows.followerId],
    references: [users.id],
    relationName: "followers",
  }),
  following: one(users, {
    fields: [userFollows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));

export const curatedShowcasesRelations = relations(
  curatedShowcases,
  ({ one }) => ({
    user: one(users, {
      fields: [curatedShowcases.userId],
      references: [users.id],
    }),
    showcase: one(showcases, {
      fields: [curatedShowcases.showcaseId],
      references: [showcases.id],
    }),
  })
);

export const curatedCollectionsRelations = relations(
  curatedCollections,
  ({ one }) => ({
    user: one(users, {
      fields: [curatedCollections.userId],
      references: [users.id],
    }),
    collection: one(collections, {
      fields: [curatedCollections.collectionId],
      references: [collections.id],
    }),
  })
);
