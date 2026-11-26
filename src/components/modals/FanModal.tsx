import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Fan, Plus, Edit2, Trash2, Cpu, Check, Sliders } from 'lucide-react';
import { FanDevice, FanMode } from '../../types';
import { useHardware } from '../../context/HardwareContext';

interface FanModalProps {
  isOpen: boolean;
  onClose: () => void;
  fanToEdit?: FanDevice | null;
}

export const FanModal: React.FC<FanModalProps> = ({ isOpen, onClose, fanToEdit }) => {
  const { addFan, updateFan, deleteFan, fans } = useHardware();

  const isEdit = Boolean(fanToEdit);

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [speed, setSpeed] = useState(60);
  const [mode, setMode] = useState<FanMode>('manual');
  const [pinOrIp, setPinOrIp] = useState('GPIO 21');

  useEffect(() => {
    if (fanToEdit) {
      setName(fanToEdit.name);
      setRoom(fanToEdit.room);
      setSpeed(fanToEdit.speed);
      setMode(fanToEdit.mode);
      setPinOrIp(fanToEdit.pinOrIp || 'GPIO 18');
    } else {
      const nextNum = fans.length + 1;
      setName(`Fan ${nextNum}`);
      setRoom(nextNum === 3 ? 'Study Room' : nextNum === 4 ? 'Dining Room' : `Room ${nextNum}`);
      setSpeed(50);
      setMode('manual');
      setPinOrIp(`GPIO ${20 + nextNum}`);
    }
  }, [fanToEdit, isOpen, fans.length]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEdit && fanToEdit) {
      updateFan(fanToEdit.id, {
        name: name.trim(),
        room: room.trim() || 'Main Room',
        speed,
        targetSpeed: speed,
        mode,
        pinOrIp: pinOrIp.trim(),
      });
    } else {
      addFan({
        name: name.trim(),
        room: room.trim() || 'Living Space',
        speed,
        targetSpeed: speed,
        mode,
        status: speed > 0 ? 'running' : 'stopped',
        rpm: Math.round((speed / 100) * 1800),
        powerWatts: +(10 + (speed / 100) * 25).toFixed(1),
        temperature: 24.0,
        pinOrIp: pinOrIp.trim(),
        isDemo: true,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (fanToEdit) {
      deleteFan(fanToEdit.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 shadow-2xl z-10 glass-card max-h-[90vh] overflow-y-auto"
          style={{
            background: 'var(--dropdown-bg)',
            borderColor: 'var(--dropdown-border)',
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-[var(--border-divider)] mb-4 sm:mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 shrink-0">
                {isEdit ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                  {isEdit ? 'Edit Fan Device' : 'Add New Fan Unit'}
                </h3>
                <p className="text-[11px] sm:text-xs text-[var(--text-subtle)]">
                  {isEdit ? 'Modify name, room or PWM pins' : 'Configure dynamic Fan unit & telemetry'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[var(--text-subtle)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Fan Name */}
            <div>
              <label className="font-semibold text-[var(--text-subtle)] block mb-1.5">
                Fan Device Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fan 3 (Study Room)"
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-sm font-medium text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* Room / Location */}
            <div>
              <label className="font-semibold text-[var(--text-subtle)] block mb-1.5">
                Room / Placement Zone
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Living Room, Balcony, Bedroom"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-sm font-medium text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* Initial Speed */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-[var(--text-subtle)]">
                  Speed Setting: <span className="font-bold text-blue-500">{speed}%</span>
                </label>
                <span className="text-[11px] text-[var(--text-subtle)] font-mono">
                  ~{Math.round((speed / 100) * 1800)} RPM
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Control Mode */}
            <div>
              <label className="font-semibold text-[var(--text-subtle)] block mb-1.5">
                Control Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('manual')}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors border ${
                    mode === 'manual'
                      ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                      : 'bg-white/60 dark:bg-slate-800/60 text-[var(--text-muted)] border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Manual</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('automatic')}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors border ${
                    mode === 'automatic'
                      ? 'bg-purple-500 text-white border-purple-600 shadow-sm'
                      : 'bg-white/60 dark:bg-slate-800/60 text-[var(--text-muted)] border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Automatic</span>
                </button>
              </div>
            </div>

            {/* Hardware Pin or IP */}
            <div>
              <label className="font-semibold text-[var(--text-subtle)] block mb-1.5">
                GPIO Pin / IP Endpoint
              </label>
              <input
                type="text"
                value={pinOrIp}
                onChange={(e) => setPinOrIp(e.target.value)}
                placeholder="GPIO 21 or 192.168.1.184:80"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-sm font-mono text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border-divider)] mt-5">
              {isEdit && fans.length > 1 ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 font-semibold text-xs cursor-pointer transition-colors flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none min-h-[44px] btn-primary-gradient px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEdit ? 'Save Changes' : 'Add Fan'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
