-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "discom" TEXT,
    "consumerType" TEXT NOT NULL,
    "voltageLevel" TEXT NOT NULL,
    "sanctionedLoadKva" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumptionProfile" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "monthlyConsumptionKwh" DOUBLE PRECISION NOT NULL,
    "tariffRsPerKwh" DOUBLE PRECISION NOT NULL,
    "operatingHoursPerDay" DOUBLE PRECISION NOT NULL,
    "renewableTargetPct" DOUBLE PRECISION NOT NULL,
    "rooftopAreaSqft" DOUBLE PRECISION NOT NULL,
    "groundAreaAcres" DOUBLE PRECISION,
    "considerGround" BOOLEAN NOT NULL DEFAULT false,
    "considerWind" BOOLEAN NOT NULL DEFAULT false,
    "includeOpenAccess" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsumptionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TariffProfile" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "consumerType" TEXT NOT NULL,
    "voltageLevel" TEXT NOT NULL,
    "tariffRsPerKwh" DOUBLE PRECISION NOT NULL,
    "crossSubsidySurcharge" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "lastVerified" TIMESTAMP(3),
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TariffProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenAccessCharge" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "voltageLevel" TEXT NOT NULL,
    "wheelingLossPct" DOUBLE PRECISION NOT NULL,
    "wheelingChargeRsPerKwh" DOUBLE PRECISION NOT NULL,
    "openAccessThresholdKva" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "lastVerified" TIMESTAMP(3),
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenAccessCharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenAccessScenario" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenAccessScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioResult" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "deliveredCostRsPerKwh" DOUBLE PRECISION NOT NULL,
    "annualCostRs" DOUBLE PRECISION NOT NULL,
    "annualSavingsRs" DOUBLE PRECISION NOT NULL,
    "savingsPct" DOUBLE PRECISION NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScenarioResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentModel" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "capexRs" DOUBLE PRECISION NOT NULL,
    "debtEquityRatio" DOUBLE PRECISION NOT NULL,
    "debtRatePct" DOUBLE PRECISION NOT NULL,
    "debtTenorYears" INTEGER NOT NULL,
    "omEscalationPct" DOUBLE PRECISION NOT NULL,
    "depreciationPct" DOUBLE PRECISION NOT NULL,
    "taxRatePct" DOUBLE PRECISION NOT NULL,
    "discountRatePct" DOUBLE PRECISION NOT NULL,
    "projectIrrPct" DOUBLE PRECISION,
    "equityIrrPct" DOUBLE PRECISION,
    "simplePaybackYrs" DOUBLE PRECISION,
    "dscrYear1" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "recommendedStrategy" TEXT NOT NULL,
    "expectedSavingsRs" DOUBLE PRECISION NOT NULL,
    "assumptions" TEXT[],
    "risks" TEXT[],
    "dataGaps" TEXT[],
    "nextActions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityBill" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "billingPeriodStart" TIMESTAMP(3),
    "billingPeriodEnd" TIMESTAMP(3),
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectricityBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityBillLineItem" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "unit" TEXT,
    "confidence" DOUBLE PRECISION,
    "source" TEXT,
    "page" INTEGER,

    CONSTRAINT "ElectricityBillLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "city" TEXT,
    "industry" TEXT,
    "consumption" TEXT,
    "tariff" TEXT,
    "requirement" TEXT,
    "message" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TariffProfile_state_consumerType_voltageLevel_key" ON "TariffProfile"("state", "consumerType", "voltageLevel");

-- CreateIndex
CREATE UNIQUE INDEX "OpenAccessCharge_state_voltageLevel_key" ON "OpenAccessCharge"("state", "voltageLevel");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentModel_scenarioId_key" ON "InvestmentModel"("scenarioId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumptionProfile" ADD CONSTRAINT "ConsumptionProfile_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenAccessScenario" ADD CONSTRAINT "OpenAccessScenario_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioResult" ADD CONSTRAINT "ScenarioResult_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "OpenAccessScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentModel" ADD CONSTRAINT "InvestmentModel_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "OpenAccessScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectricityBill" ADD CONSTRAINT "ElectricityBill_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectricityBillLineItem" ADD CONSTRAINT "ElectricityBillLineItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "ElectricityBill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
