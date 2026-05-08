import { currency } from "@/domain/accounting";
import type {
  AccountingDataset,
  Integration,
  IntegrationStatus,
  IntegrationType
} from "@/domain/types";
import type { ReactNode } from "react";

type Props = {
  dataset: AccountingDataset;
};

const TODAY = "2026-05-07T17:30:00.000Z";

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

export function InventoryDashboard({ dataset }: Props) {
  const totalUnits = dataset.inventorySnapshot.reduce((sum, item) => sum + item.units, 0);
  const totalValue = dataset.inventorySnapshot.reduce(
    (sum, item) => sum + item.valueAtCost,
    0
  );
  const totalPackages = dataset.inventorySnapshot.reduce(
    (sum, item) => sum + item.metrcPackages,
    0
  );
  const lowStockCount = dataset.inventorySnapshot.filter((item) => item.lowStock).length;

  const connectedIntegrations = dataset.integrations.filter(
    (integration) => integration.status === "connected"
  );
  const availableIntegrations = dataset.integrations.filter(
    (integration) => integration.status === "available"
  );

  return (
    <>
      <section className="portalStatsRow">
        <StatCard
          label="Inventory units on hand"
          value={totalUnits.toLocaleString("en-US")}
          caption={`${totalPackages} METRC packages`}
          tone="info"
        />
        <StatCard
          label="Inventory value at cost"
          value={currency(totalValue)}
          caption="Used for COGS and 280E"
          tone="good"
        />
        <StatCard
          label="Low-stock alerts"
          value={lowStockCount}
          caption="Categories under reorder"
          tone={lowStockCount > 0 ? "danger" : "good"}
        />
        <StatCard
          label="Live integrations"
          value={connectedIntegrations.length}
          caption={`Across CO + IL + POS`}
          tone="info"
        />
      </section>

      <section className="portalGrid">
        <div className="portalColumn">
          <Portlet
            title="Inventory snapshot"
            toolbar={
              <div className="portletToolbar">
                <button type="button" className="ghostButton">
                  Sync now
                </button>
                <button type="button" className="primaryCta sm">
                  Export to GL
                </button>
              </div>
            }
          >
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Units</th>
                    <th>METRC packages</th>
                    <th>Value at cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.inventorySnapshot.map((item) => (
                    <tr key={item.category}>
                      <td>
                        <strong>{item.category}</strong>
                      </td>
                      <td>{item.units.toLocaleString("en-US")}</td>
                      <td>{item.metrcPackages}</td>
                      <td>{currency(item.valueAtCost)}</td>
                      <td>
                        <span className={`statusPill ${item.lowStock ? "status-needs_more" : "status-approved"}`}>
                          {item.lowStock ? "Low stock" : "Healthy"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Portlet>

          <Portlet title="Connected integrations">
            <div className="integrationGrid">
              {connectedIntegrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </Portlet>

          <Portlet
            title="Available integrations"
            toolbar={
              <button type="button" className="utilityLink">
                Browse marketplace
              </button>
            }
          >
            <div className="integrationGrid">
              {availableIntegrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </Portlet>
        </div>

        <aside className="portalColumn">
          <Portlet title="Sync activity">
            <ul className="activityFeed">
              {connectedIntegrations.map((integration) => (
                <li key={integration.id} className="activityRow neutral">
                  <span className="activityDate">{relativeTime(integration.lastSyncAt)}</span>
                  <div className="activityBody">
                    <strong>{integration.name}</strong>
                    <small>
                      Pulled {integration.itemsSynced?.toLocaleString("en-US")} records
                      {integration.jurisdiction ? ` (${integration.jurisdiction})` : ""}
                    </small>
                  </div>
                  <span className="activityAmount">OK</span>
                </li>
              ))}
            </ul>
          </Portlet>

          <Portlet title="How POS data maps to your books">
            <ul className="mappingList">
              <li>
                <strong>POS sale</strong>
                <small>
                  Debits Cash, credits Cannabis Sales Revenue, credits Excise &amp; Sales Tax
                  Payable
                </small>
              </li>
              <li>
                <strong>METRC package transfer</strong>
                <small>Updates Cannabis Inventory by category and weight</small>
              </li>
              <li>
                <strong>Vendor purchase</strong>
                <small>Debits Cannabis Inventory, credits Accounts Payable</small>
              </li>
              <li>
                <strong>Daily close</strong>
                <small>Posts COGS-Cannabis from sold packages, locks the day</small>
              </li>
            </ul>
          </Portlet>

          <Portlet title="Need a custom feed?">
            <p className="emptyState">
              Drop a daily POS export into the CSV import or talk to support about a direct API
              integration. We have prebuilt mappings for Flowhub, Dutchie, Treez, Cova, and
              BioTrack.
            </p>
            <div className="requestActions">
              <button type="button" className="ghostButton">
                Upload CSV
              </button>
              <button type="button" className="primaryCta sm">
                Request integration
              </button>
            </div>
          </Portlet>
        </aside>
      </section>
    </>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <article className={`integrationCard tone-${typeToTone(integration.type)}`}>
      <header>
        <span className="integrationMonogram" aria-hidden>
          {integration.vendorMonogram}
        </span>
        <div>
          <strong>{integration.name}</strong>
          <small>{typeLabel(integration.type)}</small>
        </div>
        <span className={`statusPill ${statusClass(integration.status)}`}>
          {statusLabel(integration.status)}
        </span>
      </header>
      <p>{integration.description}</p>
      <footer>
        {integration.lastSyncAt ? (
          <small>Last sync {relativeTime(integration.lastSyncAt)}</small>
        ) : (
          <small>Not connected yet</small>
        )}
        {integration.status === "connected" ? (
          <button type="button" className="ghostButton">
            Configure
          </button>
        ) : (
          <button type="button" className="primaryCta sm">
            Connect
          </button>
        )}
      </footer>
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

function statusLabel(status: IntegrationStatus): string {
  switch (status) {
    case "connected":
      return "Connected";
    case "available":
      return "Available";
    case "error":
      return "Error";
    default:
      return status;
  }
}

function statusClass(status: IntegrationStatus): string {
  switch (status) {
    case "connected":
      return "status-approved";
    case "available":
      return "status-submitted";
    case "error":
      return "status-needs_more";
    default:
      return "";
  }
}

function typeLabel(type: IntegrationType): string {
  switch (type) {
    case "pos":
      return "Point of sale";
    case "track-and-trace":
      return "State track-and-trace";
    case "ecommerce":
      return "Online ordering";
    case "manual":
      return "Manual import";
    case "banking":
      return "Banking";
    default:
      return type;
  }
}

function typeToTone(type: IntegrationType): "info" | "good" | "neutral" {
  if (type === "track-and-trace") {
    return "good";
  }

  if (type === "pos" || type === "ecommerce") {
    return "info";
  }

  return "neutral";
}

function relativeTime(iso?: string): string {
  if (!iso) {
    return "Never";
  }

  const now = new Date(TODAY);
  const then = new Date(iso);
  const diffMin = Math.max(0, Math.round((now.getTime() - then.getTime()) / 60000));

  if (diffMin < 1) {
    return "just now";
  }

  if (diffMin < 60) {
    return `${diffMin} min ago`;
  }

  const hours = Math.round(diffMin / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
