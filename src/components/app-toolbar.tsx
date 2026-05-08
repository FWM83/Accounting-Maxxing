import type { AccountingDataset } from "@/domain/types";

type Props = {
  dataset: AccountingDataset;
  activeModule?: string;
};

const modules = [
  { label: "Dashboard", href: "/" },
  { label: "Money in", href: "/#ar-ap" },
  { label: "Money out", href: "/#ar-ap" },
  { label: "Bank", href: "/#reconciliation" },
  { label: "Books", href: "/#ledger" },
  { label: "Inventory", href: "/inventory" },
  { label: "Compliance", href: "/compliance" },
  { label: "Reports", href: "/#reports" },
  { label: "Portal", href: "/portal" },
  { label: "Settings", href: "/" }
];

export function AppToolbar({ dataset, activeModule = "Dashboard" }: Props) {
  const user = dataset.users[0];
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  const friendlyRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <header className="appShell">
      <div className="utilityBar">
        <a className="brand" href="/" aria-label="Codex home">
          <img
            className="brandMark"
            src="/codex-logo.png"
            alt=""
            width={32}
            height={32}
          />
          <span className="brandWordmark">Codex</span>
        </a>
        <div className="utilitySearch">
          <SearchGlyph />
          <input
            type="search"
            placeholder="Search packages, METRC tags, invoices, journal entries"
            aria-label="Global search"
          />
          <kbd>{"\u2318"}K</kbd>
        </div>
        <div className="utilityActions">
          <button type="button" className="utilityLink">
            Help
          </button>
          <button type="button" className="utilityLink">
            What&apos;s new
          </button>
          <div className="userChip" role="group" aria-label="Active user">
            <span className="userAvatar" aria-hidden>
              {initials}
            </span>
            <div>
              <strong>{user.name}</strong>
              <small>
                {dataset.company.name} {"\u00B7"} {friendlyRole}
              </small>
            </div>
          </div>
        </div>
      </div>

      <nav className="moduleBar" aria-label="Primary modules">
        <div className="moduleQuickActions">
          <a className="active" href="/" aria-label="Home">
            <HomeGlyph />
          </a>
          <button type="button" aria-label="Recent records">
            <ClockGlyph />
          </button>
          <button type="button" aria-label="Saved views">
            <StarGlyph />
          </button>
        </div>
        <div className="moduleLinks">
          {modules.map((module) => (
            <a
              key={module.label}
              href={module.href}
              className={module.label === activeModule ? "active" : undefined}
            >
              {module.label}
            </a>
          ))}
        </div>
        <div className="moduleAside">
          <button type="button" className="moduleNew">
            + New
          </button>
        </div>
      </nav>
    </header>
  );
}

function HomeGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 11l9-8 9 8" />
      <path d="M5 9v12h14V9" />
    </svg>
  );
}

function ClockGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function StarGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="12 3 14.7 8.6 21 9.5 16.5 13.9 17.6 20 12 17 6.4 20 7.5 13.9 3 9.5 9.3 8.6 12 3" />
    </svg>
  );
}

function SearchGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
