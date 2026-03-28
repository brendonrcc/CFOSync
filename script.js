    const { useState, useEffect, useMemo, useRef } = React;

        // --- ICONS ---
        const Icon = ({ name, size = 24, className = "", ...props }) => {
            const ref = useRef(null);
            useEffect(() => {
                if (!ref.current || !window.lucide) return;
                const pascalName = name.replace(/-([a-z0-9])/g, g => g[1].toUpperCase()).replace(/^[a-z]/, g => g.toUpperCase());
                const iconDef = window.lucide.icons[pascalName];
                if (iconDef) {
                    const svg = window.lucide.createElement(iconDef);
                    svg.setAttribute('width', size); svg.setAttribute('height', size);
                    ref.current.innerHTML = ''; ref.current.appendChild(svg);
                }
            }, [name, size]);
            return <span ref={ref} className={className} style={{ display: 'inline-flex', alignItems: 'center' }} {...props}></span>;
        };

        const CalendarDays = (p) => <Icon name="calendar-days" {...p} />;
        const Clock = (p) => <Icon name="clock" {...p} />;
        const CalendarCheck = (p) => <Icon name="calendar-check" {...p} />;
        const Users = (p) => <Icon name="users" {...p} />;
        const Moon = (p) => <Icon name="moon" {...p} />;
        const Sun = (p) => <Icon name="sun" {...p} />;
        const CheckCircle2 = (p) => <Icon name="check-circle-2" {...p} />;
        const AlertTriangle = (p) => <Icon name="alert-triangle" {...p} />;
        const X = (p) => <Icon name="x" {...p} />;
        const Trash2 = (p) => <Icon name="trash-2" {...p} />;
        const ListOrdered = (p) => <Icon name="list-ordered" {...p} />;
        const Info = (p) => <Icon name="info" {...p} />;
        const ChevronLeft = (p) => <Icon name="chevron-left" {...p} />;
        const ChevronRight = (p) => <Icon name="chevron-right" {...p} />;
        const History = (p) => <Icon name="history" {...p} />;
        const Search = (p) => <Icon name="search" {...p} />;
        const Filter = (p) => <Icon name="filter" {...p} />;
        const Download = (p) => <Icon name="download" {...p} />;
        const GraduationCap = (p) => <Icon name="graduation-cap" {...p} />;
        const ExternalLink = (p) => <Icon name="external-link" {...p} />;
        const Flag = (p) => <Icon name="flag" {...p} />;

        // --- CONSTANTES & API (SUPABASE E PLANILHA) ---
        const MACRO_AUTH_URL = "https://api-professor-dashboard.brendonhbrcc.workers.dev/?gid=1512246214";
        const MACRO_FORMADOS_URL = "https://api-professor-dashboard.brendonhbrcc.workers.dev/?gid=1016191277";
        const LOGO_URL = "https://i.imgur.com/7Q1KoaM.png";
        
        const SUPABASE_URL = "https://gaxouozzwwkntkbmyfnx.supabase.co";
        const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdheG91b3p6d3drbnRrYm15Zm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NjQyNTYsImV4cCI6MjA5MDI0MDI1Nn0.KT1GqjI0ALQ5131IICpEbkrxUXoJpnWyhiE2Z26cWPE";

        let supabaseClient = null;
        try {
            if (SUPABASE_URL !== "COLOQUE_SEU_SUPABASE_URL_AQUI") {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            }
        } catch (e) {
            console.error("Erro ao conectar ao Supabase:", e);
        }
        
        // Horários disponíveis para seleção: de 00:00 às 23:00
        const AVAILABLE_TIMES = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

        // --- LÓGICA DE EXPIRAÇÃO DE HORÁRIOS ---
        const isTimeExpired = (dateStr, timeStr) => {
            if (!dateStr || !timeStr) return false;
            const [year, month, day] = dateStr.split('-');
            const [hour, minute] = timeStr.split(':');
            const slotDate = new Date(year, parseInt(month) - 1, day, parseInt(hour), parseInt(minute));
            
            // Adiciona 1 hora ao horário do agendamento
            const expiryDate = new Date(slotDate.getTime() + 60 * 60 * 1000);
            
            return new Date() >= expiryDate;
        };

        // --- COMPONENTES BASE ---
        const ToastContainer = ({ toasts, removeToast }) => (
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                {toasts.map(toast => (
                    <div key={toast.id} className={`pointer-events-auto bg-white dark:bg-[#1a231d] border-l-4 p-4 rounded-sm shadow-lg flex items-start gap-3 animate-slide-in-right ${toast.type === 'success' ? 'border-l-green-500' : toast.type === 'error' ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                        <div className={toast.type === 'success' ? 'text-green-500' : toast.type === 'error' ? 'text-red-500' : 'text-blue-500'}>
                            {toast.type === 'success' ? <CheckCircle2 size={20} /> : toast.type === 'error' ? <AlertTriangle size={20} /> : <Info size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-bold uppercase truncate ${toast.type === 'success' ? 'text-green-600 dark:text-green-400' : toast.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{toast.title}</h4>
                            <p className="text-xs text-slate-700 dark:text-slate-300 break-words">{toast.message}</p>
                        </div>
                        <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600 shrink-0"><X size={16} /></button>
                    </div>
                ))}
            </div>
        );

        const BrandHeader = () => (
            <div className="flex items-center gap-3 select-none">
                <img src={LOGO_URL} alt="CFO" className="h-8 sm:h-10 w-auto shrink-0" />
                <div className="flex flex-col leading-none">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-condensed font-bold text-slate-900 dark:text-white italic tracking-tighter">CENTRO</span>
                        <span className="text-xs sm:text-sm font-serif italic text-brand">de</span>
                        <span className="text-xl sm:text-2xl font-condensed font-bold text-slate-900 dark:text-white italic tracking-tighter">FORMAÇÃO</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 -mt-1">
                        <span className="text-xs sm:text-sm font-serif italic text-brand">de</span>
                        <span className="text-lg sm:text-xl font-display uppercase tracking-widest text-slate-900 dark:text-white">OFICIAIS</span>
                    </div>
                </div>
            </div>
        );

        // --- PÁGINA 1: HORÁRIOS (SÓ AVALIADORES) ---
        const PaginaHorarios = ({ currentUser, addToast, availabilities, updateAvailabilities, appointments }) => {
            const [selectedDate, setSelectedDate] = useState('');
            const [selectedTimes, setSelectedTimes] = useState([]);

            const myAvailabilities = availabilities[currentUser.nickname] || {};
            
            const myAppointments = useMemo(() => {
                return appointments
                    .filter(app => app.avaliador === currentUser.nickname)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            }, [appointments, currentUser.nickname]);

            const handleTimeToggle = (time) => {
                if (selectedTimes.includes(time)) {
                    setSelectedTimes(prev => prev.filter(t => t !== time));
                } else {
                    setSelectedTimes(prev => [...prev, time].sort());
                }
            };

            const handleSave = () => {
                if (!selectedDate) return addToast('error', 'Erro', 'Selecione uma data.');
                if (selectedTimes.length === 0) return addToast('error', 'Erro', 'Selecione pelo menos um horário.');

                const userAvail = availabilities[currentUser.nickname] || {};
                const existingTimesForDate = userAvail[selectedDate] || [];
                const newTimes = Array.from(new Set([...existingTimesForDate, ...selectedTimes])).sort();

                const newAvail = {
                    ...availabilities,
                    [currentUser.nickname]: {
                        ...userAvail,
                        [selectedDate]: newTimes
                    }
                };

                updateAvailabilities(newAvail, currentUser.nickname);
                addToast('success', 'Sucesso', 'Horários guardados com sucesso!');
                setSelectedTimes([]);
                setSelectedDate('');
            };

            const handleDeleteDate = (date) => {
                const userAvail = { ...availabilities[currentUser.nickname] };
                delete userAvail[date];
                const newAvail = { ...availabilities, [currentUser.nickname]: userAvail };
                updateAvailabilities(newAvail, currentUser.nickname);
                addToast('success', 'Atualizado', 'Data removida da sua disponibilidade.');
            };

            const handleDeleteTime = (date, time) => {
                const userAvail = { ...availabilities[currentUser.nickname] };
                userAvail[date] = userAvail[date].filter(t => t !== time);
                if (userAvail[date].length === 0) delete userAvail[date];
                const newAvail = { ...availabilities, [currentUser.nickname]: userAvail };
                updateAvailabilities(newAvail, currentUser.nickname);
            };

            const localMinDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

            return (
                <div className="animate-fade-in space-y-8">
                    {/* Formulário de Adição */}
                    <div className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-brand/20 p-4 sm:p-6 rounded-xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand mb-6 flex items-center gap-2">
                            <CalendarDays size={18} /> Horários
                        </h3>
                        
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/3 space-y-3">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Data</label>
                                <input 
                                    type="date" 
                                    value={selectedDate}
                                    min={localMinDate}
                                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedTimes([]); }}
                                    className="w-full h-12 px-4 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand focus:ring-1 focus:ring-brand outline-none text-slate-700 dark:text-white uppercase"
                                />
                            </div>
                            
                            <div className="w-full md:w-2/3 space-y-3">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Selecione os Horários (BRT)</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_TIMES.map(time => {
                                        const isSelected = selectedTimes.includes(time);
                                        const isAlreadySaved = myAvailabilities[selectedDate]?.includes(time);

                                        return (
                                            <button
                                                key={time}
                                                onClick={() => handleTimeToggle(time)}
                                                disabled={isAlreadySaved}
                                                className={`px-3 py-2 sm:px-4 rounded-lg text-xs font-bold transition-all border flex-1 sm:flex-none
                                                    ${isAlreadySaved 
                                                        ? 'bg-slate-200 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-400 cursor-not-allowed' 
                                                        : isSelected 
                                                            ? 'bg-brand text-white border-brand shadow-md' 
                                                            : 'bg-white dark:bg-[#121813] border-slate-300 dark:border-brand/30 text-slate-600 dark:text-slate-300 hover:border-brand'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-brand/20 flex justify-end">
                            <button onClick={handleSave} className="w-full sm:w-auto bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-lg font-condensed font-bold uppercase tracking-widest text-sm transition-colors flex justify-center items-center gap-2 shadow-md">
                                <CalendarCheck size={18} /> Salvar
                            </button>
                        </div>
                    </div>

                    {/* Lista de Horários Ativos */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-white mb-4 flex items-center gap-2">
                            <Clock size={18} /> Meus Horários
                        </h3>
                        
                        {Object.keys(myAvailabilities).length === 0 ? (
                            <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-400">
                                Não tens horários registados no momento.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.keys(myAvailabilities).sort().map(date => {
                                    const validTimes = myAvailabilities[date].filter(time => !isTimeExpired(date, time));
                                    if (validTimes.length === 0) return null;

                                    return (
                                        <div key={date} className="bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 rounded-xl p-4 sm:p-5 relative shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                            <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-brand/10 pb-3">
                                                <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                                    <CalendarDays size={16} className="text-brand shrink-0" />
                                                    <span className="truncate">{new Date(date + 'T12:00:00').toLocaleDateString('pt-PT', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                                </span>
                                                <button onClick={() => handleDeleteDate(date)} className="flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors p-1 shrink-0" title="Apagar todo o dia">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {validTimes.map(time => (
                                                    <span key={time} className="inline-flex items-center gap-1.5 bg-brand/10 dark:bg-brand/20 text-brand-light font-bold pl-3 pr-1 py-1 rounded-lg text-sm border border-brand/20">
                                                        {time}
                                                        <button onClick={() => handleDeleteTime(date, time)} className="hover:text-red-500 bg-white/50 dark:bg-black/20 w-5 h-5 flex items-center justify-center rounded-md transition-colors shrink-0">
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Histórico Pessoal do Avaliador */}
                    <div className="pt-8 border-t border-slate-200 dark:border-brand/20">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-white mb-4 flex items-center gap-2">
                            <ListOrdered size={18} /> Meus Agendamentos Marcados
                        </h3>
                        
                        {myAppointments.length === 0 ? (
                            <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-400 font-bold uppercase tracking-widest text-xs">
                                Nenhum aluno agendou consigo ainda.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {myAppointments.map(app => (
                                    <div key={app.id} className="bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/20 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-brand/50 transition-colors overflow-hidden">
                                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-brand/10 min-w-0">
                                            <div className="w-10 h-10 bg-slate-50 dark:bg-black/20 rounded-full border border-slate-200 dark:border-brand/30 flex justify-center items-center overflow-hidden shrink-0">
                                                <img src={`https://www.habbo.com.br/habbo-imaging/avatarimage?user=${app.aluno}&direction=3&head_direction=3&gesture=sml&size=m&headonly=1`} className="object-none object-center" alt={app.aluno} onError={(e) => e.target.style.display = 'none'} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight truncate">{app.aluno}</h4>
                                                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 block truncate">Aluno</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-center gap-3 bg-slate-50 dark:bg-[#121813] p-2.5 rounded-lg border border-slate-200 dark:border-white/5 w-full mt-1">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <CalendarDays size={14} className="text-brand shrink-0" />
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{new Date(app.date + 'T12:00:00').toLocaleDateString('pt-PT')}</span>
                                            </div>
                                            <div className="w-px h-3 bg-slate-300 dark:bg-white/10 hidden sm:block shrink-0"></div>
                                            <span className="text-xs font-black text-brand bg-brand/10 px-2 py-0.5 rounded-md border border-brand/20 shrink-0">{app.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        // --- PÁGINA 2: AGENDAMENTO (PÚBLICO) ---
        const PaginaAgendamento = ({ currentUser, addToast, availabilities, appointments, addAppointment, removeAppointment, fullMembersList }) => {
            const [showMyAppointments, setShowMyAppointments] = useState(false);
            const [searchAvaliador, setSearchAvaliador] = useState('');
            const [modalBookingOpen, setModalBookingOpen] = useState(false);
            const [bookingData, setBookingData] = useState(null);

            const [modalListOpen, setModalListOpen] = useState(false);
            const [selectedAvaliadorInfo, setSelectedAvaliadorInfo] = useState(null);
            
            const [modalCancelOpen, setModalCancelOpen] = useState(false);
            const [appointmentToCancel, setAppointmentToCancel] = useState(null);

            const myAppointments = useMemo(() => {
                return appointments
                    .filter(app => app.aluno === currentUser.nickname)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            }, [appointments, currentUser.nickname]);

            const handleOpenBooking = (avaliador, date, time) => {
                setBookingData({ avaliador, date, time });
                setModalBookingOpen(true);
            };

            const confirmBooking = () => {
                const newAppointment = {
                    id: Math.random().toString(36).substr(2, 9),
                    avaliador: bookingData.avaliador,
                    aluno: currentUser.nickname,
                    date: bookingData.date,
                    time: bookingData.time,
                    timestamp: new Date().toISOString()
                };

                addAppointment(newAppointment);
                addToast('success', 'Agendado!', `Avaliação marcada com ${bookingData.avaliador} às ${bookingData.time}.`);
                setModalBookingOpen(false);
            };

            const handleOpenAvaliadorList = (avaliador) => {
                setSelectedAvaliadorInfo(avaliador);
                setModalListOpen(true);
            };
            
            const handleOpenCancel = (app) => {
                setAppointmentToCancel(app);
                setModalCancelOpen(true);
            };

            const confirmCancel = () => {
                removeAppointment(appointmentToCancel.id);
                setModalCancelOpen(false);
                setAppointmentToCancel(null);
            };

            const isBookedByMe = (avaliador, date, time) => {
                return appointments.some(app => app.avaliador === avaliador && app.date === date && app.time === time && app.aluno === currentUser.nickname);
            };

            return (
                <div className="animate-fade-in space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-white flex items-center gap-2 shrink-0">
                            {showMyAppointments ? <><CalendarCheck size={18} /> Meus Agendamentos</> : <><Users size={18} /> Avaliadores Disponíveis</>}
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            {!showMyAppointments && (
                                <div className="relative w-full sm:w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Search size={14} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Procurar avaliador..."
                                        value={searchAvaliador}
                                        onChange={(e) => setSearchAvaliador(e.target.value)}
                                        className="w-full h-10 sm:h-9 pl-9 pr-4 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm sm:text-xs font-bold focus:border-brand focus:ring-1 focus:ring-brand outline-none text-slate-700 dark:text-white placeholder-slate-400"
                                    />
                                </div>
                            )}
                            <button 
                                onClick={() => { setShowMyAppointments(!showMyAppointments); setSearchAvaliador(''); }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200 px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shrink-0 shadow-sm"
                            >
                                {showMyAppointments ? <><Users size={14} /> Ver Avaliadores</> : <><CalendarCheck size={14} /> Meus Agendamentos</>}
                            </button>
                        </div>
                    </div>

                    <div className="bg-brand/10 dark:bg-brand/20 border border-brand/20 p-4 sm:p-5 rounded-xl flex items-start gap-3 mb-6">
                        <Info className="text-brand shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="text-sm font-bold text-brand uppercase tracking-widest">Aviso Importante</h4>
                            <p className="text-sm sm:text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                                {showMyAppointments 
                                    ? "Aqui estão as avaliações que você marcou. Caso não possa comparecer, por favor, cancele o agendamento para libertar a vaga." 
                                    : "Escolha um avaliador e clique no horário desejado para marcar a sua avaliação. Mais de um aluno pode partilhar o mesmo horário."}
                            </p>
                        </div>
                    </div>

                    {!supabaseClient && (
                        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 p-4 rounded-xl flex items-center gap-3">
                            <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                            <p className="text-xs text-orange-700 dark:text-orange-400 font-bold uppercase tracking-widest">Aviso: Supabase não conectado. Configura as chaves no código para salvar dados.</p>
                        </div>
                    )}

                    {showMyAppointments ? (
                        <div className="space-y-4 animate-fade-in">
                            {myAppointments.length === 0 ? (
                                <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-500 uppercase font-bold tracking-widest">
                                    Você não possui nenhum agendamento marcado.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {myAppointments.map(app => {
                                        const displayRole = fullMembersList?.find(m => m.nickname.toLowerCase() === app.avaliador.toLowerCase())?.role || 'Avaliador';
                                        
                                        return (
                                            <div key={app.id} className="bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-brand/10 min-w-0">
                                                    <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-brand/30 flex justify-center items-center">
                                                        <img src={`https://www.habbo.com.br/habbo-imaging/avatarimage?user=${app.avaliador}&direction=3&head_direction=3&gesture=sml&size=m&headonly=1`} className="object-none object-center" alt={app.avaliador} onError={(e) => e.target.style.display = 'none'} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">{displayRole}</p>
                                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">{app.avaliador}</h4>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between sm:justify-center gap-3 bg-slate-50 dark:bg-[#121813] p-3 rounded-lg border border-slate-200 dark:border-white/5 w-full mb-4">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <CalendarDays size={14} className="text-brand shrink-0" />
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{new Date(app.date + 'T12:00:00').toLocaleDateString('pt-PT')}</span>
                                                    </div>
                                                    <div className="w-px h-3 bg-slate-300 dark:bg-white/10 hidden sm:block shrink-0"></div>
                                                    <span className="text-xs font-black text-brand bg-brand/10 px-1.5 py-0.5 rounded-md border border-brand/20 shrink-0">{app.time}</span>
                                                </div>

                                                <button 
                                                    onClick={() => handleOpenCancel(app)}
                                                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-[#121813] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 h-auto py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border border-red-200 dark:border-red-900/30 break-words whitespace-normal leading-tight"
                                                >
                                                    <Trash2 size={14} className="shrink-0" /> Cancelar Agendamento
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        Object.keys(availabilities).length === 0 ? (
                            <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-500 uppercase font-bold tracking-widest animate-fade-in">
                                Nenhum avaliador disponibilizou horários ainda.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                                {Object.entries(availabilities)
                                    .filter(([avaliador]) => avaliador.toLowerCase().includes(searchAvaliador.toLowerCase()))
                                    .map(([avaliador, dates]) => {
                                    
                                    const validDates = Object.entries(dates).reduce((acc, [date, times]) => {
                                        const validTimes = times.filter(t => !isTimeExpired(date, t));
                                        if (validTimes.length > 0) acc[date] = validTimes;
                                        return acc;
                                    }, {});

                                    if (Object.keys(validDates).length === 0) return null;
                                    const displayRole = fullMembersList?.find(m => m.nickname.toLowerCase() === avaliador.toLowerCase())?.role || 'Avaliador';

                                    return (
                                        <div key={avaliador} className="bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col min-w-0">
                                            <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-brand/10 flex items-center justify-between bg-slate-50/50 dark:bg-black/10 gap-3 min-w-0">
                                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center rounded-full overflow-hidden bg-white dark:bg-black/40 border border-slate-200 dark:border-brand/20">
                                                        <img src={`https://www.habbo.com.br/habbo-imaging/avatarimage?user=${avaliador}&direction=3&head_direction=3&gesture=sml&size=m&headonly=1`} className="object-none object-center" alt={avaliador} onError={(e) => e.target.style.display = 'none'} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">{displayRole}</p>
                                                        <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white leading-tight mt-0.5 truncate">{avaliador}</h3>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleOpenAvaliadorList(avaliador)}
                                                    className="flex items-center justify-center p-2 sm:px-3 sm:py-1.5 bg-white dark:bg-[#121813] hover:border-brand hover:text-brand border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0"
                                                    title="Ver Agendamentos marcados"
                                                >
                                                    <ListOrdered size={14} className="shrink-0" /> 
                                                    <span className="hidden lg:inline ml-1.5">Histórico</span>
                                                </button>
                                            </div>

                                            <div className="p-4 sm:p-5 flex-1 space-y-4 min-w-0">
                                                {Object.entries(validDates).sort(([d1], [d2]) => d1.localeCompare(d2)).map(([date, times]) => (
                                                    <div key={date}>
                                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand mb-2 flex items-center gap-1.5 border-b border-slate-100 dark:border-brand/10 pb-1">
                                                            <CalendarDays size={12} className="shrink-0" />
                                                            {new Date(date + 'T12:00:00').toLocaleDateString('pt-PT', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {times.map(time => {
                                                                const isMyBooking = isBookedByMe(avaliador, date, time);
                                                                return (
                                                                    <button
                                                                        key={time}
                                                                        disabled={isMyBooking}
                                                                        onClick={() => handleOpenBooking(avaliador, date, time)}
                                                                        className={`px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-xs font-bold transition-all border flex flex-row items-center justify-center gap-1.5 min-w-0
                                                                            ${isMyBooking 
                                                                                ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 cursor-not-allowed' 
                                                                                : 'bg-white dark:bg-[#121813] border-slate-300 dark:border-brand/30 text-slate-700 dark:text-slate-200 hover:border-brand hover:text-brand shadow-sm hover:shadow'
                                                                            }`}
                                                                        title={isMyBooking ? "Você já agendou este horário" : "Clique para agendar"}
                                                                    >
                                                                        <span>{time}</span>
                                                                        {isMyBooking && <span className="text-[10px] text-brand opacity-80 shrink-0 flex items-center justify-center"><Clock size={12} /></span>}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}

                    {/* MODAL COM PORTALS: Confirmar Agendamento */}
                    {modalBookingOpen && bookingData && ReactDOM.createPortal(
                        <div className="relative z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>
                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                                    <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-fade-in flex flex-col">
                                        <div className="p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]">
                                            <h3 className="text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white">Confirmar</h3>
                                            <button onClick={() => setModalBookingOpen(false)} className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"><X size={16} /></button>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-3 bg-slate-50 dark:bg-black/20 p-4 rounded-lg border border-slate-100 dark:border-white/5">
                                                <div className="flex justify-between items-center gap-2">
                                                    <strong className="text-slate-500 uppercase text-[10px] tracking-widest shrink-0">Avaliador:</strong> 
                                                    <span className="font-bold text-sm text-slate-800 dark:text-white truncate text-right">{bookingData.avaliador}</span>
                                                </div>
                                                <div className="flex justify-between items-center gap-2">
                                                    <strong className="text-slate-500 uppercase text-[10px] tracking-widest shrink-0">Data:</strong> 
                                                    <span className="font-bold text-sm text-slate-800 dark:text-white shrink-0">{new Date(bookingData.date + 'T12:00:00').toLocaleDateString('pt-PT')}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/10 gap-2">
                                                    <strong className="text-slate-500 uppercase text-[10px] tracking-widest shrink-0">Hora:</strong> 
                                                    <span className="font-black text-sm text-brand bg-brand/10 px-2 py-0.5 rounded-md border border-brand/20 shrink-0">{bookingData.time} BRT</span>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 text-center break-words">
                                                Será agendado com o nick: <strong className="text-brand">{currentUser.nickname}</strong>
                                            </p>
                                        </div>
                                        <div className="p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex flex-col sm:flex-row gap-3 sm:justify-end">
                                            <button onClick={() => setModalBookingOpen(false)} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg">Cancelar</button>
                                            <button onClick={confirmBooking} className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-brand hover:bg-brand-hover text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                                                <CheckCircle2 size={16} className="shrink-0" /> Confirmar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                    
                    {/* MODAL COM PORTALS: Cancelar Agendamento */}
                    {modalCancelOpen && appointmentToCancel && ReactDOM.createPortal(
                        <div className="relative z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>
                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                                    <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-fade-in flex flex-col">
                                        <div className="p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]">
                                            <h3 className="text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white flex items-center gap-2">
                                                <AlertTriangle size={18} className="text-red-500 shrink-0" /> Cancelar Agendamento
                                            </h3>
                                            <button onClick={() => setModalCancelOpen(false)} className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"><X size={16} /></button>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 text-center break-words">
                                                Tens a certeza que desejas cancelar a avaliação com <strong className="text-slate-800 dark:text-white">{appointmentToCancel.avaliador}</strong>?
                                            </p>
                                            <div className="flex items-center justify-between sm:justify-center gap-3 bg-slate-50 dark:bg-black/20 p-3 rounded-lg border border-slate-200 dark:border-white/5 w-full shrink-0">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays size={14} className="text-brand shrink-0"/>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{new Date(appointmentToCancel.date + 'T12:00:00').toLocaleDateString('pt-PT')}</span>
                                                </div>
                                                <div className="w-px h-3 bg-slate-300 dark:bg-white/10 hidden sm:block"></div>
                                                <span className="text-xs font-black text-brand bg-brand/10 px-2 py-0.5 rounded-md border border-brand/20">{appointmentToCancel.time}</span>
                                            </div>
                                        </div>
                                        <div className="p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex flex-col sm:flex-row gap-3 sm:justify-end">
                                            <button onClick={() => setModalCancelOpen(false)} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg">Voltar</button>
                                            <button onClick={confirmCancel} className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                                                <Trash2 size={16} className="shrink-0" /> Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}

                    {/* MODAL COM PORTALS: Lista de Agendamentos do Avaliador */}
                    {modalListOpen && selectedAvaliadorInfo && ReactDOM.createPortal(
                        <div className="relative z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>
                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                                    <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full animate-fade-in flex flex-col">
                                        <div className="p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813] gap-4 min-w-0">
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white">Agenda do Avaliador</h3>
                                                <p className="text-xs text-brand font-bold uppercase tracking-widest truncate">{selectedAvaliadorInfo}</p>
                                            </div>
                                            <button onClick={() => setModalListOpen(false)} className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"><X size={16} /></button>
                                        </div>

                                        <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto space-y-3 custom-scrollbar bg-white dark:bg-[#151b17]">
                                            {appointments.filter(app => app.avaliador === selectedAvaliadorInfo).length === 0 ? (
                                                <p className="text-center text-slate-500 py-8 text-sm font-bold uppercase tracking-widest">Nenhuma avaliação marcada ainda.</p>
                                            ) : (
                                                appointments
                                                    .filter(app => app.avaliador === selectedAvaliadorInfo)
                                                    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
                                                    .map(app => (
                                                        <div key={app.id} className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:border-brand/50 hover:shadow-sm">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="shrink-0 w-10 h-10 flex justify-center items-center rounded-full overflow-hidden bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/20 shadow-sm">
                                                                    <img src={`https://www.habbo.com.br/habbo-imaging/avatarimage?user=${app.aluno}&direction=3&head_direction=3&gesture=sml&size=m&headonly=1`} className="object-none object-center" alt={app.aluno} onError={(e) => e.target.style.display = 'none'} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{app.aluno}</p>
                                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 mt-0.5 truncate">
                                                                        <Clock size={10} className="shrink-0" /> {new Date(app.timestamp).toLocaleDateString('pt-PT')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex flex-row items-center justify-between sm:justify-end gap-3 bg-white dark:bg-[#121813] sm:bg-transparent p-3 sm:p-0 rounded-lg border border-slate-100 dark:border-white/5 sm:border-none w-full sm:w-auto mt-2 sm:mt-0 transition-colors">
                                                                <div className="flex items-center gap-1.5">
                                                                    <CalendarDays size={14} className="text-brand shrink-0" />
                                                                    <span className="text-xs sm:text-[11px] font-bold text-slate-700 dark:text-slate-200">{new Date(app.date + 'T12:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })}</span>
                                                                </div>
                                                                <div className="w-px h-3 bg-slate-300 dark:bg-white/10 hidden sm:block shrink-0"></div>
                                                                <span className="inline-block text-xs sm:text-[11px] font-black text-brand bg-brand/10 px-2 py-1 sm:px-1.5 sm:py-0.5 rounded-md border border-brand/20 shrink-0">{app.time}</span>
                                                            </div>
                                                        </div>
                                                    ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            );
        };

        // --- PÁGINA 3: HISTÓRICO (SÓ AVALIADORES) ---
        const PaginaHistorico = ({ appointments, reports, addToast, onClearExpired, currentUser }) => {
            const [viewMode, setViewMode] = useState('agendamentos'); // 'agendamentos' | 'reports'
            const [currentPage, setCurrentPage] = useState(1);
            const [searchTerm, setSearchTerm] = useState('');
            const [isResetModalOpen, setIsResetModalOpen] = useState(false);
            const itemsPerPage = 8; 

            // Filtro dinâmico para agendamentos ou reports
            const filteredItems = useMemo(() => {
                const term = searchTerm.toLowerCase();
                if (viewMode === 'agendamentos') {
                    return [...appointments]
                        .filter(app => app.aluno.toLowerCase().includes(term) || app.avaliador.toLowerCase().includes(term))
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                } else {
                    return [...reports]
                        .filter(r => r.nickname.toLowerCase().includes(term) || r.subject.toLowerCase().includes(term))
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                }
            }, [appointments, reports, searchTerm, viewMode]);

            const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
            const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

            useEffect(() => { setCurrentPage(1); }, [searchTerm, viewMode]);

            const normalizedRole = currentUser.role ? currentUser.role.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : '';
            const canManageHistory = ['estagiario', 'conselheiro', 'vice-lider', 'lider'].includes(normalizedRole);

            const generatePDF = async () => {
                if (!window.jspdf || !window.jspdf.jsPDF) {
                    addToast('error', 'Erro', 'Biblioteca PDF não carregada. Atualiza a página.');
                    return;
                }
                
                addToast('info', 'A processar...', 'A transferir ficheiros para gerar o PDF. Aguarda...');
                
                try {
                    const doc = new window.jspdf.jsPDF();
                    
                    const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf';
                    const fontResponse = await fetch(fontUrl);
                    const fontBuffer = await fontResponse.arrayBuffer();
                    let fontBinary = '';
                    const fontBytes = new Uint8Array(fontBuffer);
                    for (let i = 0; i < fontBytes.byteLength; i++) { fontBinary += String.fromCharCode(fontBytes[i]); }
                    const fontBase64 = window.btoa(fontBinary);
                    
                    doc.addFileToVFS('Poppins-Regular.ttf', fontBase64);
                    doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');

                    const fontBoldUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf';
                    const fontBoldResponse = await fetch(fontBoldUrl);
                    const fontBoldBuffer = await fontBoldResponse.arrayBuffer();
                    let fontBoldBinary = '';
                    const fontBoldBytes = new Uint8Array(fontBoldBuffer);
                    for (let i = 0; i < fontBoldBytes.byteLength; i++) { fontBoldBinary += String.fromCharCode(fontBoldBytes[i]); }
                    const fontBoldBase64 = window.btoa(fontBoldBinary);
                    
                    doc.addFileToVFS('Poppins-Bold.ttf', fontBoldBase64);
                    doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold');

                    const renderPDFContent = (offsetY) => {
                        doc.setFont("Poppins", "bold");
                        doc.setFontSize(16);
                        doc.text("Centro de Formação de Oficiais", 105, offsetY, { align: "center" });
                        
                        doc.setFontSize(12);
                        doc.setFont("Poppins", "normal");
                        doc.text("Agendamentos", 105, offsetY + 8, { align: "center" });
                        
                        const tableColumn = ["Aluno", "Avaliador", "Data da Avaliação", "Horário", "Agendado em"];
                        const tableRows = [];
                        
                        const sortedToPrint = [...appointments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                        
                        sortedToPrint.forEach(app => {
                            tableRows.push([
                                app.aluno,
                                app.avaliador,
                                new Date(app.date + 'T12:00:00').toLocaleDateString('pt-PT'),
                                app.time,
                                new Date(app.timestamp).toLocaleString('pt-PT')
                            ]);
                        });
                        
                        doc.autoTable({
                            head: [tableColumn],
                            body: tableRows,
                            startY: offsetY + 15,
                            styles: { font: "Poppins", fontSize: 9 },
                            headStyles: { fillColor: [46, 92, 24], font: "Poppins", fontStyle: "bold" },
                        });
                        
                        doc.save("CFO_Historico_Agendamentos.pdf");
                        addToast('success', 'Sucesso', 'PDF transferido com sucesso.');
                    };

                    const img = new window.Image();
                    img.crossOrigin = "Anonymous";
                    img.src = LOGO_URL;
                    
                    img.onload = () => {
                        doc.addImage(img, 'PNG', 105 - 15, 10, 30, 30);
                        renderPDFContent(48);
                    };
                    
                    img.onerror = () => {
                        renderPDFContent(20);
                    };

                } catch (err) {
                    console.error("Erro ao gerar PDF:", err);
                    addToast('error', 'Erro', 'Falha ao processar as fontes para o PDF.');
                }
            };

            return (
                <div className="animate-fade-in space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <button 
                                onClick={() => setViewMode(v => v === 'agendamentos' ? 'reports' : 'agendamentos')} 
                                className="w-full sm:w-auto flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm shrink-0"
                            >
                                {viewMode === 'agendamentos' ? <><Flag size={14} className="shrink-0" /> Reports</> : <><CalendarDays size={14} className="shrink-0" /> Agendamentos</>}
                            </button>
                            
                            {viewMode === 'agendamentos' && canManageHistory && (
                                <>
                                    <button onClick={generatePDF} className="w-full sm:w-auto flex justify-center items-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm shrink-0">
                                        <Download size={14} className="shrink-0" /> PDF
                                    </button>
                                    <button onClick={() => setIsResetModalOpen(true)} className="w-full sm:w-auto flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm shrink-0">
                                        <Trash2 size={14} className="shrink-0" /> Limpar
                                    </button>
                                </>
                            )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <div className="relative w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Search size={14} />
                                </div>
                                <input
                                    type="text"
                                    placeholder={viewMode === 'agendamentos' ? "Procurar aluno ou avaliador..." : "Procurar nickname ou assunto..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-10 sm:h-9 pl-9 pr-4 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm sm:text-xs font-bold focus:border-brand focus:ring-1 focus:ring-brand outline-none text-slate-700 dark:text-white placeholder-slate-400 shadow-sm"
                                />
                            </div>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/10 px-4 py-2.5 sm:py-2 rounded-lg border border-slate-200 dark:border-brand/20 w-full sm:w-auto text-center shrink-0">
                                Total: {filteredItems.length}
                            </span>
                        </div>
                    </div>

                    {filteredItems.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-500 uppercase font-bold tracking-widest">
                            Nenhum registo encontrado.
                        </div>
                    ) : (
                        <>
                            {viewMode === 'agendamentos' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentItems.map(app => (
                                        <div key={app.id} className="bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-brand/40 overflow-hidden">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="shrink-0 relative">
                                                    <img src={`https://www.habbo.com.br/habbo-imaging/avatarimage?user=${app.aluno}&direction=3&head_direction=3&gesture=sml&size=s&headonly=1`} className="w-10 h-10 object-none object-center rounded-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-brand/20" alt={app.aluno} onError={(e) => e.target.style.display = 'none'} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">{app.aluno}</h4>
                                                        <span className="text-[9px] text-slate-400 italic">com</span>
                                                        <span className="text-[11px] font-bold text-brand truncate">{app.avaliador}</span>
                                                    </div>
                                                    <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono flex items-center gap-1 truncate">
                                                        <Clock size={9} className="shrink-0" /> {new Date(app.timestamp).toLocaleString('pt-PT')}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between sm:justify-center gap-2 bg-slate-50 dark:bg-[#121813] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays size={12} className="text-brand shrink-0" />
                                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{new Date(app.date + 'T12:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })}</span>
                                                </div>
                                                <span className="text-[11px] font-black text-brand bg-brand/10 px-1.5 py-0.5 rounded-md border border-brand/20 ml-1">{app.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {currentItems.map(report => (
                                        <div key={report.id} className="bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 rounded-xl p-5 shadow-sm transition-colors hover:border-brand/40 overflow-hidden flex flex-col gap-4">
                                            <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100 dark:border-brand/10 min-w-0">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="shrink-0 w-10 h-10 bg-slate-50 dark:bg-black/20 rounded-full border border-slate-200 dark:border-brand/20 flex items-center justify-center overflow-hidden">
                                                        <img src={`https://www.habbo.com.br/habbo-imaging/avatarimage?user=${report.nickname}&direction=2&head_direction=3&gesture=sml&size=m&headonly=1`} className="object-none object-center" alt={report.nickname} onError={(e) => e.target.style.display = 'none'} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">{report.nickname}</h4>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono flex items-center gap-1 truncate">
                                                            <Clock size={10} className="shrink-0" /> {new Date(report.created_at).toLocaleString('pt-PT')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-1 rounded-md border border-brand/20 shrink-0 text-center uppercase tracking-widest">{report.subject}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">{report.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Paginação */}
                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-brand/20">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Página <span className="text-brand">{currentPage}</span> de {totalPages}
                                    </p>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="flex-1 sm:flex-none flex justify-center p-2.5 sm:p-2 rounded-lg bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 text-slate-600 dark:text-slate-300 hover:text-brand disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="flex-1 sm:flex-none flex justify-center p-2.5 sm:p-2 rounded-lg bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 text-slate-600 dark:text-slate-300 hover:text-brand disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* MODAL DE CONFIRMAÇÃO DE RESET */}
                    {isResetModalOpen && ReactDOM.createPortal(
                        <div className="relative z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>
                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                                    <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-fade-in flex flex-col">
                                        <div className="p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]">
                                            <h3 className="text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white flex items-center gap-2">
                                                <AlertTriangle size={18} className="text-red-500" /> Limpar Registos
                                            </h3>
                                            <button onClick={() => setIsResetModalOpen(false)} className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"><X size={16} /></button>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                                                Tens a certeza de que desejas apagar todos os <strong className="text-slate-800 dark:text-white">horários disponíveis</strong> e <strong className="text-slate-800 dark:text-white">agendamentos marcados</strong> que já ultrapassaram o limite de 1 hora?
                                            </p>
                                            <p className="text-xs text-red-500 font-bold uppercase tracking-widest mt-5 text-center">Esta ação não pode ser desfeita.</p>
                                        </div>
                                        <div className="p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex flex-col sm:flex-row gap-3 sm:justify-end">
                                            <button onClick={() => setIsResetModalOpen(false)} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg">Cancelar</button>
                                            <button onClick={() => { setIsResetModalOpen(false); onClearExpired(); }} className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                                                <Trash2 size={16} className="shrink-0" /> Confirmar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            );
        };

        // --- PÁGINA 4: LISTAGEM DE MEMBROS (PÚBLICO P/ LOGADOS) ---
        const PaginaMembros = ({ membersList, availabilities, onBookClick }) => {
            const [searchTerm, setSearchTerm] = useState('');
            const [roleFilter, setRoleFilter] = useState('Todos');
            const [onlineOnly, setOnlineOnly] = useState(false);
            const [onlineStatuses, setOnlineStatuses] = useState({});

            const filteredMembers = useMemo(() => {
                const term = searchTerm.toLowerCase();
                return membersList.filter(m => {
                    const matchesSearch = m.nickname.toLowerCase().includes(term) || m.role.toLowerCase().includes(term);
                    const matchesFilter = roleFilter === 'Todos' || m.role.toLowerCase() === roleFilter.toLowerCase();
                    const matchesOnline = !onlineOnly || onlineStatuses[m.nickname] === true;
                    return matchesSearch && matchesFilter && matchesOnline;
                });
            }, [membersList, searchTerm, roleFilter, onlineOnly, onlineStatuses]);

            // Sistema de verificação incremental do Habbo API para status Online/Offline com Throttling para evitar 429
            useEffect(() => {
                let isMounted = true;
                const delay = ms => new Promise(res => setTimeout(res, ms));

                const checkStatuses = async () => {
                    const chunkSize = 3; 
                    for (let i = 0; i < membersList.length; i += chunkSize) {
                        if (!isMounted) break;
                        const chunk = membersList.slice(i, i + chunkSize);
                        
                        await Promise.all(chunk.map(async (m) => {
                            try {
                                const response = await fetch(`https://www.habbo.com.br/api/public/users?name=${m.nickname}`);
                                if (response.ok) {
                                    const data = await response.json();
                                    setOnlineStatuses(prev => ({ ...prev, [m.nickname]: data.online === true }));
                                } else {
                                    setOnlineStatuses(prev => ({ ...prev, [m.nickname]: false }));
                                }
                            } catch (error) {
                                setOnlineStatuses(prev => ({ ...prev, [m.nickname]: false }));
                            }
                        }));
                        
                        if (i + chunkSize < membersList.length) {
                            await delay(1000);
                        }
                    }
                };

                if (membersList.length > 0) {
                    checkStatuses();
                }

                return () => { isMounted = false; };
            }, [membersList]);

            const hasAvailabilities = (nickname) => {
                const dates = availabilities[nickname];
                if (!dates) return false;
                for (const date in dates) {
                    const validTimes = dates[date].filter(time => !isTimeExpired(date, time));
                    if (validTimes.length > 0) return true;
                }
                return false;
            };

            return (
                <div className="animate-fade-in space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-end gap-4 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center gap-3 w-full lg:w-auto">
                            {/* Filtro de Online */}
                            <label className="flex items-center justify-center sm:justify-start gap-2 cursor-pointer text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-brand transition-colors bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 px-4 py-2.5 sm:py-0 rounded-lg sm:h-10 w-full sm:w-auto shadow-sm">
                                <input
                                    type="checkbox"
                                    checked={onlineOnly}
                                    onChange={(e) => setOnlineOnly(e.target.checked)}
                                    className="w-4 h-4 accent-brand"
                                />
                                Online
                            </label>

                            <div className="relative w-full sm:w-auto">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Filter size={14} />
                                </div>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="w-full sm:w-auto h-10 pl-9 pr-8 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-xs font-bold focus:border-brand outline-none text-slate-700 dark:text-white uppercase tracking-widest cursor-pointer appearance-none shadow-sm"
                                >
                                    <option value="Todos">Todos os Cargos</option>
                                    <option value="Professor">Professor</option>
                                    <option value="Avaliador">Avaliador</option>
                                </select>
                            </div>
                            
                            <div className="relative w-full sm:w-auto lg:w-64 col-span-1 sm:col-span-2 lg:col-span-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Search size={14} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Pesquisar por nickname..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-10 pl-9 pr-4 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm sm:text-xs font-bold focus:border-brand outline-none text-slate-700 dark:text-white placeholder-slate-400 shadow-sm"
                                />
                            </div>
                            
                            <span className="col-span-1 sm:col-span-2 lg:col-span-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/10 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-brand/20 shrink-0 w-full sm:w-auto text-center h-10 flex items-center justify-center">
                                Total: {filteredMembers.length}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredMembers.map((member, idx) => {
                            const isOnline = onlineStatuses[member.nickname];
                            return (
                                <div key={idx} className="bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-brand/50 transition-all group overflow-hidden">
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className="relative shrink-0">
                                            <div className="w-12 h-12 bg-slate-50 dark:bg-black/40 rounded-full border border-slate-200 dark:border-brand/40 overflow-hidden flex justify-center items-center">
                                                <img src={`https://www.habbo.com.br/habbo-imaging/avatarimage?user=${member.nickname}&direction=2&head_direction=3&gesture=sml&size=m&headonly=1`} className="object-none object-center" alt={member.nickname} onError={(e) => e.target.style.display = 'none'} />
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#151b17] ${isOnline === true ? 'bg-green-500' : isOnline === false ? 'bg-slate-300 dark:bg-slate-600' : 'bg-transparent border-transparent'}`} title={isOnline ? 'Online' : 'Offline'}></div>
                                        </div>
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight truncate w-full">{member.nickname}</h4>
                                            <span className="text-[10px] font-medium tracking-wider text-brand mt-0.5 truncate">{member.role}</span>
                                        </div>
                                    </div>
                                    
                                    {hasAvailabilities(member.nickname) && (
                                        <button
                                            onClick={onBookClick}
                                            className="ml-3 shrink-0 w-9 h-9 flex items-center justify-center bg-brand/10 hover:bg-brand text-brand hover:text-white rounded-lg transition-colors"
                                            title="Agendar Avaliação"
                                        >
                                            <CalendarCheck size={16} className="shrink-0" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {filteredMembers.length === 0 && (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-500 uppercase font-bold tracking-widest">
                                Nenhum membro encontrado.
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        // --- PÁGINA 5: FORMADOS (PÚBLICO) ---
        const PaginaFormados = ({ formadosList }) => {
            const [searchTerm, setSearchTerm] = useState('');

            const filteredFormados = useMemo(() => {
                const term = searchTerm.toLowerCase();
                return formadosList.filter(f => 
                    f.currentNickname.toLowerCase().includes(term) || 
                    (f.oldNickname && f.oldNickname.toLowerCase().includes(term))
                );
            }, [formadosList, searchTerm]);

            return (
                <div className="animate-fade-in space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto ml-auto">
                            <div className="relative w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Search size={14} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Pesquisar por nickname..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-10 sm:h-9 pl-9 pr-4 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm sm:text-xs font-bold focus:border-brand outline-none text-slate-700 dark:text-white placeholder-slate-400 shadow-sm"
                                />
                            </div>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/10 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-brand/20 shrink-0 w-full sm:w-auto text-center h-10 sm:h-9 flex items-center justify-center">
                                Total: {filteredFormados.length}
                            </span>
                        </div>
                    </div>

                    {/* Design Minimalista e Compacto para Formados */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {filteredFormados.map((formado, idx) => {
                            const statusStr = formado.status ? formado.status.toLowerCase() : '';
                            const isAtivo = statusStr.includes('ativo');
                            const isValido = statusStr.includes('válido') || statusStr.includes('valido');

                            return (
                                <div key={idx} className="bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/20 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:border-brand/40 transition-all text-center relative overflow-hidden min-w-0">
                                    
                                    <div className="w-14 h-14 bg-slate-50 dark:bg-black/40 rounded-full border-2 border-slate-200 dark:border-brand/30 overflow-hidden mb-3 shrink-0 flex justify-center items-center">
                                        <img src={`https://www.habbo.com.br/habbo-imaging/avatarimage?user=${formado.currentNickname}&direction=2&head_direction=3&gesture=sml&size=m&headonly=1`} className="object-none object-center w-full h-full" alt={formado.currentNickname} onError={(e) => e.target.style.display = 'none'} />
                                    </div>
                                    
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-none truncate w-full px-2">{formado.currentNickname}</h4>
                                    
                                    {formado.oldNickname && (
                                        <span className="text-[10px] text-slate-500 mt-1 truncate w-full px-2">Antigo: {formado.oldNickname}</span>
                                    )}
                                    
                                    {formado.dateObtained && formado.dateObtained.toLowerCase() !== 'n/a' && (
                                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-2 block truncate w-full px-2">
                                            {formado.dateObtained}
                                        </span>
                                    )}
                                    
                                    <div className="mt-3 w-full">
                                        {isAtivo && (
                                            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50 text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-lg w-full truncate">Ativo</div>
                                        )}
                                        {isValido && (
                                            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-lg w-full truncate">
                                                Válido
                                            </div>
                                        )}
                                        {!isAtivo && !isValido && formado.status && (
                                            <div className="bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-lg w-full truncate">
                                                {formado.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {filteredFormados.length === 0 && (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-500 uppercase font-bold tracking-widest">
                                Nenhum formado encontrado.
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        // --- APLICAÇÃO PRINCIPAL ---
        const App = () => {
            const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
            const [toasts, setToasts] = useState([]);
            
            // Estado de Autenticação e Navegação com Suporte a URL Params
            const [currentUser, setCurrentUser] = useState({ nickname: '', role: '' });
            const [fullMembersList, setFullMembersList] = useState([]); // Lista completa de membros
            const [formadosList, setFormadosList] = useState([]); // Lista completa de formados
            const [authStatus, setAuthStatus] = useState('loading'); // loading, unauthorized, complete
            
            const [currentTab, setCurrentTab] = useState(() => {
                const params = new URLSearchParams(window.location.search);
                const tab = params.get('tab');
                const validTabs = ['agendamento', 'membros', 'formados', 'horarios', 'historico'];
                return validTabs.includes(tab) ? tab : 'agendamento';
            });

            // Função para mudar de aba e atualizar o link automaticamente
            const handleTabChange = (tab) => {
                setCurrentTab(tab);
                const url = new URL(window.location);
                url.searchParams.set('tab', tab);
                window.history.pushState({}, '', url);
            };

            // Estados do Supabase
            const [availabilities, setAvailabilities] = useState({});
            const [appointments, setAppointments] = useState([]);
            const [reports, setReports] = useState([]);
            
            // Estado do Reporte
            const [isReportModalOpen, setIsReportModalOpen] = useState(false);
            const [reportData, setReportData] = useState({ nickname: '', subject: 'Aula/Avaliação', message: '' });

            // Atualiza o nickname do form de reporte quando o user logar
            useEffect(() => {
                if (currentUser?.nickname) {
                    setReportData(prev => ({ ...prev, nickname: currentUser.nickname }));
                }
            }, [currentUser]);

            // Busca os dados do Supabase ao Iniciar e Assina o Realtime
            useEffect(() => {
                let isMounted = true;

                const fetchSupabaseData = async () => {
                    if (!supabaseClient) return;
                    try {
                        const { data: availData, error: availErr } = await supabaseClient.from('cfo_availabilities').select('*');
                        if (availErr) {
                            console.error("Select error:", availErr);
                            addToast('error', 'Erro de Leitura', 'Falha ao ler horários. Verifica se o RLS está desativado no Supabase.');
                        } else if (availData && isMounted) {
                            const loadedAvail = {};
                            availData.forEach(row => { loadedAvail[row.avaliador] = row.schedule; });
                            setAvailabilities(loadedAvail);
                        }

                        const { data: appData, error: appErr } = await supabaseClient.from('cfo_appointments').select('*');
                        if (appErr) {
                            console.error("Select error:", appErr);
                            addToast('error', 'Erro de Leitura', 'Falha ao ler agendamentos. Verifica se o RLS está desativado.');
                        } else if (appData && isMounted) {
                            setAppointments(appData);
                        }
                        
                        const { data: repData, error: repErr } = await supabaseClient.from('cfo_reports').select('*');
                        if (repErr) {
                            console.error("Select error:", repErr);
                        } else if (repData && isMounted) {
                            setReports(repData);
                        }
                    } catch (err) {
                        console.error("Falha ao puxar dados do Supabase:", err);
                    }
                };

                fetchSupabaseData();

                if (!supabaseClient) return;

                // Subscrição do Supabase Realtime
                const channel = supabaseClient
                    .channel('public-db-changes')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'cfo_availabilities' }, (payload) => {
                        if (!isMounted) return;
                        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                            setAvailabilities(prev => ({ ...prev, [payload.new.avaliador]: payload.new.schedule }));
                        } else if (payload.eventType === 'DELETE') {
                            setAvailabilities(prev => {
                                const copy = { ...prev };
                                delete copy[payload.old.avaliador];
                                return copy;
                            });
                        }
                    })
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'cfo_appointments' }, (payload) => {
                        if (!isMounted) return;
                        if (payload.eventType === 'INSERT') {
                            setAppointments(prev => {
                                // Prevenir duplicações locais devido ao optimistic update
                                if (prev.find(a => a.id === payload.new.id)) return prev;
                                return [...prev, payload.new];
                            });
                        } else if (payload.eventType === 'DELETE') {
                            setAppointments(prev => prev.filter(a => a.id !== payload.old.id));
                        } else if (payload.eventType === 'UPDATE') {
                            setAppointments(prev => prev.map(a => a.id === payload.new.id ? payload.new : a));
                        }
                    })
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'cfo_reports' }, (payload) => {
                        if (!isMounted) return;
                        if (payload.eventType === 'INSERT') {
                            setReports(prev => {
                                if (prev.find(r => r.id === payload.new.id)) return prev;
                                return [...prev, payload.new];
                            });
                        } else if (payload.eventType === 'DELETE') {
                            setReports(prev => prev.filter(r => r.id !== payload.old.id));
                        }
                    })
                    .subscribe();

                return () => {
                    isMounted = false;
                    supabaseClient.removeChannel(channel);
                };
            }, []);

            // Funções de Update no Supabase
            const updateAvailabilities = async (newAvail, avaliador) => {
                setAvailabilities(newAvail); // Optimistic UI update
                if (!supabaseClient) {
                    addToast('info', 'Aviso', 'Funcionando localmente. Configure o Supabase para salvar na nuvem.');
                    return;
                }
                const { error } = await supabaseClient.from('cfo_availabilities').upsert({
                    avaliador: avaliador,
                    schedule: newAvail[avaliador]
                }, { onConflict: 'avaliador' });
                if (error) {
                    console.error("Upsert error:", error);
                    addToast('error', 'Erro', 'Falha ao sincronizar com o servidor. Verifica a Primary Key da tabela.');
                }
            };

            const addAppointment = async (app) => {
                setAppointments(prev => [...prev, app]); // Optimistic UI update
                if (!supabaseClient) {
                    addToast('info', 'Aviso', 'Funcionando localmente. Configure o Supabase para salvar na nuvem.');
                    return;
                }
                const { error } = await supabaseClient.from('cfo_appointments').insert(app);
                if (error) addToast('error', 'Erro', 'Falha ao sincronizar agendamento.');
            };
            
            const removeAppointment = async (appId) => {
                setAppointments(prev => prev.filter(app => app.id !== appId)); // Optimistic UI update
                if (!supabaseClient) {
                    addToast('info', 'Aviso', 'Cancelado localmente. Configure o Supabase para salvar na nuvem.');
                    return;
                }
                const { error } = await supabaseClient.from('cfo_appointments').delete().eq('id', appId);
                if (error) addToast('error', 'Erro', 'Falha ao cancelar o agendamento no servidor.');
            };

            const handleClearExpired = async () => {
                if (!supabaseClient) {
                    addToast('error', 'Erro', 'Supabase não conectado.');
                    return;
                }

                try {
                    let hasChanges = false;
                    
                    // 1. Limpar agendamentos expirados (+ de 1h)
                    const expiredAppIds = appointments.filter(app => isTimeExpired(app.date, app.time)).map(app => app.id);
                    if (expiredAppIds.length > 0) {
                        const { error: appErr } = await supabaseClient.from('cfo_appointments').delete().in('id', expiredAppIds);
                        if (appErr) throw appErr;
                        setAppointments(prev => prev.filter(app => !expiredAppIds.includes(app.id)));
                        hasChanges = true;
                    }

                    // 2. Limpar disponibilidades expiradas (+ de 1h)
                    const newAvail = { ...availabilities };
                    let availabilitiesChanged = false;

                    for (const avaliador of Object.keys(newAvail)) {
                        const dates = { ...newAvail[avaliador] };
                        let avaliadorChanged = false;
                        
                        for (const date of Object.keys(dates)) {
                            const times = dates[date];
                            const validTimes = times.filter(t => !isTimeExpired(date, t));
                            
                            if (validTimes.length !== times.length) {
                                avaliadorChanged = true;
                                if (validTimes.length === 0) {
                                    delete dates[date];
                                } else {
                                    dates[date] = validTimes;
                                }
                            }
                        }
                        
                        if (avaliadorChanged) {
                            availabilitiesChanged = true;
                            newAvail[avaliador] = dates;
                            const { error } = await supabaseClient.from('cfo_availabilities').upsert({
                                avaliador: avaliador,
                                schedule: dates
                            }, { onConflict: 'avaliador' });
                            if (error) throw error;
                        }
                    }

                    if (availabilitiesChanged) {
                        setAvailabilities(newAvail);
                        hasChanges = true;
                    }

                    if (hasChanges) {
                        addToast('success', 'Limpeza Concluída', 'Registos expirados foram removidos.');
                    } else {
                        addToast('info', 'Aviso', 'Nenhum registo expirado encontrado.');
                    }
                    
                } catch (error) {
                    console.error(error);
                    addToast('error', 'Erro', 'Falha ao limpar dados expirados do servidor.');
                }
            };
            
            const submitReport = async () => {
                if (!reportData.nickname.trim() || !reportData.message.trim()) {
                    addToast('error', 'Erro', 'Preencha o seu nickname e a mensagem antes de enviar.');
                    return;
                }
                if (!supabaseClient) {
                    addToast('info', 'Aviso', 'Reporte cancelado: Supabase não conectado.');
                    return;
                }
                
                const newReport = {
                    nickname: reportData.nickname,
                    subject: reportData.subject,
                    message: reportData.message,
                    created_at: new Date().toISOString()
                };
                
                try {
                    const { error } = await supabaseClient.from('cfo_reports').insert(newReport);
                    if (error) {
                        addToast('error', 'Erro', 'Falha ao enviar o reporte. Verifique a tabela no Supabase.');
                        console.error(error);
                    } else {
                        addToast('success', 'Sucesso', 'Reporte enviado com sucesso. Obrigado!');
                        setIsReportModalOpen(false);
                        setReportData(prev => ({ ...prev, message: '' }));
                    }
                } catch (err) {
                    addToast('error', 'Erro', 'Ocorreu um erro ao comunicar com a base de dados.');
                }
            };

            // Aplicar Tema
            useEffect(() => {
                const root = document.documentElement;
                if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
                localStorage.setItem('theme', theme);
            }, [theme]);

            const addToast = (type, title, message) => {
                const id = Math.random().toString(36).substr(2, 9);
                setToasts(prev => [...prev, { id, type, title, message }]);
                setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
            };

            const parseTSVGlobal = (tsv) => {
                let rows = []; let currentRow = []; let currentCell = ''; let inQuotes = false;
                for (let i = 0; i < tsv.length; i++) {
                    let char = tsv[i], nextChar = tsv[i+1];
                    if (inQuotes) {
                        if (char === '"' && nextChar === '"') { currentCell += '"'; i++; }
                        else if (char === '"') { inQuotes = false; }
                        else { currentCell += char; }
                    } else {
                        if (char === '"' && currentCell.trim() === '') { inQuotes = true; }
                        else if (char === '\t') { currentRow.push(currentCell); currentCell = ''; }
                        else if (char === '\n') { currentRow.push(currentCell); rows.push(currentRow); currentRow = []; currentCell = ''; }
                        else if (char === '\r') { if (nextChar !== '\n') currentCell += char; }
                        else { currentCell += char; }
                    }
                }
                if (currentCell !== '' || currentRow.length > 0) { currentRow.push(currentCell); rows.push(currentRow); }
                return rows;
            };

            const getForumUsername = async () => {
                try {
                    const response = await fetch("/forum", { cache: "no-store" });
                    const html = await response.text();
                    const match = html.match(/_userdata\["username"\]\s*=\s*"([^"]+)"/);
                    return match && match[1] ? match[1] : null;
                } catch { return null; }
            };

            // Processo para puxar a lista de formados
            useEffect(() => {
                const fetchFormados = async () => {
                    try {
                        const response = await fetch(MACRO_FORMADOS_URL);
                        const text = await response.text();
                        const data = parseTSVGlobal(text);
                        let extractedFormados = [];

                        for (let i = 1; i < data.length; i++) {
                            const row = data[i];
                            const currentNick = row[6] ? row[6].toString().trim() : ''; // G (Novo Nick / Atual)
                            
                            if (currentNick && currentNick.toLowerCase() !== 'nickname' && currentNick.toLowerCase() !== 'novo nickname' && currentNick.toLowerCase() !== 'nick atual') {
                                extractedFormados.push({
                                    currentNickname: currentNick,
                                    dateObtained: row[7] ? row[7].toString().trim() : '', // H
                                    oldNickname: row[8] ? row[8].toString().trim() : '', // I
                                    status: row[9] ? row[9].toString().trim() : '' // J
                                });
                            }
                        }
                        setFormadosList(extractedFormados);
                    } catch (error) {
                        console.error("Falha ao carregar a lista de formados", error);
                    }
                };
                fetchFormados();
            }, []);

            // Processo de Autenticação e Leitura de Membros
            useEffect(() => {
                const authenticate = async () => {
                    const forumNick = await getForumUsername();
                    
                    // BLOQUEIO: Se não tiver logado no fórum (ou em modo visitante), barra o acesso.
                    if (!forumNick || forumNick.toLowerCase().trim() === "convidado") {
                        setAuthStatus('unauthorized');
                        return;
                    }

                    const nickToSearch = forumNick.toLowerCase().trim();

                    try {
                        const response = await fetch(MACRO_AUTH_URL);
                        const text = await response.text();
                        const data = parseTSVGlobal(text);
                        
                        let foundRole = null;
                        let foundNick = forumNick;
                        let extractedMembers = [];

                        for (let i = 0; i < data.length; i++) {
                            const row = data[i];
                            
                            // Adicionar à lista geral de membros (Apenas Colunas A [0] e B [1])
                            if (row[0] && row[1] && row[0].trim() !== '' && row[0].toLowerCase() !== 'cargo') {
                                extractedMembers.push({ role: row[0].toString().trim(), nickname: row[1].toString().trim() });
                            }

                            // Identificação do utilizador ativo (Apenas na Coluna B [1])
                            if (row[1] && row[1].toString().trim().toLowerCase() === nickToSearch) {
                                foundRole = row[0] ? row[0].toString().trim() : 'Avaliador';
                                foundNick = row[1].toString().trim();
                            }
                        }

                        // Remove possíveis membros duplicados da lista
                        const uniqueMembers = Array.from(new Map(extractedMembers.map(item => [item.nickname, item])).values());
                        setFullMembersList(uniqueMembers);

                        if (foundRole) {
                            setCurrentUser({ nickname: foundNick, role: foundRole });
                            // A aba inicial é gerida pelo currentTab state (URL Params)
                        } else {
                            // Está logado no fórum mas não está na macro = Aluno (Convidado)
                            setCurrentUser({ nickname: forumNick, role: 'Convidado' });
                        }
                    } catch (error) {
                        // Erro ao carregar a TSV, mas está logado no fórum
                        setCurrentUser({ nickname: forumNick, role: 'Convidado' });
                    } finally {
                        setAuthStatus('complete');
                    }
                };
                authenticate();
            }, []);

            const isAvaliador = currentUser.role !== 'Convidado' && currentUser.role !== '';
            
            const normalizedUserRole = currentUser.role ? currentUser.role.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : '';
            const canViewHistory = ['fiscalizador', 'estagiario', 'conselheiro', 'vice-lider', 'lider', 'diretor', 'coordenador'].some(r => normalizedUserRole.includes(r));

            return (
                <div className="flex flex-col min-h-screen w-full pb-10">
                    <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

                    <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 mt-2 md:mt-6">
                        <div className="bg-white dark:bg-[#121813] rounded-2xl border border-slate-200 dark:border-brand/50 border-t-4 border-t-brand p-4 sm:p-6 md:p-10 transition-colors shadow-lg">
                            
                            {/* HEADER */}
                            <div className="flex flex-col gap-6 mb-6 sm:mb-8 border-b border-slate-100 dark:border-brand/20 pb-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 min-w-0">
                                    <BrandHeader />
                                    
                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end min-w-0">
                                        <button 
                                            onClick={() => setIsReportModalOpen(true)} 
                                            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-black/20 hover:bg-brand/10 hover:text-brand dark:hover:bg-brand/20 dark:hover:text-brand-light text-slate-500 rounded-full sm:rounded-lg w-10 h-10 sm:w-auto sm:px-3 sm:py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border border-slate-200 dark:border-brand/20 shrink-0" 
                                        >
                                            <Flag size={14} className="shrink-0" />
                                            <span className="hidden sm:inline">Reportar</span>
                                        </button>
                                        <button 
                                            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-black/20 text-slate-500 hover:text-brand transition-colors border border-slate-200 dark:border-brand/20 shrink-0" 
                                        >
                                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                        </button>
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="text-right hidden sm:flex flex-col min-w-0">
                                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{currentUser.nickname || 'Aguardando...'}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-brand">{currentUser.role || 'Visitante'}</p>
                                            </div>
                                            <div className="shrink-0">
                                                {currentUser.nickname && currentUser.nickname !== 'Visitante' ? (
                                                    <img src={`https://www.habbo.com.br/habbo-imaging/avatarimage?user=${currentUser.nickname}&direction=3&head_direction=3&gesture=sml&size=m&headonly=1`} className="object-none object-center bg-slate-50 dark:bg-black/20 rounded-full w-10 h-10 border border-slate-200 dark:border-brand/30" alt={currentUser.nickname} onError={(e) => e.target.style.display = 'none'} />
                                                ) : (
                                                    <div className="w-10 h-10 bg-slate-100 dark:bg-black/20 rounded-full border border-slate-200 dark:border-brand/20 overflow-hidden flex items-center justify-center">
                                                        <Users size={16} className="text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* NAVEGAÇÃO DE ABAS */}
                                {authStatus === 'complete' && (
                                    <div className="flex overflow-x-auto hide-scrollbar gap-2 sm:gap-4 border-b-2 border-slate-100 dark:border-white/5 pt-2 pb-1">
                                        <button
                                            onClick={() => handleTabChange('agendamento')}
                                            className={`shrink-0 whitespace-nowrap pb-3 px-3 sm:px-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors relative
                                                ${currentTab === 'agendamento' ? 'text-brand' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                        >
                                            Agendamento
                                            {currentTab === 'agendamento' && <span className="absolute bottom-[-2px] left-0 w-full h-1 bg-brand rounded-t-md transition-all duration-300"></span>}
                                        </button>

                                        <button
                                            onClick={() => handleTabChange('membros')}
                                            className={`shrink-0 whitespace-nowrap pb-3 px-3 sm:px-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors relative
                                                ${currentTab === 'membros' ? 'text-brand' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                        >
                                            Listagem
                                            {currentTab === 'membros' && <span className="absolute bottom-[-2px] left-0 w-full h-1 bg-brand rounded-t-md transition-all duration-300"></span>}
                                        </button>

                                        <button
                                            onClick={() => handleTabChange('formados')}
                                            className={`shrink-0 whitespace-nowrap pb-3 px-3 sm:px-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors relative
                                                ${currentTab === 'formados' ? 'text-brand' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                        >
                                            Formados
                                            {currentTab === 'formados' && <span className="absolute bottom-[-2px] left-0 w-full h-1 bg-brand rounded-t-md transition-all duration-300"></span>}
                                        </button>
                                        
                                        {isAvaliador && (
                                            <button
                                                onClick={() => handleTabChange('horarios')}
                                                className={`shrink-0 whitespace-nowrap pb-3 px-3 sm:px-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors relative
                                                    ${currentTab === 'horarios' ? 'text-brand' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                            >
                                                Meus Horários
                                                {currentTab === 'horarios' && <span className="absolute bottom-[-2px] left-0 w-full h-1 bg-brand rounded-t-md transition-all duration-300"></span>}
                                            </button>
                                        )}
                                        {canViewHistory && (
                                            <button
                                                onClick={() => handleTabChange('historico')}
                                                className={`shrink-0 whitespace-nowrap pb-3 px-3 sm:px-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors relative
                                                    ${currentTab === 'historico' ? 'text-brand' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                            >
                                                Histórico
                                                {currentTab === 'historico' && <span className="absolute bottom-[-2px] left-0 w-full h-1 bg-brand rounded-t-md transition-all duration-300"></span>}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* CORPO DA APLICAÇÃO */}
                            <div className="min-h-[300px] mt-4 sm:mt-6">
                                {authStatus === 'loading' ? (
                                    <div className="flex justify-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">A carregar perfil...</div>
                                ) : authStatus === 'unauthorized' ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 animate-fade-in">
                                        <AlertTriangle size={64} className="text-red-500 mb-2" />
                                        <h2 className="text-xl sm:text-2xl font-condensed font-bold uppercase text-slate-800 dark:text-white">Acesso Negado</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                            É estritamente obrigatório estar autenticado no fórum para visualizar e utilizar o sistema de agendamento de avaliações do CFO.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {currentTab === 'agendamento' && (
                                            <PaginaAgendamento 
                                                currentUser={currentUser} 
                                                addToast={addToast} 
                                                availabilities={availabilities} 
                                                appointments={appointments} 
                                                addAppointment={addAppointment} 
                                                removeAppointment={removeAppointment}
                                                fullMembersList={fullMembersList}
                                            />
                                        )}
                                        {currentTab === 'membros' && (
                                            <PaginaMembros 
                                                membersList={fullMembersList} 
                                                availabilities={availabilities}
                                                onBookClick={() => handleTabChange('agendamento')}
                                            />
                                        )}
                                        {currentTab === 'formados' && (
                                            <PaginaFormados 
                                                formadosList={formadosList} 
                                            />
                                        )}
                                        {currentTab === 'horarios' && isAvaliador && (
                                            <PaginaHorarios 
                                                currentUser={currentUser} 
                                                addToast={addToast} 
                                                availabilities={availabilities} 
                                                updateAvailabilities={updateAvailabilities} 
                                                appointments={appointments}
                                            />
                                        )}
                                        {currentTab === 'historico' && canViewHistory && (
                                            <PaginaHistorico 
                                                appointments={appointments}
                                                reports={reports} 
                                                addToast={addToast}
                                                onClearExpired={handleClearExpired}
                                                currentUser={currentUser}
                                            />
                                        )}
                                    </>
                                )}
                            </div>

                            {/* FOOTER LINK GLOBAL */}
                            {authStatus === 'complete' && (
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-brand/20 flex justify-center">
                                    <a href="/forum" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand transition-colors">
                                        <ExternalLink size={14} /> Voltar ao Fórum CFO
                                    </a>
                                </div>
                            )}

                            {/* MODAL DE REPORTE */}
                            {isReportModalOpen && ReactDOM.createPortal(
                                <div className="relative z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>
                                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                                            <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-fade-in flex flex-col">
                                                <div className="p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]">
                                                    <h3 className="text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white flex items-center gap-2">
                                                        <Flag size={18} className="text-brand" /> Novo Reporte
                                                    </h3>
                                                    <button onClick={() => setIsReportModalOpen(false)} className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"><X size={16} /></button>
                                                </div>
                                                <div className="p-6 space-y-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Seu Nickname</label>
                                                        <input 
                                                            type="text" 
                                                            value={reportData.nickname}
                                                            onChange={(e) => setReportData({...reportData, nickname: e.target.value})}
                                                            className="w-full h-10 px-3 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand focus:ring-1 focus:ring-brand outline-none text-slate-700 dark:text-white shadow-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Assunto</label>
                                                        <div className="relative w-full">
                                                            <select 
                                                                value={reportData.subject}
                                                                onChange={(e) => setReportData({...reportData, subject: e.target.value})}
                                                                className="w-full h-10 px-3 pr-8 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand focus:ring-1 focus:ring-brand outline-none text-slate-700 dark:text-white shadow-sm appearance-none cursor-pointer"
                                                            >
                                                                <option value="Aula/Avaliação">Aula/Avaliação</option>
                                                                <option value="Site/Ferramenta">Site/Ferramenta</option>
                                                                <option value="Sugestões/Melhorias">Sugestões/Melhorias</option>
                                                                <option value="Erro/Bug">Erro/Bug</option>
                                                                <option value="Dúvidas">Dúvidas</option>
                                                                <option value="Reclamações">Reclamações</option>
                                                                <option value="Outros">Outros</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Mensagem</label>
                                                        <textarea 
                                                            value={reportData.message}
                                                            onChange={(e) => setReportData({...reportData, message: e.target.value})}
                                                            placeholder="Descreva detalhadamente a situação..."
                                                            rows="4"
                                                            className="w-full p-3 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-slate-700 dark:text-white shadow-sm resize-none custom-scrollbar"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                                <div className="p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex flex-col sm:flex-row gap-3 sm:justify-end">
                                                    <button onClick={() => setIsReportModalOpen(false)} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg">Cancelar</button>
                                                    <button onClick={submitReport} className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-brand hover:bg-brand-hover text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                                                        <CheckCircle2 size={16} className="shrink-0" /> Enviar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>,
                                document.body
                            )}
                        </div>
                    </div>
                </div>
            );
        };

        const container = document.getElementById('root');
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
