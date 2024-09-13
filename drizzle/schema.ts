import { relations, sql } from 'drizzle-orm';
import { pgTable, serial, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

export const User = pgTable('user', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
export type User = typeof User.$inferSelect;
export type UserInsert = typeof User.$inferInsert;

export const UserRelations = relations(User, ({ many }) => ({
    sessions: many(Session),
}));

export const Session = pgTable('session', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => User.id),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
export type Session = typeof Session.$inferSelect;
export type SessionInsert = typeof Session.$inferInsert;

export const SessionRelations = relations(Session, ({ one }) => ({
    user: one(User, {
        fields: [Session.userId],
        references: [User.id],
    })
}));
