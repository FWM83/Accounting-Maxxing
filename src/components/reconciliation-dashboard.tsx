import {
  currency,
  getDocumentsForLine,
  getReconciliationRows,
  getReconciliationSummary,
  getSuggestedMatches,
  signedCurrency
} from "@/domain/accounting";
import type { AccountingDataset, MatchStatus } from "@/domain/types";
import { Badge, Card, EmptyState, Metric } from "./ui";

type Props = {
  dataset: AccountingDataset;
};

export function ReconciliationDashboard({ dataset }: Props) {
  const summary = getReconciliationSummary(dataset);
  const rows = getReconciliationRows(dataset);
  const suggestions = getSuggestedMatches(dataset);
  const session = dataset.reconciliationSessions[0];
  const bankAccount = dataset.bankAccounts.find((account) => account.id === session.bankAccountId);

  return (
    <div className="sectionGrid">
      <Card title="Bank Reconciliation" eyebrow="Bookkeeper workspace">
        <div className="metricGrid">
          <Metric label="Imported lines" value={summary.total.toString()} detail="CSV import prototype" />
          <Metric label="Matched" value={summary.matched.toString()} detail="Cleared against GL cash lines" />
          <Metric label="Unmatched" value={summary.unmatched.toString()} detail="Exception queue" />
          <Metric label="Net variance" value={signedCurrency(summary.variance)} detail="Must be zero to approve" />
        </div>
        <div className="callout">
          <strong>{bankAccount?.institutionName} operating account</strong>
          <p>
            Statement ending balance {currency(session.statementEndingBalance)} · Session status {session.status.replace("_", " ")}
          </p>
        </div>
      </Card>

      <Card title="Imported Bank Lines" eyebrow="CSV import and match review">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>GL Link</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.bankTransaction.id}>
                  <td>{row.bankTransaction.postedOn}</td>
                  <td>{row.bankTransaction.description}</td>
                  <td>{signedCurrency(row.bankTransaction.amount)}</td>
                  <td>
                    <Badge tone={matchTone(row.status)}>{row.status.replace("_", " ")}</Badge>
                  </td>
                  <td>{row.linkedEntryNumbers.length ? row.linkedEntryNumbers.join(", ") : "Needs match"}</td>
                  <td>{row.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Suggested Matches" eyebrow="Automation assist">
        <div className="list">
          {suggestions.map((suggestion) => (
            <div className="listRow" key={suggestion.bankTransaction.id}>
              <div>
                <strong>{suggestion.bankTransaction.description}</strong>
                <p>
                  {signedCurrency(suggestion.bankTransaction.amount)} · {suggestion.reason}
                </p>
                {suggestion.candidate ? (
                  <small>
                    Suggested: {suggestion.candidate.entry.entryNumber} · {suggestion.candidate.line.memo}
                  </small>
                ) : null}
              </div>
              <Badge tone={suggestion.confidence > 90 ? "good" : suggestion.confidence > 0 ? "warn" : "neutral"}>
                {suggestion.confidence}% confidence
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Auditor Evidence Drill-Down" eyebrow="Trace balance to proof">
        <div className="evidenceGrid">
          {rows
            .filter((row) => row.linkedLines.length > 0)
            .map((row) => (
              <div className="evidenceCard" key={row.bankTransaction.id}>
                <Badge tone="good">traceable</Badge>
                <h3>{row.bankTransaction.description}</h3>
                <p>{signedCurrency(row.bankTransaction.amount)}</p>
                {row.linkedLines.map((line) => {
                  const entry = dataset.journalEntries.find((item) => item.id === line.journalEntryId);
                  const account = dataset.accounts.find((item) => item.id === line.accountId);
                  const documents = getDocumentsForLine(dataset, line);

                  return (
                    <div className="evidenceLine" key={line.id}>
                      <strong>{entry?.entryNumber}</strong>
                      <span>
                        {account?.code} {account?.name} · {line.memo}
                      </span>
                      <small>
                        Docs: {documents.length ? documents.map((document) => document.name).join(", ") : "None linked"}
                      </small>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
        {rows.every((row) => row.linkedLines.length === 0) ? <EmptyState>No evidence linked yet.</EmptyState> : null}
      </Card>
    </div>
  );
}

function matchTone(status: MatchStatus) {
  if (status === "matched") {
    return "good";
  }

  if (status === "partially_matched") {
    return "warn";
  }

  if (status === "variance") {
    return "danger";
  }

  return "neutral";
}
