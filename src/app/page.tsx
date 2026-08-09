import { MarketingShell } from "@/components/ui/marketing-shell";
import { ProductAssistant } from "@/components/product-assistant";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n/get-locale";
import { getProfile, homePathForRole } from "@/lib/auth/session";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getProfile();
  if (session) {
    redirect(homePathForRole(session.profile.role));
  }

  const { locale, t } = await getI18n();
  const L = t.landing;

  return (
    <MarketingShell locale={locale} t={t} fullBleed>
      <section className="relative flex min-h-[100dvh] items-end overflow-hidden">
        <Image
          src="/images/hero-aegean-terrace.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover animate-hero-drift"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
          aria-hidden
        />
        <div className="relative z-10 w-full px-4 pb-14 pt-28 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-3xl animate-rise">
            <p className="font-display text-5xl leading-none text-foam sm:text-7xl">
              Leblebee
            </p>
            <h1 className="font-display mt-5 max-w-xl text-2xl leading-snug text-foam sm:text-3xl">
              {L.headline}
            </h1>
            <p className="mt-3 max-w-lg text-base text-foam/90 sm:text-lg">
              {L.support}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register">
                <Button variant="secondary">{L.ctaStart}</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghostOnDark">{L.ctaSignIn}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-foam px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl animate-rise-delay">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            {L.storyTitle}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            {L.storyBody}
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            {L.bringTitle}
          </h2>
          <ul className="mt-10 space-y-8">
            {L.bringItems.map((item) => (
              <li key={item.title}>
                <h3 className="font-display text-xl text-ink">{item.title}</h3>
                <p className="mt-2 text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-olive-soft/40 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            {L.offerTitle}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            {L.offerOwners}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            {L.offerSuppliers}
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button>{L.ctaStart}</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-4 py-10 text-center text-sm text-ink-muted sm:px-6">
        <p>{L.footerNote}</p>
        <p className="mt-4 text-ink">
          {L.footerBy}{" "}
          <a
            href="https://github.com/alex-elia"
            className="font-semibold hover:text-olive"
            target="_blank"
            rel="noreferrer"
          >
            Alex Gon
          </a>
          {" · "}
          <a
            href="https://elia-studio.eu"
            className="font-semibold hover:text-olive"
            target="_blank"
            rel="noreferrer"
          >
            {L.footerStudioName}
          </a>
        </p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <a
            href="https://elia-studio.eu"
            className="hover:text-olive"
            target="_blank"
            rel="noreferrer"
          >
            {L.footerStudio}
          </a>
          <span aria-hidden className="text-line">
            ·
          </span>
          <a
            href="https://github.com/alex-elia"
            className="hover:text-olive"
            target="_blank"
            rel="noreferrer"
          >
            {L.footerGithub}
          </a>
        </p>
      </footer>
      <ProductAssistant />
    </MarketingShell>
  );
}
