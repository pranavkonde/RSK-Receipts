import { ReceiptForm } from "@/components/ReceiptForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
            RSK Receipts
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            The Web3 Bookkeeper
          </p>
          <p className="mt-4 text-zinc-500 dark:text-zinc-500 max-w-xl mx-auto">
            Calculate the historical fiat (USD) value of your Rootstock
            transactions and generate printable PDF receipts for accounting and
            tax purposes.
          </p>
        </header>

        <ReceiptForm />

        <footer className="mt-20 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>Zero smart contracts. Pure frontend utility.</p>
          <p className="mt-1">
            Built for Web3 freelancers & DAOs on Rootstock
          </p>
        </footer>
      </div>
    </div>
  );
}
