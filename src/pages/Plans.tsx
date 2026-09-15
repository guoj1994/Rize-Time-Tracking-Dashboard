import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Segmented } from '../components/ui/Segmented';
import { planOptions } from '../data/plans';
import { useShell } from '../contexts/ShellContext';
import type { PlanTier } from '../types';

type Audience = 'individual' | 'team';
type Cycle = 'annual' | 'quarterly' | 'monthly';

const cycleCopy: Record<Cycle, string> = {
  annual: 'Billed annually',
  quarterly: 'Billed quarterly',
  monthly: 'Billed monthly'
};

export function Plans() {
  const { plan, setPlan } = useShell();
  const [audience, setAudience] = useState<Audience>('individual');
  const [cycle, setCycle] = useState<Cycle>('annual');

  const priceFor = (option: (typeof planOptions)[number]) => {
    const base =
    cycle === 'annual' ? option.priceAnnual : cycle === 'quarterly' ? option.priceQuarterly : option.priceMonthly;
    return audience === 'team' ? base + 6 : base;
  };

  const saveFor = (option: (typeof planOptions)[number]) =>
  cycle === 'annual' ? option.saveAnnual : cycle === 'quarterly' ? option.saveQuarterly : null;

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Plan & billing" />

      <div className="rize-scroll flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1040px] px-5 py-8">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-[32px] font-semibold tracking-tight text-ink">Select Your Plan</h1>
            <Segmented
              ariaLabel="Audience"
              value={audience}
              onChange={setAudience}
              options={[
              { value: 'individual', label: 'Individual' },
              { value: 'team', label: 'Team' }]
              } />
            
            <Segmented
              ariaLabel="Billing cycle"
              value={cycle}
              onChange={setCycle}
              options={[
              { value: 'annual', label: 'Annual' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'monthly', label: 'Monthly' }]
              } />
            
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {planOptions.map((option) => {
              const isCurrent = option.id === plan;
              const save = saveFor(option);
              const badge = isCurrent ? 'Current Plan' : option.badge;
              const badgeTone = isCurrent ? 'accent' : option.badgeTone;
              return (
                <article
                  key={option.id}
                  className={`relative flex flex-col rounded-xl border px-5 pb-6 pt-8 ${
                  isCurrent ? 'border-accent bg-accent-soft/50' : 'border-line bg-surface shadow-panel'}`
                  }>
                  
                  {badge &&
                  <span
                    className={`absolute -top-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium text-white ${
                    badgeTone === 'positive' ? 'bg-positive' : 'bg-accent'}`
                    }>
                    
                      {badge}
                    </span>
                  }

                  <h2 className="text-center text-[21px] font-semibold text-ink">{option.name}</h2>
                  <p className="mt-1 text-center text-[13px] text-muted">{option.tagline}</p>

                  <p className="mt-6 text-center">
                    <span className="tabular text-[32px] font-semibold tracking-tight text-ink">
                      US${priceFor(option).toFixed(2)}
                    </span>
                    <span className="text-[13px] text-muted"> /mo</span>
                  </p>
                  <p className="mt-1 text-center text-[13px] text-muted">{cycleCopy[cycle]}</p>
                  <p className="mt-1 h-[18px] text-center text-[12px] font-medium text-positive">{save ?? ''}</p>
                  <p className="mt-1 text-center text-[12px] text-accent">{option.credits}</p>

                  <button
                    type="button"
                    onClick={() => setPlan(option.id as PlanTier)}
                    className="mt-6 w-full rounded-lg bg-accent-ink px-4 py-2.5 text-[14px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
                    
                    {isCurrent ? 'Manage Plan' : 'Select Plan'}
                  </button>

                  <div className="mt-6">
                    {option.inherits && <p className="mb-3 text-[12px] italic text-muted">{option.inherits}</p>}
                    <ul className="space-y-2.5">
                      {option.features.map((feature) =>
                      <li key={feature} className="flex gap-2 text-[13px] text-ink">
                          <CheckIcon className="mt-[3px] h-[13px] w-[13px] shrink-0 text-positive" />
                          <span>{feature}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </article>);

            })}
          </div>

          <p className="mt-8 text-center text-[12px] text-faint">
            Plans renew automatically. Switching tiers here updates what the app unlocks — AI report sections are gated
            on the Basic plan.
          </p>
        </div>
      </div>
    </div>);

}