import { currency, entryTotals, getLedgerHealth, getTrialBalance } from "@/domain/accounting";
import type { AccountingDataset, PeriodStatus } from "@/domain/types";
import { Badge, Card, Metric } from "./ui";

type Props = {
  dataset: AccountingDataset;
};

export function LedgerDashboard({ dataset }: Props) {
  const ledgerHealth = getLedgerHealth(dataset);
  const trialBalance = getTrialBalance(dataset);

  return (
    <div className="sectionGrid">
      <Card title="Ledger Control Center" eyebrow="Accounting core">
        <div className="metricGrid">
          <Metric label="Posted entries" value={ledgerHealth.postedCount.toString()} detail="All source-linked" />
          <Metric
            label="Total debits"
            value={currency(ledgerHealth.totalDebit)}
            detail={ledgerHealth.isLedgerBalanced ? "Equals credits" : "Needs review"}
          />
          <Metric label="Total credits" value={currency(ledgerHealth.totalCredit)} detail="Trial balance basis" />
          <Metric
            label="Unbalanced entries"
            value={ledgerHealth.unbalancedCount.toString()}
            detail="Must be zero before close"
          />
        </div>
      </Card>

      <Card title="Accounting Periods" eyebrow="Close workflow">
        <div className="list">
          {dataset.periods.map((period) => (
            <div className="listRow" key={period.id}>
              <div>
                <strong>{period.name}</strong>
                <p>
                  {period.startsOn} to {period.endsOn}
                </p>
              </div>
              <Badge tone={periodTone(period.status)}>{period.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Chart Of Accounts" eyebrow="Company setup">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Normal</th>
              </tr>
            </thead>
            <tbody>
              {dataset.accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.code}</td>
                  <td>{account.name}</td>
                  <td>{account.type}</td>
                  <td>{account.normalBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Trial Balance" eyebrow="Financial reports">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {trialBalance.map((row) => (
                <tr key={row.account.id}>
                  <td>
                    {row.account.code} {row.account.name}
                  </td>
                  <td>{currency(row.debit)}</td>
                  <td>{currency(row.credit)}</td>
                  <td>{currency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Journal Entry Review" eyebrow="Posting controls">
        <div className="list">
          {dataset.journalEntries.map((entry) => {
            const totals = entryTotals(entry);

            return (
              <div className="listRow" key={entry.id}>
                <div>
                  <strong>
                    {entry.entryNumber} · {entry.description}
                  </strong>
                  <p>
                    {entry.date} · Debits {currency(totals.debit)} · Credits {currency(totals.credit)}
                  </p>
                </div>
                <Badge tone={totals.isBalanced ? "good" : "danger"}>
                  {totals.isBalanced ? "balanced" : "unbalanced"}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Audit Timeline" eyebrow="Immutable evidence">
        <div className="timeline">
          {dataset.auditEvents.map((event) => {
            const actor = dataset.users.find((user) => user.id === event.actorUserId);

            return (
              <div className="timelineItem" key={event.id}>
                <span>{new Date(event.occurredAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
                <strong>
                  {event.action} · {event.entityType}
                </strong>
                <p>{event.summary}</p>
                <small>{actor?.name ?? "Unknown user"}</small>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function periodTone(status: PeriodStatus) {
  if (status === "open") {
    return "info";
  }

  if (status === "closed") {
    return "warn";
  }

  return "good";
}
