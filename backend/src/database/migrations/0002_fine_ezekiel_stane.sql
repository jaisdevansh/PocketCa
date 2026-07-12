CREATE TABLE "email_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"email_log_id" uuid NOT NULL,
	"file_name" varchar(255),
	"mime_type" varchar(255),
	"s3_key" varchar(255),
	"parsed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "email_failures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"email_log_id" uuid NOT NULL,
	"reason" text,
	"parser_version" varchar(50),
	"resolved" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "email_parser_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"email_log_id" uuid NOT NULL,
	"raw_html_length" integer,
	"raw_text_length" integer,
	"execution_time_ms" integer,
	"error_details" text
);
--> statement-breakpoint
CREATE TABLE "email_unknown" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"email_log_id" uuid NOT NULL,
	"confidence" numeric(5, 2),
	"reason" text,
	"manual_review_required" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "gmail_sync_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"connection_id" uuid NOT NULL,
	"sync_type" varchar(50) NOT NULL,
	"history_id" varchar(255),
	"status" varchar(50) DEFAULT 'COMPLETED',
	"messages_fetched" integer DEFAULT 0,
	"error_details" text
);
--> statement-breakpoint
CREATE TABLE "provider_aliases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"provider_template_id" uuid NOT NULL,
	"sender_email" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"provider_name" varchar(100) NOT NULL,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "statement_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"attachment_id" uuid NOT NULL,
	"statement_type" varchar(50),
	"total_amount_due" numeric(12, 2),
	"minimum_amount_due" numeric(12, 2)
);
--> statement-breakpoint
ALTER TABLE "email_attachments" ADD CONSTRAINT "email_attachments_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_attachments" ADD CONSTRAINT "email_attachments_email_log_id_email_logs_id_fk" FOREIGN KEY ("email_log_id") REFERENCES "public"."email_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_failures" ADD CONSTRAINT "email_failures_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_failures" ADD CONSTRAINT "email_failures_email_log_id_email_logs_id_fk" FOREIGN KEY ("email_log_id") REFERENCES "public"."email_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_parser_logs" ADD CONSTRAINT "email_parser_logs_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_parser_logs" ADD CONSTRAINT "email_parser_logs_email_log_id_email_logs_id_fk" FOREIGN KEY ("email_log_id") REFERENCES "public"."email_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_unknown" ADD CONSTRAINT "email_unknown_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_unknown" ADD CONSTRAINT "email_unknown_email_log_id_email_logs_id_fk" FOREIGN KEY ("email_log_id") REFERENCES "public"."email_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gmail_sync_logs" ADD CONSTRAINT "gmail_sync_logs_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gmail_sync_logs" ADD CONSTRAINT "gmail_sync_logs_connection_id_email_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."email_connections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_aliases" ADD CONSTRAINT "provider_aliases_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_aliases" ADD CONSTRAINT "provider_aliases_provider_template_id_provider_templates_id_fk" FOREIGN KEY ("provider_template_id") REFERENCES "public"."provider_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_templates" ADD CONSTRAINT "provider_templates_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_metadata" ADD CONSTRAINT "statement_metadata_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_metadata" ADD CONSTRAINT "statement_metadata_attachment_id_email_attachments_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."email_attachments"("id") ON DELETE no action ON UPDATE no action;