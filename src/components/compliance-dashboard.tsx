import { currency } from "@/domain/accounting";
import type {
  AccountingDataset,
  ComplianceItem,
  ComplianceSeverity,
  ComplianceStatus,
  Jurisdiction,
  License,
  LicenseStatus,
  TaxFiling,
  TaxFilingStatus
} from "@/domain/types";
import type { ReactNode } from "react";

type Props = {
  dataset: AccountingDataset;
};

const TODAY = "2026-05-07";

function Portlet({
  title,
  toolbar,
  children
}: {
  title: string;
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="portlet">
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

export function ComplianceDashboard({ dataset }: Props) {
  const open = dataset.complianceItems.filter((item) => item.status !== "complete");
  const high = open.filter((item) => item.severity === "high");
  const dueThisWeek = open.filter((item) => daysUntil(item.dueOn) <= 14);
  const taxesDueSoon = dataset.taxFilings.filter((filing) => filing.status === "due_soon");
  const totalTaxLiability = dataset.taxFilings.reduce(
    (sum, filing) => sum + filing.estimatedAmount,
    0
  );

  return (
    <>
      <section className="portalStatsRow">
        <StatCard
          label="Open compliance items"
          value={open.length}
          caption={`${high.length} high severity`}
          tone={high.length > 0 ? "danger" : "info"}
        />
        <StatCard
          label="Due in next 14 days"
          value={dueThisWeek.length}
          caption="Across CO, IL, and federal"
          tone={dueThisWeek.length > 0 ? "danger" : "good"}
        />
        <StatCard
          label="Estimated tax due May 20"
          value={currency(totalTaxLiability)}
          caption={`${taxesDueSoon.length} filings`}
          tone="info"
        />
        <StatCard
          label="Active licenses"
          value={dataset.licenses.filter((license) => license.status !== "expired").length}
          caption={`${
            dataset.licenses.filter((license) => license.status === "renewal_due").length
          } need renewal`}
          tone={
            dataset.licenses.some((license) => license.status === "renewal_due")
              ? "danger"
              : "good"
          }
        />
      </section>

      <section className="portalGrid">
        <div className="portalColumn">
          <Portlet
            title="Compliance work queue"
            toolbar={
              <button type="button" className="primaryCta sm">
                + Add item
              </button>
            }
          >
            <div className="requestList">
              {open.map((item) => (
                <ComplianceCard key={item.id} item={item} />
              ))}
            </div>
          </Portlet>

          <Portlet title="Tax filings">
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Filing</th>
                    <th>Period</th>
                    <th>Rate</th>
                    <th>Estimated</th>
                    <th>Due</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.taxFilings.map((filing) => (
                    <tr key={filing.id}>
                      <td>
                        <strong>{filing.name}</strong>
                        <small className="muted">
                          <JurisdictionBadge jurisdiction={filing.jurisdiction} />
                          {filing.formNumber ? ` ${filing.formNumber}` : ""}
                        </small>
                      </td>
                      <td>{filing.period}</td>
                      <td>{filing.rate}</td>
                      <td>{currency(filing.estimatedAmount)}</td>
                      <td>{formatDate(filing.dueOn)}</td>
                      <td>
                        <span className={`statusPill ${taxStatusClass(filing.status)}`}>
                          {taxStatusLabel(filing.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Portlet>

          <Portlet title="280E classification helper">
            <div className="evidenceCard">
              <h3>Why this matters</h3>
              <p>
                Under IRC 280E, cannabis operators cannot deduct ordinary selling and G&amp;A
                expenses. Only direct Cost of Goods Sold is deductible. Misclassifying expenses can
                cause large effective tax increases.
              </p>
              <ul className="mappingList">
                <li>
                  <strong className="good">COGS-deductible (5000)</strong>
                  <small>
                    Inventory purchases, cultivation labor, packaging, freight to dispensary, lab
                    testing, METRC tag fees attached to product
                  </small>
                </li>
                <li>
                  <strong className="danger">280E-disallowed (selling &amp; G&amp;A)</strong>
                  <small>
                    Retail rent, security guards, marketing, sales staff, executive salaries,
                    administrative software not tied to production
                  </small>
                </li>
              </ul>
              <div className="requestActions">
                <button type="button" className="ghostButton">
                  Open expense review
                </button>
                <button type="button" className="primaryCta sm">
                  Run 280E report
                </button>
              </div>
            </div>
          </Portlet>
        </div>

        <aside className="portalColumn">
          <Portlet title="Licenses">
            <div className="licenseList">
              {dataset.licenses.map((license) => (
                <LicenseCard key={license.id} license={license} />
              ))}
            </div>
          </Portlet>

          <Portlet title="State guardrails">
            <ul className="mappingList">
              <li>
                <strong>
                  <JurisdictionBadge jurisdiction="CO" /> Colorado MED
                </strong>
                <small>
                  15% retail marijuana excise + 2.9% state sales tax + local taxes. Monthly DR 0500
                  filing. METRC required for every package.
                </small>
              </li>
              <li>
                <strong>
                  <JurisdictionBadge jurisdiction="IL" /> Illinois IDFPR
                </strong>
                <small>
                  Cannabis purchaser excise tax 10-25% based on potency, plus 6.25% state sales
                  tax. Monthly REG-1 filing. METRC required statewide.
                </small>
              </li>
              <li>
                <strong>Banking</strong>
                <small>
                  SAFE Banking still pending. Cash management, vault drops, and BSA-aligned cash
                  logs are first-class citizens here.
                </small>
              </li>
            </ul>
          </Portlet>

          <Portlet title="Need a hand?">
            <p className="emptyState">
              Loop in your auditor with one click. Casey Patel from 420 Accounting Co. is already
              connected to this engagement.
            </p>
            <div className="requestActions">
              <a href="/portal" className="ghostButton">
                Open portal
              </a>
              <a href="/portal" className="primaryCta sm">
                Send a request
              </a>
            </div>
          </Portlet>
        </aside>
      </section>
    </>
  );
}

function ComplianceCard({ item }: { item: ComplianceItem }) {
  const days = daysUntil(item.dueOn);
  const overdue = days < 0;

  return (
    <article className="requestCard">
      <header>
        <div className="requestStatusRow">
          <span className={`statusPill ${severityClass(item.severity)}`}>
            {severityLabel(item.severity)} priority
          </span>
          <span className={`statusPill ${complianceStatusClass(item.status)}`}>
            {complianceStatusLabel(item.status)}
          </span>
          {overdue ? <span className="statusPill status-overdue">Overdue</span> : null}
          {item.jurisdiction ? <JurisdictionBadge jurisdiction={item.jurisdiction} /> : null}
        </div>
        <small>{overdue ? `${Math.abs(days)}d overdue` : `Due in ${days}d`}</small>
      </header>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <ul className="requestMeta">
        <li>
          <span>Framework</span>
          <strong>{item.framework}</strong>
        </li>
        <li>
          <span>Due</span>
          <strong>{formatDate(item.dueOn)}</strong>
        </li>
      </ul>
      <div className="requestActions">
        <button type="button" className="ghostButton">
          Assign
        </button>
        <button type="button" className="ghostButton">
          Open in portal
        </button>
        <button type="button" className="primaryCta sm">
          Mark complete
        </button>
      </div>
    </article>
  );
}

function LicenseCard({ license }: { license: License }) {
  const days = daysUntil(license.expiresOn);
  const renewalSoon = days <= 120 && license.status !== "expired";

  return (
    <article className={`licenseCard status-${license.status}`}>
      <header>
        <JurisdictionBadge jurisdiction={license.jurisdiction} />
        <span className={`statusPill ${licenseStatusClass(license.status)}`}>
          {licenseStatusLabel(license.status)}
        </span>
      </header>
      <h3>{license.locationName}</h3>
      <p className="muted">{licenseTypeLabel(license.type)}</p>
      <ul className="requestMeta">
        <li>
          <span>License #</span>
          <strong>{license.licenseNumber}</strong>
        </li>
        <li>
          <span>Authority</span>
          <strong>{license.issuingAuthority}</strong>
        </li>
        <li>
          <span>Issued</span>
          <strong>{formatDate(license.issuedOn)}</strong>
        </li>
        <li>
          <span>Expires</span>
          <strong>{formatDate(license.expiresOn)}</strong>
        </li>
      </ul>
      {renewalSoon ? (
        <p className="requestNote">
          <strong>Heads up:</strong> {days} days until renewal. Start the application now to avoid
          a lapse.
        </p>
      ) : null}
    </article>
  );
}

function StatCard({
  label,
  value,
  caption,
  tone
}: {
  label: string;
  value: string | number;
  caption: string;
  tone: "neutral" | "info" | "danger" | "good";
}) {
  return (
    <div className={`statCard tone-${tone}`}>
      <span className="statLabel">{label}</span>
      <strong>{value}</strong>
      <small>{caption}</small>
    </div>
  );
}

function JurisdictionBadge({ jurisdiction }: { jurisdiction: Jurisdiction }) {
  return <span className={`jurisdictionPill jur-${jurisdiction}`}>{jurisdiction}</span>;
}

function severityClass(severity: ComplianceSeverity): string {
  switch (severity) {
    case "high":
      return "status-needs_more";
    case "medium":
      return "status-open";
    case "low":
      return "status-submitted";
    default:
      return "";
  }
}

function severityLabel(severity: ComplianceSeverity): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

function complianceStatusLabel(status: ComplianceStatus): string {
  switch (status) {
    case "open":
      return "Open";
    case "in_review":
      return "In review";
    case "in_progress":
      return "In progress";
    case "due_soon":
      return "Due soon";
    case "complete":
      return "Complete";
    default:
      return status;
  }
}

function complianceStatusClass(status: ComplianceStatus): string {
  switch (status) {
    case "complete":
      return "status-approved";
    case "in_progress":
    case "in_review":
      return "status-submitted";
    case "due_soon":
      return "status-needs_more";
    case "open":
      return "status-open";
    default:
      return "";
  }
}

function licenseStatusLabel(status: LicenseStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "renewal_due":
      return "Renewal due";
    case "expired":
      return "Expired";
    case "pending":
      return "Pending";
    default:
      return status;
  }
}

function licenseStatusClass(status: LicenseStatus): string {
  switch (status) {
    case "active":
      return "status-approved";
    case "renewal_due":
      return "status-needs_more";
    case "expired":
      return "status-overdue";
    case "pending":
      return "status-open";
    default:
      return "";
  }
}

function licenseTypeLabel(type: License["type"]): string {
  switch (type) {
    case "retail":
      return "Retail dispensary";
    case "cultivation":
      return "Cultivation";
    case "manufacturing":
      return "Infused product manufacturing";
    case "transporter":
      return "Transporter";
    case "delivery":
      return "Delivery";
    default:
      return type;
  }
}

function taxStatusLabel(status: TaxFilingStatus): string {
  switch (status) {
    case "due_soon":
      return "Due soon";
    case "filed":
      return "Filed";
    case "overdue":
      return "Overdue";
    default:
      return status;
  }
}

function taxStatusClass(status: TaxFilingStatus): string {
  switch (status) {
    case "due_soon":
      return "status-needs_more";
    case "filed":
      return "status-approved";
    case "overdue":
      return "status-overdue";
    default:
      return "";
  }
}

function daysUntil(iso: string): number {
  const today = new Date(`${TODAY}T12:00:00Z`);
  const target = new Date(`${iso}T12:00:00Z`);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function formatDate(iso: string): string {
  const parts = iso.split("-").map(Number);
  const year = parts[0] ?? 1970;
  const month = (parts[1] ?? 1) - 1;
  const day = parts[2] ?? 1;
  return new Date(Date.UTC(year, month, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
}
