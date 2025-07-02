import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence

// Weapon data (No changes)
const WEAPON_TYPES = [
  { value: 'spear', label: 'Spearmen', icon: '🏹', description: 'For attack' },
  { value: 'archer', label: 'Archers', icon: '🏹', description: 'For attack' },
  { value: 'knight', label: 'Knights', icon: '⚔️', description: 'For attack' },
];

// All sub-components (Button, Option, Grid, Slider, Display, Handle)

const WeaponSelectionButton = ({ onSelect }) => (
  <div className="flex justify-center">
    <button
      onClick={onSelect}
      className="relative p-6 rounded-lg border-2 border-dashed border-gray-500 hover:border-gray-400 transition-colors"
      style={{ backgroundColor: '#3c3a55', width: 'calc(100% + 6rem)' }}
    >
      <DragHandle isSelected={false} />
      <div className="text-2xl mb-2">⚔️</div>
      <div className="text-gray-300">Select Unit Type</div>
    </button>
  </div>
);

const WeaponOption = ({ weapon, onSelect }) => (
  <button
    onClick={() => onSelect(weapon.value)}
    className="p-4 rounded border border-gray-600 hover:border-gray-500 transition-colors text-left"
    style={{ backgroundColor: '#2d2a47' }}
  >
    <div className="flex items-center gap-3">
      <div className="text-2xl">{weapon.icon}</div>
      <div>
        <div className="text-white font-medium">{weapon.label}</div>
        <div className="text-gray-400 text-sm">{weapon.description}</div>
      </div>
    </div>
  </button>
);

const WeaponSelectionGrid = ({ onSelect, onCancel }) => (
  <div className="flex justify-center">
    <div
      className="relative rounded-lg p-4"
      style={{
        backgroundColor: '#3c3a55',
        border: '1px solid #4a4666',
        width: 'calc(100% + 6rem)',
      }}
    >
      <DragHandle />
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Choose Unit Type</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white text-sm"
        >
          Cancel
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {WEAPON_TYPES.map((weapon) => (
          <WeaponOption
            key={weapon.value}
            weapon={weapon}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  </div>
);

const QuantitySlider = ({ quantity, onChange, max = 136 }) => {
  const progressWidth = Math.min((quantity / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-white text-sm">0</span>
      <div className="flex-1 relative">
        <div
          className="h-6 rounded relative overflow-hidden"
          style={{ backgroundColor: '#4a4666' }}
        >
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{
              width: `${progressWidth}%`,
              background: 'linear-gradient(90deg, #ef4444, #dc2626)',
            }}
          />
        </div>
        <input
          type="range"
          min="0"
          max={max}
          value={quantity}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-6 opacity-0 cursor-pointer"
        />
        <div className="absolute inset-0 flex items-center justify-end pr-2 pointer-events-none">
          <span
            className="text-white text-xs font-medium px-2 py-1 rounded"
            style={{ backgroundColor: '#3c3a55' }}
          >
            {quantity}
          </span>
        </div>
      </div>
      <span className="text-white text-sm">{quantity}</span>
    </div>
  );
};

const SelectedWeaponDisplay = ({
  weapon,
  quantity,
  onQuantityChange,
  onChangeWeapon,
}) => (
  <div className="flex justify-center">
    <div className="relative p-4" style={{ width: 'calc(100% + 6rem)' }}>
      <DragHandle isSelected={true} />
      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl">{weapon.icon}</div>
        <div className="flex-1">
          <div className="text-white font-medium">
            {quantity} {weapon.label} {weapon.description}
          </div>
        </div>
        <button
          onClick={onChangeWeapon}
          className="text-gray-400 hover:text-white text-sm"
        >
          Change
        </button>
      </div>
      <QuantitySlider quantity={quantity} onChange={onQuantityChange} />
    </div>
  </div>
);

const DragHandle = ({ isSelected = false }) => (
  <div
    className="absolute top-1/2 transform -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity pointer-events-none"
    style={{ left: isSelected ? '6px' : '2px' }}
  >
    {isSelected && (
      <div
        className="absolute top-0 flex flex-col"
        style={{ left: '-6px', gap: '2px' }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-400 rounded-full"
            style={{ width: '4px', height: '4px' }}
          ></div>
        ))}
      </div>
    )}
    <div className="flex flex-col" style={{ gap: '2px' }}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-400 rounded-full"
          style={{ width: '4px', height: '4px' }}
        ></div>
      ))}
    </div>
  </div>
);

const ActionButton = ({ onClick, color, children }) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded text-sm transition-colors hover:opacity-90"
    style={{ backgroundColor: color }}
  >
    {children}
  </button>
);

const AttackOrderSummary = ({ slots }) => {
  const readySlots = slots
    .filter((slot) => slot.weaponType && slot.quantity > 0)
    .sort((a, b) => a.order - b.order);
  return (
    <div className="mt-6 text-center">
      <div className="text-gray-400 text-sm mb-2">⚔️ Attack Order:</div>
      <div className="flex justify-center gap-2">
        {readySlots.length > 0 ? (
          readySlots.map((slot, index) => {
            const weapon = WEAPON_TYPES.find(
              (w) => w.value === slot.weaponType
            );
            return (
              <div
                key={slot.id}
                className="flex items-center gap-1 px-3 py-1 rounded text-sm"
                style={{ backgroundColor: '#3c3a55' }}
              >
                <span className="text-gray-300">{weapon?.icon}</span>
                <span className="text-gray-300">{weapon?.label}</span>
                {index < readySlots.length - 1 && (
                  <span className="text-gray-500 ml-1">→</span>
                )}
              </div>
            );
          })
        ) : (
          <span className="text-gray-500 text-sm">
            No units ready for battle
          </span>
        )}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// --- CORE ANIMATION CHANGE IS IN WeaponSlot BELOW ---
// ------------------------------------------------------------------

const WeaponSlot = ({
  slot,
  selectedWeapon,
  isDraggedOver,
  isBeingDragged,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onUpdateSlot,
  onToggleSelection,
}) => {
  // Animation variants for a clean fade transition.
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      // `layout` prop remains for the perfect drag-and-drop reordering animation.
      layout
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      key={slot.id}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className="cursor-move border-2 rounded-lg transition-all duration-200 relative"
      style={{
        borderColor: isDraggedOver ? '#fbbf24' : 'transparent',
        boxShadow: isDraggedOver ? '0 0 15px rgba(251, 191, 36, 0.3)' : 'none',
        opacity: isBeingDragged ? 0 : 1,
      }}
    >
      {/* 
        FIX: Use AnimatePresence to control the open/close animations,
        overriding the "egregious" default layout animation for content swaps.
      */}
      <AnimatePresence mode="wait" initial={false}>
        {!slot.isSelecting && !selectedWeapon && (
          <motion.div
            key="button"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            <WeaponSelectionButton
              onSelect={() => onToggleSelection(slot.id)}
            />
          </motion.div>
        )}

        {selectedWeapon && !slot.isSelecting && (
          <motion.div
            key="display"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            <SelectedWeaponDisplay
              weapon={selectedWeapon}
              quantity={slot.quantity}
              onQuantityChange={(value) =>
                onUpdateSlot(slot.id, 'quantity', value)
              }
              onChangeWeapon={() => onToggleSelection(slot.id)}
            />
          </motion.div>
        )}

        {slot.isSelecting && (
          <motion.div
            key="grid"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            <WeaponSelectionGrid
              onSelect={(weaponType) => {
                onUpdateSlot(slot.id, 'weaponType', weaponType);
                onUpdateSlot(slot.id, 'isSelecting', false);
              }}
              onCancel={() => onToggleSelection(slot.id)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WeaponCraftingUI = () => {
  const [slots, setSlots] = useState([
    { id: 1, weaponType: '', quantity: 0, isSelecting: false, order: 1 },
    { id: 2, weaponType: '', quantity: 0, isSelecting: false, order: 2 },
    { id: 3, weaponType: '', quantity: 0, isSelecting: false, order: 3 },
  ]);

  const [draggedSlot, setDraggedSlot] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const updateSlot = (slotId, field, value) =>
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, [field]: value } : s))
    );
  const toggleSelection = (slotId) =>
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? { ...s, isSelecting: !s.isSelecting }
          : { ...s, isSelecting: false }
      )
    );
  const clearAllSlots = () =>
    setSlots((prev) =>
      prev.map((s) => ({
        ...s,
        weaponType: '',
        quantity: 0,
        isSelecting: false,
      }))
    );

  const handleDragStart = (e, slot) => setDraggedSlot(slot);
  const handleDragOver = (e, slot) => {
    e.preventDefault();
    if (draggedSlot && draggedSlot.id !== slot.id) setDragOverSlot(slot);
  };
  const handleDragLeave = () => setDragOverSlot(null);
  const handleDrop = (e, targetSlot) => {
    e.preventDefault();
    if (!draggedSlot || draggedSlot.id === targetSlot.id) return;
    setSlots((prevSlots) => {
      const newSlots = [...prevSlots];
      const draggedItem = newSlots.find((s) => s.id === draggedSlot.id);
      const targetItem = newSlots.find((s) => s.id === targetSlot.id);
      if (draggedItem && targetItem) {
        const tempOrder = draggedItem.order;
        draggedItem.order = targetItem.order;
        targetItem.order = tempOrder;
      }
      return newSlots;
    });
  };
  const handleDragEnd = () => {
    setDraggedSlot(null);
    setDragOverSlot(null);
  };

  const getSelectedWeapon = (weaponType) =>
    WEAPON_TYPES.find((w) => w.value === weaponType);
  const sortedSlots = [...slots].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2d2a47' }}>
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-white">Suit Up Army:</h1>
          <button
            className="text-white px-3 py-1 rounded text-sm"
            style={{ backgroundColor: '#4ade80' }}
          >
            i
          </button>
        </div>
        <div
          className="rounded p-3 mb-6 text-center"
          style={{ backgroundColor: '#3c3a55', border: '1px solid #4a4666' }}
        >
          <span className="text-gray-300">Army deployed in battle</span>
        </div>
        <div className="space-y-6">
          {sortedSlots.map((slot) => {
            const selectedWeapon = getSelectedWeapon(slot.weaponType);
            const isDraggedOver = dragOverSlot && dragOverSlot.id === slot.id;
            const isBeingDragged = draggedSlot && draggedSlot.id === slot.id;
            return (
              <WeaponSlot
                key={slot.id}
                slot={slot}
                selectedWeapon={selectedWeapon}
                isDraggedOver={isDraggedOver}
                isBeingDragged={isBeingDragged}
                onDragStart={(e) => handleDragStart(e, slot)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, slot)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, slot)}
                onUpdateSlot={updateSlot}
                onToggleSelection={toggleSelection}
              />
            );
          })}
        </div>
        <div className="flex gap-3 mt-6 justify-center">
          <ActionButton onClick={clearAllSlots} color="#6b7280">
            Clear All
          </ActionButton>
          <ActionButton onClick={() => {}} color="#3b82f6">
            Start Training
          </ActionButton>
          <ActionButton onClick={() => {}} color="#10b981">
            Deploy Army
          </ActionButton>
        </div>
        <AttackOrderSummary slots={slots} />
      </div>
    </div>
  );
};

export default WeaponCraftingUI;
