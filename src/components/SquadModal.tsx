import React, { useState, useRef } from 'react';
import { Player, Role } from '../types';
import { FACE_PRESETS, FacePreset, generateFaceSvg } from '../data/avatarPresets';
import {
  Users,
  UserPlus,
  Trash2,
  Edit2,
  Upload,
  Camera,
  Check,
  X,
  Sparkles,
  Shirt,
  Search,
  PlusCircle,
  ArrowRightCircle,
} from 'lucide-react';

interface SquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  squad: Player[];
  onUpdateSquad: (squad: Player[]) => void;
  onSpawnPlayerToPitch: (player: Player) => void;
}

const ROLES: Role[] = [
  'POR',
  'DC',
  'TD',
  'TS',
  'DCD',
  'DCS',
  'MED',
  'CC',
  'MEZ',
  'TRQ',
  'ED',
  'ES',
  'AD',
  'AS',
  'ATT',
  'P',
  'SP',
  'JOL',
];

export const SquadModal: React.FC<SquadModalProps> = ({
  isOpen,
  onClose,
  squad,
  onUpdateSquad,
  onSpawnPlayerToPitch,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states for creating / editing
  const [formName, setFormName] = useState('');
  const [formNumber, setFormNumber] = useState<number>(10);
  const [formRole, setFormRole] = useState<Role>('TRQ');
  const [formTeam, setFormTeam] = useState<'home' | 'away' | 'jolly' | 'keeper' | 'referee'>('home');
  const [formPhotoUrl, setFormPhotoUrl] = useState<string>('');
  const [formJerseyUrl, setFormJerseyUrl] = useState<string>('');
  const [formFoot, setFormFoot] = useState<'Destro' | 'Sinistro' | 'Ambidestro'>('Destro');
  const [formAge, setFormAge] = useState<number>(24);
  const [formNotes, setFormNotes] = useState<string>('');

  const [selectedFacePresetId, setSelectedFacePresetId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const jerseyFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle open add player form
  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingPlayer(null);
    setFormName('');
    setFormNumber(squad.length + 1);
    setFormRole('CC');
    setFormTeam('home');
    setFormPhotoUrl(generateFaceSvg(FACE_PRESETS[0]));
    setFormJerseyUrl('');
    setSelectedFacePresetId(FACE_PRESETS[0].id);
    setFormFoot('Destro');
    setFormAge(24);
    setFormNotes('');
  };

  // Handle open edit player form
  const handleStartEdit = (player: Player) => {
    setEditingPlayer(player);
    setIsAddingNew(false);
    setFormName(player.name);
    setFormNumber(player.number);
    setFormRole(player.role);
    setFormTeam(player.team);
    setFormPhotoUrl(player.photoUrl || '');
    setFormJerseyUrl(player.jerseyImageUrl || '');
    setFormFoot(player.preferredFoot || 'Destro');
    setFormAge(player.age || 24);
    setFormNotes(player.notes || '');
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Jersey File Upload
  const handleJerseyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormJerseyUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Select Face Preset
  const handleSelectPreset = (preset: FacePreset) => {
    setSelectedFacePresetId(preset.id);
    const svgData = generateFaceSvg(preset);
    setFormPhotoUrl(svgData);
  };

  // Save Player (New or Edit)
  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (isAddingNew) {
      const newPlayer: Player = {
        id: `custom-p-${Date.now()}`,
        name: formName.trim(),
        number: Number(formNumber) || 1,
        role: formRole,
        team: formRole === 'POR' ? 'keeper' : formTeam,
        avatarType: 'photo',
        photoUrl: formPhotoUrl || generateFaceSvg(FACE_PRESETS[0]),
        jerseyImageUrl: formJerseyUrl || undefined,
        preferredFoot: formFoot,
        age: Number(formAge) || 20,
        notes: formNotes.trim(),
      };
      onUpdateSquad([...squad, newPlayer]);
      setIsAddingNew(false);
    } else if (editingPlayer) {
      const updatedSquad = squad.map((p) =>
        p.id === editingPlayer.id
          ? {
              ...p,
              name: formName.trim(),
              number: Number(formNumber) || 1,
              role: formRole,
              team: formRole === 'POR' ? 'keeper' : formTeam,
              photoUrl: formPhotoUrl || p.photoUrl,
              jerseyImageUrl: formJerseyUrl || p.jerseyImageUrl,
              preferredFoot: formFoot,
              age: Number(formAge) || p.age,
              notes: formNotes.trim(),
            }
          : p
      );
      onUpdateSquad(updatedSquad);
      setEditingPlayer(null);
    }
  };

  // Delete Player
  const handleDeletePlayer = (playerId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo giocatore dalla rosa?')) {
      onUpdateSquad(squad.filter((p) => p.id !== playerId));
      if (editingPlayer?.id === playerId) {
        setEditingPlayer(null);
      }
    }
  };

  // Filtered squad
  const filteredSquad = squad.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase()) ||
      String(p.number).includes(search);

    const matchesRole =
      selectedRoleFilter === 'all'
        ? true
        : selectedRoleFilter === 'POR'
        ? p.role === 'POR'
        : selectedRoleFilter === 'DEF'
        ? ['DC', 'TD', 'TS', 'DCD', 'DCS', 'LIB'].includes(p.role)
        : selectedRoleFilter === 'MID'
        ? ['MED', 'CC', 'MEZ', 'TRQ', 'ED', 'ES'].includes(p.role)
        : selectedRoleFilter === 'ATT'
        ? ['ATT', 'P', 'SP', 'AD', 'AS'].includes(p.role)
        : true;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#131d33]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Gestione Rosa Squadra & Volti
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  {squad.length} Giocatori
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Inserisci nuovi calciatori, modifica ruoli e numeri, carica foto reali o scegli volti personalizzati.
              </p>
            </div>
          </div>

          <button
            id="close-squad-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Layout (Left: Squad List, Right: Edit/Add Form) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Left Column: Player List (7 cols) */}
          <div className="md:col-span-7 flex flex-col h-full overflow-hidden p-4 bg-[#0c1322]">
            {/* Search and Action Bar */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cerca per nome, ruolo o numero..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                id="btn-add-new-player"
                onClick={handleStartAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-transform active:scale-95 whitespace-nowrap"
              >
                <UserPlus size={14} />
                <span>Nuovo Giocatore</span>
              </button>
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1 mb-3 text-[11px] overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'Tutti' },
                { id: 'POR', label: 'Portieri' },
                { id: 'DEF', label: 'Difensori' },
                { id: 'MID', label: 'Centrocampisti' },
                { id: 'ATT', label: 'Attaccanti' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRoleFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    selectedRoleFilter === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Squad Cards Grid */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[55vh]">
              {filteredSquad.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Nessun giocatore trovato con questi criteri.
                </div>
              ) : (
                filteredSquad.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      editingPlayer?.id === player.id
                        ? 'bg-blue-950/40 border-blue-500/80 shadow-md'
                        : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800'
                    }`}
                  >
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-3">
                      {/* Avatar Circle */}
                      <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 flex-shrink-0 shadow-inner flex items-center justify-center">
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-white text-sm">
                            {player.number}
                          </span>
                        )}
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-blue-600 border border-slate-900 text-[8px] font-black text-white flex items-center justify-center">
                          {player.number}
                        </span>
                      </div>

                      {/* Name & Details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-sm">{player.name}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-black ${
                              player.role === 'POR'
                                ? 'bg-amber-900/80 text-amber-300'
                                : player.role === 'TRQ'
                                ? 'bg-yellow-900/80 text-yellow-300'
                                : ['ATT', 'P', 'SP', 'AD', 'AS'].includes(player.role)
                                ? 'bg-red-900/80 text-red-300'
                                : 'bg-blue-900/80 text-blue-300'
                            }`}
                          >
                            {player.role}
                          </span>
                          {player.jerseyImageUrl && (
                            <span
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/40 text-[9px] font-semibold"
                              title="Maglia grafica personalizzata attiva"
                            >
                              <Shirt size={9} /> Divisa
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Piede: {player.preferredFoot || 'Destro'}</span>
                          <span>•</span>
                          <span>{player.age ? `${player.age} anni` : '24 anni'}</span>
                          {player.notes && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[140px] italic text-slate-500">
                                {player.notes}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5">
                      {/* Spawn to pitch */}
                      <button
                        onClick={() => {
                          onSpawnPlayerToPitch(player);
                          onClose();
                        }}
                        className="px-2 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="Porta questo giocatore sul campo"
                      >
                        <ArrowRightCircle size={13} />
                        <span className="hidden sm:inline">In Campo</span>
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleStartEdit(player)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-colors"
                        title="Modifica dati o volto"
                      >
                        <Edit2 size={13} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeletePlayer(player.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
                        title="Elimina giocatore dalla rosa"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Player Editor / Face Customizer (5 cols) */}
          <div className="md:col-span-5 p-5 bg-[#0f172a] overflow-y-auto max-h-[65vh]">
            {isAddingNew || editingPlayer ? (
              <form onSubmit={handleSavePlayer} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {isAddingNew ? <UserPlus size={16} className="text-blue-400" /> : <Edit2 size={16} className="text-blue-400" />}
                    {isAddingNew ? 'Aggiungi Nuovo Calciatore' : `Modifica ${editingPlayer?.name}`}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingPlayer(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Annulla
                  </button>
                </div>

                {/* Face & Avatar Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Volto del Giocatore (Foto o Avatar 3D)
                  </label>
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    {/* Live Preview */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-800 border-2 border-blue-500 shadow-md flex-shrink-0 flex items-center justify-center">
                      {formPhotoUrl ? (
                        <img src={formPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-xl text-white">{formNumber}</span>
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                      >
                        <Upload size={13} />
                        <span>Carica Foto Giocatore</span>
                      </button>
                      <p className="text-[10px] text-slate-400 text-center">
                        Supporta JPG, PNG, WebP o seleziona un avatar qui sotto
                      </p>
                    </div>
                  </div>

                  {/* Preset Face Avatars Selection */}
                  <div className="mt-2.5">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                      Oppure scegli un volto predefinito:
                    </span>
                    <div className="grid grid-cols-6 gap-1.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                      {FACE_PRESETS.map((preset) => {
                        const svgPreview = generateFaceSvg(preset);
                        const isSelected = selectedFacePresetId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`relative rounded-lg p-0.5 transition-transform hover:scale-105 ${
                              isSelected ? 'ring-2 ring-blue-500 bg-blue-950' : 'bg-slate-800/50 hover:bg-slate-800'
                            }`}
                            title={preset.name}
                          >
                            <img src={svgPreview} alt={preset.name} className="w-8 h-8 rounded-full mx-auto" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Jersey / Kit Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Shirt size={13} className="text-amber-400" /> Maglia Divisa Personalizzata
                    </span>
                    {formJerseyUrl && (
                      <button
                        type="button"
                        onClick={() => setFormJerseyUrl('')}
                        className="text-[10px] text-red-400 hover:text-red-300 font-medium"
                      >
                        Rimuovi maglia
                      </button>
                    )}
                  </label>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      {formJerseyUrl ? (
                        <img src={formJerseyUrl} alt="Maglia" className="w-full h-full object-cover" />
                      ) : (
                        <Shirt size={22} className="text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        ref={jerseyFileInputRef}
                        accept="image/*"
                        onChange={handleJerseyFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => jerseyFileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                      >
                        <Upload size={12} className="text-amber-400" />
                        <span>{formJerseyUrl ? 'Cambia Foto Maglia' : 'Carica Foto Maglia'}</span>
                      </button>
                      <p className="text-[9.5px] text-slate-500 text-center">
                        PNG, JPG o texture divisa del club
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name & Number */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nome & Cognome
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Es: Catoni M."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Numero
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      required
                      value={formNumber}
                      onChange={(e) => setFormNumber(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white text-center font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Role & Team */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Ruolo</label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as Role)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Squadra / Tipo</label>
                    <select
                      value={formTeam}
                      onChange={(e) => setFormTeam(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="home">Casa (Blu)</option>
                      <option value="away">Trasferta (Rosso)</option>
                      <option value="jolly">Jolly (Giallo)</option>
                      <option value="keeper">Portiere (Verde/Arancione)</option>
                      <option value="referee">Arbitro (Nero)</option>
                    </select>
                  </div>
                </div>

                {/* Foot & Age */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Piede Preferito</label>
                    <select
                      value={formFoot}
                      onChange={(e) => setFormFoot(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Destro">Destro</option>
                      <option value="Sinistro">Sinistro</option>
                      <option value="Ambidestro">Ambidestro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Età</label>
                    <input
                      type="number"
                      min={14}
                      max={45}
                      value={formAge}
                      onChange={(e) => setFormAge(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white text-center focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Note Tattiche</label>
                  <input
                    type="text"
                    placeholder="Es: Ottima visione, bravo negli inserimenti..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  <Check size={16} />
                  <span>{isAddingNew ? 'Salva Nuovo Giocatore' : 'Aggiorna Giocatore'}</span>
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                  <Shirt size={28} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dettagli & Volto Giocatore</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Seleziona un giocatore dalla lista per modificarne dati e volto, oppure creane uno nuovo da inserire sul campo tattico.
                  </p>
                </div>
                <button
                  onClick={handleStartAdd}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <UserPlus size={14} />
                  <span>Crea Nuovo Calciatore</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
