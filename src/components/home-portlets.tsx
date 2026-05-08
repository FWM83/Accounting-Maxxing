import {
  currency,
  getBillAging,
  getInvoiceAging,
  getLedgerHealth,
  getReconciliationSummary,
  getTrialBalance,
  signedCurrency
} from "@/domain/accounting";
import type { AccountingDataset, JournalEntry } from "@/domain/types";
import type { ReactNode } from "react";

type Props = {
  dataset: AccountingDataset;
};

type PortletProps = {
  title: string;
  toolbar?: ReactNode;
  variant?: "default" | "hero";
  children: ReactNode;
};

function Portlet({ title, toolbar, variant = "default", children }: PortletProps) {
  return (
    <section className={`portlet ${variant}`}>
      <header>
        <h2>{title}</h2>
        <div className="portletToolbar">
          {toolbar ?? (
            <button type="button" aria-label="Portlet menu">
              {"\u22EF"}
            </button>
          )}
        </div>
      </header>
      <div className="portletBody">{children}</div>
    </section>
  );
}

type TaskTone = "coral" | "amber" | "indigo" | "mint";

const setupTasks = [
  { id: "metrc-co", label: "Connect METRC (Colorado)", done: true },
  { id: "metrc-il", label: "Connect METRC (Illinois)", done: true },
  { id: "pos", label: "Sync your POS (Flowhub, Dutchie, Treez...)", done: true },
  { id: "chart", label: "Set up cannabis chart of accounts", done: true },
  { id: "cpa", label: "Invite your cannabis CPA", done: false }
];

const quickLinkGroups = [
  {
    title: "Sales & POS",
    links: ["Daily sales summary", "Cash drop log", "Wholesale invoices", "Customer list"]
  },
  {
    title: "Inventory",
    links: ["Sync METRC", "Receive packages", "Adjust on-hand", "Variance review"]
  },
  {
    title: "Compliance",
    links: ["280E review", "Excise tax filings", "License tracker", "Audit trail"]
  },
  {
    title: "Books",
    links: ["Journal entries", "Trial balance", "Period close", "Reports"]
  }
];

const quickTools: Array<{
  title: string;
  caption: string;
  tone: "indigo" | "mint" | "amber" | "lavender";
  monogram: string;
  href: string;
}> = [
  { title: "Sync inventory", caption: "Pull METRC + POS", tone: "mint", monogram: "IS", href: "/inventory" },
  { title: "Record expense", caption: "Tag for 280E", tone: "amber", monogram: "EX", href: "#ar-ap" },
  { title: "Reconcile bank", caption: "Match cash flow", tone: "indigo", monogram: "RC", href: "#reconciliation" },
  { title: "File excise tax", caption: "CO + IL filings", tone: "lavender", monogram: "FT", href: "/compliance" }
];

export function HomePortlets({ dataset }: Props) {
  const ledger = getLedgerHealth(dataset);
  const recon = getReconciliationSummary(dataset);
  const invoices = getInvoiceAging(dataset);
  const bills = getBillAging(dataset);
  const trial = getTrialBalance(dataset);

  const cashAccount = trial.find((row) => row.account.code === "1000");
  const apAccount = trial.find((row) => row.account.code === "2000");
  const arAccount = trial.find((row) => row.account.code === "1200");
  const revenueAccount = trial.find((row) => row.account.code === "4000");
  const expenseTotal = trial
    .filter((row) => row.account.type === "expense")
    .reduce((sum, row) => sum + row.balance, 0);
  const netIncome = (revenueAccount?.balance ?? 0) - expenseTotal;

  const cashOnHand = cashAccount?.balance ?? 0;
  const moneyOwedToYou = arAccount?.balance ?? 0;
  const moneyYouOwe = apAccount?.balance ?? 0;

  const openInvoices = invoices.filter((item) => item.openAmount > 0);
  const openBills = bills.filter((item) => item.openAmount > 0);

  const today = "2026-05-07";
  const openCompliance = dataset.complianceItems.filter((item) => item.status !== "complete");
  const highSeverity = openCompliance.filter((item) => item.severity === "high");
  const metrcVariance = openCompliance.find((item) => item.id === "comp-metrc-variance");
  const reviewable280e = openCompliance.find((item) => item.id === "comp-280e");
  const taxesDueSoon = dataset.taxFilings.filter((filing) => filing.status === "due_soon");
  const totalTaxDue = dataset.taxFilings.reduce((sum, filing) => sum + filing.estimatedAmount, 0);
  const renewalsSoon = dataset.licenses.filter((license) => license.status === "renewal_due");

  const todayTasks: Array<{
    id: string;
    tone: TaskTone;
    label: string;
    cta: string;
    href: string;
  }> = [
    {
      id: "metrc",
      tone: "coral",
      label: metrcVariance
        ? "METRC variance found - reconcile 2 CO packages"
        : "METRC sync clean across CO + IL",
      cta: metrcVariance ? "Reconcile" : "View sync",
      href: "/inventory"
    },
    {
      id: "280e",
      tone: "amber",
      label: reviewable280e
        ? "12 expenses need 280E classification"
        : "280E expenses classified",
      cta: "Review",
      href: "/compliance"
    },
    {
      id: "tax",
      tone: "indigo",
      label: `${taxesDueSoon.length} excise & sales tax filings due May 20`,
      cta: "Open filings",
      href: "/compliance"
    },
    {
      id: "books-balanced",
      tone: ledger.unbalancedCount === 0 ? "mint" : "coral",
      label:
        ledger.unbalancedCount === 0
          ? "Books are balanced for this period"
          : `${ledger.unbalancedCount} entries are out of balance`,
      cta: "Open ledger",
      href: "#ledger"
    }
  ];

  const cashSeries = [3.2, 3.5, 4.0, 4.4, 4.7, 5.0, 5.2, 5.6, 6.1, 5.9, 6.5, 7.2];
  const salesSeries = [10, 12, 11, 14, 15, 18, 20, 22, 26, 28, 30, 34];

  const recentEntries = [...dataset.journalEntries]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  const openRequests = dataset.documentRequests.filter((req) => req.status !== "approved");
  const overdueRequests = openRequests.filter((req) => req.dueOn < today);
  const latestMessage = [...dataset.messages].sort((a, b) =>
    a.sentAt < b.sentAt ? 1 : -1
  )[0];
  const latestMessageSender = latestMessage
    ? dataset.users.find((user) => user.id === latestMessage.senderUserId)
    : undefined;

  return (
    <section className="portletGrid">
      <aside className="portletColumn">
        <Portlet title="Today's checklist">
          <ul className="checklist">
            {todayTasks.map((task) => (
              <li key={task.id} className={task.tone}>
                <span className="checklistDot" aria-hidden />
                <div>
                  <strong>{task.label}</strong>
                  <a href={task.href}>{task.cta} {"\u2192"}</a>
                </div>
              </li>
            ))}
          </ul>
        </Portlet>

        <Portlet title="Get set up">
          <SetupChecklist tasks={setupTasks} />
        </Portlet>

        <Portlet title="Quick links">
          <div className="quickLinks">
            {quickLinkGroups.map((group) => (
              <div key={group.title}>
                <p className="quickLinkTitle">{group.title}</p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#overview">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Portlet>
      </aside>

      <div className="portletColumn portletColumnWide">
        <Portlet
          title="Cash on hand"
          variant="hero"
          toolbar={
            <span className="trendChip up">
              <ArrowGlyph direction="up" /> +12% this month
            </span>
          }
        >
          <div className="cashHero">
            <div>
              <strong className="cashAmount">{currency(cashOnHand)}</strong>
              <p>Across your operating account.</p>
              <ul className="miniStats">
                <li>
                  <span>Money owed to you</span>
                  <strong>{currency(moneyOwedToYou)}</strong>
                </li>
                <li>
                  <span>Money you owe</span>
                  <strong>{currency(moneyYouOwe)}</strong>
                </li>
                <li>
                  <span>Net this period</span>
                  <strong className={netIncome >= 0 ? "good" : "danger"}>
                    {signedCurrency(netIncome)}
                  </strong>
                </li>
              </ul>
            </div>
            <AreaSpark series={cashSeries} />
          </div>
        </Portlet>

        <Portlet title="Quick tools">
          <div className="quickToolGrid">
            {quickTools.map((tool) => (
              <a className={`quickTool ${tool.tone}`} href={tool.href} key={tool.title}>
                <span className="toolMonogram" aria-hidden>
                  {tool.monogram}
                </span>
                <strong>{tool.title}</strong>
                <small>{tool.caption}</small>
              </a>
            ))}
          </div>
        </Portlet>

        <Portlet title="How you're doing">
          <div className="kpiGrid">
            <KpiCard
              label="Sales this period"
              value={currency(revenueAccount?.balance ?? 0)}
              change="+13.5% vs last period"
              direction="up"
              series={[12, 16, 14, 19, 22, 26, 28, 33, 36]}
            />
            <KpiCard
              label="Expenses"
              value={currency(expenseTotal)}
              change="+3.5% vs last period"
              direction="down"
              series={[8, 9, 7, 11, 10, 13, 12, 14, 15]}
            />
            <KpiCard
              label="Cash on hand"
              value={currency(cashOnHand)}
              change="+6.0% vs last period"
              direction="up"
              series={[4, 5, 7, 6, 8, 9, 11, 12, 14]}
            />
            <KpiCard
              label="Net income"
              value={currency(netIncome)}
              change={netIncome >= 0 ? "+10.2% vs last period" : "-3.5% vs last period"}
              direction={netIncome >= 0 ? "up" : "down"}
              series={[3, 4, 6, 5, 8, 9, 11, 13, 14]}
            />
          </div>

          <h3 className="subSectionTitle">What changed recently</h3>
          <ul className="activityFeed">
            {recentEntries.map((entry) => (
              <ActivityRow key={entry.id} dataset={dataset} entry={entry} />
            ))}
          </ul>
        </Portlet>
      </div>

      <aside className="portletColumn">
        <Portlet
          title="Sales trend"
          toolbar={
            <select className="portletSelect" defaultValue="By Month">
              <option>By Month</option>
              <option>By Quarter</option>
              <option>By Year</option>
            </select>
          }
        >
          <RevenueChart series={salesSeries} />
          <ul className="chartLegend">
            <li>
              <span className="legendDot" /> Sales
            </li>
            <li>
              <span className="legendDot dashed" /> 3-month average
            </li>
          </ul>
        </Portlet>

        <Portlet
          title="Compliance & METRC"
          toolbar={
            <a className="portletLinkAction" href="/compliance">
              Open compliance {"\u2192"}
            </a>
          }
        >
          <div className="complianceSnapshot">
            <div className="complianceStats">
              <div className={highSeverity.length > 0 ? "danger" : ""}>
                <span>High priority</span>
                <strong>{highSeverity.length}</strong>
              </div>
              <div>
                <span>Tax due May 20</span>
                <strong>{currency(totalTaxDue)}</strong>
              </div>
              <div className={renewalsSoon.length > 0 ? "danger" : ""}>
                <span>Licenses to renew</span>
                <strong>{renewalsSoon.length}</strong>
              </div>
            </div>
            <ul className="complianceList">
              {openCompliance.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <span className={`complianceDot sev-${item.severity}`} aria-hidden />
                  <div>
                    <strong>{item.title}</strong>
                    <small>
                      {item.framework} {"\u00B7"} due {formatActivityDate(item.dueOn)}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
            <a className="portalSnapshotCta" href="/compliance">
              See all {openCompliance.length} items {"\u2192"}
            </a>
          </div>
        </Portlet>

        <Portlet
          title="Auditor portal"
          toolbar={
            <a className="portletLinkAction" href="/portal">
              Open portal {"\u2192"}
            </a>
          }
        >
          <div className="portalSnapshot">
            <div className="portalSnapshotStats">
              <div>
                <span>Open requests</span>
                <strong>{openRequests.length}</strong>
              </div>
              <div className={overdueRequests.length > 0 ? "danger" : ""}>
                <span>Overdue</span>
                <strong>{overdueRequests.length}</strong>
              </div>
              <div>
                <span>Conversations</span>
                <strong>{dataset.conversations.length}</strong>
              </div>
            </div>
            {latestMessage ? (
              <div className="portalSnapshotMessage">
                <strong>{latestMessageSender?.name ?? "Unknown"}</strong>
                <p>{latestMessage.body}</p>
              </div>
            ) : null}
            <a className="portalSnapshotCta" href="/portal">
              Reply in portal {"\u2192"}
            </a>
          </div>
        </Portlet>

        <Portlet title="Get paid faster">
          {openInvoices.length === 0 ? (
            <p className="emptyState">All caught up. Nice work.</p>
          ) : (
            <ul className="getPaidList">
              {openInvoices.map((invoice) => (
                <li key={invoice.id}>
                  <div>
                    <strong>{invoice.counterparty}</strong>
                    <small>
                      {invoice.number} {"\u00B7"} due {invoice.dueOn}
                    </small>
                  </div>
                  <div className="getPaidAmount">
                    <strong>{currency(invoice.openAmount)}</strong>
                    <a href="#ar-ap">Send reminder</a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Portlet>

        <Portlet
          title="License tracker"
          toolbar={
            <a className="portletLinkAction" href="/compliance">
              All licenses {"\u2192"}
            </a>
          }
        >
          <ul className="topList">
            {dataset.licenses.map((license) => (
              <li key={license.id}>
                <span className={`jurisdictionPill jur-${license.jurisdiction}`}>
                  {license.jurisdiction}
                </span>
                <div>
                  <strong>{license.locationName}</strong>
                  <small>
                    {license.licenseNumber} {"\u00B7"} expires {formatActivityDate(license.expiresOn)}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </Portlet>
      </aside>
    </section>
  );
}

function KpiCard({
  label,
  value,
  change,
  direction,
  series
}: {
  label: string;
  value: string;
  change: string;
  direction: "up" | "down";
  series: number[];
}) {
  return (
    <div className="kpiCard">
      <span className="kpiLabel">{label}</span>
      <strong className={`kpiValue ${direction === "up" ? "good" : "danger"}`}>
        <ArrowGlyph direction={direction} /> {value}
      </strong>
      <Sparkline values={series} direction={direction} />
      <small>{change}</small>
    </div>
  );
}

function SetupChecklist({ tasks }: { tasks: typeof setupTasks }) {
  const done = tasks.filter((task) => task.done).length;
  const pct = Math.round((done / tasks.length) * 100);

  return (
    <div className="setup">
      <div className="setupHeader">
        <strong>
          {done} of {tasks.length} done
        </strong>
        <span>{pct}% complete</span>
      </div>
      <div className="setupBar">
        <span style={{ width: `${pct}%` }} />
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? "done" : "pending"}>
            <CheckGlyph done={task.done} />
            {task.label}
          </li>
        ))}
      </ul>
      <a className="setupCta" href="#overview">
        Finish setup {"\u2192"}
      </a>
    </div>
  );
}

function ActivityRow({
  dataset,
  entry
}: {
  dataset: AccountingDataset;
  entry: JournalEntry;
}) {
  const totalDebit = entry.lines.reduce((sum, line) => sum + line.debit, 0);
  const cashLine = entry.lines.find((line) => {
    const account = dataset.accounts.find((accountRecord) => accountRecord.id === line.accountId);
    return account?.code === "1000";
  });
  const direction: "in" | "out" | "neutral" = cashLine
    ? cashLine.debit > 0
      ? "in"
      : "out"
    : "neutral";
  const amount = cashLine ? (cashLine.debit > 0 ? cashLine.debit : -cashLine.credit) : totalDebit;

  return (
    <li className={`activityRow ${direction}`}>
      <span className="activityDate">{formatActivityDate(entry.date)}</span>
      <div className="activityBody">
        <strong>{entry.description}</strong>
        <small>{entry.entryNumber}</small>
      </div>
      <span className="activityAmount">{signedCurrency(amount)}</span>
    </li>
  );
}

function formatActivityDate(iso: string): string {
  const parts = iso.split("-").map(Number);
  const year = parts[0] ?? 1970;
  const month = (parts[1] ?? 1) - 1;
  const day = parts[2] ?? 1;
  const date = new Date(Date.UTC(year, month, day));

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  });
}

function Sparkline({
  values,
  direction
}: {
  values: number[];
  direction: "up" | "down";
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const width = 140;
  const height = 36;
  const stepX = width / Math.max(values.length - 1, 1);
  const points = values
    .map((value, idx) => {
      const x = idx * stepX;
      const y = height - ((value - min) / Math.max(max - min, 1)) * (height - 4) - 2;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      className={`sparkline ${direction}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline points={points} fill="none" strokeWidth="1.6" />
    </svg>
  );
}

function AreaSpark({ series }: { series: number[] }) {
  const width = 320;
  const height = 140;
  const padX = 4;
  const padY = 8;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const stepX = (width - padX * 2) / Math.max(series.length - 1, 1);
  const points = series.map((value, idx) => ({
    x: padX + idx * stepX,
    y: padY + (1 - (value - min) / Math.max(max - min, 1)) * (height - padY * 2)
  }));
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L${(width - padX).toFixed(2)},${(height - padY).toFixed(2)} L${padX.toFixed(2)},${(height - padY).toFixed(2)} Z`;

  return (
    <svg className="cashSpark" viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <defs>
        <linearGradient id="cashFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(79,60,201,0.45)" />
          <stop offset="100%" stopColor="rgba(79,60,201,0)" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#cashFill)" />
      <path d={linePath} stroke="#4f3cc9" strokeWidth="2.2" fill="none" />
    </svg>
  );
}

function RevenueChart({ series }: { series: number[] }) {
  const width = 320;
  const height = 160;
  const padX = 4;
  const padY = 14;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const stepX = (width - padX * 2) / Math.max(series.length - 1, 1);
  const points = series.map((value, idx) => ({
    x: padX + idx * stepX,
    y: padY + (1 - (value - min) / Math.max(max - min, 1)) * (height - padY * 2)
  }));
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L${(width - padX).toFixed(2)},${(height - padY).toFixed(2)} L${padX.toFixed(2)},${(height - padY).toFixed(2)} Z`;

  return (
    <svg className="revenueChart" viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <defs>
        <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(16,185,129,0.45)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0)" />
        </linearGradient>
      </defs>
      <line
        x1={padX}
        x2={width - padX}
        y1={height - padY}
        y2={height - padY}
        stroke="#ebe6d8"
        strokeWidth="1"
      />
      <path d={areaPath} fill="url(#salesFill)" />
      <path d={linePath} stroke="#10b981" strokeWidth="2.2" fill="none" />
    </svg>
  );
}

function ArrowGlyph({ direction }: { direction: "up" | "down" }) {
  if (direction === "up") {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
        <polygon points="5,1 9,9 1,9" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <polygon points="5,9 1,1 9,1" fill="currentColor" />
    </svg>
  );
}

function CheckGlyph({ done }: { done: boolean }) {
  if (done) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="4 12 10 18 20 6" />
      </svg>
    );
  }

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
