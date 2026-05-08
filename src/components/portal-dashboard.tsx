import type {
  AccountingDataset,
  Conversation,
  DocumentRequest,
  DocumentRequestStatus,
  PortalMessage,
  Role,
  User
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

export function PortalDashboard({ dataset }: Props) {
  const requests = dataset.documentRequests;
  const openRequests = requests.filter((req) => req.status !== "approved");
  const approvedRequests = requests.filter((req) => req.status === "approved");
  const submittedRequests = requests.filter((req) => req.status === "submitted");
  const overdueRequests = requests.filter(
    (req) => req.status !== "approved" && req.dueOn < TODAY
  );

  return (
    <>
      <section className="portalStatsRow">
        <StatCard
          label="Open requests"
          value={openRequests.length}
          caption="Awaiting your team"
          tone="info"
        />
        <StatCard
          label="Awaiting auditor"
          value={submittedRequests.length}
          caption="Submitted, in review"
          tone="neutral"
        />
        <StatCard
          label="Overdue"
          value={overdueRequests.length}
          caption="Past their due date"
          tone={overdueRequests.length > 0 ? "danger" : "good"}
        />
        <StatCard
          label="Active conversations"
          value={dataset.conversations.length}
          caption="With your audit team"
          tone="neutral"
        />
      </section>

      <section className="portalGrid">
        <div className="portalColumn">
          <Portlet
            title="Open document requests"
            toolbar={
              <button type="button" className="primaryCta sm">
                + New request
              </button>
            }
          >
            <div className="requestList">
              {openRequests.length === 0 ? (
                <p className="emptyState">All caught up. No open requests.</p>
              ) : (
                openRequests.map((request) => (
                  <RequestCard key={request.id} request={request} dataset={dataset} />
                ))
              )}
            </div>
          </Portlet>

          {approvedRequests.length > 0 ? (
            <Portlet title="Recently approved">
              <div className="requestList">
                {approvedRequests.map((request) => (
                  <RequestCard key={request.id} request={request} dataset={dataset} />
                ))}
              </div>
            </Portlet>
          ) : null}
        </div>

        <aside className="portalColumn">
          <Portlet
            title="Conversations"
            toolbar={
              <button type="button" className="utilityLink">
                + New thread
              </button>
            }
          >
            <div className="conversationList">
              {dataset.conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  dataset={dataset}
                />
              ))}
            </div>
          </Portlet>

          <Portlet title="People in this engagement">
            <ul className="participantList">
              {dataset.users.map((user) => (
                <li key={user.id}>
                  <span className="participantAvatar" aria-hidden>
                    {initialsOf(user.name)}
                  </span>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{roleLabel(user.role)}</small>
                  </div>
                  <span className={`rolePill role-${user.role}`}>{roleShort(user.role)}</span>
                </li>
              ))}
            </ul>
          </Portlet>
        </aside>
      </section>
    </>
  );
}

function StatCard({
  label,
  value,
  caption,
  tone
}: {
  label: string;
  value: number;
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

function RequestCard({
  request,
  dataset
}: {
  request: DocumentRequest;
  dataset: AccountingDataset;
}) {
  const requester = dataset.users.find((user) => user.id === request.requesterUserId);
  const recipient = dataset.users.find((user) => user.id === request.recipientUserId);
  const linkedEntry = request.journalEntryId
    ? dataset.journalEntries.find((entry) => entry.id === request.journalEntryId)
    : undefined;
  const linkedPeriod = request.periodId
    ? dataset.periods.find((period) => period.id === request.periodId)
    : undefined;
  const conversation = request.conversationId
    ? dataset.conversations.find((conv) => conv.id === request.conversationId)
    : undefined;
  const latestMessage = conversation
    ? [...dataset.messages]
        .filter((message) => message.conversationId === conversation.id)
        .sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1))[0]
    : undefined;
  const latestSender = latestMessage
    ? dataset.users.find((user) => user.id === latestMessage.senderUserId)
    : undefined;
  const isOverdue = request.status !== "approved" && request.dueOn < TODAY;

  return (
    <article className="requestCard">
      <header>
        <div className="requestStatusRow">
          <span className={`statusPill status-${request.status}`}>
            {statusLabel(request.status)}
          </span>
          {isOverdue ? <span className="statusPill status-overdue">Overdue</span> : null}
        </div>
        <small>Due {formatDate(request.dueOn)}</small>
      </header>

      <h3>{request.title}</h3>
      <p>{request.description}</p>

      <ul className="requestMeta">
        <li>
          <span>Requested by</span>
          <strong>{requester?.name ?? "Unknown"}</strong>
        </li>
        <li>
          <span>Assigned to</span>
          <strong>{recipient?.name ?? "Unknown"}</strong>
        </li>
        {linkedEntry ? (
          <li>
            <span>Linked entry</span>
            <strong>{linkedEntry.entryNumber}</strong>
          </li>
        ) : null}
        {linkedPeriod ? (
          <li>
            <span>Period</span>
            <strong>{linkedPeriod.name}</strong>
          </li>
        ) : null}
      </ul>

      <div className="attachments">
        <div className="attachmentLabel">
          <PaperclipGlyph /> Attachments
        </div>
        {request.attachmentDocumentIds.length > 0 ? (
          <ul>
            {request.attachmentDocumentIds.map((docId) => {
              const doc = dataset.documents.find((document) => document.id === docId);
              return doc ? (
                <li key={docId} className="attachmentChip">
                  {doc.name}
                </li>
              ) : null;
            })}
          </ul>
        ) : (
          <p className="emptyState">No documents uploaded yet.</p>
        )}
      </div>

      {request.notes ? (
        <p className="requestNote">
          <strong>Note:</strong> {request.notes}
        </p>
      ) : null}

      {latestMessage ? (
        <div className="latestMessage">
          <strong>{latestSender?.name ?? "Unknown"}</strong>
          <span> {"\u00B7"} {timeAgo(latestMessage.sentAt)}</span>
          <p>{latestMessage.body}</p>
        </div>
      ) : null}

      <div className="requestActions">
        <button type="button" className="ghostButton">
          Reply
        </button>
        <button type="button" className="ghostButton">
          Upload document
        </button>
        {request.status !== "approved" ? (
          <button type="button" className="primaryCta sm">
            Mark complete
          </button>
        ) : null}
      </div>
    </article>
  );
}

function ConversationCard({
  conversation,
  dataset
}: {
  conversation: Conversation;
  dataset: AccountingDataset;
}) {
  const messages: PortalMessage[] = dataset.messages
    .filter((message) => message.conversationId === conversation.id)
    .sort((a, b) => (a.sentAt < b.sentAt ? -1 : 1));
  const participants: User[] = conversation.participantIds
    .map((id) => dataset.users.find((user) => user.id === id))
    .filter((user): user is User => Boolean(user));

  return (
    <article className="conversationCard">
      <header>
        <div>
          <h3>{conversation.subject}</h3>
          <small>{participants.map((participant) => participant.name).join(" \u00B7 ")}</small>
        </div>
        {conversation.unreadCount > 0 ? (
          <span className="unreadPill">{conversation.unreadCount} new</span>
        ) : null}
      </header>
      <div className="messageThread">
        {messages.map((message) => {
          const sender = dataset.users.find((user) => user.id === message.senderUserId);
          const isExternal = sender?.role === "auditor";

          return (
            <div
              key={message.id}
              className={`messageBubble ${isExternal ? "external" : "internal"}`}
            >
              <header>
                <strong>{sender?.name ?? "Unknown"}</strong>
                <small>{formatDateTime(message.sentAt)}</small>
              </header>
              <p>{message.body}</p>
            </div>
          );
        })}
      </div>
      <div className="composeBox">
        <textarea placeholder="Type a reply..." rows={2} />
        <div className="composeActions">
          <button type="button" className="ghostButton">
            Attach
          </button>
          <button type="button" className="primaryCta sm">
            Send
          </button>
        </div>
      </div>
    </article>
  );
}

function statusLabel(status: DocumentRequestStatus): string {
  switch (status) {
    case "open":
      return "Open";
    case "submitted":
      return "Submitted";
    case "needs_more":
      return "Needs more info";
    case "approved":
      return "Approved";
    default:
      return status;
  }
}

function roleLabel(role: Role): string {
  switch (role) {
    case "admin":
      return "Owner / Admin";
    case "accountant":
      return "Accountant";
    case "bookkeeper":
      return "Bookkeeper";
    case "auditor":
      return "External auditor";
    case "viewer":
      return "Viewer";
    default:
      return role;
  }
}

function roleShort(role: Role): string {
  switch (role) {
    case "auditor":
      return "External";
    case "admin":
      return "Owner";
    case "accountant":
      return "Internal";
    case "bookkeeper":
      return "Internal";
    case "viewer":
      return "Viewer";
    default:
      return role;
  }
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function formatDate(iso: string): string {
  const parts = iso.split("-").map(Number);
  const year = parts[0] ?? 1970;
  const month = (parts[1] ?? 1) - 1;
  const day = parts[2] ?? 1;
  return new Date(Date.UTC(year, month, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC"
  });
}

function timeAgo(iso: string): string {
  const todayDate = new Date(`${TODAY}T12:00:00Z`);
  const sent = new Date(iso);
  const diffMs = todayDate.getTime() - sent.getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days <= 0) {
    return "today";
  }

  if (days === 1) {
    return "yesterday";
  }

  return `${days} days ago`;
}

function PaperclipGlyph() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21.4 11.6 12 21a6 6 0 1 1-8.5-8.5L13 2.9a4 4 0 1 1 5.6 5.6L9 18a2 2 0 1 1-2.8-2.8L15 6.4" />
    </svg>
  );
}
