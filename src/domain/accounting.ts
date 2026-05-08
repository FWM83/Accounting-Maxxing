import type {
  Account,
  AccountingDataset,
  Bill,
  ImportedBankTransaction,
  Invoice,
  JournalEntry,
  JournalEntryLine,
  MatchStatus,
  PaymentStatus,
  ReconciliationMatch
} from "./types";

export type AccountBalance = {
  account: Account;
  debit: number;
  credit: number;
  balance: number;
};

export type EntryCheck = {
  entry: JournalEntry;
  debit: number;
  credit: number;
  isBalanced: boolean;
};

export type AgingItem = {
  id: string;
  number: string;
  counterparty: string;
  dueOn: string;
  amount: number;
  paidAmount: number;
  openAmount: number;
  status: PaymentStatus;
};

export type ReconciliationRow = {
  bankTransaction: ImportedBankTransaction;
  match?: ReconciliationMatch;
  status: MatchStatus;
  variance: number;
  confidence: number;
  linkedLines: JournalEntryLine[];
  linkedEntryNumbers: string[];
};

export function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

export function signedCurrency(value: number): string {
  const formatted = currency(Math.abs(value));
  return value < 0 ? `-${formatted}` : formatted;
}

export function entryTotals(entry: JournalEntry): EntryCheck {
  const debit = roundMoney(entry.lines.reduce((sum, line) => sum + line.debit, 0));
  const credit = roundMoney(entry.lines.reduce((sum, line) => sum + line.credit, 0));

  return {
    entry,
    debit,
    credit,
    isBalanced: debit === credit
  };
}

export function getEntryChecks(entries: JournalEntry[]): EntryCheck[] {
  return entries.map(entryTotals);
}

export function getTrialBalance(dataset: AccountingDataset): AccountBalance[] {
  return dataset.accounts.map((account) => {
    const lines = dataset.journalEntries.flatMap((entry) =>
      entry.status === "posted" ? entry.lines.filter((line) => line.accountId === account.id) : []
    );
    const debit = roundMoney(lines.reduce((sum, line) => sum + line.debit, 0));
    const credit = roundMoney(lines.reduce((sum, line) => sum + line.credit, 0));
    const balance = account.normalBalance === "debit" ? debit - credit : credit - debit;

    return {
      account,
      debit,
      credit,
      balance: roundMoney(balance)
    };
  });
}

export function getLedgerHealth(dataset: AccountingDataset) {
  const checks = getEntryChecks(dataset.journalEntries);
  const postedEntries = checks.filter(({ entry }) => entry.status === "posted");
  const unbalancedEntries = checks.filter((check) => !check.isBalanced);
  const trialBalance = getTrialBalance(dataset);
  const totalDebit = roundMoney(trialBalance.reduce((sum, row) => sum + row.debit, 0));
  const totalCredit = roundMoney(trialBalance.reduce((sum, row) => sum + row.credit, 0));

  return {
    postedCount: postedEntries.length,
    unbalancedCount: unbalancedEntries.length,
    totalDebit,
    totalCredit,
    isLedgerBalanced: totalDebit === totalCredit
  };
}

export function getInvoiceAging(dataset: AccountingDataset): AgingItem[] {
  return dataset.invoices.map((invoice) => {
    const customer = dataset.customers.find((item) => item.id === invoice.customerId);
    return toAgingItem(invoice, invoice.invoiceNumber, customer?.name ?? "Unknown customer");
  });
}

export function getBillAging(dataset: AccountingDataset): AgingItem[] {
  return dataset.bills.map((bill) => {
    const vendor = dataset.vendors.find((item) => item.id === bill.vendorId);
    return toAgingItem(bill, bill.billNumber, vendor?.name ?? "Unknown vendor");
  });
}

export function getReconciliationRows(dataset: AccountingDataset): ReconciliationRow[] {
  return dataset.bankTransactions.map((bankTransaction) => {
    const match = dataset.reconciliationMatches.find((item) => item.bankTransactionId === bankTransaction.id);
    const linkedLines = match
      ? dataset.journalEntries.flatMap((entry) =>
          entry.lines.filter((line) => match.journalEntryLineIds.includes(line.id))
        )
      : [];
    const linkedEntryNumbers = Array.from(
      new Set(
        linkedLines
          .map((line) => dataset.journalEntries.find((entry) => entry.id === line.journalEntryId)?.entryNumber)
          .filter((entryNumber): entryNumber is string => Boolean(entryNumber))
      )
    );

    return {
      bankTransaction,
      match,
      status: match?.status ?? "unmatched",
      variance: match?.variance ?? bankTransaction.amount,
      confidence: match?.confidence ?? 0,
      linkedLines,
      linkedEntryNumbers
    };
  });
}

export function getReconciliationSummary(dataset: AccountingDataset) {
  const rows = getReconciliationRows(dataset);
  const matched = rows.filter((row) => row.status === "matched").length;
  const unmatched = rows.filter((row) => row.status === "unmatched").length;
  const variance = roundMoney(rows.reduce((sum, row) => sum + row.variance, 0));
  const clearedAmount = roundMoney(
    rows.filter((row) => row.status === "matched").reduce((sum, row) => sum + row.bankTransaction.amount, 0)
  );

  return {
    total: rows.length,
    matched,
    unmatched,
    variance,
    clearedAmount,
    reviewReady: unmatched === 0 && variance === 0
  };
}

export function getSuggestedMatches(dataset: AccountingDataset) {
  const cashAccountId = dataset.bankAccounts[0]?.accountId;
  const cashLines = dataset.journalEntries.flatMap((entry) =>
    entry.lines
      .filter((line) => line.accountId === cashAccountId)
      .map((line) => ({
        entry,
        line,
        signedAmount: line.debit > 0 ? line.debit : -line.credit
      }))
  );

  return dataset.bankTransactions.map((bankTransaction) => {
    const exactAmount = cashLines.find((candidate) => candidate.signedAmount === bankTransaction.amount);
    const containsReference = cashLines.find((candidate) => {
      const text = `${candidate.entry.description} ${candidate.line.memo}`.toLowerCase();
      return Boolean(bankTransaction.reference && text.includes(bankTransaction.reference.toLowerCase().replace("-", "")));
    });
    const candidate = exactAmount ?? containsReference;

    return {
      bankTransaction,
      candidate,
      confidence: exactAmount ? 95 : containsReference ? 78 : 0,
      reason: exactAmount
        ? "Exact signed amount match against posted cash line."
        : containsReference
          ? "Reference appears in entry description or memo."
          : "No strong suggestion yet."
    };
  });
}

export function getDocumentsForLine(dataset: AccountingDataset, line: JournalEntryLine) {
  return dataset.documents.filter((document) => document.id === line.sourceDocumentId);
}

function toAgingItem(record: Invoice | Bill, number: string, counterparty: string): AgingItem {
  const openAmount = roundMoney(record.amount - record.paidAmount);
  return {
    id: record.id,
    number,
    counterparty,
    dueOn: record.dueOn,
    amount: record.amount,
    paidAmount: record.paidAmount,
    openAmount,
    status: getPaymentStatus(record.amount, record.paidAmount)
  };
}

function getPaymentStatus(amount: number, paidAmount: number): PaymentStatus {
  if (paidAmount <= 0) {
    return "unpaid";
  }

  if (paidAmount >= amount) {
    return "paid";
  }

  return "partially_paid";
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
