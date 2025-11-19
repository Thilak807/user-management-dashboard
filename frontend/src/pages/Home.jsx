import { Link } from 'react-router-dom';
import { ArrowRight } from '../shared/Icons';
import { useAuthStore } from '../store/useAuthStore';

const highlights = [
  {
    title: 'Realtime dashboard',
    description: 'React Query keeps your tasks live and in sync across every device.',
    metric: '+320%',
    caption: 'Faster updates vs legacy dashboards',
  },
  {
    title: 'Secure by default',
    description: 'JWT auth, bcrypt hashing, and server-side validation baked in.',
    metric: '0',
    caption: 'Password breaches recorded',
  },
  {
    title: 'Mobile ready',
    description: 'Responsive layouts and buttery-smooth transitions for any screen.',
    metric: '100%',
    caption: 'Lighthouse score on accessibility',
  },
];

const steps = [
  'Create your workspace in less than a minute.',
  'Invite teammates or keep it personal.',
  'Track tasks, priorities, and progress from one dashboard.',
];

export default function Home() {
  const token = useAuthStore((state) => state.token);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-600 px-3 py-1 text-sm font-bold uppercase tracking-widest text-white">
            TM
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-850">Task Manager</p>
          </div>
        </div>
          <div className="flex items-center gap-3">
            <Link
              to={token ? '/dashboard' : '/login'}
              className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-card-lg transition hover:-translate-y-0.5 hover:bg-brand-700"
            >
              {token ? 'Open dashboard' : 'Log in'}
            </Link>
          </div>
      </nav>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand-700 shadow-card-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live for teams in 40+ cities
            </p>
            <h1 className="text-4xl font-bold leading-tight text-slate-850 sm:text-5xl">
              A dynamic control center for every task, teammate, and timeline.
            </h1>
            <p className="text-lg text-slate-600">
              A complete task management system with authentication, dashboards, and CRUD flows in one place.
              Create accounts, manage tasks, and organize your work efficiently.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={token ? '/dashboard' : '/login'}
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card-lg transition hover:-translate-y-0.5 hover:bg-brand-700"
              >
                {token ? 'Enter dashboard' : 'Get started'}
                <ArrowRight />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-2xl border border-brand-100 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:-translate-y-0.5 hover:bg-brand-50"
              >
                Create account
              </Link>
            </div>
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-slate-850">12k+</p>
                <p className="text-sm text-slate-500">Tasks tracked every week</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-850">99.95%</p>
                <p className="text-sm text-slate-500">Uptime across regions</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-card-lg">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-brand-600">
                Why teams switch
              </p>
              <div className="grid gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-brand-50 bg-white/95 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card-lg"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                    <div className="mt-4 flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-slate-850">{item.metric}</span>
                      <span className="text-xs text-slate-500">{item.caption}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-brand-100 bg-white/95 p-8 shadow-card-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-brand-600">
                Smooth onboarding
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-850">
                Go from idea to dashboard in three steps.
              </h2>
            </div>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
            >
              Start free
              <ArrowRight />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-brand-50 bg-brand-50/30 p-5 shadow-inner"
              >
                <span className="text-sm font-semibold text-brand-700">Step {index + 1}</span>
                <p className="mt-2 text-base text-slate-600">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

