export type ShariahStatus = "Likely Halal" | "Doubtful" | "Avoid" | "Needs Manual Review";
export type Country =
  | "India"
  | "United States"
  | "United Kingdom"
  | "Saudi Arabia"
  | "UAE"
  | "Malaysia"
  | "Indonesia"
  | "Qatar"
  | "Kuwait"
  | "Canada"
  | "Australia";
export type RiskLevel = "Low" | "Medium" | "High";

export interface FinancialRatios {
  debtRatio?: number | null;
  interestIncomeRatio?: number | null;
  cashAndInterestBearingRatio?: number | null;
  impureIncomeRatio?: number | null;
}

export interface StockScreeningInput {
  companyName: string;
  ticker: string;
  country: Country;
  exchange: string;
  sector: string;
  businessActivity: string;
  ratios?: FinancialRatios | null;
  lastReviewed: string;
  notes: string;
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
  "highly leveraged finance",
];

const thresholds = {
  debtRatio: 33,
  interestIncomeRatio: 5,
  cashAndInterestBearingRatio: 33,
  impureIncomeRatio: 5,
};

export const manualReviewChecklist = [
  "Is the main business halal?",
  "Is debt within acceptable Shariah screening limits?",
  "Is interest income low?",
  "Is impure income low?",
  "Is the company reviewed by a reliable Shariah screening source?",
  "Is purification required?",
];

export function screenStock(input: StockScreeningInput): StockScreeningResult {
  const activity = `${input.sector} ${input.businessActivity}`.toLowerCase();
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
    typeof ratios.cashAndInterestBearingRatio === "number" &&
    typeof ratios.impureIncomeRatio === "number";

  if (!hasCompleteRatios) {
    return {
      ...input,
      status: input.notes.toLowerCase().includes("shariah") ? "Doubtful" : "Needs Manual Review",
      riskLevel: "Medium",
      reasons: [
        "Reliable current financial ratio data is not available in this demo dataset.",
        input.notes,
      ],
      demoData: true,
    };
  }

  const reasons: string[] = [];
  if ((ratios.debtRatio || 0) > thresholds.debtRatio) {
    reasons.push(`Debt ratio is above the ${thresholds.debtRatio}% demo threshold.`);
  }
  if ((ratios.interestIncomeRatio || 0) > thresholds.interestIncomeRatio) {
    reasons.push(`Interest income is above the ${thresholds.interestIncomeRatio}% demo threshold.`);
  }
  if ((ratios.cashAndInterestBearingRatio || 0) > thresholds.cashAndInterestBearingRatio) {
    reasons.push(`Cash and interest-bearing securities exceed the ${thresholds.cashAndInterestBearingRatio}% demo threshold.`);
  }
  if ((ratios.impureIncomeRatio || 0) > thresholds.impureIncomeRatio) {
    reasons.push(`Impure income is above the ${thresholds.impureIncomeRatio}% demo threshold.`);
  }

  if (reasons.length === 0) {
    return {
      ...input,
      status: "Likely Halal",
      riskLevel: "Low",
      reasons: [
        "Core activity appears permissible in this demo dataset.",
        "Demo financial ratios are below basic screening thresholds.",
        input.notes,
      ],
      demoData: true,
    };
  }

  return {
    ...input,
    status: "Doubtful",
    riskLevel: reasons.length > 1 ? "High" : "Medium",
    reasons: [...reasons, input.notes],
    demoData: true,
  };
}

const date = "2026-06-18";

export const demoStocks: StockScreeningInput[] = [
  stock("Tata Consultancy Services", "TCS", "India", "NSE", "Information Technology", "IT services, consulting, enterprise software and digital transformation.", { debtRatio: 2, interestIncomeRatio: 1, cashAndInterestBearingRatio: 18, impureIncomeRatio: 1 }, "Demo likely halal profile; verify with a qualified Shariah screening source."),
  stock("Infosys", "INFY", "India", "NSE", "Information Technology", "Technology consulting, software services, cloud, and business process services.", { debtRatio: 1, interestIncomeRatio: 2, cashAndInterestBearingRatio: 22, impureIncomeRatio: 1 }, "Demo likely halal profile; verify current ratios."),
  stock("HCL Tech", "HCLTECH", "India", "NSE", "Information Technology", "IT services, engineering services, cloud, and software support.", { debtRatio: 4, interestIncomeRatio: 1, cashAndInterestBearingRatio: 16, impureIncomeRatio: 1 }, "Demo likely halal profile; verify current ratios."),
  stock("Wipro", "WIPRO", "India", "NSE", "Information Technology", "IT consulting, digital services, cybersecurity, and cloud solutions.", { debtRatio: 5, interestIncomeRatio: 1, cashAndInterestBearingRatio: 20, impureIncomeRatio: 1 }, "Demo likely halal profile; verify current ratios."),
  stock("Persistent Systems", "PERSISTENT", "India", "NSE", "Information Technology", "Software engineering, digital product development, and IT services.", { debtRatio: 3, interestIncomeRatio: 1, cashAndInterestBearingRatio: 19, impureIncomeRatio: 1 }, "Demo likely halal profile; verify current ratios."),
  stock("Tata Elxsi", "TATAELXSI", "India", "NSE", "Design and Technology", "Product design, embedded systems, and digital technology services.", { debtRatio: 1, interestIncomeRatio: 1, cashAndInterestBearingRatio: 21, impureIncomeRatio: 1 }, "Demo likely halal profile; verify current ratios."),

  stock("Microsoft", "MSFT", "United States", "NASDAQ", "Software and Cloud", "Software, cloud infrastructure, enterprise services, gaming, and AI products.", null, "Large diversified revenue and financial ratios require manual Shariah review."),
  stock("Apple", "AAPL", "United States", "NASDAQ", "Consumer Technology", "Devices, software, services, payments ecosystem, and digital subscriptions.", null, "Services and cash holdings require manual review."),
  stock("Nvidia", "NVDA", "United States", "NASDAQ", "Semiconductors", "GPUs, data center chips, AI infrastructure, software platforms, and hardware systems.", null, "High-growth semiconductor business; verify financial ratios and customer exposure."),
  stock("Alphabet", "GOOGL", "United States", "NASDAQ", "Internet Services", "Search, advertising, cloud, video platforms, Android, and AI products.", null, "Advertising and diversified services require manual review."),
  stock("Adobe", "ADBE", "United States", "NASDAQ", "Software", "Creative software, document tools, cloud subscriptions, and digital media services.", null, "Subscription software profile; verify ratios and content exposure."),
  stock("Tesla", "TSLA", "United States", "NASDAQ", "Automobiles and Energy", "Electric vehicles, batteries, charging, energy products, and software.", null, "Automotive profile but ratios and financing arms require manual review."),

  stock("AstraZeneca", "AZN", "United Kingdom", "LSE", "Pharmaceuticals", "Prescription medicines, vaccines, oncology, respiratory, and biopharmaceutical research.", null, "Healthcare profile; verify financial ratios and product lines."),
  stock("Unilever", "ULVR", "United Kingdom", "LSE", "Consumer Goods", "Food, personal care, home care, and beauty products.", null, "Consumer products may include mixed product lines; manual review required."),
  stock("Halma", "HLMA", "United Kingdom", "LSE", "Safety Technology", "Safety, environmental, and medical technology products.", null, "Business appears generally permissible but financial ratios are missing."),
  stock("RELX", "REL", "United Kingdom", "LSE", "Information Services", "Analytics, scientific publishing, legal data, exhibitions, and information services.", null, "Events/data business lines require manual review."),

  stock("Al Rajhi Bank", "1120", "Saudi Arabia", "Tadawul", "Islamic Banking", "Shariah-governed banking and financial services.", null, "Islamic bank; still verify with a reliable Shariah board and current disclosures."),
  stock("Saudi Telecom Company", "7010", "Saudi Arabia", "Tadawul", "Telecommunications", "Mobile, fixed line, broadband, enterprise technology, and digital services.", null, "Telecom profile; financial ratios missing."),
  stock("SABIC", "2010", "Saudi Arabia", "Tadawul", "Chemicals", "Petrochemicals, chemicals, polymers, fertilizers, and industrial materials.", null, "Industrial profile; verify ratios and product exposure."),
  stock("Saudi Aramco", "2222", "Saudi Arabia", "Tadawul", "Energy", "Oil, gas, refining, chemicals, and energy infrastructure.", null, "Energy profile; verify Shariah standards and ratios."),

  stock("Salik", "SALIK", "UAE", "DFM", "Transport Infrastructure", "Road toll systems and mobility infrastructure services.", null, "Infrastructure profile; financial ratios missing."),
  stock("DEWA", "DEWA", "UAE", "DFM", "Utilities", "Electricity and water utility services.", null, "Utility profile; verify debt and interest exposure."),
  stock("Emaar Properties", "EMAAR", "UAE", "DFM", "Real Estate", "Property development, malls, hospitality, and real estate services.", null, "Real estate can involve financing concerns; manual review required."),
  stock("ADNOC Gas", "ADNOCGAS", "UAE", "ADX", "Energy", "Natural gas processing, LNG, and energy products.", null, "Energy profile; financial ratios missing."),

  stock("Tenaga Nasional", "TENAGA", "Malaysia", "Bursa Malaysia", "Utilities", "Electricity generation, transmission, distribution, and energy services.", null, "Utility profile; verify debt and interest exposure."),
  stock("Petronas Chemicals", "PCHEM", "Malaysia", "Bursa Malaysia", "Chemicals", "Petrochemicals, fertilizers, polymers, and chemical products.", null, "Industrial profile; financial ratios missing."),
  stock("IHH Healthcare", "IHH", "Malaysia", "Bursa Malaysia", "Healthcare", "Hospitals, healthcare services, and medical operations.", null, "Healthcare profile; verify financial ratios."),
  stock("Maybank Islamic", "MAYBANK-ISLAMIC", "Malaysia", "Bursa Malaysia", "Islamic Banking", "Islamic banking products and Shariah-compliant financial services.", null, "Islamic finance entity; verify Shariah board and current screening."),

  stock("Telkom Indonesia", "TLKM", "Indonesia", "IDX", "Telecommunications", "Telecom, broadband, enterprise services, and digital infrastructure.", null, "Telecom profile; ratios missing."),
  stock("Bank Syariah Indonesia", "BRIS", "Indonesia", "IDX", "Islamic Banking", "Shariah banking and Islamic financial services.", null, "Islamic bank; verify Shariah governance and disclosures."),
  stock("Indofood", "INDF", "Indonesia", "IDX", "Food Products", "Packaged food, consumer products, agribusiness, and distribution.", null, "Food product mix requires halal and financial review."),
  stock("Kalbe Farma", "KLBF", "Indonesia", "IDX", "Healthcare", "Pharmaceuticals, nutrition, healthcare products, and distribution.", null, "Healthcare profile; verify products and ratios."),

  stock("Ooredoo", "ORDS", "Qatar", "QSE", "Telecommunications", "Mobile, broadband, enterprise telecom, and digital services.", null, "Telecom profile; financial ratios missing."),
  stock("Qatar Gas Transport", "QGTS", "Qatar", "QSE", "Energy Transport", "LNG shipping and energy transport services.", null, "Energy transport profile; manual ratio review needed."),
  stock("Industries Qatar", "IQCD", "Qatar", "QSE", "Industrials", "Petrochemicals, fertilizers, and steel businesses.", null, "Industrial profile; financial ratios missing."),

  stock("Zain", "ZAIN", "Kuwait", "Boursa Kuwait", "Telecommunications", "Mobile telecommunications and digital services.", null, "Telecom profile; financial ratios missing."),
  stock("Agility", "AGLTY", "Kuwait", "Boursa Kuwait", "Logistics", "Logistics, warehousing, infrastructure, and supply-chain services.", null, "Logistics profile; verify business lines and ratios."),
  stock("Kuwait Finance House", "KFH", "Kuwait", "Boursa Kuwait", "Islamic Banking", "Islamic banking, investment, and financial services.", null, "Islamic finance entity; verify Shariah governance and disclosures."),

  stock("Shopify", "SHOP", "Canada", "TSX", "E-commerce Software", "Commerce software, payments tools, merchant services, and logistics products.", null, "Payments exposure and ratios require manual review."),
  stock("Constellation Software", "CSU", "Canada", "TSX", "Software", "Vertical market software acquisitions and operations.", null, "Software profile; verify ratios and subsidiaries."),
  stock("Canadian National Railway", "CNR", "Canada", "TSX", "Rail Transport", "Rail freight, logistics, and transportation infrastructure.", null, "Transport profile; debt ratios require manual review."),

  stock("CSL", "CSL", "Australia", "ASX", "Biotechnology", "Biotherapies, vaccines, plasma products, and healthcare research.", null, "Healthcare profile; verify products and ratios."),
  stock("WiseTech Global", "WTC", "Australia", "ASX", "Software", "Logistics software and supply-chain technology platforms.", null, "Software profile; ratios missing."),
  stock("Xero", "XRO", "Australia", "ASX", "Software", "Cloud accounting, small business software, and financial workflow tools.", null, "Accounting software can serve mixed clients; manual review needed."),
  stock("Cochlear", "COH", "Australia", "ASX", "Medical Devices", "Hearing implants, sound processors, and medical device services.", null, "Medical device profile; financial ratios missing."),
];

function stock(
  companyName: string,
  ticker: string,
  country: Country,
  exchange: string,
  sector: string,
  businessActivity: string,
  ratios: FinancialRatios | null,
  notes: string
): StockScreeningInput {
  return {
    companyName,
    ticker,
    country,
    exchange,
    sector,
    businessActivity,
    ratios,
    lastReviewed: date,
    notes,
  };
}

export function getScreenedDemoStocks() {
  return demoStocks.map(screenStock);
}
