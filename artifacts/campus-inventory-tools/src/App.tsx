import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, Boxes, CalendarDays, Check, ClipboardCopy, FileText, Hash, PackageCheck, Plus, Printer, RotateCcw, ScanLine, ShoppingBag, Sparkles, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type ReceiptItem = { id: number; name: string; quantity: number; unitPrice: number };
type AdjustmentType = 'none' | 'discount' | 'tax';

const money = (value: number) => `$${value.toFixed(2)}`;
const today = () => new Date().toISOString().slice(0, 10);

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline" data-testid="link-home-logo">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[4px_4px_0_hsl(var(--accent))]">
        <Boxes size={21} strokeWidth={2.4} />
      </span>
      <span className="leading-none">
        <span className="block text-[15px] font-bold tracking-[-0.03em]">Campus</span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">inventory tools</span>
      </span>
    </Link>
  );
}

function TopNav() {
  const [location] = useLocation();
  return (
    <header className="no-print mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Logo />
      <nav className="flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.72)] p-1 backdrop-blur-sm" aria-label="Main navigation">
        <Link href="/receipt" data-testid="link-nav-receipt" className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 ${location === '/receipt' ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}>
          Receipts
        </Link>
        <Link href="/sku" data-testid="link-nav-sku" className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 ${location === '/sku' ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}>
          SKU maker
        </Link>
      </nav>
    </header>
  );
}

function PageIntro({ eyebrow, title, description, icon }: { eyebrow: string; title: string; description: string; icon: ReactNode }) {
  return (
    <div className="fade-up mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <div className="mb-3 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.19em] text-[hsl(var(--primary))]">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[hsl(var(--secondary))]">{icon}</span>
          {eyebrow}
        </div>
        <h1 className="max-w-2xl text-4xl font-bold leading-[.98] tracking-[-0.055em] sm:text-6xl">{title}</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-6 text-[hsl(var(--muted-foreground))]">{description}</p>
      </div>
      <div className="hidden shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))] sm:flex">
        <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" /> local only / ready to use
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="app-shell">
      <TopNav />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <section className="grid items-end gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div className="fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] px-3 py-2 font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">
              <Sparkles size={13} className="text-[hsl(var(--accent))]" /> campus shop toolkit / 01
            </div>
            <h1 className="max-w-3xl text-6xl font-bold leading-[.88] tracking-[-0.07em] sm:text-8xl">
              From loose details<span className="text-[hsl(var(--accent))]">.</span><br />
              To <span className="text-[hsl(var(--primary))]">ready</span> stock.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[hsl(var(--muted-foreground))] sm:text-lg">
              Two focused tools for the moments that make a campus shop run smoothly: a receipt that adds up, and a SKU that makes sense.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/receipt" data-testid="link-hero-receipt" className="button-lift inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3.5 text-sm font-bold text-[hsl(var(--primary-foreground))]">
                Make a receipt <ArrowRight size={16} />
              </Link>
              <Link href="/sku" data-testid="link-hero-sku" className="button-lift inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)] px-5 py-3.5 text-sm font-bold hover:bg-[hsl(var(--card))]">
                Generate a SKU <Hash size={16} />
              </Link>
            </div>
          </div>
          <div className="fade-up fade-up-delay-2 relative min-h-[310px] overflow-hidden rounded-[2rem] bg-[hsl(var(--sidebar))] p-6 text-[hsl(var(--sidebar-foreground))] shadow-[var(--shadow-card)] sm:p-8">
            <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[20px] border-[hsl(var(--accent)/.65)]" />
            <div className="absolute bottom-[-58px] left-[-38px] h-40 w-40 rounded-full bg-[hsl(var(--secondary)/.35)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.65)]">
                <span>Today&apos;s counter</span><span>02 tools</span>
              </div>
              <div>
                <p className="font-mono text-xs text-[hsl(var(--accent))]">01 / prepare</p>
                <p className="mt-3 max-w-sm text-3xl font-semibold leading-tight tracking-[-.04em]">Good records make good handovers.</p>
              </div>
              <div className="flex items-end justify-between border-t border-[hsl(var(--sidebar-border))] pt-4 font-mono text-[10px] uppercase tracking-[.13em] text-[hsl(var(--sidebar-foreground)/.62)]">
                <span>built for practicals</span><ScanLine size={20} className="text-[hsl(var(--accent))]" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24" aria-labelledby="tools-heading">
          <div className="mb-6 flex items-end justify-between">
            <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">Choose your station</p><h2 id="tools-heading" className="mt-2 text-3xl font-bold tracking-[-.05em]">Two tools. Zero clutter.</h2></div>
            <span className="hidden font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))] sm:block">Everything stays in this browser</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/receipt" data-testid="card-receipt-tool" className="group button-lift relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[var(--shadow-card)] sm:p-8">
              <div className="absolute right-6 top-6 text-[hsl(var(--accent))] transition-transform group-hover:rotate-12"><FileText size={38} strokeWidth={1.4} /></div>
              <span className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">01 / sales desk</span>
              <h3 className="mt-12 text-3xl font-bold tracking-[-.06em]">Receipt Generator</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">Capture a customer, price several items, then leave with a clean total and a print-ready summary.</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]">Open Skills Test <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></span>
            </Link>
            <Link href="/sku" data-testid="card-sku-tool" className="group button-lift relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)] p-6 shadow-[var(--shadow-card)] sm:p-8">
              <div className="absolute right-6 top-6 text-[hsl(var(--primary))] transition-transform group-hover:-rotate-12"><Hash size={38} strokeWidth={1.4} /></div>
              <span className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">02 / stock room</span>
              <h3 className="mt-12 text-3xl font-bold tracking-[-.06em]">SKU Generator</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">Turn a product category, name, and stock count into one compact code your team can track.</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]">Open Project <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></span>
            </Link>
          </div>
        </section>

        <section className="mt-16 flex flex-col gap-4 border-t border-[hsl(var(--border))] pt-6 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-[.13em]">Campus Inventory Tools <span className="text-[hsl(var(--accent))]">/</span> practical ICT project</p>
          <p>Local state only. No account, no upload, no fuss.</p>
        </section>
      </main>
    </div>
  );
}

function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return <label className="mb-2 flex items-baseline justify-between gap-2 text-xs font-bold text-[hsl(var(--foreground))]"><span>{children}</span>{hint && <span className="font-normal text-[hsl(var(--muted-foreground))]">{hint}</span>}</label>;
}

function ReceiptPage() {
  // Receipt form state is intentionally local: this tool should work offline and reset instantly.
  const [customer, setCustomer] = useState('');
  const [receiptDate, setReceiptDate] = useState(today());
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('none');
  const [adjustmentValue, setAdjustmentValue] = useState('');
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [formError, setFormError] = useState('');

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), [items]);
  const adjustmentAmount = adjustmentType === 'none' ? 0 : subtotal * (Math.max(0, Number(adjustmentValue) || 0) / 100);
  const grandTotal = adjustmentType === 'discount' ? subtotal - adjustmentAmount : subtotal + adjustmentAmount;

  const addItem = (event: FormEvent) => {
    event.preventDefault();
    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(unitPrice);
    if (!itemName.trim() || !Number.isFinite(parsedQuantity) || parsedQuantity < 1 || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setFormError('Add an item name, a whole quantity, and a valid price.');
      return;
    }
    setItems((current) => [...current, { id: Date.now(), name: itemName.trim(), quantity: parsedQuantity, unitPrice: parsedPrice }]);
    setItemName('');
    setQuantity('1');
    setUnitPrice('');
    setFormError('');
  };

  const resetReceipt = () => {
    setCustomer(''); setReceiptDate(today()); setItemName(''); setQuantity('1'); setUnitPrice('');
    setAdjustmentType('none'); setAdjustmentValue(''); setItems([]); setFormError('');
  };

  return (
    <div className="app-shell">
      <TopNav />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <PageIntro eyebrow="Receipt Generator / Skills Test" title="Make every total tell the truth." description="Set up the customer, build the basket, and check your work in the receipt preview. Add as many line items as you need." icon={<FileText size={14} />} />
        <div className="grid gap-7 lg:grid-cols-[1.08fr_.92fr]">
          <section className="fade-up-delay-1 fade-up space-y-5">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)] p-5 shadow-[var(--shadow-card)] sm:p-7">
              <div className="mb-6 flex items-center justify-between border-b border-[hsl(var(--border))] pb-4">
                <div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Step 01</p><h2 className="mt-1 text-xl font-bold tracking-[-.04em]">Customer details</h2></div>
                <CalendarDays size={19} className="text-[hsl(var(--accent))]" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><FieldLabel hint="required">Customer name</FieldLabel><input data-testid="input-customer-name" className="input-control" value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="e.g. Amina Bello" /></div>
                <div><FieldLabel hint="required">Date</FieldLabel><input data-testid="input-receipt-date" type="date" className="input-control" value={receiptDate} onChange={(event) => setReceiptDate(event.target.value)} /></div>
              </div>
            </div>
            <form onSubmit={addItem} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)] p-5 shadow-[var(--shadow-card)] sm:p-7">
              <div className="mb-6 flex items-center justify-between border-b border-[hsl(var(--border))] pb-4">
                <div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Step 02</p><h2 className="mt-1 text-xl font-bold tracking-[-.04em]">Add line item</h2></div>
                <ShoppingBag size={19} className="text-[hsl(var(--accent))]" />
              </div>
              <div className="grid gap-4 sm:grid-cols-[1.3fr_.5fr_.7fr]">
                <div><FieldLabel>Item name</FieldLabel><input data-testid="input-item-name" className="input-control" value={itemName} onChange={(event) => setItemName(event.target.value)} placeholder="e.g. Practical notebook" /></div>
                <div><FieldLabel>Qty</FieldLabel><input data-testid="input-item-quantity" type="number" min="1" step="1" className="input-control" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></div>
                <div><FieldLabel>Unit price</FieldLabel><div className="relative"><span className="pointer-events-none absolute left-3 top-3 text-sm text-[hsl(var(--muted-foreground))]">$</span><input data-testid="input-item-price" type="number" min="0" step="0.01" className="input-control pl-7" value={unitPrice} onChange={(event) => setUnitPrice(event.target.value)} placeholder="0.00" /></div></div>
              </div>
              {formError && <p data-testid="status-receipt-form-error" className="mt-3 text-xs font-semibold text-[hsl(var(--destructive))]">{formError}</p>}
              <button data-testid="button-add-item" type="submit" className="button-lift mt-5 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))]"><Plus size={16} /> Add item</button>
            </form>
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)] p-5 shadow-[var(--shadow-card)] sm:p-7">
              <div className="mb-5 flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Step 03</p><h2 className="mt-1 text-xl font-bold tracking-[-.04em]">Fine tune total</h2></div><span className="rounded-full bg-[hsl(var(--muted))] px-2.5 py-1 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">optional</span></div>
              <div className="grid gap-4 sm:grid-cols-[.8fr_1fr]">
                <div><FieldLabel>Adjustment</FieldLabel><select data-testid="select-adjustment-type" className="input-control" value={adjustmentType} onChange={(event) => setAdjustmentType(event.target.value as AdjustmentType)}><option value="none">No adjustment</option><option value="discount">Discount</option><option value="tax">Tax</option></select></div>
                <div><FieldLabel hint={adjustmentType === 'none' ? 'not active' : 'percentage'}>Rate</FieldLabel><div className="relative"><input data-testid="input-adjustment-value" disabled={adjustmentType === 'none'} type="number" min="0" max="100" step="0.1" className="input-control pr-9 disabled:cursor-not-allowed disabled:opacity-45" value={adjustmentValue} onChange={(event) => setAdjustmentValue(event.target.value)} placeholder="0" /><span className="pointer-events-none absolute right-3 top-3 text-sm text-[hsl(var(--muted-foreground))]">%</span></div></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button data-testid="button-reset-receipt" type="button" onClick={resetReceipt} className="button-lift inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] px-4 py-3 text-sm font-bold hover:bg-[hsl(var(--card))]"><RotateCcw size={15} /> Clear receipt</button>
              <button data-testid="button-print-receipt" type="button" onClick={() => window.print()} className="button-lift inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-4 py-3 text-sm font-bold text-[hsl(var(--accent-foreground))]"><Printer size={15} /> Print preview</button>
            </div>
          </section>

          <section className="fade-up fade-up-delay-2 receipt-paper print-area h-fit rounded-sm p-6 sm:p-8" aria-label="Receipt preview">
            <div className="flex items-start justify-between border-b-2 border-dashed border-[hsl(var(--foreground)/.2)] pb-5">
              <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Campus Inventory Tools</p><h2 className="mt-2 text-3xl font-bold tracking-[-.07em]">SALES RECEIPT</h2></div>
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"><Check size={20} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-dashed border-[hsl(var(--foreground)/.16)] py-5 text-xs">
              <div><p className="font-mono uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Customer</p><p data-testid="text-receipt-customer" className="mt-1 font-bold">{customer || 'Awaiting name'}</p></div>
              <div className="text-right"><p className="font-mono uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Date</p><p data-testid="text-receipt-date" className="mt-1 font-bold">{receiptDate || '—'}</p></div>
            </div>
            <div className="min-h-[200px] border-b border-dashed border-[hsl(var(--foreground)/.16)] py-5">
              {items.length === 0 ? <div data-testid="empty-receipt-items" className="flex min-h-[160px] flex-col items-center justify-center text-center"><ShoppingBag size={27} className="mb-3 text-[hsl(var(--muted-foreground)/.55)]" /><p className="text-sm font-semibold text-[hsl(var(--muted-foreground))]">Your basket is empty</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Add an item to start the receipt.</p></div> : <div className="space-y-3">{items.map((item) => <div data-testid={`row-receipt-item-${item.id}`} key={item.id} className="group grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm"><div><p className="font-semibold">{item.name}</p><p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{item.quantity} × {money(item.unitPrice)}</p></div><span className="font-mono text-xs font-medium">{money(item.quantity * item.unitPrice)}</span><button data-testid={`button-remove-item-${item.id}`} type="button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} className="rounded-md p-1 text-[hsl(var(--muted-foreground))] opacity-60 transition hover:bg-[hsl(var(--destructive)/.12)] hover:text-[hsl(var(--destructive))] sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Remove ${item.name}`}><X size={14} /></button></div>)}</div>}
            </div>
            <div className="space-y-2 py-5 text-sm">
              <div className="flex justify-between text-[hsl(var(--muted-foreground))]"><span>Subtotal</span><span data-testid="text-receipt-subtotal" className="font-mono">{money(subtotal)}</span></div>
              {adjustmentType !== 'none' && <div className="flex justify-between text-[hsl(var(--muted-foreground))]"><span>{adjustmentType === 'discount' ? 'Discount' : 'Tax'} ({adjustmentValue || 0}%)</span><span data-testid="text-receipt-adjustment" className="font-mono">{adjustmentType === 'discount' ? '−' : '+'}{money(adjustmentAmount)}</span></div>}
              <div className="mt-4 flex items-end justify-between border-t-2 border-[hsl(var(--foreground)/.8)] pt-4"><span className="font-bold">Total due</span><span data-testid="text-receipt-total" className="font-mono text-2xl font-medium tracking-[-.06em]">{money(Math.max(0, grandTotal))}</span></div>
            </div>
            <div className="border-t border-dashed border-[hsl(var(--foreground)/.16)] pt-5 text-center"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Thank you for supporting campus life</p><p data-testid="text-receipt-item-count" className="mt-2 text-[11px] text-[hsl(var(--muted-foreground))]">{items.length} line item{items.length === 1 ? '' : 's'} recorded</p></div>
          </section>
        </div>
      </main>
    </div>
  );
}

function createSku(category: string, product: string, stock: string) {
  // Keep the recipe readable: category prefix + product signal + padded stock + short unique suffix.
  const categoryPart = category.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase().padEnd(3, 'X');
  const productWords = product.trim().split(/\s+/).filter(Boolean);
  const productPart = (productWords.length > 1 ? productWords.map((word) => word[0]).join('') : productWords[0] || 'ITEM').replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase().padEnd(2, 'X');
  const stockPart = String(Math.max(0, Number(stock) || 0)).padStart(3, '0');
  const uniquePart = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${categoryPart}-${productPart}-${stockPart}-${uniquePart}`;
}

function SkuPage() {
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = (event: FormEvent) => {
    event.preventDefault();
    if (!category.trim() || !product.trim() || stock === '' || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      setError('Complete all three fields. Stock must be a whole number of zero or more.');
      return;
    }
    const nextSku = createSku(category, product, stock);
    setSku(nextSku);
    setHistory((current) => [nextSku, ...current].slice(0, 4));
    setError('');
    setCopied(false);
  };

  const copySku = async (value = sku) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Copy is unavailable in this browser. Select the code and copy it manually.');
    }
  };

  const resetSku = () => { setCategory(''); setProduct(''); setStock(''); setSku(''); setHistory([]); setError(''); setCopied(false); };

  return (
    <div className="app-shell">
      <TopNav />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <PageIntro eyebrow="SKU Generator / Project" title="Give every product a proper place." description="A small, consistent code makes a busy stock room easier to read. Feed in the basics and get a unique identifier in one click." icon={<Hash size={14} />} />
        <div className="grid gap-7 lg:grid-cols-[.86fr_1.14fr]">
          <section className="fade-up fade-up-delay-1 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.8)] p-5 shadow-[var(--shadow-card)] sm:p-7">
            <div className="mb-7 flex items-center justify-between border-b border-[hsl(var(--border))] pb-5">
              <div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Build a code</p><h2 className="mt-1 text-xl font-bold tracking-[-.04em]">Product details</h2></div>
              <PackageCheck size={20} className="text-[hsl(var(--accent))]" />
            </div>
            <form onSubmit={generate} className="space-y-5">
              <div><FieldLabel hint="e.g. stationery">Product category</FieldLabel><input data-testid="input-sku-category" className="input-control" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Stationery" /></div>
              <div><FieldLabel hint="use the shelf name">Product name</FieldLabel><input data-testid="input-sku-product" className="input-control" value={product} onChange={(event) => setProduct(event.target.value)} placeholder="Blue grid notebook" /></div>
              <div><FieldLabel hint="whole number">Stock quantity</FieldLabel><input data-testid="input-sku-stock" type="number" min="0" step="1" className="input-control" value={stock} onChange={(event) => setStock(event.target.value)} placeholder="24" /></div>
              {error && <p data-testid="status-sku-error" className="text-xs font-semibold leading-5 text-[hsl(var(--destructive))]">{error}</p>}
              <div className="flex flex-wrap gap-3 pt-2">
                <button data-testid="button-generate-sku" type="submit" className="button-lift inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3.5 text-sm font-bold text-[hsl(var(--primary-foreground))]"><ScanLine size={16} /> Generate SKU</button>
                <button data-testid="button-reset-sku" type="button" onClick={resetSku} className="button-lift inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] px-4 py-3.5 text-sm font-bold hover:bg-[hsl(var(--muted))]"><RotateCcw size={15} /> Reset</button>
              </div>
            </form>
            <div className="mt-8 rounded-xl bg-[hsl(var(--secondary)/.55)] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[hsl(var(--secondary-foreground)/.75)]">How this code reads</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs font-medium text-[hsl(var(--secondary-foreground))]"><span className="rounded bg-[hsl(var(--card)/.7)] px-2 py-1">CAT</span><span>—</span><span className="rounded bg-[hsl(var(--card)/.7)] px-2 py-1">NAME</span><span>—</span><span className="rounded bg-[hsl(var(--card)/.7)] px-2 py-1">STOCK</span><span>—</span><span className="rounded bg-[hsl(var(--card)/.7)] px-2 py-1">ID</span></div>
            </div>
          </section>
          <section className="fade-up fade-up-delay-2 space-y-5">
            <div className="paper-grid relative overflow-hidden rounded-2xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] p-6 text-[hsl(var(--sidebar-foreground))] shadow-[var(--shadow-card)] sm:p-8">
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full border-[18px] border-[hsl(var(--accent)/.7)]" />
              <div className="relative">
                <div className="flex items-center justify-between"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.65)]">Latest generated code</p><span className="rounded-full bg-[hsl(var(--accent))] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[.1em] text-[hsl(var(--accent-foreground))]">unique</span></div>
                {sku ? <div className="py-12"><p data-testid="text-generated-sku" className="break-all font-mono text-3xl font-medium leading-tight tracking-[-.06em] text-[hsl(var(--accent))] sm:text-5xl">{sku}</p><div className="mt-8 flex flex-wrap gap-3"><button data-testid="button-copy-sku" type="button" onClick={() => copySku()} className="button-lift inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-4 py-3 text-sm font-bold text-[hsl(var(--accent-foreground))]">{copied ? <Check size={16} /> : <ClipboardCopy size={16} />}{copied ? 'Copied to clipboard' : 'Copy SKU'}</button></div></div> : <div data-testid="empty-generated-sku" className="flex min-h-[220px] flex-col justify-center"><Hash size={34} className="mb-5 text-[hsl(var(--sidebar-foreground)/.35)]" /><p className="max-w-sm text-3xl font-semibold leading-tight tracking-[-.05em]">Your next shelf label starts here.</p><p className="mt-3 max-w-sm text-sm leading-6 text-[hsl(var(--sidebar-foreground)/.63)]">Fill in the product details and your identifier will appear in this space.</p></div>}
                <div className="flex items-center gap-2 border-t border-[hsl(var(--sidebar-border))] pt-4 font-mono text-[10px] uppercase tracking-[.13em] text-[hsl(var(--sidebar-foreground)/.5)]"><span className="h-2 w-2 rounded-full bg-[hsl(var(--secondary))]" /> generated locally in your browser</div>
              </div>
            </div>
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.75)] p-5 shadow-[var(--shadow-card)] sm:p-6">
              <div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Recent codes</p><h2 className="mt-1 text-xl font-bold tracking-[-.04em]">Your generated history</h2></div><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{history.length}/4</span></div>
              {history.length === 0 ? <div data-testid="empty-sku-history" className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-[hsl(var(--border))] p-4 text-sm text-[hsl(var(--muted-foreground))]"><Hash size={17} /> Generated codes will collect here.</div> : <div className="mt-5 space-y-2">{history.map((entry, index) => <div data-testid={`row-sku-history-${index}`} key={entry} className="flex items-center justify-between gap-3 rounded-xl bg-[hsl(var(--muted)/.65)] px-3 py-2.5"><span className="truncate font-mono text-xs font-medium">{entry}</span><button data-testid={`button-copy-history-${index}`} type="button" onClick={() => copySku(entry)} className="shrink-0 rounded-lg p-2 text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]" aria-label={`Copy ${entry}`}><ClipboardCopy size={15} /></button></div>)}</div>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/receipt" component={ReceiptPage} /><Route path="/sku" component={SkuPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={basePath}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;