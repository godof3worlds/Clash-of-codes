import React from 'react';
import { useStore } from '../store/useStore';

export const Settings: React.FC = () => {
  const { showToast } = useStore();

  return (
    <div className="flex flex-col space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">Settings</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">Configure your CodeConquer experience.</p>
      </div>

      {/* Theme & Display */}
      <div className="bg-surface-container rounded-xl p-5 shadow-xl border border-surface-container-high/50">
        <h3 className="font-display text-sm font-bold text-on-surface mb-4">Theme & Display</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm text-on-surface">Dark Mode</p>
              <p className="font-sans text-xs text-on-surface-variant">Always enabled for the coding world aesthetic</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-primary relative cursor-pointer">
              <div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm text-on-surface">Editor Font Size</p>
              <p className="font-sans text-xs text-on-surface-variant">Adjust Monaco Editor text size</p>
            </div>
            <select className="bg-surface-container-high border border-surface-container-highest rounded-lg px-3 py-1.5 text-sm font-mono text-on-surface focus:outline-none focus:border-primary">
              <option>12px</option><option>14px</option><option>16px</option><option>18px</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-surface-container rounded-xl p-5 shadow-xl border border-surface-container-high/50">
        <h3 className="font-display text-sm font-bold text-on-surface mb-4">Notifications</h3>
        <div className="space-y-3">
          {['Daily streak reminders', 'New badge earned', 'Clash match found', 'AI course updates'].map((item) => (
            <div key={item} className="flex items-center justify-between py-1">
              <span className="font-sans text-sm text-on-surface">{item}</span>
              <div className="w-11 h-6 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white shadow" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys & Integrations */}
      <div className="bg-surface-container rounded-xl p-5 shadow-xl border border-error/20">
        <h3 className="font-display text-sm font-bold text-on-surface mb-2">API Configuration</h3>
        <p className="font-sans text-xs text-on-surface-variant mb-4">Server-side secrets are stored in <code className="font-mono text-primary">.env</code> and never exposed to the client.</p>
        <div className="space-y-3">
          {[
            { label: 'Supabase URL', value: 'Configured ✓', secure: true },
            { label: 'JDoodle API', value: 'Configured ✓', secure: true },
            { label: 'Gemma 4 API', value: 'Configured ✓', secure: true },
          ].map((api) => (
            <div key={api.label} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-surface-container-lowest">
              <span className="font-sans text-sm text-on-surface">{api.label}</span>
              <span className="font-mono text-xs text-tertiary">{api.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface-container rounded-xl p-5 shadow-xl border border-error/30">
        <h3 className="font-display text-sm font-bold text-error mb-3">Danger Zone</h3>
        <div className="flex gap-3">
          <button
            onClick={() => showToast('⚠️ This would reset all progress in production.')}
            className="px-4 py-2 rounded-lg border border-error/30 text-error font-sans text-sm font-medium hover:bg-error/10 transition-colors"
          >
            Reset Progress
          </button>
          <button
            onClick={() => showToast('⚠️ This would delete your account in production.')}
            className="px-4 py-2 rounded-lg bg-error/20 text-error font-sans text-sm font-medium hover:bg-error/30 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
