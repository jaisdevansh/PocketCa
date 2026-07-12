CREATE TABLE "bank_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"bank_name" varchar(100) NOT NULL,
	"sender_regex" text NOT NULL,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "parser_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" varchar(50) NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"description" text,
	"active" boolean DEFAULT true,
	CONSTRAINT "parser_versions_version_unique" UNIQUE("version")
);
--> statement-breakpoint
CREATE TABLE "regex_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" varchar(50) NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"bank_template_id" uuid NOT NULL,
	"pattern" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "sms_duplicate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"sms_id" uuid NOT NULL,
	"duplicate_of" uuid NOT NULL,
	"similarity_score" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE "sms_failures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"sms_id" uuid NOT NULL,
	"reason" text,
	"parser_version" varchar(50),
	"resolved" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "sms_unknown" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"sms_id" uuid NOT NULL,
	"confidence" numeric(5, 2),
	"reason" text,
	"manual_review_required" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "sms_logs" ADD COLUMN "sender" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "sms_logs" ADD COLUMN "raw_content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "bank_templates" ADD CONSTRAINT "bank_templates_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parser_versions" ADD CONSTRAINT "parser_versions_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regex_versions" ADD CONSTRAINT "regex_versions_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regex_versions" ADD CONSTRAINT "regex_versions_bank_template_id_bank_templates_id_fk" FOREIGN KEY ("bank_template_id") REFERENCES "public"."bank_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_duplicate" ADD CONSTRAINT "sms_duplicate_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_duplicate" ADD CONSTRAINT "sms_duplicate_sms_id_sms_logs_id_fk" FOREIGN KEY ("sms_id") REFERENCES "public"."sms_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_duplicate" ADD CONSTRAINT "sms_duplicate_duplicate_of_sms_logs_id_fk" FOREIGN KEY ("duplicate_of") REFERENCES "public"."sms_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_failures" ADD CONSTRAINT "sms_failures_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_failures" ADD CONSTRAINT "sms_failures_sms_id_sms_logs_id_fk" FOREIGN KEY ("sms_id") REFERENCES "public"."sms_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_unknown" ADD CONSTRAINT "sms_unknown_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_unknown" ADD CONSTRAINT "sms_unknown_sms_id_sms_logs_id_fk" FOREIGN KEY ("sms_id") REFERENCES "public"."sms_logs"("id") ON DELETE no action ON UPDATE no action;