export type ShariahStatus = "Likely Halal" | "Doubtful" | "Avoid" | "Needs Manual Review";
export type Market = "India" | "US";
export type RiskLevel = "Low" | "Medium" | "High";

export interface FinancialRatios {
  debtRatio?: number | null;
  interestIncomeRatio?: number | null;
  cashAndInterestBearingRatio?: number | null;
}

export interface StockScreeningInput {
  companyName: string;
  ticker: string;
  market: Market;
  sector: string;
  businessActivity: string;
  ratios?: FinancialRatios | null;
  lastReviewed: string;
}

export interface StockScreeningResult extends StockScreeningInput {
  status: ShariahStatus;
  riskLevel: RiskLevel;
  reasons: string[];
  demoData: boolean;
}

const prohibitedActivities = [
  "conventional banking",
  "interest-based lending",
  "alcohol",
  "gambling",
  "pork",
  "adult entertainment",
  "tobacco",
  "conventional insurance",
  "weapons manufacturing",
  "high-interest finance",
];

const thresholds = {
  debtRatio: 33,
  interestIncomeRatio: 5,
  cashAndInterestBearingRatio: 33,
};

export function screenStock(input: StockScreeningInput): StockScreeningResult {
  const activity = `${input.sector} ${input.businessActivity}`.toLowerCase();
  const reasons: string[] = [];

  const prohibitedMatch = prohibitedActivities.find((term) => activity.includes(term));
  if (prohibitedMatch) {
    return {
      ...input,
      status: "Avoid",
      riskLevel: "High",
      reasons: [`Core business appears connected to ${prohibitedMatch}.`],
      demoData: true,
    };
  }

  const ratios = input.ratios || {};
  const hasCompleteRatios =
    typeof ratios.debtRatio === "number" &&
    typeof ratios.interestIncomeRatio === "number" &&
    typeof ratios.cashAndInterestBearingRatio === "number";

  if (!hasCompleteRatios) {
    return {
      ...input,
      status: "Needs Manual Review",
      riskLevel: "Medium",
      reasons: ["Reliable financial ratio data is not available in this demo dataset."],
      demoData: true,
    };
  }

  if ((ratios.debtRatio || 0) > thresholds.debtRatio) {
    reasons.push(`Debt ratio is above the ${thresholds.debtRatio}% demo threshold.`);
  }
  if ((ratios.interestIncomeRatio || 0) > thresholds.interestIncomeRatio) {
    reasons.push(`Interest income concern is above the ${thresholds.interestIncomeRatio}% demo threshold.`);
  }
  if ((ratios.cashAndInterestBearingRatio || 0) > thresholds.cashAndInterestBearingRatio) {
    reasons.push(`Cash and interest-bearing securities exceed the ${thresholds.cashAndInterestBearingRatio}% demo threshold.`);
  }

  if (reasons.length === 0) {
    return {
      ...input,
      status: "Likely Halal",
      riskLevel: "Low",
      reasons: [
        "Core activity appears permissible in this demo dataset.",
        "Demo financial ratios are below the basic screening thresholds.",
      ],
      demoData: true,
    };
  }

  return {
    ...input,
    status: "Doubtful",
    riskLevel: reasons.length > 1 ? "High" : "Medium",
    reasons,
    demoData: true,
  };
}

export const demoStocks: StockScreeningInput[] = [
  {
    companyName: "Tata Consultancy Services",
    ticker: "TCS",
    market: "India",
    sector: "Information Technology",
    businessActivity: "IT services, consulting, enterprise software and digital transformation.",
    ratios: { debtRatio: 2, interestIncomeRatio: 1, cashAndInterestBearingRatio: 18 },
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Infosys",
    ticker: "INFY",
    market: "India",
    sector: "Information Technology",
    businessActivity: "Technology consulting, software services, cloud, and business process services.",
    ratios: { debtRatio: 1, interestIncomeRatio: 2, cashAndInterestBearingRatio: 22 },
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "HCL Tech",
    ticker: "HCLTECH",
    market: "India",
    sector: "Information Technology",
    businessActivity: "IT services, engineering services, cloud, and software support.",
    ratios: { debtRatio: 4, interestIncomeRatio: 1, cashAndInterestBearingRatio: 16 },
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Wipro",
    ticker: "WIPRO",
    market: "India",
    sector: "Information Technology",
    businessActivity: "IT consulting, digital services, cybersecurity, and cloud solutions.",
    ratios: { debtRatio: 5, interestIncomeRatio: 1, cashAndInterestBearingRatio: 20 },
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Persistent Systems",
    ticker: "PERSISTENT",
    market: "India",
    sector: "Information Technology",
    businessActivity: "Software engineering, digital product development, and IT services.",
    ratios: { debtRatio: 3, interestIncomeRatio: 1, cashAndInterestBearingRatio: 19 },
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Tata Elxsi",
    ticker: "TATAELXSI",
    market: "India",
    sector: "Design and Technology",
    businessActivity: "Product design, embedded systems, and digital technology services.",
    ratios: { debtRatio: 1, interestIncomeRatio: 1, cashAndInterestBearingRatio: 21 },
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Reliance Industries",
    ticker: "RELIANCE",
    market: "India",
    sector: "Conglomerate",
    businessActivity: "Energy, retail, telecom, media, and diversified businesses.",
    ratios: null,
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Tata Motors",
    ticker: "TATAMOTORS",
    market: "India",
    sector: "Automobiles",
    businessActivity: "Passenger vehicles, commercial vehicles, financing subsidiaries, and global auto brands.",
    ratios: null,
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Adani Enterprises",
    ticker: "ADANIENT",
    market: "India",
    sector: "Diversified",
    businessActivity: "Infrastructure, trading, resources, energy, airports, and emerging businesses.",
    ratios: null,
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Apple",
    ticker: "AAPL",
    market: "US",
    sector: "Consumer Technology",
    businessActivity: "Devices, software, services, payments ecosystem, and digital subscriptions.",
    ratios: null,
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Microsoft",
    ticker: "MSFT",
    market: "US",
    sector: "Software and Cloud",
    businessActivity: "Software, cloud infrastructure, enterprise services, gaming, and AI products.",
    ratios: null,
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Nvidia",
    ticker: "NVDA",
    market: "US",
    sector: "Semiconductors",
    businessActivity: "GPUs, data center chips, AI infrastructure, software platforms, and hardware systems.",
    ratios: null,
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Amazon",
    ticker: "AMZN",
    market: "US",
    sector: "E-commerce and Cloud",
    businessActivity: "Marketplace, cloud infrastructure, streaming, logistics, advertising, and subscriptions.",
    ratios: null,
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Alphabet",
    ticker: "GOOGL",
    market: "US",
    sector: "Internet Services",
    businessActivity: "Search, advertising, cloud, video platforms, Android, and AI products.",
    ratios: null,
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Demo Conventional Bank",
    ticker: "BANKDEMO",
    market: "US",
    sector: "Conventional Banking",
    businessActivity: "Conventional banking and interest-based lending.",
    ratios: { debtRatio: 90, interestIncomeRatio: 70, cashAndInterestBearingRatio: 80 },
    lastReviewed: "2026-06-18",
  },
  {
    companyName: "Demo Alcohol & Gambling Group",
    ticker: "AVOIDDEMO",
    market: "India",
    sector: "Alcohol and Gambling",
    businessActivity: "Alcohol production and gambling entertainment.",
    ratios: { debtRatio: 20, interestIncomeRatio: 2, cashAndInterestBearingRatio: 10 },
    lastReviewed: "2026-06-18",
  },
];

export function getScreenedDemoStocks() {
  return demoStocks.map(screenStock);
}
