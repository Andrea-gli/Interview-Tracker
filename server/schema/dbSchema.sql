DROP TABLE applications CASCADE;
DROP TABLE job_seekers CASCADE;
DROP TABLE steps CASCADE;
DROP TABLE app_statuses CASCADE;

CREATE TABLE "applications" (
	"id" serial NOT NULL,
	"job_seeker_id" integer NOT NULL,
	"company" varchar(255) NOT NULL,
	"job_title" varchar(255) NOT NULL,
	"how_applied" varchar(255),
	"date_applied" DATE,
	"location" varchar(255),
	"found_by" varchar(255) NOT NULL,
	"notes" varchar(255),
	"app_status" integer NOT NULL,
	CONSTRAINT "applications_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "job_seekers" (
	"id" serial NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"cur_salary" integer,
	"dob" DATE,
	CONSTRAINT "job_seekers_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "app_statuses" (
  "id" serial NOT NULL,
	"app_status" varchar(255) NOT NULL,
	CONSTRAINT "app_statuses_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "steps" (
	"id" serial NOT NULL,
	"app_id" integer NOT NULL,
	"date" DATE NOT NULL,
	"step_type" varchar(255) NOT NULL,
	"contact_name" varchar(255) NOT NULL,
	"contact_role" varchar(255) NOT NULL,
	"contact" varchar(255) NOT NULL,
	"notes" varchar(255),
	CONSTRAINT "steps_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE "applications" ADD CONSTRAINT "applications_fk0" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id");
ALTER TABLE "applications" ADD CONSTRAINT "applications_fk1" FOREIGN KEY ("app_status") REFERENCES "app_statuses"("id");


ALTER TABLE "steps" ADD CONSTRAINT "steps_fk0" FOREIGN KEY ("app_id") REFERENCES "applications"("id") ON DELETE CASCADE;







