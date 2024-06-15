-- CreateTable
CREATE TABLE "Creator" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    "amount" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "option_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "pending_amount" INTEGER NOT NULL,
    "locked_amount" INTEGER NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Creator_address_key" ON "Creator"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_address_key" ON "Worker"("address");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
