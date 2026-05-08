import { AppToolbar } from "@/components/app-toolbar";
import { ArApDashboard } from "@/components/ar-ap-dashboard";
import { HomePortlets } from "@/components/home-portlets";
import { LedgerDashboard } from "@/components/ledger-dashboard";
import { ReconciliationDashboard } from "@/components/reconciliation-dashboard";
import { dataset } from "@/domain/sample-data";

export default function Home() {
  const firstName = (dataset.users[0]?.name ?? "there").split(" ")[0];

  return (
    <>
      <AppToolbar dataset={dataset} />

      <div className="pageBar" id="overview">
        <div>
          <p className="pageBarEyebrow">
            Today {"\u00B7"} <span className="jurisdictionPill jur-CO">CO</span>
            <span className="jurisdictionPill jur-IL" style={{ marginLeft: 4 }}>
              IL
            </span>
          </p>
          <h1>Hi {firstName}, welcome back.</h1>
          <p className="pageBarSubtitle">
            {dataset.company.name} - cannabis accounting built for Colorado and Illinois
            dispensaries. METRC, POS, and your CPA all in one place.
          </p>
        </div>
        <div className="pageBarActions">
          <a href="/inventory">Sync inventory</a>
          <a href="/compliance">Compliance</a>
          <button type="button" className="primaryCta">
            + Add new
          </button>
        </div>
      </div>

      <main>
        <HomePortlets dataset={dataset} />

        <section id="ledger" className="pageSection">
          <div className="sectionHeading">
            <p className="eyebrow">Books</p>
            <h2>Your ledger and audit trail</h2>
          </div>
          <LedgerDashboard dataset={dataset} />
        </section>

        <section id="reconciliation" className="pageSection">
          <div className="sectionHeading">
            <p className="eyebrow">Bank</p>
            <h2>Reconcile your bank in minutes</h2>
          </div>
          <ReconciliationDashboard dataset={dataset} />
        </section>

        <section id="ar-ap" className="pageSection">
          <div className="sectionHeading">
            <p className="eyebrow">Money in &amp; out</p>
            <h2>Wholesale customers, vendors, and what they owe</h2>
          </div>
          <ArApDashboard dataset={dataset} />
        </section>

        <section id="reports" className="pageSection">
          <div className="sectionHeading">
            <p className="eyebrow">Exports</p>
            <h2>Reports made for sharing</h2>
          </div>
          <div className="reportShelf">
            <article>
              <span>Monthly</span>
              <strong>Profit &amp; loss snapshot</strong>
              <p>A clean one-page summary perfect for investors and accountants.</p>
            </article>
            <article>
              <span>Bank</span>
              <strong>Reconciliation report</strong>
              <p>What cleared, what is outstanding, and what still needs a receipt.</p>
            </article>
            <article>
              <span>Audit-ready</span>
              <strong>Evidence package</strong>
              <p>Ties every journal line to a source document for stress-free audits.</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
