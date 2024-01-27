// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `pa4bf_${name}`);

export const picture = createTable("picture", {
  id: serial("picture_id").primaryKey(),
  metadata: text("metadata"),
});

export const group = createTable("group", {
  id: serial("group_id").primaryKey(),
  inviteCode: text("invite_code").notNull(),
  displayName: text("display_name").notNull(),
});

export const userPicture = createTable(
  "user_picture",
  {
    userId: text("user_id").notNull(),
    pictureId: integer("picture_id")
      .notNull()
      .references(() => picture.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.pictureId] }),
  }),
);

// export const userPictureRelations = relations(userPicture, ({ many }) => ({
//   pictures: many(picture),
// }));

export const groupPicture = createTable(
  "group_picture",
  {
    groupId: integer("group_id")
      .notNull()
      .references(() => group.id),
    pictureId: integer("picture_id")
      .notNull()
      .references(() => picture.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupId, t.pictureId] }),
  }),
);

// export const groupPictureRelations = relations(groupPicture, ({ many }) => ({
//   pictures: many(picture),
// }));

// TODO: rename
export const usersToGroupsRelations = relations(groupPicture, ({ one }) => ({
  group: one(group, {
    fields: [groupPicture.groupId],
    references: [group.id],
  }),
  picture: one(picture, {
    fields: [groupPicture.groupId],
    references: [picture.id],
  }),
}));

export const groupMembership = createTable(
  "group_membership",
  {
    groupId: integer("group_id")
      .notNull()
      .references(() => group.id),
    userId: text("user_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupId, t.userId] }),
  }),
);

export const groupOwnership = createTable(
  "group_ownership",
  {
    groupId: integer("group_id")
      .notNull()
      .references(() => group.id),
    userId: text("user_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupId, t.userId] }),
  }),
);
