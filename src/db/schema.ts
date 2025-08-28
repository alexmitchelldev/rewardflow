import { pgTable, text, integer, timestamp, uuid, boolean, decimal } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

// Businesses table
export const businesses = pgTable("businesses", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone"),
  address_line1: text("address_line1"),
  address_line2: text("address_line2"),
  address_city: text("address_city"),
  address_state: text("address_state"),
  address_zip_code: text("address_zip_code"),
  address_country: text("address_country"),
  logoUrl: text("logo_url"),
  description: text("description"),
  website: text("website"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products/Loyalty Programs table
export const products = pgTable("products", {
  id: integer("id").primaryKey(),
  businessId: uuid("business_id")
    .references(() => businesses.id)
    .notNull(),
  name: text("name").notNull(),
  productTypeId: integer("product_type_id").references(() => productTypes.id),
  description: text("description"),
  rules: text("rules"), // JSON string with reward rules
  maxPoints: integer("max_points").default(10), // For stamp cards
  pointsPerPurchase: integer("points_per_purchase").default(1),
  rewardValue: decimal("reward_value", { precision: 10, scale: 2 }), // Reward amount
  backgroundColor: text("background_color").default("#4F46E5"),
  textColor: text("text_color").default("#FFFFFF"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productTypes = pgTable("product_types", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(), // 'stamp', 'cashback', 'points'
});

// Clients table
export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id")
    .references(() => businesses.id)
    .notNull(),
  nameFirst: text("name_first").notNull(),
  nameLast: text("name_last").notNull(),
  email: text("email"),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  isAnonymous: boolean("is_anonymous").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loyalty Cards table
export const cards = pgTable("cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .references(() => clients.id)
    .notNull(),
  qrCode: text("qr_code").notNull().unique(),
  walletPassUrl: text("wallet_pass_url"),
  appleWalletSerialNumber: text("apple_wallet_serial_number"),
  googleWalletObjectId: text("google_wallet_object_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Rewards/Points balance table
export const rewards = pgTable("rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardId: uuid("card_id")
    .references(() => cards.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  currentPoints: integer("current_points").default(0),
  totalPointsEarned: integer("total_points_earned").default(0),
  totalRewardsRedeemed: integer("total_rewards_redeemed").default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions/Scans table
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardId: uuid("card_id")
    .references(() => cards.id)
    .notNull(),
  businessId: uuid("business_id")
    .references(() => businesses.id)
    .notNull(),
  productTypeId: integer("product_type_id")
    .references(() => productTypes.id)
    .notNull(),
  transactionTypeId: integer("transaction_type_id")
    .references(() => transactionTypes.id)
    .notNull(),
  points: integer("points").notNull(),
  description: text("description"),
  purchaseAmount: decimal("purchase_amount", { precision: 10, scale: 2 }),
  scannedBy: uuid("scanned_by"), // Business user who performed the scan
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactionTypes = pgTable("transaction_types", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(), // 'earn', 'redeem'
});

// QR Codes for business sign-up
export const signupQrCodes = pgTable("signup_qr_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id")
    .references(() => businesses.id)
    .notNull(),
  productId: integer("product_id").references(() => products.id),
  qrCode: text("qr_code").notNull().unique(),
  deepLinkUrl: text("deep_link_url").notNull(),
  scansCount: integer("scans_count").default(0),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Business staff/users table
export const businessStaff = pgTable("business_staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id")
    .references(() => businesses.id)
    .notNull(),
  userId: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  role: text("role").default("staff"), // 'owner', 'admin', 'staff'
  privilegeLevel: integer("privilege_level").references(() => privileges.privilegeLevel),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const privileges = pgTable("privileges", {
  privilegeLevel: integer("privilege_level").primaryKey(),
  label: text("label"),
});
