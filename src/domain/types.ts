export type Role = "admin" | "accountant" | "bookkeeper" | "auditor" | "viewer";

export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

export type NormalBalance = "debit" | "credit";

export type PeriodStatus = "open" | "closed" | "locked";

export type EntryStatus = "draft" | "posted" | "void";

export type PaymentStatus = "unpaid" | "partially_paid" | "paid";

export type MatchStatus = "matched" | "partially_matched" | "unmatched" | "variance";

export type Tenant = {
  id: string;
  name: string;
  plan: "starter" | "growth" | "enterprise";
};

export type Company = {
  id: string;
  tenantId: string;
  name: string;
  legalName: string;
  baseCurrency: string;
  fiscalYearStartMonth: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Account = {
  id: string;
  companyId: string;
  code: string;
  name: string;
  type: AccountType;
  normalBalance: NormalBalance;
  parentId?: string;
  isActive: boolean;
};

export type AccountingPeriod = {
  id: string;
  companyId: string;
  name: string;
  startsOn: string;
  endsOn: string;
  status: PeriodStatus;
};

export type JournalEntryLine = {
  id: string;
  journalEntryId: string;
  accountId: string;
  memo: string;
  debit: number;
  credit: number;
  sourceDocumentId?: string;
};

export type JournalEntry = {
  id: string;
  companyId: string;
  periodId: string;
  entryNumber: string;
  date: string;
  description: string;
  status: EntryStatus;
  createdByUserId: string;
  lines: JournalEntryLine[];
};

export type SourceDocument = {
  id: string;
  companyId: string;
  type: "invoice" | "bill" | "receipt" | "bank_statement" | "contract" | "other";
  name: string;
  uploadedAt: string;
  linkedEntityId?: string;
};

export type Customer = {
  id: string;
  companyId: string;
  name: string;
  email: string;
};

export type Vendor = {
  id: string;
  companyId: string;
  name: string;
  email: string;
};

export type Invoice = {
  id: string;
  companyId: string;
  customerId: string;
  invoiceNumber: string;
  issuedOn: string;
  dueOn: string;
  amount: number;
  paidAmount: number;
  journalEntryId: string;
};

export type Bill = {
  id: string;
  companyId: string;
  vendorId: string;
  billNumber: string;
  issuedOn: string;
  dueOn: string;
  amount: number;
  paidAmount: number;
  journalEntryId: string;
};

export type Payment = {
  id: string;
  companyId: string;
  direction: "inbound" | "outbound";
  counterpartyId: string;
  date: string;
  amount: number;
  appliesToId: string;
  journalEntryId: string;
};

export type BankAccount = {
  id: string;
  companyId: string;
  accountId: string;
  institutionName: string;
  last4: string;
};

export type ImportedBankTransaction = {
  id: string;
  companyId: string;
  bankAccountId: string;
  postedOn: string;
  description: string;
  amount: number;
  reference?: string;
};

export type ReconciliationSession = {
  id: string;
  companyId: string;
  bankAccountId: string;
  periodId: string;
  status: "in_progress" | "review_ready" | "approved";
  statementEndingBalance: number;
  startedByUserId: string;
  startedAt: string;
};

export type ReconciliationMatch = {
  id: string;
  sessionId: string;
  bankTransactionId: string;
  journalEntryLineIds: string[];
  status: MatchStatus;
  variance: number;
  confidence: number;
  matchedByUserId?: string;
  matchedAt?: string;
  note: string;
};

export type AuditEvent = {
  id: string;
  companyId: string;
  actorUserId: string;
  occurredAt: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
};

export type Jurisdiction = "CO" | "IL";

export type LicenseStatus = "active" | "renewal_due" | "expired" | "pending";

export type LicenseType =
  | "retail"
  | "cultivation"
  | "manufacturing"
  | "transporter"
  | "delivery";

export type License = {
  id: string;
  companyId: string;
  jurisdiction: Jurisdiction;
  type: LicenseType;
  licenseNumber: string;
  issuingAuthority: string;
  locationName: string;
  issuedOn: string;
  expiresOn: string;
  status: LicenseStatus;
};

export type IntegrationStatus = "connected" | "available" | "error";

export type IntegrationType =
  | "pos"
  | "track-and-trace"
  | "manual"
  | "banking"
  | "ecommerce";

export type Integration = {
  id: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  description: string;
  vendorMonogram: string;
  lastSyncAt?: string;
  jurisdiction?: Jurisdiction;
  itemsSynced?: number;
};

export type InventorySnapshotItem = {
  category: string;
  units: number;
  valueAtCost: number;
  lowStock: boolean;
  metrcPackages: number;
};

export type ComplianceSeverity = "high" | "medium" | "low";

export type ComplianceStatus =
  | "open"
  | "in_review"
  | "in_progress"
  | "due_soon"
  | "complete";

export type ComplianceItem = {
  id: string;
  companyId: string;
  title: string;
  description: string;
  framework: string;
  jurisdiction?: Jurisdiction;
  severity: ComplianceSeverity;
  status: ComplianceStatus;
  dueOn: string;
};

export type TaxFilingStatus = "due_soon" | "filed" | "overdue";

export type TaxFiling = {
  id: string;
  companyId: string;
  jurisdiction: Jurisdiction;
  name: string;
  formNumber?: string;
  period: string;
  dueOn: string;
  rate: string;
  estimatedAmount: number;
  status: TaxFilingStatus;
};

export type DocumentRequestStatus = "open" | "submitted" | "needs_more" | "approved";

export type DocumentRequest = {
  id: string;
  companyId: string;
  conversationId?: string;
  requesterUserId: string;
  recipientUserId: string;
  title: string;
  description: string;
  dueOn: string;
  status: DocumentRequestStatus;
  periodId?: string;
  journalEntryId?: string;
  attachmentDocumentIds: string[];
  notes: string;
};

export type Conversation = {
  id: string;
  companyId: string;
  subject: string;
  participantIds: string[];
  lastMessageAt: string;
  unreadCount: number;
};

export type PortalMessage = {
  id: string;
  conversationId: string;
  senderUserId: string;
  sentAt: string;
  body: string;
  attachmentDocumentIds?: string[];
};

export type AccountingDataset = {
  tenant: Tenant;
  company: Company;
  users: User[];
  accounts: Account[];
  periods: AccountingPeriod[];
  journalEntries: JournalEntry[];
  documents: SourceDocument[];
  customers: Customer[];
  vendors: Vendor[];
  invoices: Invoice[];
  bills: Bill[];
  payments: Payment[];
  bankAccounts: BankAccount[];
  bankTransactions: ImportedBankTransaction[];
  reconciliationSessions: ReconciliationSession[];
  reconciliationMatches: ReconciliationMatch[];
  auditEvents: AuditEvent[];
  documentRequests: DocumentRequest[];
  conversations: Conversation[];
  messages: PortalMessage[];
  licenses: License[];
  integrations: Integration[];
  inventorySnapshot: InventorySnapshotItem[];
  complianceItems: ComplianceItem[];
  taxFilings: TaxFiling[];
};
