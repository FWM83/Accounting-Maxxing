import type { Role } from "./types";

type Capability =
  | "manage_users"
  | "post_entries"
  | "close_periods"
  | "import_bank_transactions"
  | "match_reconciliation"
  | "review_audit_evidence"
  | "view_reports";

const roleCapabilities: Record<Role, Capability[]> = {
  admin: [
    "manage_users",
    "post_entries",
    "close_periods",
    "import_bank_transactions",
    "match_reconciliation",
    "review_audit_evidence",
    "view_reports"
  ],
  accountant: [
    "post_entries",
    "close_periods",
    "import_bank_transactions",
    "match_reconciliation",
    "review_audit_evidence",
    "view_reports"
  ],
  bookkeeper: ["post_entries", "import_bank_transactions", "match_reconciliation", "view_reports"],
  auditor: ["review_audit_evidence", "view_reports"],
  viewer: ["view_reports"]
};

export function can(role: Role, capability: Capability): boolean {
  return roleCapabilities[role].includes(capability);
}

export function describeRole(role: Role): string {
  const descriptions: Record<Role, string> = {
    admin: "Owns company settings, users, periods, and all accounting workflows.",
    accountant: "Posts entries, closes periods, reviews reports, and manages reconciliation.",
    bookkeeper: "Imports bank data, posts routine entries, and prepares reconciliation packages.",
    auditor: "Reviews evidence, traces balances, and exports workpapers without changing books.",
    viewer: "Reads reports and dashboards only."
  };

  return descriptions[role];
}
