-- Codex initial SaaS ERP schema.
-- This is written for PostgreSQL and mirrors the TypeScript domain model used by the prototype.

create table tenants (
  id uuid primary key,
  name text not null,
  plan text not null check (plan in ('starter', 'growth', 'enterprise')),
  created_at timestamptz not null default now()
);

create table companies (
  id uuid primary key,
  tenant_id uuid not null references tenants(id),
  name text not null,
  legal_name text not null,
  base_currency char(3) not null default 'USD',
  fiscal_year_start_month integer not null check (fiscal_year_start_month between 1 and 12),
  created_at timestamptz not null default now()
);

create table app_users (
  id uuid primary key,
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table memberships (
  id uuid primary key,
  company_id uuid not null references companies(id),
  user_id uuid not null references app_users(id),
  role text not null check (role in ('admin', 'accountant', 'bookkeeper', 'auditor', 'viewer')),
  unique (company_id, user_id)
);

create table accounts (
  id uuid primary key,
  company_id uuid not null references companies(id),
  parent_id uuid references accounts(id),
  code text not null,
  name text not null,
  type text not null check (type in ('asset', 'liability', 'equity', 'revenue', 'expense')),
  normal_balance text not null check (normal_balance in ('debit', 'credit')),
  is_active boolean not null default true,
  unique (company_id, code)
);

create table accounting_periods (
  id uuid primary key,
  company_id uuid not null references companies(id),
  name text not null,
  starts_on date not null,
  ends_on date not null,
  status text not null check (status in ('open', 'closed', 'locked')),
  unique (company_id, starts_on, ends_on)
);

create table source_documents (
  id uuid primary key,
  company_id uuid not null references companies(id),
  type text not null,
  name text not null,
  storage_key text,
  linked_entity_id uuid,
  uploaded_at timestamptz not null default now()
);

create table journal_entries (
  id uuid primary key,
  company_id uuid not null references companies(id),
  period_id uuid not null references accounting_periods(id),
  entry_number text not null,
  date date not null,
  description text not null,
  status text not null check (status in ('draft', 'posted', 'void')),
  created_by_user_id uuid not null references app_users(id),
  posted_at timestamptz,
  unique (company_id, entry_number)
);

create table journal_entry_lines (
  id uuid primary key,
  journal_entry_id uuid not null references journal_entries(id) on delete cascade,
  account_id uuid not null references accounts(id),
  source_document_id uuid references source_documents(id),
  memo text not null,
  debit numeric(14, 2) not null default 0 check (debit >= 0),
  credit numeric(14, 2) not null default 0 check (credit >= 0),
  check (not (debit > 0 and credit > 0))
);

create table customers (
  id uuid primary key,
  company_id uuid not null references companies(id),
  name text not null,
  email text not null
);

create table vendors (
  id uuid primary key,
  company_id uuid not null references companies(id),
  name text not null,
  email text not null
);

create table invoices (
  id uuid primary key,
  company_id uuid not null references companies(id),
  customer_id uuid not null references customers(id),
  journal_entry_id uuid not null references journal_entries(id),
  invoice_number text not null,
  issued_on date not null,
  due_on date not null,
  amount numeric(14, 2) not null check (amount >= 0),
  paid_amount numeric(14, 2) not null default 0 check (paid_amount >= 0),
  unique (company_id, invoice_number)
);

create table bills (
  id uuid primary key,
  company_id uuid not null references companies(id),
  vendor_id uuid not null references vendors(id),
  journal_entry_id uuid not null references journal_entries(id),
  bill_number text not null,
  issued_on date not null,
  due_on date not null,
  amount numeric(14, 2) not null check (amount >= 0),
  paid_amount numeric(14, 2) not null default 0 check (paid_amount >= 0),
  unique (company_id, bill_number)
);

create table payments (
  id uuid primary key,
  company_id uuid not null references companies(id),
  journal_entry_id uuid not null references journal_entries(id),
  direction text not null check (direction in ('inbound', 'outbound')),
  counterparty_id uuid not null,
  applies_to_id uuid not null,
  date date not null,
  amount numeric(14, 2) not null check (amount > 0)
);

create table bank_accounts (
  id uuid primary key,
  company_id uuid not null references companies(id),
  account_id uuid not null references accounts(id),
  institution_name text not null,
  last4 char(4) not null
);

create table imported_bank_transactions (
  id uuid primary key,
  company_id uuid not null references companies(id),
  bank_account_id uuid not null references bank_accounts(id),
  posted_on date not null,
  description text not null,
  amount numeric(14, 2) not null,
  reference text
);

create table reconciliation_sessions (
  id uuid primary key,
  company_id uuid not null references companies(id),
  bank_account_id uuid not null references bank_accounts(id),
  period_id uuid not null references accounting_periods(id),
  status text not null check (status in ('in_progress', 'review_ready', 'approved')),
  statement_ending_balance numeric(14, 2) not null,
  started_by_user_id uuid not null references app_users(id),
  started_at timestamptz not null default now()
);

create table reconciliation_matches (
  id uuid primary key,
  session_id uuid not null references reconciliation_sessions(id),
  bank_transaction_id uuid not null references imported_bank_transactions(id),
  status text not null check (status in ('matched', 'partially_matched', 'unmatched', 'variance')),
  variance numeric(14, 2) not null default 0,
  confidence numeric(5, 2) not null default 0,
  matched_by_user_id uuid references app_users(id),
  matched_at timestamptz,
  note text not null default ''
);

create table reconciliation_match_lines (
  reconciliation_match_id uuid not null references reconciliation_matches(id) on delete cascade,
  journal_entry_line_id uuid not null references journal_entry_lines(id),
  primary key (reconciliation_match_id, journal_entry_line_id)
);

create table audit_events (
  id uuid primary key,
  company_id uuid not null references companies(id),
  actor_user_id uuid not null references app_users(id),
  occurred_at timestamptz not null default now(),
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  summary text not null
);

create index journal_entries_company_period_idx on journal_entries(company_id, period_id);
create index journal_entry_lines_entry_idx on journal_entry_lines(journal_entry_id);
create index imported_bank_transactions_company_date_idx on imported_bank_transactions(company_id, posted_on);
create index audit_events_company_time_idx on audit_events(company_id, occurred_at desc);
