import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Home, Building2, CalendarRange, RefreshCcw, CircleDollarSign, Wrench, Users,
  BarChart3, FolderOpen, Settings, HelpCircle, ShieldCheck,
  ChevronDown, ArrowRight, CalendarDays,
} from "lucide-react";
import { supabase } from "../lib/supabase";

// =====================================================================
// Airtable access token — provided at build time via the VITE_AIRTABLE_PAT
// environment variable (set it in Vercel → Project Settings → Environment Variables).
// Never commit the token itself.
// =====================================================================
const AIRTABLE_PAT = (import.meta as any).env?.VITE_AIRTABLE_PAT || "";
const AIRTABLE_BASE = "app2SaraxJ53msJB2";
const TABLE = "Bookings";

const SAGE = "#9DA07E";
const SAGE_DARK = "#8A8D6D";
const CREAM = "#FDFCF8";
const INK = "#2D2D2D";
const MUTED = "#AFAFAF";
const HAIRLINE = "#F1F1EE";

const COHOST_RATE = 0.2; // 20% co-host management fee
const PROCESS_RATE = 0.03; // 3% payment processing

const AUTHORIZED_EMAILS = ["grantashl1@gmail.com", "donki.bmbr@gmail.com", "bookings@carlsonproperties.co.nz"];

const navItems = [
  { label: "Dashboard", icon: Home },
  { label: "Properties", icon: Building2 },
  { label: "Reservations", icon: CalendarRange },
  { label: "Turnovers", icon: RefreshCcw },
  { label: "Financials", icon: CircleDollarSign, active: true },
  { label: "Maintenance", icon: Wrench },
  { label: "Owners", icon: Users },
  { label: "Reports", icon: BarChart3 },
  { label: "SOP Library", icon: FolderOpen },
  { label: "Settings", icon: Settings },
];

const tabs = ["Overview", "Ledger", "Payouts", "Expenses", "Taxes"] as const;
type Tab = (typeof tabs)[number];
const ledgerViews = ["All Transactions", "By Property", "By Type", "Payouts"] as const;

const stripBom = (s: string) => String(s).replace(/^\uFEFF/, "").replace(/[\u200B-\u200D\u2060]/g, "").trim();
const getField = (rec: any, key: string) => {
  const k = Object.keys(rec.fields || {}).find((x) => stripBom(x).toLowerCase() === key.toLowerCase());
  return k === undefined ? undefined : rec.fields[k];
};
const money = (n: number) => "$" + (Math.round(n) || 0).toLocaleString();
const fmtDate = (d?: string) => {
  if (!d) return "—";
  return new Date(d + (d.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-NZ", { month: "short", day: "numeric", year: "numeric" });
};
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Txn {
  id: string;
  date: string; // Check In
  checkOut: string;
  property: string;
  type: "Payout" | "Expense";
  description: string;
  amount: number; // Revenue
  customer: string;
  channel: string;
  nights: number;
  notes: string;
  email: string;
  phone: string;
  invoice: number;
}

export function FinancialsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("Overview");
  const [ledgerView, setLedgerView] = useState<(typeof ledgerViews)[number]>("All Transactions");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [period, setPeriod] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ---- Auth (Owner Portal) ----
  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email || !AUTHORIZED_EMAILS.includes(session.user.email.toLowerCase())) {
          toast.error("Unauthorized Access");
          navigate("/owner-login");
          return;
        }
        setAuthorized(true);
      } catch {
        navigate("/owner-login");
      }
    })();
  }, [navigate]);

  // ---- Fetch Airtable ----
  useEffect(() => {
    if (authorized !== true) return;
    if (!AIRTABLE_PAT) {
      setError("Airtable token is not configured. Set VITE_AIRTABLE_PAT in Vercel (or server-side) to enable the Financials page.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        let all: any[] = [];
        let offset: string | undefined;
        do {
          const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(TABLE)}?pageSize=100` + (offset ? `&offset=${encodeURIComponent(offset)}` : "");
          const res = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_PAT}` } });
          if (!res.ok) throw new Error(`Airtable ${res.status}`);
          const data = await res.json();
          all = all.concat(data.records || []);
          offset = data.offset;
        } while (offset);

        const txns: Txn[] = all
          .map((rec, i) => {
            const revenue = Number(getField(rec, "Revenue") || 0);
            const ci = String(getField(rec, "Check In") || "");
            const notes = String(getField(rec, "Notes") || "") + (String(getField(rec, "Special Requests/Booking Notes") || "") ? " · " + String(getField(rec, "Special Requests/Booking Notes")) : "");
            return {
              id: rec.id || String(i),
              date: ci.slice(0, 10),
              checkOut: String(getField(rec, "Check Out") || "").slice(0, 10),
              property: String(getField(rec, "Property") || "Property"),
              type: (revenue >= 0 ? "Payout" : "Expense") as Txn["type"],
              description: notes || (String(getField(rec, "Booking Channel") || "") || "Guest payment"),
              amount: Math.abs(revenue),
              customer: String(getField(rec, "Customer Name") || "Guest"),
              channel: String(getField(rec, "Booking Channel") || ""),
              nights: Number(getField(rec, "Nights Stayed") || 0),
              notes,
              email: String(getField(rec, "Email") || ""),
              phone: String(getField(rec, "Cellphone") || ""),
              invoice: Number(getField(rec, "ID/Invoice Number") || 0),
            };
          })
          .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

        setRows(txns);
        setSelectedId(txns[0]?.id ?? null);
      } catch (e: any) {
        setError(e.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, [authorized]);

  const properties = useMemo(() => [...new Set(rows.map((r) => r.property))].sort(), [rows]);
  const periods = useMemo(() => {
    const set = new Set(rows.map((r) => (r.date || "").slice(0, 7)));
    return [...set].sort().reverse().map((m) => ({ value: m, label: `${MONTHS[Number(m.slice(5)) - 1]} ${m.slice(0, 4)}` }));
  }, [rows]);

  const filtered = useMemo(() => rows.filter((r) => {
    if (propertyFilter !== "all" && r.property !== propertyFilter) return false;
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (period !== "all" && (r.date || "").slice(0, 7) !== period) return false;
    return true;
  }), [rows, propertyFilter, typeFilter, period]);

  const grossRevenue = useMemo(() => rows.reduce((s, r) => s + r.amount, 0), [rows]);
  const cohost = grossRevenue * COHOST_RATE;
  const processing = grossRevenue * PROCESS_RATE;
  const netProfit = grossRevenue - cohost - processing;
  const paidOut = cohost + processing;

  const overviewKpis = [
    { label: "Gross Revenue", value: grossRevenue },
    { label: "Total Expenses", value: 0 },
    { label: "Net Profit", value: netProfit },
    { label: "Paid Out", value: paidOut },
  ];
  const ledgerPreview = rows.slice(0, 6);

  if (authorized !== true) {
    return (
      <OuterShell>
        <div className="flex items-center justify-center py-40 text-[#666]">Checking access…</div>
      </OuterShell>
    );
  }
  if (loading) {
    return (
      <OuterShell>
        <div className="flex items-center justify-center py-40 text-[#666]">
          <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-[#9DA07E] border-t-transparent" />
          Loading financial data…
        </div>
      </OuterShell>
    );
  }

  return (
    <OuterShell>
      <div className="px-8 py-8 xl:px-12">
        <div className="mb-6">
          <h1 className="font-serif text-4xl text-[#2D2D2D]">Financials</h1>
          <p className="text-[#666] mt-1">Automated ledger, real-time insights, full transparency.</p>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-1 border-b" style={{ borderColor: HAIRLINE }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${tab === t ? "text-[#2D2D2D]" : "text-[#AFAFAF] hover:text-[#2D2D2D]"}`}
              style={{ borderColor: tab === t ? SAGE : "transparent" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Top filters: All Properties + Date */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-[#2D2D2D]" style={{ borderColor: HAIRLINE, background: "#fff" }}>
            <Building2 size={15} className="text-[#9DA07E]" />
            <select className="bg-transparent text-sm outline-none" value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)}>
              <option value="all">All Properties</option>
              {properties.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={14} className="text-[#AFAFAF]" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-[#2D2D2D]" style={{ borderColor: HAIRLINE, background: "#fff" }}>
            <CalendarDays size={15} className="text-[#9DA07E]" />
            <select className="bg-transparent text-sm outline-none" value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="all">All Time</option>
              {periods.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="text-[#AFAFAF]" />
          </div>
          {(propertyFilter !== "all" || period !== "all" || typeFilter !== "all") && (
            <button onClick={() => { setPropertyFilter("all"); setPeriod("all"); setTypeFilter("all"); }} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#9DA07E]">Clear</button>
          )}
        </div>

        {tab === "Overview" && <OverviewView kpis={overviewKpis} preview={ledgerPreview} onViewLedger={() => setTab("Ledger")} />}
        {tab === "Ledger" && (
          <LedgerView rows={filtered} view={ledgerView} setView={setLedgerView} typeFilter={typeFilter} setTypeFilter={setTypeFilter} selectedId={selectedId} setSelectedId={setSelectedId} properties={properties} />
        )}
        {tab === "Payouts" && <EmptyTab title="Payouts" text="Owner payout runs and their status will appear here." />}
        {tab === "Expenses" && <EmptyTab title="Expenses" text="Cleaning, linen, repairs and other operating costs will appear here once an expense source is connected." />}
        {tab === "Taxes" && <EmptyTab title="Taxes" text="GST and withholding summaries will appear here." />}

        {error && <p className="mt-4 text-sm text-red-600">Could not load data: {error}</p>}
      </div>
    </OuterShell>
  );
}

// ---------------- Overview ----------------
function OverviewView({ kpis, preview, onViewLedger }: { kpis: { label: string; value: number }[]; preview: Txn[]; onViewLedger: () => void }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border p-5 shadow-sm" style={{ borderColor: HAIRLINE, background: "#fff" }}>
            <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-[#AFAFAF]">{k.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#2D2D2D]">{money(k.value)}</p>
          </div>
        ))}
      </div>

      {/* Ledger preview */}
      <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm" style={{ borderColor: HAIRLINE }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-[#2D2D2D]">Ledger Preview</h2>
          <button onClick={onViewLedger} className="flex items-center gap-1 text-sm font-medium" style={{ color: SAGE_DARK }}>
            View Full Ledger <ArrowRight size={15} />
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: HAIRLINE }}>
          {preview.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-3 text-sm">
              <div className="min-w-0">
                <p className="truncate text-[#2D2D2D] font-medium">{r.customer}</p>
                <p className="text-xs text-[#AFAFAF]">{fmtDate(r.date)} · {r.property}</p>
              </div>
              <div className="text-right">
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: "rgba(16,185,129,0.12)", color: "#059669" }}>{r.type}</span>
                <p className="mt-1 font-semibold text-[#2D2D2D]">{money(r.amount)}</p>
              </div>
            </div>
          ))}
          {preview.length === 0 && <p className="py-6 text-center text-[#AFAFAF]">No transactions.</p>}
        </div>
      </div>
    </div>
  );
}

// ---------------- Ledger ----------------
function LedgerView({ rows, view, setView, typeFilter, setTypeFilter, selectedId, setSelectedId, properties }: any) {
  const display = useMemo(() => {
    let r = rows;
    if (view === "Payouts") r = r.filter((x: Txn) => x.type === "Payout");
    if (view === "By Type") return { type: "type" as const, rows: r };
    if (view === "By Property") return { type: "property" as const, rows: r };
    return { type: "flat" as const, rows: r };
  }, [rows, view]);

  const groupKey = (r: Txn) => (display.type === "property" ? r.property : r.type);
  const grouped = display.type === "flat" ? null : display.rows.reduce<Record<string, Txn[]>>((acc, r) => {
    const k = groupKey(r);
    (acc[k] = acc[k] || []).push(r);
    return acc;
  }, {});

  return (
    <div className="rounded-3xl border bg-white p-4 shadow-sm" style={{ borderColor: HAIRLINE }}>
      {/* Sub-tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-2 border-b pb-3" style={{ borderColor: HAIRLINE }}>
        {(["All Transactions", "By Property", "By Type", "Payouts"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${view === v ? "text-white" : "text-[#666]"}`}
            style={view === v ? { background: SAGE } : { background: "#FAFAF6" }}>
            {v}
          </button>
        ))}
        {/* Type filter */}
        <div className="ml-auto flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-[#2D2D2D]" style={{ borderColor: HAIRLINE }}>
          <select className="bg-transparent text-sm outline-none" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="Payout">Payout</option>
            <option value="Expense">Expense</option>
          </select>
          <ChevronDown size={14} className="text-[#AFAFAF]" />
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-xs text-[#AFAFAF]" style={{ borderColor: HAIRLINE }}>
            <th className="py-2 pr-3 font-medium">Date</th>
            <th className="py-2 pr-3 font-medium">Property</th>
            <th className="py-2 pr-3 font-medium">Type</th>
            <th className="py-2 pr-3 font-medium">Description</th>
            <th className="py-2 pr-3 font-medium">Customer</th>
            <th className="py-2 pr-3 font-medium">Channel</th>
            <th className="py-2 pr-3 font-medium">Check-Out</th>
            <th className="py-2 pr-3 font-medium">Nights</th>
            <th className="py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {display.type === "flat" && display.rows.map((r: Txn) => <TxnRow key={r.id} r={r} selectedId={selectedId} setSelectedId={setSelectedId} />)}
          {display.type !== "flat" && Object.entries(grouped || {}).map(([key, items]) => (
            <React.Fragment key={key}>
              <tr><td colSpan={9} className="pt-4 pb-1 text-xs font-bold uppercase tracking-wider text-[#9DA07E]">{key}</td></tr>
              {(items as Txn[]).map((r) => <TxnRow key={r.id} r={r} selectedId={selectedId} setSelectedId={setSelectedId} />)}
            </React.Fragment>
          ))}
          {display.rows.length === 0 && <tr><td colSpan={9} className="py-10 text-center text-[#AFAFAF]">No transactions.</td></tr>}
        </tbody>
      </table>

      <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm" style={{ borderColor: HAIRLINE }}>
        <p className="text-[#AFAFAF]">Showing {display.rows.length} transactions</p>
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[#9DA07E]" size={18} />
          <span className="font-semibold text-[#2D2D2D]">Total {money(display.rows.reduce((s: number, r: Txn) => s + r.amount, 0))}</span>
        </div>
      </div>
    </div>
  );
}

function TxnRow({ r, selectedId, setSelectedId }: { r: Txn; selectedId: string | null; setSelectedId: (id: string) => void }) {
  const isSel = r.id === selectedId;
  return (
    <tr onClick={() => setSelectedId(r.id)} className="cursor-pointer border-b text-sm transition-colors"
      style={{ borderColor: HAIRLINE, background: isSel ? "rgba(157,160,126,0.08)" : undefined }}>
      <td className="py-3 pr-3 text-[#2D2D2D] whitespace-nowrap">{fmtDate(r.date)}</td>
      <td className="py-3 pr-3"><span className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] text-white" style={{ background: SAGE }}>{r.property.charAt(0)}</span> <span className="ml-1.5 text-[#2D2D2D]">{r.property}</span></td>
      <td className="py-3 pr-3"><span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: r.type === "Payout" ? "rgba(16,185,129,0.12)" : "rgba(244,114,182,0.12)", color: r.type === "Payout" ? "#059669" : "#db2777" }}>{r.type}</span></td>
      <td className="max-w-[220px] truncate py-3 pr-3 text-[#666]" title={r.description}>{r.description || "—"}</td>
      <td className="py-3 pr-3 text-[#2D2D2D] whitespace-nowrap">{r.customer}</td>
      <td className="py-3 pr-3 text-[#2D2D2D] whitespace-nowrap">{r.channel || "—"}</td>
      <td className="py-3 pr-3 text-[#2D2D2D] whitespace-nowrap">{fmtDate(r.checkOut)}</td>
      <td className="py-3 pr-3 text-[#2D2D2D]">{r.nights || "—"}</td>
      <td className="py-3 text-right font-semibold text-[#2D2D2D] whitespace-nowrap">{money(r.amount)}</td>
    </tr>
  );
}

function EmptyTab({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border bg-white p-12 text-center shadow-sm" style={{ borderColor: HAIRLINE }}>
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: SAGE }}><BarChart3 size={20} /></span>
      <h2 className="font-serif text-xl text-[#2D2D2D]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#AFAFAF]">{text}</p>
    </div>
  );
}

function OuterShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDFCF8]" style={{ background: CREAM }}>
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="hidden w-60 shrink-0 border-r lg:block" style={{ borderColor: HAIRLINE, background: "#FBFBF7" }}>
          <div className="p-5">
            <div className="mb-8 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: SAGE }}>CP</span>
              <span className="font-serif text-lg text-[#2D2D2D]">Carlson</span>
            </div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#AFAFAF]">Navigation</p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
                    style={item.active ? { color: SAGE, background: "rgba(157,160,126,0.12)", fontWeight: 600 } : { color: "#666" }}>
                    <Icon size={18} /> {item.label} {item.active && <ChevronRight size={14} className="ml-auto" />}
                  </a>
                );
              })}
            </nav>
            <div className="mt-8 flex items-start gap-2 text-xs text-[#AFAFAF]"><HelpCircle size={16} className="mt-0.5" /><p>Need help?<br />Visit our help center.</p></div>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
