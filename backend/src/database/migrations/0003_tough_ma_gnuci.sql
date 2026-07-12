CREATE TYPE "public"."budget_period" AS ENUM('WEEKLY', 'MONTHLY', 'YEARLY');--> statement-breakpoint
CREATE TABLE "emi_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"emi_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"payment_date" timestamp with time zone NOT NULL,
	"amount_paid" numeric(15, 2) NOT NULL,
	"principal_component" numeric(15, 2),
	"interest_component" numeric(15, 2)
);
--> statement-breakpoint
CREATE TABLE "subscription_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"subscription_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"billing_date" timestamp with time zone NOT NULL,
	"amount_paid" numeric(15, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budget_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"budget_id" uuid NOT NULL,
	"period_start" timestamp with time zone NOT NULL,
	"period_end" timestamp with time zone NOT NULL,
	"amount_budgeted" numeric(15, 2) NOT NULL,
	"amount_spent" numeric(15, 2) DEFAULT '0.00',
	"currency" varchar(3) DEFAULT 'INR',
	"exceeded" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "category_monthly_statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"user_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"stat_month" varchar(7) NOT NULL,
	"total_spent" numeric(15, 2) DEFAULT '0.00'
);
--> statement-breakpoint
CREATE TABLE "daily_statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"user_id" uuid NOT NULL,
	"stat_date" date NOT NULL,
	"total_income" numeric(15, 2) DEFAULT '0.00',
	"total_expense" numeric(15, 2) DEFAULT '0.00',
	"transaction_count" integer DEFAULT 0,
	"currency" varchar(3) DEFAULT 'INR'
);
--> statement-breakpoint
CREATE TABLE "merchant_monthly_statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"user_id" uuid NOT NULL,
	"merchant_id" uuid NOT NULL,
	"stat_month" varchar(7) NOT NULL,
	"total_spent" numeric(15, 2) DEFAULT '0.00'
);
--> statement-breakpoint
CREATE TABLE "monthly_statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"user_id" uuid NOT NULL,
	"stat_month" varchar(7) NOT NULL,
	"total_income" numeric(15, 2) DEFAULT '0.00',
	"total_expense" numeric(15, 2) DEFAULT '0.00',
	"transaction_count" integer DEFAULT 0,
	"currency" varchar(3) DEFAULT 'INR'
);
--> statement-breakpoint
CREATE TABLE "yearly_statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"user_id" uuid NOT NULL,
	"stat_year" varchar(4) NOT NULL,
	"total_income" numeric(15, 2) DEFAULT '0.00',
	"total_expense" numeric(15, 2) DEFAULT '0.00',
	"transaction_count" integer DEFAULT 0,
	"currency" varchar(3) DEFAULT 'INR'
);
--> statement-breakpoint
ALTER TABLE "emi_history" ADD CONSTRAINT "emi_history_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emi_history" ADD CONSTRAINT "emi_history_emi_id_emis_id_fk" FOREIGN KEY ("emi_id") REFERENCES "public"."emis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emi_history" ADD CONSTRAINT "emi_history_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_history" ADD CONSTRAINT "subscription_history_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_history" ADD CONSTRAINT "subscription_history_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_history" ADD CONSTRAINT "subscription_history_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_history" ADD CONSTRAINT "budget_history_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_history" ADD CONSTRAINT "budget_history_budget_id_budgets_id_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_monthly_statistics" ADD CONSTRAINT "category_monthly_statistics_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_monthly_statistics" ADD CONSTRAINT "category_monthly_statistics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_monthly_statistics" ADD CONSTRAINT "category_monthly_statistics_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_statistics" ADD CONSTRAINT "daily_statistics_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_statistics" ADD CONSTRAINT "daily_statistics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchant_monthly_statistics" ADD CONSTRAINT "merchant_monthly_statistics_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchant_monthly_statistics" ADD CONSTRAINT "merchant_monthly_statistics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchant_monthly_statistics" ADD CONSTRAINT "merchant_monthly_statistics_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_statistics" ADD CONSTRAINT "monthly_statistics_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_statistics" ADD CONSTRAINT "monthly_statistics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yearly_statistics" ADD CONSTRAINT "yearly_statistics_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yearly_statistics" ADD CONSTRAINT "yearly_statistics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;