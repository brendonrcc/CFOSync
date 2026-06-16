const {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;

// --- ICONS ---
const Icon = ({
  name,
  size = 24,
  className = "",
  ...props
}) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.lucide) return;
    const pascalName = name.replace(/-([a-z0-9])/g, g => g[1].toUpperCase()).replace(/^[a-z]/, g => g.toUpperCase());
    const iconDef = window.lucide.icons[pascalName];
    if (iconDef) {
      const svg = window.lucide.createElement(iconDef);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      ref.current.innerHTML = '';
      ref.current.appendChild(svg);
    }
  }, [name, size]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: className,
    style: {
      display: 'inline-flex',
      alignItems: 'center'
    },
    ...props
  });
};
const CalendarDays = p => /*#__PURE__*/React.createElement(Icon, {
  name: "calendar-days",
  ...p
});
const Clock = p => /*#__PURE__*/React.createElement(Icon, {
  name: "clock",
  ...p
});
const CalendarCheck = p => /*#__PURE__*/React.createElement(Icon, {
  name: "calendar-check",
  ...p
});
const Users = p => /*#__PURE__*/React.createElement(Icon, {
  name: "users",
  ...p
});
const Moon = p => /*#__PURE__*/React.createElement(Icon, {
  name: "moon",
  ...p
});
const Sun = p => /*#__PURE__*/React.createElement(Icon, {
  name: "sun",
  ...p
});
const CheckCircle2 = p => /*#__PURE__*/React.createElement(Icon, {
  name: "check-circle-2",
  ...p
});
const AlertTriangle = p => /*#__PURE__*/React.createElement(Icon, {
  name: "alert-triangle",
  ...p
});
const X = p => /*#__PURE__*/React.createElement(Icon, {
  name: "x",
  ...p
});
const Trash2 = p => /*#__PURE__*/React.createElement(Icon, {
  name: "trash-2",
  ...p
});
const ListOrdered = p => /*#__PURE__*/React.createElement(Icon, {
  name: "list-ordered",
  ...p
});
const Info = p => /*#__PURE__*/React.createElement(Icon, {
  name: "info",
  ...p
});
const ChevronLeft = p => /*#__PURE__*/React.createElement(Icon, {
  name: "chevron-left",
  ...p
});
const ChevronRight = p => /*#__PURE__*/React.createElement(Icon, {
  name: "chevron-right",
  ...p
});
const Search = p => /*#__PURE__*/React.createElement(Icon, {
  name: "search",
  ...p
});
const Filter = p => /*#__PURE__*/React.createElement(Icon, {
  name: "filter",
  ...p
});
const Download = p => /*#__PURE__*/React.createElement(Icon, {
  name: "download",
  ...p
});
const GraduationCap = p => /*#__PURE__*/React.createElement(Icon, {
  name: "graduation-cap",
  ...p
});
const ExternalLink = p => /*#__PURE__*/React.createElement(Icon, {
  name: "external-link",
  ...p
});
const Flag = p => /*#__PURE__*/React.createElement(Icon, {
  name: "flag",
  ...p
});
const BookOpen = p => /*#__PURE__*/React.createElement(Icon, {
  name: "book-open",
  ...p
});
const MessageCircle = p => /*#__PURE__*/React.createElement(Icon, {
  name: "message-circle",
  ...p
});
const Pencil = p => /*#__PURE__*/React.createElement(Icon, {
  name: "pencil",
  ...p
});

// --- CONSTANTES & API ---
const MACRO_AUTH_URL = "https://api-professor-dashboard.brendonhbrcc.workers.dev/?gid=1512246214";
const MACRO_FORMADOS_URL = "https://api-professor-dashboard.brendonhbrcc.workers.dev/?gid=1016191277";
const MACRO_FALTAS_URL = "https://script.google.com/macros/s/AKfycbxZA4DWO2b7YWRGwIGsjt4HmvHAsdIo3J6dYVYpZL28t1HlEtk7ARqCve2iTfJZa22gdw/exec";
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
const AVAILABLE_TIMES = Array.from({
  length: 24
}, (_, i) => `${i.toString().padStart(2, '0')}:00`);
const normalizeSchedule = schedule => {
  if (!schedule || typeof schedule !== 'object' || Array.isArray(schedule)) return {};
  return Object.entries(schedule).reduce((acc, [day, times]) => {
    const validTimes = Array.isArray(times) ? times.filter(Boolean) : [];
    if (validTimes.length > 0) acc[day] = validTimes;
    return acc;
  }, {});
};
const normalizeAvailabilityMap = availabilityMap => {
  if (!availabilityMap || typeof availabilityMap !== 'object' || Array.isArray(availabilityMap)) return {};
  return Object.entries(availabilityMap).reduce((acc, [avaliador, schedule]) => {
    acc[avaliador] = normalizeSchedule(schedule);
    return acc;
  }, {});
};
const hasScheduleSlots = schedule => Object.values(normalizeSchedule(schedule)).some(times => times.length > 0);
const DAYS_OF_WEEK = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const normalizeForumIdentity = (value = '') => String(value).normalize('NFKC').replace(/\s+/g, ' ').trim();
const foldForumIdentity = (value = '') => normalizeForumIdentity(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const isBlockedForumIdentity = value => {
  const n = foldForumIdentity(value);
  if (!n) return true;
  const blocked = ['anonymous', 'anonymus', 'anonimo', 'anonima', 'anon', 'modo anonimo', 'janela anonima', 'incognito', 'modo incognito', 'convidado', 'guest', 'visitante', 'visitor', 'login', 'entrar', 'iniciar sessao', 'registrar', 'register'];
  if (blocked.includes(n)) return true;
  if (/\b(anonymous|anonymus|anonimo|anonima)\b/.test(n)) return true;
  return /^(anonymous|anonymus|anonimo|anonima|anon|guest|convidado|visitante|visitor)(\b|[\s_\-.#0-9])/.test(n);
};
const isLoggedOutForumValue = value => {
  if (value === undefined || value === null || value === '') return false;
  const n = foldForumIdentity(String(value).replace(/^["']|["']$/g, ''));
  return ['0', 'false', 'no', 'nao', 'não', 'off', 'logged_out', 'logout'].includes(n);
};
const isNonPositiveForumId = value => {
  if (value === undefined || value === null || value === '') return false;
  const id = Number(String(value).replace(/^["']|["']$/g, '').trim());
  return Number.isFinite(id) && id <= 0;
};
const forumSessionLooksLoggedOut = (session = {}) => {
  if (!session || typeof session !== 'object') return false;
  const sessionFlag = session.session_logged_in ?? session.logged_in ?? session.isLoggedIn;
  const userId = session.user_id ?? session.userId ?? session.id;
  return isLoggedOutForumValue(sessionFlag) || isNonPositiveForumId(userId);
};
const htmlForumSessionLooksLoggedOut = (html = '') => {
  if (!html || typeof html !== 'string') return false;
  const sessionMatch = html.match(/_userdata(?:\[['"]session_logged_in['"]\]|\.session_logged_in)\s*=\s*([^;\n]+)/i);
  if (sessionMatch && isLoggedOutForumValue(sessionMatch[1])) return true;
  const userIdMatch = html.match(/_userdata(?:\[['"]user_id['"]\]|\.user_id)\s*=\s*([^;\n]+)/i);
  return userIdMatch ? isNonPositiveForumId(userIdMatch[1]) : false;
};

// --- BLINDAGEM DE IDENTIDADE (anti-bypass por console/devtools) ---
const createForumIdentityShield = () => {
  const _vault = new Map();
  const _seed = (() => {
    const rnd = () => Math.random().toString(36).slice(2, 10);
    return `${Date.now().toString(36)}.${rnd()}${rnd()}`;
  })();
  const normalize = (value = '') => value.toString().normalize('NFKC').trim();
  const hash = input => {
    let h = 0x811c9dc5;
    const text = String(input);
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  };
  const mask = (seed, size) => {
    let out = '';
    let cursor = `${seed}:${_seed}:${size}`;
    while (out.length < size) {
      cursor = hash(cursor + out.length);
      out += cursor;
    }
    return out.slice(0, size);
  };
  const utf8Encode = text => {
    if (typeof TextEncoder !== 'undefined') return Array.from(new TextEncoder().encode(text));
    return Array.from(unescape(encodeURIComponent(text))).map(ch => ch.charCodeAt(0));
  };
  const utf8Decode = bytes => {
    if (typeof TextDecoder !== 'undefined') return new TextDecoder().decode(new Uint8Array(bytes));
    return decodeURIComponent(escape(String.fromCharCode(...bytes)));
  };
  const obfEncode = (plainText, seed) => {
    const bytes = utf8Encode(plainText);
    const key = mask(seed, Math.max(bytes.length, 1));
    const scrambled = bytes.map((byte, i) => (byte ^ key.charCodeAt(i)) & 0xff);
    return btoa(String.fromCharCode(...scrambled));
  };
  const obfDecode = (encoded, seed) => {
    try {
      const bytes = Array.from(atob(encoded), ch => ch.charCodeAt(0));
      const key = mask(seed, Math.max(bytes.length, 1));
      const clearBytes = bytes.map((byte, i) => (byte ^ key.charCodeAt(i)) & 0xff);
      return utf8Decode(clearBytes);
    } catch (error) {
      return null;
    }
  };
  const lock = (nickname, role) => {
    const n = normalize(nickname);
    const r = normalize(role);
    const nonce = `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 12)}`;
    const payload = obfEncode(JSON.stringify({
      n,
      r,
      tag: nonce.slice(0, 5)
    }), nonce);
    const signature = hash(`${payload}|${nonce}|${_seed}|${n.toLowerCase()}|${r.toLowerCase()}`);
    const handle = hash(`${nonce}|${payload}|${Math.random().toString(36).slice(2, 8)}`);
    _vault.set(handle, {
      payload,
      nonce,
      signature
    });
    return handle;
  };
  const read = handle => {
    const record = _vault.get(handle);
    if (!record) return null;
    const decoded = obfDecode(record.payload, record.nonce);
    if (!decoded) return null;
    try {
      const parsed = JSON.parse(decoded);
      const safeNick = normalize(parsed?.n);
      const safeRole = normalize(parsed?.r);
      const expected = hash(`${record.payload}|${record.nonce}|${_seed}|${safeNick.toLowerCase()}|${safeRole.toLowerCase()}`);
      if (expected !== record.signature) return null;
      return Object.freeze({
        nickname: safeNick,
        role: safeRole
      });
    } catch (error) {
      return null;
    }
  };
  const verify = (handle, candidate) => {
    const trusted = read(handle);
    if (!trusted) return false;
    const nick = normalize(candidate?.nickname).toLowerCase();
    const role = normalize(candidate?.role).toLowerCase();
    return nick === trusted.nickname.toLowerCase() && role === trusted.role.toLowerCase();
  };
  return Object.freeze({
    lock,
    read,
    verify
  });
};

// --- LÓGICA DE DATAS ---
const getNextDateForDayOfWeek = dayName => {
  const dayIndex = DAYS_OF_WEEK.indexOf(dayName);
  if (dayIndex === -1) return new Date().toISOString().split('T')[0];
  const today = new Date();
  let targetDate = new Date(today);
  const daysUntil = (dayIndex + 7 - today.getDay()) % 7;
  targetDate.setDate(today.getDate() + daysUntil);
  return targetDate.toISOString().split('T')[0];
};
const isTimeExpired = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return false;
  const [year, month, day] = dateStr.split('-');
  const [hour, minute] = timeStr.split(':');
  const slotDate = new Date(year, parseInt(month) - 1, day, parseInt(hour), parseInt(minute));
  const expiryDate = new Date(slotDate.getTime() + 60 * 60 * 1000);
  return new Date() >= expiryDate;
};
const checkIsLess24h = (dateStr, timeStr) => {
  const slotTime = new Date(`${dateStr}T${timeStr}:00`);
  const now = new Date();
  return slotTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000;
};
const canCancelAppointment = (dateStr, timeStr) => {
  const slotTime = new Date(`${dateStr}T${timeStr}:00`);
  const now = new Date();
  const diffHours = (slotTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours >= 4;
};
const getStartOfWeek = dateStr => {
  const date = new Date(dateStr + 'T12:00:00');
  const diff = date.getDate() - date.getDay();
  return new Date(date.setDate(diff)).toISOString().split('T')[0];
};
const getEndOfWeek = dateStr => {
  const date = new Date(dateStr + 'T12:00:00');
  const diff = date.getDate() + (6 - date.getDay());
  return new Date(date.setDate(diff)).toISOString().split('T')[0];
};

// --- COMPONENTES BASE ---
const ToastContainer = ({
  toasts,
  removeToast
}) => /*#__PURE__*/React.createElement("div", {
  className: "fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
}, toasts.map(toast => /*#__PURE__*/React.createElement("div", {
  key: toast.id,
  className: `pointer-events-auto bg-white dark:bg-[#1a231d] border-l-4 p-4 rounded-sm shadow-lg flex items-start gap-3 animate-slide-in-right ${toast.type === 'success' ? 'border-l-green-500' : toast.type === 'error' ? 'border-l-red-500' : 'border-l-blue-500'}`
}, /*#__PURE__*/React.createElement("div", {
  className: toast.type === 'success' ? 'text-green-500' : toast.type === 'error' ? 'text-red-500' : 'text-blue-500'
}, toast.type === 'success' ? /*#__PURE__*/React.createElement(CheckCircle2, {
  size: 20
}) : toast.type === 'error' ? /*#__PURE__*/React.createElement(AlertTriangle, {
  size: 20
}) : /*#__PURE__*/React.createElement(Info, {
  size: 20
})), /*#__PURE__*/React.createElement("div", {
  className: "flex-1 min-w-0"
}, /*#__PURE__*/React.createElement("h4", {
  className: `text-xs font-bold uppercase truncate ${toast.type === 'success' ? 'text-green-600 dark:text-green-400' : toast.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`
}, toast.title), /*#__PURE__*/React.createElement("p", {
  className: "text-xs text-slate-700 dark:text-slate-300 break-words"
}, toast.message)), /*#__PURE__*/React.createElement("button", {
  onClick: () => removeToast(toast.id),
  className: "text-slate-400 hover:text-slate-600 shrink-0"
}, /*#__PURE__*/React.createElement(X, {
  size: 16
})))));
const BrandHeader = () => /*#__PURE__*/React.createElement("div", {
  className: "flex items-center gap-3 select-none"
}, /*#__PURE__*/React.createElement("img", {
  src: LOGO_URL,
  alt: "CFO",
  className: "h-8 sm:h-10 w-auto shrink-0"
}), /*#__PURE__*/React.createElement("div", {
  className: "flex flex-col leading-none"
}, /*#__PURE__*/React.createElement("div", {
  className: "flex items-baseline gap-1.5"
}, /*#__PURE__*/React.createElement("span", {
  className: "text-xl sm:text-2xl font-condensed font-bold text-slate-900 dark:text-white italic tracking-tighter"
}, "CENTRO"), /*#__PURE__*/React.createElement("span", {
  className: "text-xs sm:text-sm font-serif italic text-brand"
}, "de"), /*#__PURE__*/React.createElement("span", {
  className: "text-xl sm:text-2xl font-condensed font-bold text-slate-900 dark:text-white italic tracking-tighter"
}, "FORMAÇÃO")), /*#__PURE__*/React.createElement("div", {
  className: "flex items-baseline gap-1.5 -mt-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "text-xs sm:text-sm font-serif italic text-brand"
}, "de"), /*#__PURE__*/React.createElement("span", {
  className: "text-lg sm:text-xl font-display uppercase tracking-widest text-slate-900 dark:text-white"
}, "OFICIAIS"))));

// --- PÁGINA: HORÁRIOS (VISÃO AVALIADOR) ---
const PaginaHorarios = ({
  currentUser,
  addToast,
  availabilities,
  updateAvailabilities,
  appointments,
  updateAppointment,
  evaluatorWhatsapps
}) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [whatsappInput, setWhatsappInput] = useState(evaluatorWhatsapps[currentUser.nickname] || '');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [evalCancelApp, setEvalCancelApp] = useState(null);
  const [evalCancelReason, setEvalCancelReason] = useState('plausivel');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const myAvailabilities = availabilities[currentUser.nickname] || {};
  const myActiveAppointments = useMemo(() => {
    return appointments.filter(app => app.avaliador === currentUser.nickname && (app.status === 'agendado' || !app.status)).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [appointments, currentUser.nickname]);
  const handleTimeToggle = time => {
    if (selectedTimes.includes(time)) setSelectedTimes(prev => prev.filter(t => t !== time));else setSelectedTimes(prev => [...prev, time].sort());
  };
  const handleSave = () => {
    if (!selectedDay) return addToast('error', 'Erro', 'Selecione um dia da semana.');
    if (selectedTimes.length === 0) return addToast('error', 'Erro', 'Selecione pelo menos um horário.');
    const userAvail = availabilities[currentUser.nickname] || {};
    const existingTimesForDay = userAvail[selectedDay] || [];
    const newTimes = Array.from(new Set([...existingTimesForDay, ...selectedTimes])).sort();
    const newAvail = {
      ...availabilities,
      [currentUser.nickname]: {
        ...userAvail,
        [selectedDay]: newTimes
      }
    };
    updateAvailabilities(newAvail, currentUser.nickname);
    addToast('success', 'Sucesso', 'Horários semanais guardados com sucesso!');
    setSelectedTimes([]);
    setSelectedDay('');
  };
  const handleDeleteDay = day => {
    const userAvail = {
      ...availabilities[currentUser.nickname]
    };
    delete userAvail[day];
    const newAvail = {
      ...availabilities,
      [currentUser.nickname]: userAvail
    };
    updateAvailabilities(newAvail, currentUser.nickname);
    addToast('success', 'Atualizado', 'Dia removido da sua rotina semanal.');
  };
  const handleDeleteTime = (day, time) => {
    const userAvail = {
      ...availabilities[currentUser.nickname]
    };
    userAvail[day] = userAvail[day].filter(t => t !== time);
    if (userAvail[day].length === 0) delete userAvail[day];
    const newAvail = {
      ...availabilities,
      [currentUser.nickname]: userAvail
    };
    updateAvailabilities(newAvail, currentUser.nickname);
  };
  const handleSaveWhatsapp = () => {
    updateAvailabilities(availabilities, currentUser.nickname, whatsappInput);
    addToast('success', 'Sucesso', 'O seu contato de WhatsApp foi guardado.');
  };
  const confirmRealizado = appId => {
    updateAppointment(appId, {
      status: 'realizado',
      resolved_at: new Date().toISOString()
    });
    addToast('success', 'Confirmado', 'Avaliação marcada como realizada!');
  };
  const openCancelModal = app => {
    setEvalCancelApp(app);
    setEvalCancelReason('plausivel');
    setCancelModalOpen(true);
  };
  const confirmCancelByEvaluator = async () => {
    if (isSubmitting) return; // Evita duplo clique
    setIsSubmitting(true);
    const newStatus = evalCancelReason === 'plausivel' ? 'cancelado_plausivel' : 'cancelado_implausivel';
    if (evalCancelReason === 'implausivel') {
      try {
        if (MACRO_FALTAS_URL && MACRO_FALTAS_URL !== "COLOQUE_AQUI_O_URL_DO_WEB_APP_DO_GOOGLE_APPS_SCRIPT") {
          await fetch(MACRO_FALTAS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify({
              avaliador: currentUser.nickname,
              aluno: evalCancelApp.aluno,
              appointmentDate: new Date(evalCancelApp.date + 'T12:00:00').toLocaleDateString('pt-PT'),
              appointmentTime: evalCancelApp.time
            })
          });
          addToast('success', 'Registado', 'A ausência do aluno foi lançada na planilha com sucesso.');
        } else {
          console.warn("Atenção: A URL do Webhook de Faltas não foi configurada.");
        }
      } catch (error) {
        console.error("Erro ao enviar dados para a planilha:", error);
        addToast('error', 'Erro', 'Falha ao sincronizar o cancelamento com a planilha.');
      }
    }
    updateAppointment(evalCancelApp.id, {
      status: newStatus,
      resolved_at: new Date().toISOString()
    });
    addToast('info', 'Cancelado', `Avaliação cancelada. Motivo registado: ${evalCancelReason === 'plausivel' ? 'Plausível' : 'Implausível'}.`);
    setIsSubmitting(false);
    setCancelModalOpen(false);
    setEvalCancelApp(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "animate-fade-in space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-brand/20 p-4 sm:p-6 rounded-xl"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold uppercase tracking-widest text-brand mb-4 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(MessageCircle, {
    size: 18
  }), " Meu WhatsApp (Opcional)"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed"
  }, "Deixa o teu contato guardado para facilitar a comunicação com os alunos. Este número ficará visível ", /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-700 dark:text-slate-200"
  }, "apenas"), " para os alunos que agendarem avaliações contigo."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: +55 11 99999-9999",
    value: whatsappInput,
    onChange: e => setWhatsappInput(e.target.value),
    className: "flex-1 h-11 px-4 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand outline-none text-slate-700 dark:text-white transition-colors"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleSaveWhatsapp,
    className: "h-11 px-6 bg-brand hover:bg-brand-hover text-white rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center shadow-sm shrink-0 transition-colors"
  }, "Salvar Número"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-brand/20 p-4 sm:p-6 rounded-xl"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold uppercase tracking-widest text-brand mb-6 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(CalendarDays, {
    size: 18
  }), " Rotina Semanal"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full md:w-1/3 space-y-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block"
  }, "Dia da Semana"), /*#__PURE__*/React.createElement("select", {
    value: selectedDay,
    onChange: e => {
      setSelectedDay(e.target.value);
      setSelectedTimes([]);
    },
    className: "w-full h-12 px-4 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand focus:ring-1 focus:ring-brand outline-none text-slate-700 dark:text-white uppercase appearance-none cursor-pointer"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Selecione um dia..."), DAYS_OF_WEEK.map(day => /*#__PURE__*/React.createElement("option", {
    key: day,
    value: day
  }, day)))), /*#__PURE__*/React.createElement("div", {
    className: "w-full md:w-2/3 space-y-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block"
  }, "Selecione os Horários (BRT)"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, AVAILABLE_TIMES.map(time => {
    const isSelected = selectedTimes.includes(time);
    const isAlreadySaved = myAvailabilities[selectedDay]?.includes(time);
    return /*#__PURE__*/React.createElement("button", {
      key: time,
      onClick: () => handleTimeToggle(time),
      disabled: isAlreadySaved,
      className: `px-3 py-2 sm:px-4 rounded-lg text-xs font-bold transition-all border flex-1 sm:flex-none ${isAlreadySaved ? 'bg-slate-200 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-400 cursor-not-allowed' : isSelected ? 'bg-brand text-white border-brand shadow-md' : 'bg-white dark:bg-[#121813] border-slate-300 dark:border-brand/30 text-slate-600 dark:text-slate-300 hover:border-brand'}`
    }, time);
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-6 border-t border-slate-200 dark:border-brand/20 flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleSave,
    className: "w-full sm:w-auto bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-lg font-condensed font-bold uppercase tracking-widest text-sm transition-colors flex justify-center items-center gap-2 shadow-md"
  }, /*#__PURE__*/React.createElement(CalendarCheck, {
    size: 18
  }), " Salvar Rotina"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-white mb-4 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Clock, {
    size: 18
  }), " Meus Horários (Fixos)"), Object.keys(myAvailabilities).length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-8 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-400"
  }, "Não tens horários registados no momento.") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  }, Object.keys(myAvailabilities).sort((a, b) => DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b)).map(day => {
    const times = myAvailabilities[day];
    if (!times || times.length === 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: day,
      className: "bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 rounded-xl p-4 sm:p-5 relative shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-center mb-4 border-b border-slate-100 dark:border-brand/10 pb-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-2"
    }, /*#__PURE__*/React.createElement(CalendarDays, {
      size: 16,
      className: "text-brand shrink-0"
    }), /*#__PURE__*/React.createElement("span", {
      className: "truncate"
    }, day)), /*#__PURE__*/React.createElement("button", {
      onClick: () => handleDeleteDay(day),
      className: "flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors p-1 shrink-0",
      title: "Apagar todo o dia"
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2"
    }, times.map(time => /*#__PURE__*/React.createElement("span", {
      key: time,
      className: "inline-flex items-center gap-1.5 bg-brand/10 dark:bg-brand/20 text-brand-light font-bold pl-3 pr-1 py-1 rounded-lg text-sm border border-brand/20"
    }, time, /*#__PURE__*/React.createElement("button", {
      onClick: () => handleDeleteTime(day, time),
      className: "hover:text-red-500 bg-white/50 dark:bg-black/20 w-5 h-5 flex items-center justify-center rounded-md transition-colors shrink-0"
    }, /*#__PURE__*/React.createElement(X, {
      size: 12
    }))))));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-8 border-t border-slate-200 dark:border-brand/20"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-white mb-4 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(ListOrdered, {
    size: 18
  }), " Agendamentos (Pendentes)"), myActiveAppointments.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-8 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-400 font-bold uppercase tracking-widest text-xs"
  }, "Nenhum aluno possui agendamentos pendentes consigo.") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  }, myActiveAppointments.map(app => /*#__PURE__*/React.createElement("div", {
    key: app.id,
    className: "bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/20 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-brand/50 transition-colors overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-brand/10 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-slate-50 dark:bg-black/20 rounded-full border border-slate-200 dark:border-brand/30 flex justify-center items-center overflow-hidden shrink-0"
  }, /*#__PURE__*/React.createElement("img", {
    src: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${app.aluno}&direction=3&head_direction=3&gesture=sml&size=m&headonly=1`,
    className: "object-none object-center",
    alt: app.aluno,
    onError: e => e.target.style.display = 'none'
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm font-bold text-slate-800 dark:text-white leading-tight truncate"
  }, app.aluno), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 block truncate"
  }, "Aluno"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between sm:justify-center gap-3 bg-slate-50 dark:bg-[#121813] p-2.5 rounded-lg border border-slate-200 dark:border-white/5 w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 min-w-0"
  }, /*#__PURE__*/React.createElement(CalendarDays, {
    size: 14,
    className: "text-brand shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-slate-700 dark:text-slate-200 truncate"
  }, new Date(app.date + 'T12:00:00').toLocaleDateString('pt-PT'))), /*#__PURE__*/React.createElement("div", {
    className: "w-px h-3 bg-slate-300 dark:bg-white/10 hidden sm:block shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-black text-brand bg-brand/10 px-2 py-0.5 rounded-md border border-brand/20 shrink-0"
  }, app.time)), app.aluno_whatsapp && /*#__PURE__*/React.createElement("a", {
    href: `https://api.whatsapp.com/send/?phone=${app.aluno_whatsapp.replace(/\D/g, '')}&text=Ol%C3%A1+${app.aluno}%21+Sou+o+avaliador+${currentUser.nickname}+do+CFO.&type=phone_number&app_absent=0`,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "mt-3 flex items-center justify-center gap-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border border-[#25D366]/20"
  }, /*#__PURE__*/React.createElement(MessageCircle, {
    size: 14
  }), " WhatsApp do Aluno"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => confirmRealizado(app.id),
    className: "flex-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:bg-green-600 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border border-green-200 dark:border-green-800/30"
  }, "Confirmar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => openCancelModal(app),
    className: "flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border border-red-200 dark:border-red-800/30"
  }, "Cancelar")))))), cancelModalOpen && evalCancelApp && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "relative z-[9999]",
    "aria-labelledby": "modal-title",
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-10 w-screen overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-full items-center justify-center p-4 text-center sm:p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-fade-in flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(AlertTriangle, {
    size: 18,
    className: "text-red-500 shrink-0"
  }), " Justificar Falta"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCancelModalOpen(false),
    className: "flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"
  }, /*#__PURE__*/React.createElement(X, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5"
  }, "Vais cancelar a avaliação do aluno ", /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-800 dark:text-white"
  }, evalCancelApp.aluno), ". Seleciona o motivo:"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: `flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${evalCancelReason === 'plausivel' ? 'bg-brand/10 border-brand/50 dark:bg-brand/20' : 'bg-slate-50 border-slate-200 dark:bg-[#121813] dark:border-white/10 hover:border-brand/30'}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "reason",
    value: "plausivel",
    checked: evalCancelReason === 'plausivel',
    onChange: () => setEvalCancelReason('plausivel'),
    className: "mt-1 mr-3 accent-brand"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "block text-sm font-bold text-slate-800 dark:text-white"
  }, "Plausível"), /*#__PURE__*/React.createElement("span", {
    className: "block text-xs text-slate-500 mt-1"
  }, "Houve o aviso atencipado ou apresentou um motivo plausível."))), /*#__PURE__*/React.createElement("label", {
    className: `flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${evalCancelReason === 'implausivel' ? 'bg-red-50 border-red-500/50 dark:bg-red-900/20' : 'bg-slate-50 border-slate-200 dark:bg-[#121813] dark:border-white/10 hover:border-red-500/30'}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "reason",
    value: "implausivel",
    checked: evalCancelReason === 'implausivel',
    onChange: () => setEvalCancelReason('implausivel'),
    className: "mt-1 mr-3 accent-red-500"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "block text-sm font-bold text-slate-800 dark:text-white"
  }, "Implausível"), /*#__PURE__*/React.createElement("span", {
    className: "block text-xs text-slate-500 mt-1"
  }, "Não compareceu (falta) ou cancelou sem aviso prévio válido. Reprovação imediata."))))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex flex-col sm:flex-row gap-3 sm:justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCancelModalOpen(false),
    disabled: isSubmitting,
    className: `w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-bold uppercase tracking-widest transition-colors rounded-lg border ${isSubmitting ? 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-slate-500 cursor-not-allowed' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-white dark:bg-black/20 border-slate-300 dark:border-white/10'}`
  }, "Voltar"), /*#__PURE__*/React.createElement("button", {
    onClick: confirmCancelByEvaluator,
    disabled: isSubmitting,
    className: `w-full sm:w-auto px-6 py-2.5 sm:py-2 text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md ${isSubmitting ? 'bg-red-400 dark:bg-red-900/50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`
  }, isSubmitting ? /*#__PURE__*/React.createElement("span", {
    className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white/50"
  }) : /*#__PURE__*/React.createElement(Trash2, {
    size: 16,
    className: "shrink-0"
  }), isSubmitting ? 'A aguardar...' : 'Confirmar')))))), document.body));
};
const sendPrivateMessage = async (username, subject, message) => {
  try {
    const composeResp = await fetch('/privmsg?mode=post', {
      credentials: 'same-origin',
      headers: {
        'Cache-Control': 'no-store, no-cache'
      }
    });
    if (!composeResp.ok) return false;
    const html = await composeResp.text();
    const dom = new DOMParser().parseFromString(html, 'text/html');
    const form = dom.querySelector('form[action*="/privmsg"]');
    if (!form) return false;
    const formData = new FormData();
    let hasUsernameArrayField = false;
    form.querySelectorAll('input, textarea, select').forEach(el => {
      const name = el.getAttribute('name');
      if (!name || name === 'message' || name === 'subject') return;
      if (name === 'username[]') hasUsernameArrayField = true;
      if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
      if (el.type === 'submit') return;
      formData.append(name, el.value || '');
    });
    if (hasUsernameArrayField) formData.set('username[]', username);else formData.set('username', username);
    formData.set('subject', subject);
    formData.set('message', message);
    const submitBtn = form.querySelector('input[type="submit"][name="post"]');
    formData.set('post', submitBtn ? submitBtn.value : 'Enviar');
    const action = form.getAttribute('action') || '/privmsg';
    const sendResp = await fetch(action, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });
    if (!sendResp.ok) return false;
    const textLower = (await sendResp.text()).toLowerCase();
    if (textLower.includes('não existe') || textLower.includes('flood')) return false;
    return true;
  } catch (error) {
    return false;
  }
};

// --- PÁGINA: AGENDAMENTO (VISÃO ALUNO) ---
const PaginaAgendamento = ({
  currentUser,
  addToast,
  availabilities,
  appointments,
  addAppointment,
  fullMembersList,
  evaluatorWhatsapps
}) => {
  const [showMyAppointments, setShowMyAppointments] = useState(false);
  const [searchAvaliador, setSearchAvaliador] = useState('');
  const [modalBookingOpen, setModalBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [modalRegrasOpen, setModalRegrasOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalListOpen, setModalListOpen] = useState(false);
  const [selectedAvaliadorInfo, setSelectedAvaliadorInfo] = useState(null);
  const [modalCancelOpen, setModalCancelOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [cancelMotivo, setCancelMotivo] = useState('');
  const [alunoWhatsapp, setAlunoWhatsapp] = useState(() => localStorage.getItem('cfo_aluno_whatsapp') || '');
  const [saveWhatsappLocal, setSaveWhatsappLocal] = useState(true);
  const availableEvaluatorEntries = useMemo(() => {
    return Object.entries(normalizeAvailabilityMap(availabilities)).filter(([, days]) => hasScheduleSlots(days));
  }, [availabilities]);
  const myAppointments = useMemo(() => {
    return appointments.filter(app => app.aluno === currentUser.nickname && (app.status === 'agendado' || !app.status)).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [appointments, currentUser.nickname]);
  const checkPenalty = aluno => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const implausiveis = appointments.filter(app => app.aluno === aluno && app.status === 'cancelado_implausivel' && app.resolved_at && new Date(app.resolved_at) >= thirtyDaysAgo).sort((a, b) => new Date(b.resolved_at) - new Date(a.resolved_at));
    if (implausiveis.length >= 2) {
      const lastImplausivelDate = new Date(implausiveis[0].resolved_at);
      const blockUntil = new Date(lastImplausivelDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      if (now < blockUntil) return {
        blocked: true,
        until: blockUntil
      };
    }
    return {
      blocked: false
    };
  };
  const handleOpenBooking = (avaliador, dayName, targetDate, time) => {
    if (isBlockedForumIdentity(currentUser.nickname)) {
      addToast('error', 'Acesso negado', 'Inicia sessão no fórum com uma conta válida antes de agendar.');
      return;
    }
    const penalty = checkPenalty(currentUser.nickname);
    if (penalty.blocked) {
      addToast('error', 'Bloqueado', `Estás bloqueado de agendar novas avaliações até ${penalty.until.toLocaleDateString('pt-PT')} devido a faltas ou cancelamentos injustificados recentes.`);
      return;
    }
    const targetStart = getStartOfWeek(targetDate);
    const targetEnd = getEndOfWeek(targetDate);
    const appsInWeek = appointments.filter(app => app.aluno === currentUser.nickname && app.date >= targetStart && app.date <= targetEnd && (app.status === 'agendado' || app.status === 'realizado' || !app.status));
    if (appsInWeek.length >= 3) {
      addToast('error', 'Limite Atingido', 'Só podes agendar no máximo 03 avaliações na mesma semana.');
      return;
    }
    setBookingData({
      avaliador,
      dayName,
      date: targetDate,
      time
    });
    setModalBookingOpen(true);
  };
  const confirmBooking = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (isBlockedForumIdentity(currentUser.nickname)) {
      addToast('error', 'Acesso negado', 'Inicia sessão no fórum com uma conta válida antes de confirmar o agendamento.');
      setIsSubmitting(false);
      return;
    }
    if (saveWhatsappLocal && alunoWhatsapp) localStorage.setItem('cfo_aluno_whatsapp', alunoWhatsapp);else if (!saveWhatsappLocal) localStorage.removeItem('cfo_aluno_whatsapp');

    // 1. Buscar o template da MP no GitHub
    try {
      const res = await fetch("https://raw.githubusercontent.com/brendonrcc/CFOmps/refs/heads/main/cfoagen");
      if (res.ok) {
        let template = await res.text();
        const dataFormatada = `${new Date(bookingData.date + 'T12:00:00').toLocaleDateString('pt-PT')} às ${bookingData.time}`;
        const numeroFormatado = alunoWhatsapp || "Não informado";

        // 2. Substituir as variáveis
        template = template.replace(/{NICKNAME}/g, currentUser.nickname);
        template = template.replace(/{DATA\/HORA}/g, dataFormatada);
        template = template.replace(/{NUMERO}/g, numeroFormatado);

        // 3. Enviar a MP automaticamente
        addToast('info', 'A enviar MP...', 'A enviar a mensagem privada ao avaliador. Aguarde...');
        const mpSuccess = await sendPrivateMessage(bookingData.avaliador, "[CFO] Agendamento", template);
        if (mpSuccess) {
          addToast('success', 'MP Enviada!', 'A mensagem privada foi enviada com sucesso ao avaliador.');
        } else {
          // Fallback se o envio automático falhar
          addToast('error', 'Falha na MP', 'Não foi possível enviar a MP automaticamente. O BBCode foi copiado.');
          const textarea = document.createElement('textarea');
          textarea.value = template;
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
          } catch (err) {
            console.error("Erro ao copiar BBCode", err);
          }
          document.body.removeChild(textarea);
          window.open('https://www.policiarcc.com/privmsg?mode=post', '_blank');
        }
      }
    } catch (e) {
      console.error("Erro ao buscar template da MP", e);
      addToast('error', 'Aviso', 'Não foi possível gerar a MP automática. Envia mensagem ao avaliador manualmente.');
    }
    const newAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      avaliador: bookingData.avaliador,
      aluno: currentUser.nickname,
      date: bookingData.date,
      time: bookingData.time,
      timestamp: new Date().toISOString(),
      status: 'agendado',
      aluno_whatsapp: alunoWhatsapp || null
    };
    const saved = await addAppointment(newAppointment);
    if (!saved) {
      setIsSubmitting(false);
      return;
    }
    addToast('success', 'Agendado!', `Avaliação marcada com ${bookingData.avaliador} às ${bookingData.time}.`);
    setIsSubmitting(false);
    setModalBookingOpen(false);
  };
  const handleOpenAvaliadorList = avaliador => {
    setSelectedAvaliadorInfo(avaliador);
    setModalListOpen(true);
  };
  const handleOpenCancel = app => {
    setAppointmentToCancel(app);
    setCancelMotivo('');
    setModalCancelOpen(true);
  };
  const confirmCancel = async () => {
    if (!cancelMotivo || !cancelMotivo.trim()) {
      addToast('error', 'Atenção', 'Por favor, informa um motivo para o cancelamento.');
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("https://raw.githubusercontent.com/brendonrcc/CFOmps/refs/heads/main/cfocanagen");
      if (res.ok) {
        let template = await res.text();
        const dataFormatada = `${new Date(appointmentToCancel.date + 'T12:00:00').toLocaleDateString('pt-PT')} às ${appointmentToCancel.time}`;

        // Substituir as variáveis para o cancelamento
        template = template.replace(/{NICKNAME}/g, currentUser.nickname);
        template = template.replace(/{DATA\/HORA}/g, dataFormatada);
        template = template.replace(/{MOTIVO}/g, cancelMotivo);

        // Enviar a MP automaticamente
        addToast('info', 'A enviar MP...', 'A enviar a justificativa ao avaliador. Aguarde...');
        const mpSuccess = await sendPrivateMessage(appointmentToCancel.avaliador, "[CFO] Cancelamento do Agendamento", template);
        if (mpSuccess) {
          addToast('success', 'MP Enviada!', 'A justificativa de cancelamento foi enviada ao avaliador.');
        } else {
          // Fallback se o envio automático falhar
          addToast('error', 'Falha na MP', 'Não foi possível enviar a MP automaticamente. O BBCode foi copiado.');
          const textarea = document.createElement('textarea');
          textarea.value = template;
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
          } catch (err) {
            console.error("Erro ao copiar BBCode", err);
          }
          document.body.removeChild(textarea);
          window.open('https://www.policiarcc.com/privmsg?mode=post', '_blank');
        }
      } else {
        addToast('error', 'Erro', 'Não foi possível carregar o template da MP.');
      }
    } catch (e) {
      console.error("Erro ao buscar template da MP", e);
      addToast('error', 'Aviso', 'Não foi possível gerar a MP. Tente enviar manualmente.');
    }
    setIsSubmitting(false);
    setModalCancelOpen(false);
    setAppointmentToCancel(null);
    setCancelMotivo('');
  };
  const isBookedByMe = (avaliador, date, time) => {
    return appointments.some(app => app.avaliador === avaliador && app.date === date && app.time === time && app.aluno === currentUser.nickname && (app.status === 'agendado' || !app.status));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "animate-fade-in space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 w-full"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-white flex items-center gap-2 shrink-0"
  }, showMyAppointments ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CalendarCheck, {
    size: 18
  }), " Meus Agendamentos") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Users, {
    size: 18
  }), " Avaliadores Disponíveis")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto"
  }, !showMyAppointments && /*#__PURE__*/React.createElement("div", {
    className: "relative w-full sm:w-64 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
  }, /*#__PURE__*/React.createElement(Search, {
    size: 14
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Procurar avaliador...",
    value: searchAvaliador,
    onChange: e => setSearchAvaliador(e.target.value),
    className: "w-full h-10 sm:h-9 pl-9 pr-4 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm sm:text-xs font-bold focus:border-brand focus:ring-1 focus:ring-brand outline-none text-slate-700 dark:text-white placeholder-slate-400"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowMyAppointments(!showMyAppointments);
      setSearchAvaliador('');
    },
    className: "w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200 px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
  }, showMyAppointments ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Users, {
    size: 14
  }), " Ver Avaliadores") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CalendarCheck, {
    size: 14
  }), " Meus Agendamentos")))), /*#__PURE__*/React.createElement("div", {
    className: "bg-brand/10 dark:bg-brand/20 border border-brand/20 p-4 sm:p-5 rounded-xl flex items-start sm:items-center justify-between gap-4 mb-6 flex-col sm:flex-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement(Info, {
    className: "text-brand shrink-0 mt-0.5",
    size: 20
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm font-bold text-brand uppercase tracking-widest"
  }, "Informações e Regras"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm sm:text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed"
  }, showMyAppointments ? "Aqui estão as tuas avaliações ativas. O cancelamento só é permitido com até 4h de antecedência." : "Agendamentos requerem 24h de antecedência. Máximo de 3 por semana."))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setModalRegrasOpen(true),
    className: "w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-white dark:bg-[#121813] text-brand border border-brand/30 hover:bg-brand hover:text-white px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 14
  }), " Ler Regras")), !supabaseClient && /*#__PURE__*/React.createElement("div", {
    className: "bg-orange-50 dark:bg-orange-900/10 border border-orange-200 p-4 rounded-xl flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(AlertTriangle, {
    className: "text-orange-500 shrink-0",
    size: 20
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-orange-700 dark:text-orange-400 font-bold uppercase tracking-widest"
  }, "Aviso: Supabase não conectado. Configura as chaves no código para salvar dados.")), showMyAppointments ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 animate-fade-in"
  }, myAppointments.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "py-20 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-500 uppercase font-bold tracking-widest"
  }, "Você não possui nenhum agendamento marcado no momento.") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
  }, myAppointments.map(app => {
    const displayRole = fullMembersList?.find(m => m.nickname.toLowerCase() === app.avaliador.toLowerCase())?.role || 'Avaliador';
    const evalWhatsapp = evaluatorWhatsapps[app.avaliador];
    return /*#__PURE__*/React.createElement("div", {
      key: app.id,
      className: "bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-brand/10 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "shrink-0 w-12 h-12 rounded-full overflow-hidden bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-brand/30 flex justify-center items-center"
    }, /*#__PURE__*/React.createElement("img", {
      src: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${app.avaliador}&direction=3&head_direction=3&gesture=sml&size=m&headonly=1`,
      className: "object-none object-center",
      alt: app.avaliador,
      onError: e => e.target.style.display = 'none'
    })), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate"
    }, displayRole), /*#__PURE__*/React.createElement("h4", {
      className: "text-sm font-bold text-slate-800 dark:text-white truncate"
    }, app.avaliador))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between sm:justify-center gap-3 bg-slate-50 dark:bg-[#121813] p-3 rounded-lg border border-slate-200 dark:border-white/5 w-full mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5 min-w-0"
    }, /*#__PURE__*/React.createElement(CalendarDays, {
      size: 14,
      className: "text-brand shrink-0"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold text-slate-700 dark:text-slate-200 truncate"
    }, new Date(app.date + 'T12:00:00').toLocaleDateString('pt-PT'))), /*#__PURE__*/React.createElement("div", {
      className: "w-px h-3 bg-slate-300 dark:bg-white/10 hidden sm:block shrink-0"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-black text-brand bg-brand/10 px-1.5 py-0.5 rounded-md border border-brand/20 shrink-0"
    }, app.time)), evalWhatsapp && /*#__PURE__*/React.createElement("a", {
      href: `https://api.whatsapp.com/send/?phone=${evalWhatsapp.replace(/\D/g, '')}&text=Ol%C3%A1+${app.avaliador}%21+Agendei+uma+avalia%C3%A7%C3%A3o+contigo+no+CFOSync.&type=phone_number&app_absent=0`,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "w-full mb-3 flex items-center justify-center gap-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border border-[#25D366]/20 break-words whitespace-normal leading-tight"
    }, /*#__PURE__*/React.createElement(MessageCircle, {
      size: 14,
      className: "shrink-0"
    }), " Contatar Avaliador"), (() => {
      const canCancel = canCancelAppointment(app.date, app.time);
      return /*#__PURE__*/React.createElement("button", {
        onClick: () => canCancel ? handleOpenCancel(app) : addToast('error', 'Cancelamento Bloqueado', 'Não é possível solicitar cancelamento com menos de 4 horas de antecedência.'),
        disabled: !canCancel,
        className: `w-full flex items-center justify-center gap-2 h-auto py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border break-words whitespace-normal leading-tight mt-auto ${canCancel ? 'bg-white dark:bg-[#121813] text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-900/30' : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10 cursor-not-allowed opacity-70'}`
      }, canCancel ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MessageCircle, {
        size: 14,
        className: "shrink-0"
      }), "Cancelar") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AlertTriangle, {
        size: 14,
        className: "shrink-0"
      }), " Bloqueado (Menos de 4h)"));
    })());
  }))) : availableEvaluatorEntries.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "py-20 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-500 uppercase font-bold tracking-widest animate-fade-in"
  }, "Nenhum avaliador disponibilizou horários ainda.") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in"
  }, availableEvaluatorEntries.filter(([avaliador]) => avaliador.toLowerCase().includes(searchAvaliador.toLowerCase())).map(([avaliador, days]) => {
    const sortedDays = Object.keys(days).sort((a, b) => DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b));
    if (sortedDays.length === 0) return null;
    const displayRole = fullMembersList?.find(m => m.nickname.toLowerCase() === avaliador.toLowerCase())?.role || 'Avaliador';
    return /*#__PURE__*/React.createElement("div", {
      key: avaliador,
      className: "bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3 sm:p-4 border-b border-slate-100 dark:border-brand/10 flex items-center justify-between bg-slate-50/50 dark:bg-black/10 gap-3 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 sm:gap-4 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center rounded-full overflow-hidden bg-white dark:bg-black/40 border border-slate-200 dark:border-brand/20"
    }, /*#__PURE__*/React.createElement("img", {
      src: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${avaliador}&direction=3&head_direction=3&gesture=sml&size=m&headonly=1`,
      className: "object-none object-center",
      alt: avaliador,
      onError: e => e.target.style.display = 'none'
    })), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate"
    }, displayRole), /*#__PURE__*/React.createElement("h3", {
      className: "text-sm sm:text-base font-bold text-slate-800 dark:text-white leading-tight mt-0.5 truncate"
    }, avaliador))), /*#__PURE__*/React.createElement("button", {
      onClick: () => handleOpenAvaliadorList(avaliador),
      className: "flex items-center justify-center p-2 sm:px-3 sm:py-1.5 bg-white dark:bg-[#121813] hover:border-brand hover:text-brand border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0",
      title: "Ver Agendamentos marcados"
    }, /*#__PURE__*/React.createElement(ListOrdered, {
      size: 14,
      className: "shrink-0"
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "hidden lg:inline ml-1.5"
    }, "Histórico"))), /*#__PURE__*/React.createElement("div", {
      className: "p-4 sm:p-5 flex-1 space-y-4 min-w-0"
    }, sortedDays.map(dayName => {
      const times = days[dayName];
      if (!times || times.length === 0) return null;
      const targetDate = getNextDateForDayOfWeek(dayName);
      return /*#__PURE__*/React.createElement("div", {
        key: dayName
      }, /*#__PURE__*/React.createElement("h4", {
        className: "text-[10px] font-bold uppercase tracking-widest text-brand mb-2 flex items-center justify-between border-b border-slate-100 dark:border-brand/10 pb-1"
      }, /*#__PURE__*/React.createElement("span", {
        className: "flex items-center gap-1.5"
      }, /*#__PURE__*/React.createElement(CalendarDays, {
        size: 12,
        className: "shrink-0"
      }), dayName), /*#__PURE__*/React.createElement("span", {
        className: "text-[9px] text-slate-400 font-mono tracking-normal"
      }, new Date(targetDate + 'T12:00:00').toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit'
      }))), /*#__PURE__*/React.createElement("div", {
        className: "flex flex-wrap gap-2"
      }, times.map(time => {
        const expired = isTimeExpired(targetDate, time);
        const isMyBooking = isBookedByMe(avaliador, targetDate, time);
        const isLess24h = !isMyBooking && checkIsLess24h(targetDate, time);
        const isDisabled = expired || isMyBooking || isLess24h;
        let btnClasses = "px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-xs font-bold transition-all border flex flex-row items-center justify-center gap-1.5 min-w-0 ";
        let btnTitle = "Clique para agendar";
        if (expired) {
          btnClasses += "bg-slate-100/50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed line-through";
          btnTitle = "Horário indisponível (Prazo expirado)";
        } else if (isMyBooking) {
          btnClasses += "bg-brand/10 dark:bg-brand/20 border-brand/30 text-brand cursor-not-allowed";
          btnTitle = "Você já agendou este horário";
        } else if (isLess24h) {
          btnClasses += "bg-slate-50 dark:bg-[#151b17] border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60";
          btnTitle = "Indisponível (Agendamentos devem ter 24h de antecedência)";
        } else {
          btnClasses += "bg-white dark:bg-[#121813] border-slate-300 dark:border-brand/30 text-slate-700 dark:text-slate-200 hover:border-brand hover:text-brand shadow-sm hover:shadow cursor-pointer";
        }
        return /*#__PURE__*/React.createElement("button", {
          key: time,
          disabled: isDisabled,
          onClick: () => handleOpenBooking(avaliador, dayName, targetDate, time),
          className: btnClasses,
          title: btnTitle
        }, /*#__PURE__*/React.createElement("span", null, time), isMyBooking && !expired && /*#__PURE__*/React.createElement("span", {
          className: "text-[10px] text-brand opacity-80 shrink-0 flex items-center justify-center"
        }, /*#__PURE__*/React.createElement(Clock, {
          size: 12
        })));
      })));
    })));
  })), modalBookingOpen && bookingData && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "relative z-[9999]",
    "aria-labelledby": "modal-title",
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-10 w-screen overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-full items-center justify-center p-4 text-center sm:p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-fade-in flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white"
  }, "Confirmar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setModalBookingOpen(false),
    className: "flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"
  }, /*#__PURE__*/React.createElement(X, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 bg-slate-50 dark:bg-black/20 p-4 rounded-lg border border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center gap-2"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-500 uppercase text-[10px] tracking-widest shrink-0"
  }, "Avaliador:"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-sm text-slate-800 dark:text-white truncate text-right"
  }, bookingData.avaliador)), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center gap-2"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-500 uppercase text-[10px] tracking-widest shrink-0"
  }, "Dia / Data:"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-end"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-sm text-slate-800 dark:text-white shrink-0"
  }, bookingData.dayName), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-500"
  }, new Date(bookingData.date + 'T12:00:00').toLocaleDateString('pt-PT')))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/10 gap-2"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-500 uppercase text-[10px] tracking-widest shrink-0"
  }, "Hora:"), /*#__PURE__*/React.createElement("span", {
    className: "font-black text-sm text-brand bg-brand/10 px-2 py-0.5 rounded-md border border-brand/20 shrink-0"
  }, bookingData.time, " BRT"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 bg-slate-50 dark:bg-black/20 p-4 rounded-lg border border-slate-100 dark:border-white/5 mt-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(MessageCircle, {
    size: 14,
    className: "text-[#25D366]"
  }), " Seu WhatsApp (Opcional)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: +55 11 99999-9999",
    value: alunoWhatsapp,
    onChange: e => setAlunoWhatsapp(e.target.value),
    className: "w-full h-10 px-3 bg-white dark:bg-[#121813] border border-slate-300 dark:border-white/10 rounded-lg text-sm focus:border-brand outline-none text-slate-700 dark:text-white transition-colors"
  }), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 cursor-pointer mt-2 pt-2 border-t border-slate-200 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: saveWhatsappLocal,
    onChange: e => setSaveWhatsappLocal(e.target.checked),
    className: "accent-brand w-4 h-4 rounded cursor-pointer"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-medium text-slate-600 dark:text-slate-400"
  }, "Salvar o meu número para próximos agendamentos")), /*#__PURE__*/React.createElement("p", {
    className: "text-[9px] text-slate-400 leading-tight"
  }, "* O teu número ficará disponível apenas para este avaliador.")), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-slate-400 mt-4 text-center break-words"
  }, "Será agendado com o(a): ", /*#__PURE__*/React.createElement("strong", {
    className: "text-brand"
  }, currentUser.nickname))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex flex-col sm:flex-row gap-3 sm:justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setModalBookingOpen(false),
    disabled: isSubmitting,
    className: `w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: confirmBooking,
    disabled: isSubmitting,
    className: `w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-brand hover:bg-brand-hover text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`
  }, isSubmitting ? /*#__PURE__*/React.createElement("span", {
    className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white/50"
  }) : /*#__PURE__*/React.createElement(CheckCircle2, {
    size: 16,
    className: "shrink-0"
  }), isSubmitting ? 'A processar...' : 'Confirmar')))))), document.body), modalCancelOpen && appointmentToCancel && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "relative z-[9999]",
    "aria-labelledby": "modal-title",
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-10 w-screen overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-full items-center justify-center p-4 text-center sm:p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-fade-in flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(MessageCircle, {
    size: 18,
    className: "text-blue-500 shrink-0"
  }), "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setModalCancelOpen(false),
    className: "flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"
  }, /*#__PURE__*/React.createElement(X, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 text-center break-words"
  }, "O cancelamento não é automático. Para cancelar a avaliação com ", /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-800 dark:text-white"
  }, appointmentToCancel.avaliador), ", enviaremos uma ", /*#__PURE__*/React.createElement("strong", null, "Mensagem Privada (MP)"), " no fórum justificando a desistência."), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between sm:justify-center gap-3 bg-slate-50 dark:bg-black/20 p-3 rounded-lg border border-slate-200 dark:border-white/5 w-full shrink-0 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(CalendarDays, {
    size: 14,
    className: "text-brand shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-slate-700 dark:text-slate-200"
  }, new Date(appointmentToCancel.date + 'T12:00:00').toLocaleDateString('pt-PT'))), /*#__PURE__*/React.createElement("div", {
    className: "w-px h-3 bg-slate-300 dark:bg-white/10 hidden sm:block"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-black text-brand bg-brand/10 px-2 py-0.5 rounded-md border border-brand/20"
  }, appointmentToCancel.time)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest block"
  }, "Motivo do Cancelamento"), /*#__PURE__*/React.createElement("textarea", {
    value: cancelMotivo,
    onChange: e => setCancelMotivo(e.target.value),
    placeholder: "Explica resumidamente porque precisas cancelar a avaliação...",
    rows: "3",
    className: "w-full p-3 bg-white dark:bg-[#121813] border border-slate-300 dark:border-white/10 rounded-lg text-sm focus:border-brand outline-none text-slate-700 dark:text-white transition-colors resize-none custom-scrollbar"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex flex-col sm:flex-row gap-3 sm:justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setModalCancelOpen(false),
    disabled: isSubmitting,
    className: `w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`
  }, "Voltar"), /*#__PURE__*/React.createElement("button", {
    onClick: confirmCancel,
    disabled: isSubmitting,
    className: `w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`
  }, isSubmitting ? /*#__PURE__*/React.createElement("span", {
    className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white/50"
  }) : /*#__PURE__*/React.createElement(MessageCircle, {
    size: 16,
    className: "shrink-0"
  }), isSubmitting ? 'A enviar...' : 'Enviar Justificativa (MP)')))))), document.body), modalListOpen && selectedAvaliadorInfo && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "relative z-[9999]",
    "aria-labelledby": "modal-title",
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-10 w-screen overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-full items-center justify-center p-4 text-center sm:p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full animate-fade-in flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813] gap-4 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white"
  }, "Agenda do Avaliador"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-brand font-bold uppercase tracking-widest truncate"
  }, selectedAvaliadorInfo)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setModalListOpen(false),
    className: "flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"
  }, /*#__PURE__*/React.createElement(X, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 sm:p-6 max-h-[65vh] overflow-y-auto space-y-3 custom-scrollbar bg-white dark:bg-[#151b17]"
  }, appointments.filter(app => app.avaliador === selectedAvaliadorInfo).length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-center text-slate-500 py-8 text-sm font-bold uppercase tracking-widest"
  }, "Nenhuma avaliação registada.") : appointments.filter(app => app.avaliador === selectedAvaliadorInfo).sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)).map(app => {
    const statusStr = app.status || 'agendado';
    let statusClass = "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    let statusLabel = "Agendado";
    if (statusStr === 'realizado') {
      statusClass = "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      statusLabel = "Realizado";
    } else if (statusStr === 'cancelado_plausivel') {
      statusClass = "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400";
      statusLabel = "Cancelado (Plausível)";
    } else if (statusStr === 'cancelado_implausivel') {
      statusClass = "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      statusLabel = "Cancelado (Falta/Implausível)";
    }
    return /*#__PURE__*/React.createElement("div", {
      key: app.id,
      className: "bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:border-brand/50 hover:shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "shrink-0 w-10 h-10 flex justify-center items-center rounded-full overflow-hidden bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/20 shadow-sm"
    }, /*#__PURE__*/React.createElement("img", {
      src: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${app.aluno}&direction=3&head_direction=3&gesture=sml&size=m&headonly=1`,
      className: "object-none object-center",
      alt: app.aluno,
      onError: e => e.target.style.display = 'none'
    })), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-bold text-slate-800 dark:text-white truncate"
    }, app.aluno), /*#__PURE__*/React.createElement("span", {
      className: `inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${statusClass}`
    }, statusLabel))), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-row items-center justify-between sm:justify-end gap-3 bg-white dark:bg-[#121813] sm:bg-transparent p-3 rounded-lg border border-slate-100 dark:border-white/5 sm:border-none w-full sm:w-auto mt-2 sm:mt-0 transition-colors"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(CalendarDays, {
      size: 14,
      className: "text-brand shrink-0"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-xs sm:text-[11px] font-bold text-slate-700 dark:text-slate-200"
    }, new Date(app.date + 'T12:00:00').toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit'
    }))), /*#__PURE__*/React.createElement("div", {
      className: "w-px h-3 bg-slate-300 dark:bg-white/10 hidden sm:block shrink-0"
    }), /*#__PURE__*/React.createElement("span", {
      className: "inline-block text-xs sm:text-[11px] font-black text-brand bg-brand/10 px-2 py-1 sm:px-1.5 sm:py-0.5 rounded-md border border-brand/20 shrink-0"
    }, app.time)));
  })))))), document.body), modalRegrasOpen && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "relative z-[9999]",
    "aria-labelledby": "modal-title",
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-10 w-screen overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-full items-center justify-center p-4 text-center sm:p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl w-full animate-fade-in flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 18,
    className: "text-brand"
  }), " Regras do Sistema"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setModalRegrasOpen(false),
    className: "flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"
  }, /*#__PURE__*/React.createElement(X, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6 text-sm text-slate-700 dark:text-slate-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-brand uppercase tracking-widest text-xs flex items-center gap-2 border-b border-slate-100 dark:border-brand/20 pb-2"
  }, /*#__PURE__*/React.createElement(GraduationCap, {
    size: 16
  }), " Para Alunos"), /*#__PURE__*/React.createElement("ul", {
    className: "list-disc pl-5 space-y-2"
  }, /*#__PURE__*/React.createElement("li", null, "Só poderá ser agendado no máximo ", /*#__PURE__*/React.createElement("strong", null, "03 avaliações na semana"), "."), /*#__PURE__*/React.createElement("li", null, "Os agendamentos devem acontecer com ", /*#__PURE__*/React.createElement("strong", null, "24h de antecedência"), " à data/hora marcada."), /*#__PURE__*/React.createElement("li", null, "Os alunos serão bloqueados de solicitar cancelamento com ", /*#__PURE__*/React.createElement("strong", null, "04 horas antes"), " da aplicação da av. agendada."), /*#__PURE__*/React.createElement("li", null, "Atrasos serão tolerados até ", /*#__PURE__*/React.createElement("strong", null, "10 minutos"), ". Passado disso, o aluno será reprovado, recebendo a nota 0."), /*#__PURE__*/React.createElement("li", null, "Em casos de imprevistos, deve ser notificado ao Avaliador, via MP ou formulário, a indisponibilidade."), /*#__PURE__*/React.createElement("li", null, "Em casos de ", /*#__PURE__*/React.createElement("strong", null, "02 não comparecimentos injustificáveis"), " no período de 30 dias, o aluno ficará impossibilitado de agendar novas avaliações pelo período de 07 dias."))), currentUser && currentUser.role !== 'Convidado' && currentUser.role !== '' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-brand uppercase tracking-widest text-xs flex items-center gap-2 border-b border-slate-100 dark:border-brand/20 pb-2"
  }, /*#__PURE__*/React.createElement(CalendarCheck, {
    size: 16
  }), " Para Avaliadores"), /*#__PURE__*/React.createElement("ul", {
    className: "list-disc pl-5 space-y-2"
  }, /*#__PURE__*/React.createElement("li", null, "A cada X avaliações agendadas aplicadas gera ", /*#__PURE__*/React.createElement("strong", null, "01 ponto"), " no ranking interno."), /*#__PURE__*/React.createElement("li", null, "O avaliador deverá avisar com, no máximo, ", /*#__PURE__*/React.createElement("strong", null, "15 minutos de antecedência"), " caso não consiga comparecer. O aviso deverá ser realizado para um Estagiário+ garantindo a ciência."), /*#__PURE__*/React.createElement("li", null, "O não comparecimento sem justificativas resultará numa advertência interna por Abandono de Dever/Negligência.")))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setModalRegrasOpen(false),
    className: "w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-brand hover:bg-brand-hover text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
  }, "Entendido")))))), document.body));
};

// --- PÁGINA 3: MEMBROS ---
const PaginaMembros = ({
  membersList,
  availabilities,
  onBookClick
}) => {
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
  useEffect(() => {
    let isMounted = true;
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const checkStatuses = async () => {
      const chunkSize = 3;
      for (let i = 0; i < membersList.length; i += chunkSize) {
        if (!isMounted) break;
        const chunk = membersList.slice(i, i + chunkSize);
        await Promise.all(chunk.map(async m => {
          try {
            const response = await fetch(`https://www.habbo.com.br/api/public/users?name=${m.nickname}`);
            if (response.ok) {
              const data = await response.json();
              setOnlineStatuses(prev => ({
                ...prev,
                [m.nickname]: data.online === true
              }));
            } else setOnlineStatuses(prev => ({
              ...prev,
              [m.nickname]: false
            }));
          } catch {
            setOnlineStatuses(prev => ({
              ...prev,
              [m.nickname]: false
            }));
          }
        }));
        if (i + chunkSize < membersList.length) await delay(1000);
      }
    };
    if (membersList.length > 0) checkStatuses();
    return () => {
      isMounted = false;
    };
  }, [membersList]);
  const hasAvailabilities = nickname => {
    return hasScheduleSlots(availabilities[nickname]);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "animate-fade-in space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col lg:flex-row lg:items-center justify-end gap-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center gap-3 w-full lg:w-auto"
  }, /*#__PURE__*/React.createElement("label", {
    className: "flex items-center justify-center sm:justify-start gap-2 cursor-pointer text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-brand transition-colors bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 px-4 py-2.5 sm:py-0 rounded-lg sm:h-10 w-full sm:w-auto shadow-sm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: onlineOnly,
    onChange: e => setOnlineOnly(e.target.checked),
    className: "w-4 h-4 accent-brand"
  }), " Online"), /*#__PURE__*/React.createElement("div", {
    className: "relative w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
  }, /*#__PURE__*/React.createElement(Filter, {
    size: 14
  })), /*#__PURE__*/React.createElement("select", {
    value: roleFilter,
    onChange: e => setRoleFilter(e.target.value),
    className: "w-full sm:w-auto h-10 pl-9 pr-8 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-xs font-bold focus:border-brand outline-none text-slate-700 dark:text-white uppercase tracking-widest cursor-pointer appearance-none shadow-sm"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Todos"
  }, "Todos os Cargos"), /*#__PURE__*/React.createElement("option", {
    value: "Professor"
  }, "Professor"), /*#__PURE__*/React.createElement("option", {
    value: "Avaliador"
  }, "Avaliador"))), /*#__PURE__*/React.createElement("div", {
    className: "relative w-full sm:w-auto lg:w-64 col-span-1 sm:col-span-2 lg:col-span-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
  }, /*#__PURE__*/React.createElement(Search, {
    size: 14
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Pesquisar por nickname...",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value),
    className: "w-full h-10 pl-9 pr-4 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm sm:text-xs font-bold focus:border-brand outline-none text-slate-700 dark:text-white placeholder-slate-400 shadow-sm"
  })), /*#__PURE__*/React.createElement("span", {
    className: "col-span-1 sm:col-span-2 lg:col-span-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/10 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-brand/20 shrink-0 w-full sm:w-auto text-center h-10 flex items-center justify-center"
  }, "Total: ", filteredMembers.length))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  }, filteredMembers.map((member, idx) => {
    const isOnline = onlineStatuses[member.nickname];
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-brand/50 transition-all group overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative shrink-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-12 h-12 bg-slate-50 dark:bg-black/40 rounded-full border border-slate-200 dark:border-brand/40 overflow-hidden flex justify-center items-center"
    }, /*#__PURE__*/React.createElement("img", {
      src: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${member.nickname}&direction=2&head_direction=3&gesture=sml&size=m&headonly=1`,
      className: "object-none object-center",
      alt: member.nickname,
      onError: e => e.target.style.display = 'none'
    })), /*#__PURE__*/React.createElement("div", {
      className: `absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#151b17] ${isOnline === true ? 'bg-green-500' : isOnline === false ? 'bg-slate-300 dark:bg-slate-600' : 'bg-transparent border-transparent'}`,
      title: isOnline ? 'Online' : 'Offline'
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "text-sm font-bold text-slate-800 dark:text-white leading-tight truncate w-full"
    }, member.nickname), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-medium tracking-wider text-brand mt-0.5 truncate"
    }, member.role))), hasAvailabilities(member.nickname) && /*#__PURE__*/React.createElement("button", {
      onClick: onBookClick,
      className: "ml-3 shrink-0 w-9 h-9 flex items-center justify-center bg-brand/10 hover:bg-brand text-brand hover:text-white rounded-lg transition-colors",
      title: "Agendar Avaliação"
    }, /*#__PURE__*/React.createElement(CalendarCheck, {
      size: 16,
      className: "shrink-0"
    })));
  }), filteredMembers.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-500 uppercase font-bold tracking-widest"
  }, "Nenhum membro encontrado.")));
};

// --- PÁGINA 4: FORMADOS ---
const PaginaFormados = ({
  formadosList
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredFormados = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return formadosList.filter(f => f.currentNickname.toLowerCase().includes(term) || f.oldNickname && f.oldNickname.toLowerCase().includes(term));
  }, [formadosList, searchTerm]);
  return /*#__PURE__*/React.createElement("div", {
    className: "animate-fade-in space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto ml-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-full sm:w-72"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
  }, /*#__PURE__*/React.createElement(Search, {
    size: 14
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Pesquisar por nickname...",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value),
    className: "w-full h-10 sm:h-9 pl-9 pr-4 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm sm:text-xs font-bold focus:border-brand outline-none text-slate-700 dark:text-white placeholder-slate-400 shadow-sm"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/10 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-brand/20 shrink-0 w-full sm:w-auto text-center h-10 sm:h-9 flex items-center justify-center"
  }, "Total: ", filteredFormados.length))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
  }, filteredFormados.map((formado, idx) => {
    const statusStr = formado.status ? formado.status.toLowerCase() : '';
    const isAtivo = statusStr.includes('ativo');
    const isValido = statusStr.includes('válido') || statusStr.includes('valido');
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/20 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:border-brand/40 transition-all text-center relative overflow-hidden min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-14 h-14 bg-slate-50 dark:bg-black/40 rounded-full border-2 border-slate-200 dark:border-brand/30 overflow-hidden mb-3 shrink-0 flex justify-center items-center"
    }, /*#__PURE__*/React.createElement("img", {
      src: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${formado.currentNickname}&direction=2&head_direction=3&gesture=sml&size=m&headonly=1`,
      className: "object-none object-center w-full h-full",
      alt: formado.currentNickname,
      onError: e => e.target.style.display = 'none'
    })), /*#__PURE__*/React.createElement("h4", {
      className: "text-sm font-bold text-slate-800 dark:text-white leading-none truncate w-full px-2"
    }, formado.currentNickname), formado.oldNickname && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-slate-500 mt-1 truncate w-full px-2"
    }, "Antigo: ", formado.oldNickname), formado.dateObtained && formado.dateObtained.toLowerCase() !== 'n/a' && /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-mono text-slate-500 dark:text-slate-400 mt-2 block truncate w-full px-2"
    }, formado.dateObtained), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 w-full"
    }, isAtivo && /*#__PURE__*/React.createElement("div", {
      className: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50 text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-lg w-full truncate"
    }, "Ativo"), isValido && /*#__PURE__*/React.createElement("div", {
      className: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-lg w-full truncate"
    }, "Válido"), !isAtivo && !isValido && formado.status && /*#__PURE__*/React.createElement("div", {
      className: "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-lg w-full truncate"
    }, formado.status)));
  }), filteredFormados.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-500 uppercase font-bold tracking-widest"
  }, "Nenhum formado encontrado.")));
};

// --- PÁGINA 5: HISTÓRICO GERAL ---
const PaginaControles = ({
  availabilities,
  appointments,
  reports,
  addToast,
  onClearExpired,
  onClearRoutines,
  onClearReports,
  currentUser,
  onUpdateAppointment,
  onDeleteAppointment,
  onUpdateReport,
  onDeleteReport,
  onUpdateAvailability,
  onDeleteAvailability
}) => {
  const [viewMode, setViewMode] = useState('agendamentos'); // 'agendamentos' | 'reports' | 'rotinas'
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const itemsPerPage = 8;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editType, setEditType] = useState('');
  const [editData, setEditData] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState('');
  const [deleteData, setDeleteData] = useState({});
  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (viewMode === 'agendamentos') {
      return [...appointments].filter(app => app.aluno.toLowerCase().includes(term) || app.avaliador.toLowerCase().includes(term)).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (viewMode === 'reports') {
      return [...reports].filter(r => r.nickname.toLowerCase().includes(term) || r.subject.toLowerCase().includes(term)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      return Object.entries(normalizeAvailabilityMap(availabilities)).map(([avaliador, schedule]) => ({
        id: avaliador,
        avaliador,
        schedule
      })).filter(r => r.avaliador.toLowerCase().includes(term));
    }
  }, [appointments, reports, availabilities, searchTerm, viewMode]);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, viewMode]);
  const normalizedRole = currentUser.role ? currentUser.role.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : '';
  const canManageHistory = ['estagiario', 'conselheiro', 'vice-lider', 'lider'].includes(normalizedRole);
  const handleSaveEdit = () => {
    if (editType === 'appointment') {
      onUpdateAppointment(editData.id, {
        aluno: editData.aluno,
        avaliador: editData.avaliador,
        date: editData.date,
        time: editData.time,
        status: editData.status
      });
      addToast('success', 'Atualizado', 'Agendamento atualizado com sucesso.');
    } else if (editType === 'report') {
      onUpdateReport(editData.id, {
        nickname: editData.nickname,
        subject: editData.subject,
        message: editData.message
      });
      addToast('success', 'Atualizado', 'Reporte atualizado com sucesso.');
    } else if (editType === 'routine') {
      const newAvail = {
        ...availabilities,
        [editData.avaliador]: editData.schedule
      };
      onUpdateAvailability(newAvail, editData.avaliador);
      addToast('success', 'Atualizado', 'Rotina atualizada com sucesso.');
    }
    setEditModalOpen(false);
  };
  const handleConfirmDelete = () => {
    if (deleteType === 'appointment') {
      onDeleteAppointment(deleteData.id);
      addToast('success', 'Removido', 'Agendamento apagado com sucesso.');
    } else if (deleteType === 'report') {
      onDeleteReport(deleteData.id);
      addToast('success', 'Removido', 'Reporte apagado com sucesso.');
    } else if (deleteType === 'routine') {
      onDeleteAvailability(deleteData.avaliador);
      addToast('success', 'Removido', 'Rotina do avaliador apagada com sucesso.');
    }
    setDeleteModalOpen(false);
  };
  const generatePDF = async () => {
    if (!window.jspdf || !window.jspdf.jsPDF) return addToast('error', 'Erro', 'Biblioteca PDF não carregada. Atualiza a página.');
    addToast('info', 'A processar...', 'A transferir ficheiros para gerar o PDF. Aguarda...');
    try {
      const doc = new window.jspdf.jsPDF();
      const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf';
      const fontResponse = await fetch(fontUrl);
      const fontBuffer = await fontResponse.arrayBuffer();
      let fontBinary = '';
      const fontBytes = new Uint8Array(fontBuffer);
      for (let i = 0; i < fontBytes.byteLength; i++) fontBinary += String.fromCharCode(fontBytes[i]);
      const fontBase64 = window.btoa(fontBinary);
      doc.addFileToVFS('Poppins-Regular.ttf', fontBase64);
      doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');
      const fontBoldUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf';
      const fontBoldResponse = await fetch(fontBoldUrl);
      const fontBoldBuffer = await fontBoldResponse.arrayBuffer();
      let fontBoldBinary = '';
      const fontBoldBytes = new Uint8Array(fontBoldBuffer);
      for (let i = 0; i < fontBoldBytes.byteLength; i++) fontBoldBinary += String.fromCharCode(fontBoldBytes[i]);
      const fontBoldBase64 = window.btoa(fontBoldBinary);
      doc.addFileToVFS('Poppins-Bold.ttf', fontBoldBase64);
      doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold');
      const renderPDFContent = offsetY => {
        doc.setFont("Poppins", "bold");
        doc.setFontSize(16);
        doc.text("Centro de Formação de Oficiais", 105, offsetY, {
          align: "center"
        });
        if (viewMode === 'agendamentos') {
          doc.setFontSize(12);
          doc.setFont("Poppins", "normal");
          doc.text("Agendamentos Globais", 105, offsetY + 8, {
            align: "center"
          });
          const tableColumn = ["Aluno", "Avaliador", "Data da Avaliação", "Status", "Agendado em"];
          const tableRows = [];
          const sortedToPrint = [...appointments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          sortedToPrint.forEach(app => {
            let statusText = 'Agendado';
            if (app.status === 'realizado') statusText = 'Realizado';else if (app.status === 'cancelado_plausivel') statusText = 'Cancelado (P)';else if (app.status === 'cancelado_implausivel') statusText = 'Cancelado (Falta)';
            tableRows.push([app.aluno, app.avaliador, `${new Date(app.date + 'T12:00:00').toLocaleDateString('pt-PT')} ${app.time}`, statusText, new Date(app.timestamp).toLocaleString('pt-PT')]);
          });
          doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: offsetY + 15,
            styles: {
              font: "Poppins",
              fontSize: 9
            },
            headStyles: {
              fillColor: [46, 92, 24],
              font: "Poppins",
              fontStyle: "bold"
            }
          });
          doc.save("CFO_Agendamentos.pdf");
        } else if (viewMode === 'reports') {
          doc.setFontSize(12);
          doc.setFont("Poppins", "normal");
          doc.text("Relatórios e Feedbacks", 105, offsetY + 8, {
            align: "center"
          });
          const tableColumn = ["Nickname", "Assunto", "Mensagem", "Data do Reporte"];
          const tableRows = [];
          const sortedToPrint = [...reports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          sortedToPrint.forEach(r => tableRows.push([r.nickname, r.subject, r.message, new Date(r.created_at).toLocaleString('pt-PT')]));
          doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: offsetY + 15,
            styles: {
              font: "Poppins",
              fontSize: 9
            },
            headStyles: {
              fillColor: [46, 92, 24],
              font: "Poppins",
              fontStyle: "bold"
            },
            columnStyles: {
              2: {
                cellWidth: 80
              }
            }
          });
          doc.save("CFO_Reports.pdf");
        } else {
          doc.setFontSize(12);
          doc.setFont("Poppins", "normal");
          doc.text("Rotinas dos Avaliadores", 105, offsetY + 8, {
            align: "center"
          });
          const tableColumn = ["Avaliador", "Rotina Semanal"];
          const tableRows = [];
          const sortedToPrint = Object.entries(normalizeAvailabilityMap(availabilities)).sort((a, b) => a[0].localeCompare(b[0]));
          sortedToPrint.forEach(([avaliador, schedule]) => {
            const schedString = Object.entries(schedule).map(([day, times]) => `${day}: ${times.join(', ')}`).join('\n');
            tableRows.push([avaliador, schedString]);
          });
          doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: offsetY + 15,
            styles: {
              font: "Poppins",
              fontSize: 9
            },
            headStyles: {
              fillColor: [46, 92, 24],
              font: "Poppins",
              fontStyle: "bold"
            }
          });
          doc.save("CFO_Rotinas.pdf");
        }
        addToast('success', 'Sucesso', 'PDF transferido com sucesso.');
      };
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = LOGO_URL;
      img.onload = () => {
        doc.addImage(img, 'PNG', 105 - 15, 10, 30, 30);
        renderPDFContent(48);
      };
      img.onerror = () => renderPDFContent(20);
    } catch (err) {
      addToast('error', 'Erro', 'Falha ao processar as fontes para o PDF.');
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "animate-fade-in space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-3 w-full lg:w-auto flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex bg-slate-100 dark:bg-[#121813] p-1 rounded-lg border border-slate-200 dark:border-brand/20 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setViewMode('agendamentos'),
    className: `flex-1 sm:flex-none px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-md transition-all ${viewMode === 'agendamentos' ? 'bg-white dark:bg-black/40 text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`
  }, "Agendamentos"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setViewMode('reports'),
    className: `flex-1 sm:flex-none px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-md transition-all ${viewMode === 'reports' ? 'bg-white dark:bg-black/40 text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`
  }, "Reports"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setViewMode('rotinas'),
    className: `flex-1 sm:flex-none px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-md transition-all ${viewMode === 'rotinas' ? 'bg-white dark:bg-black/40 text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`
  }, "Rotinas")), canManageHistory && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: generatePDF,
    className: "flex-1 sm:flex-none flex justify-center items-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm shrink-0"
  }, /*#__PURE__*/React.createElement(Download, {
    size: 14,
    className: "shrink-0"
  }), " PDF"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-full sm:w-64"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
  }, /*#__PURE__*/React.createElement(Search, {
    size: 14
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: viewMode === 'agendamentos' ? "Procurar aluno ou avaliador..." : viewMode === 'reports' ? "Procurar nickname ou assunto..." : "Procurar avaliador...",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value),
    className: "w-full h-10 sm:h-9 pl-9 pr-4 bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm sm:text-xs font-bold focus:border-brand focus:ring-1 focus:ring-brand outline-none text-slate-700 dark:text-white placeholder-slate-400 shadow-sm"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/10 px-4 py-2.5 sm:py-2 rounded-lg border border-slate-200 dark:border-brand/20 w-full sm:w-auto text-center shrink-0"
  }, "Total: ", filteredItems.length))), filteredItems.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "py-20 text-center border-2 border-dashed border-slate-200 dark:border-brand/20 rounded-xl text-slate-500 uppercase font-bold tracking-widest"
  }, "Nenhum registo encontrado.") : /*#__PURE__*/React.createElement(React.Fragment, null, viewMode === 'agendamentos' ? /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-5"
  }, currentItems.map(app => {
    const statusStr = app.status || 'agendado';
    let statusClass = "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400";
    let statusLabel = "Agendado";
    let StatusIconComp = Clock;
    if (statusStr === 'realizado') {
      statusClass = "bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400";
      statusLabel = "Realizado";
      StatusIconComp = CheckCircle2;
    } else if (statusStr === 'cancelado_plausivel') {
      statusClass = "bg-slate-50 border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-slate-400";
      statusLabel = "Cancelado (Plausível)";
      StatusIconComp = Info;
    } else if (statusStr === 'cancelado_implausivel') {
      statusClass = "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400";
      statusLabel = "Falta/Implausível";
      StatusIconComp = AlertTriangle;
    }
    return /*#__PURE__*/React.createElement("div", {
      key: app.id,
      className: "bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 rounded-xl flex flex-col shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-4 sm:p-5 flex items-center gap-4 border-b border-slate-100 dark:border-brand/10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative shrink-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-12 h-12 rounded-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-brand/30 flex items-center justify-center overflow-hidden"
    }, /*#__PURE__*/React.createElement("img", {
      src: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${app.aluno}&direction=3&head_direction=3&gesture=sml&size=m&headonly=1`,
      className: "object-none object-center",
      alt: app.aluno,
      onError: e => e.target.style.display = 'none'
    }))), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "text-base font-bold text-slate-800 dark:text-white truncate"
    }, app.aluno), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 truncate"
    }, /*#__PURE__*/React.createElement("span", null, "com"), " ", /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-brand"
    }, app.avaliador))), /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${statusClass}`
    }, /*#__PURE__*/React.createElement(StatusIconComp, {
      size: 12,
      className: "shrink-0"
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "hidden sm:inline"
    }, statusLabel))), /*#__PURE__*/React.createElement("div", {
      className: "px-4 sm:px-5 py-4 bg-slate-50/50 dark:bg-transparent flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 bg-white dark:bg-[#121813] border border-slate-200 dark:border-white/5 px-3 py-2 rounded-lg shadow-sm"
    }, /*#__PURE__*/React.createElement(CalendarDays, {
      size: 16,
      className: "text-brand shrink-0"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-bold text-slate-700 dark:text-slate-200"
    }, new Date(app.date + 'T12:00:00').toLocaleDateString('pt-PT'))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 bg-white dark:bg-[#121813] border border-slate-200 dark:border-white/5 px-3 py-2 rounded-lg shadow-sm"
    }, /*#__PURE__*/React.createElement(Clock, {
      size: 16,
      className: "text-brand shrink-0"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-black text-brand"
    }, app.time)))), /*#__PURE__*/React.createElement("div", {
      className: "px-4 sm:px-5 py-3 bg-slate-50 dark:bg-[#121813] border-t border-slate-100 dark:border-white/5 flex justify-between items-center gap-3 mt-auto"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-slate-400 font-mono flex items-center gap-1.5"
    }, "Criado a ", new Date(app.timestamp).toLocaleString('pt-PT')), canManageHistory && /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setEditType('appointment');
        setEditData(app);
        setEditModalOpen(true);
      },
      className: "p-1.5 text-slate-400 hover:text-blue-500 bg-white dark:bg-black/20 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md border border-slate-200 dark:border-white/10 transition-colors",
      title: "Editar"
    }, /*#__PURE__*/React.createElement(Pencil, {
      size: 14
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setDeleteType('appointment');
        setDeleteData(app);
        setDeleteModalOpen(true);
      },
      className: "p-1.5 text-slate-400 hover:text-red-500 bg-white dark:bg-black/20 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md border border-slate-200 dark:border-white/10 transition-colors",
      title: "Apagar"
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 14
    })))));
  })) : viewMode === 'reports' ? /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-5"
  }, currentItems.map(report => /*#__PURE__*/React.createElement("div", {
    key: report.id,
    className: "bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 sm:p-5 border-b border-slate-100 dark:border-brand/10 flex justify-between items-start gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "shrink-0 w-12 h-12 bg-slate-50 dark:bg-black/20 rounded-full border border-slate-200 dark:border-brand/20 flex items-center justify-center overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${report.nickname}&direction=2&head_direction=3&gesture=sml&size=m&headonly=1`,
    className: "object-none object-center",
    alt: report.nickname,
    onError: e => e.target.style.display = 'none'
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-base font-bold text-slate-800 dark:text-white truncate"
  }, report.nickname), /*#__PURE__*/React.createElement("span", {
    className: "inline-block mt-1 px-2 py-0.5 rounded-md border border-brand/20 bg-brand/10 text-[9px] font-bold text-brand uppercase tracking-widest truncate max-w-full"
  }, report.subject)))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 sm:p-5 flex-1 bg-slate-50/50 dark:bg-transparent"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words"
  }, report.message)), /*#__PURE__*/React.createElement("div", {
    className: "px-4 sm:px-5 py-3 bg-slate-50 dark:bg-[#121813] border-t border-slate-100 dark:border-white/5 flex justify-between items-center gap-3 mt-auto"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-400 font-mono flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Clock, {
    size: 12,
    className: "shrink-0 text-slate-300 dark:text-slate-500"
  }), " ", new Date(report.created_at).toLocaleString('pt-PT')), canManageHistory && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEditType('report');
      setEditData(report);
      setEditModalOpen(true);
    },
    className: "p-1.5 text-slate-400 hover:text-blue-500 bg-white dark:bg-black/20 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md border border-slate-200 dark:border-white/10 transition-colors",
    title: "Editar"
  }, /*#__PURE__*/React.createElement(Pencil, {
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDeleteType('report');
      setDeleteData(report);
      setDeleteModalOpen(true);
    },
    className: "p-1.5 text-slate-400 hover:text-red-500 bg-white dark:bg-black/20 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md border border-slate-200 dark:border-white/10 transition-colors",
    title: "Apagar"
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 14
  }))))))) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-5"
  }, currentItems.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    className: "bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 sm:p-5 border-b border-slate-100 dark:border-brand/10 flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "shrink-0 w-10 h-10 bg-slate-50 dark:bg-black/20 rounded-full border border-slate-200 dark:border-brand/20 flex items-center justify-center overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${item.avaliador}&direction=2&head_direction=3&gesture=sml&size=m&headonly=1`,
    className: "object-none object-center",
    alt: item.avaliador,
    onError: e => e.target.style.display = 'none'
  })), /*#__PURE__*/React.createElement("h4", {
    className: "text-base font-bold text-slate-800 dark:text-white truncate"
  }, item.avaliador))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 sm:p-5 flex-1 bg-slate-50/50 dark:bg-transparent"
  }, Object.keys(item.schedule || {}).length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 italic"
  }, "Nenhuma rotina gravada.") : Object.entries(item.schedule).map(([day, times]) => /*#__PURE__*/React.createElement("div", {
    key: day,
    className: "mb-3 last:mb-0"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-[10px] font-bold text-brand uppercase tracking-widest block mb-1"
  }, day), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5"
  }, times.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "bg-white dark:bg-[#121813] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm"
  }, t)))))), canManageHistory && /*#__PURE__*/React.createElement("div", {
    className: "px-4 sm:px-5 py-3 bg-slate-50 dark:bg-[#121813] border-t border-slate-100 dark:border-white/5 flex justify-end items-center gap-2 mt-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEditType('routine');
      setEditData(item);
      setEditModalOpen(true);
    },
    className: "p-1.5 text-slate-400 hover:text-blue-500 bg-white dark:bg-black/20 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md border border-slate-200 dark:border-white/10 transition-colors",
    title: "Editar Rotina"
  }, /*#__PURE__*/React.createElement(Pencil, {
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDeleteType('routine');
      setDeleteData(item);
      setDeleteModalOpen(true);
    },
    className: "p-1.5 text-slate-400 hover:text-red-500 bg-white dark:bg-black/20 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md border border-slate-200 dark:border-white/10 transition-colors",
    title: "Apagar Rotina Inteira"
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 14
  })))))), totalPages > 0 && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-brand/20"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-widest text-slate-500"
  }, "Página ", /*#__PURE__*/React.createElement("span", {
    className: "text-brand"
  }, currentPage), " de ", totalPages), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCurrentPage(p => Math.max(1, p - 1)),
    disabled: currentPage === 1,
    className: "flex-1 sm:flex-none flex justify-center p-2.5 sm:p-2 rounded-lg bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 text-slate-600 dark:text-slate-300 hover:text-brand disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCurrentPage(p => Math.min(totalPages, p + 1)),
    disabled: currentPage === totalPages,
    className: "flex-1 sm:flex-none flex justify-center p-2.5 sm:p-2 rounded-lg bg-white dark:bg-[#121813] border border-slate-300 dark:border-brand/30 text-slate-600 dark:text-slate-300 hover:text-brand disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
  }, /*#__PURE__*/React.createElement(ChevronRight, {
    size: 16
  }))))), editModalOpen && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "relative z-[9999]",
    "aria-labelledby": "modal-title",
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-10 w-screen overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-full items-center justify-center p-4 text-center sm:p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-fade-in flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Pencil, {
    size: 18,
    className: "text-brand"
  }), " ", editType === 'routine' ? 'Editar Rotina' : 'Editar Registo'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditModalOpen(false),
    className: "flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"
  }, /*#__PURE__*/React.createElement(X, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 space-y-4"
  }, editType === 'appointment' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest block"
  }, "Aluno"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editData.aluno || '',
    onChange: e => setEditData({
      ...editData,
      aluno: e.target.value
    }),
    className: "w-full h-10 px-3 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand outline-none text-slate-700 dark:text-white transition-colors"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest block"
  }, "Avaliador"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editData.avaliador || '',
    onChange: e => setEditData({
      ...editData,
      avaliador: e.target.value
    }),
    className: "w-full h-10 px-3 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand outline-none text-slate-700 dark:text-white transition-colors"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest block"
  }, "Data"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: editData.date || '',
    onChange: e => setEditData({
      ...editData,
      date: e.target.value
    }),
    className: "w-full h-10 px-3 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand outline-none text-slate-700 dark:text-white transition-colors appearance-none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "w-1/3 space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest block"
  }, "Hora"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: editData.time || '',
    onChange: e => setEditData({
      ...editData,
      time: e.target.value
    }),
    className: "w-full h-10 px-3 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand outline-none text-slate-700 dark:text-white transition-colors appearance-none"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest block"
  }, "Status"), /*#__PURE__*/React.createElement("select", {
    value: editData.status || 'agendado',
    onChange: e => setEditData({
      ...editData,
      status: e.target.value
    }),
    className: "w-full h-10 px-3 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand outline-none text-slate-700 dark:text-white transition-colors cursor-pointer"
  }, /*#__PURE__*/React.createElement("option", {
    value: "agendado"
  }, "Agendado (Pendente)"), /*#__PURE__*/React.createElement("option", {
    value: "realizado"
  }, "Realizado"), /*#__PURE__*/React.createElement("option", {
    value: "cancelado_plausivel"
  }, "Cancelado (Plausível)"), /*#__PURE__*/React.createElement("option", {
    value: "cancelado_implausivel"
  }, "Cancelado (Implausível/Falta)")))) : editType === 'report' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest block"
  }, "Nickname"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editData.nickname || '',
    onChange: e => setEditData({
      ...editData,
      nickname: e.target.value
    }),
    className: "w-full h-10 px-3 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand outline-none text-slate-700 dark:text-white transition-colors"
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest block"
  }, "Assunto"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editData.subject || '',
    onChange: e => setEditData({
      ...editData,
      subject: e.target.value
    }),
    className: "w-full h-10 px-3 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand outline-none text-slate-700 dark:text-white transition-colors"
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest block"
  }, "Mensagem"), /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    value: editData.message || '',
    onChange: e => setEditData({
      ...editData,
      message: e.target.value
    }),
    className: "w-full p-3 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm focus:border-brand outline-none text-slate-700 dark:text-white transition-colors resize-none custom-scrollbar"
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 max-h-[45vh] overflow-y-auto custom-scrollbar pr-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm font-bold text-slate-800 dark:text-white mb-2"
  }, "Avaliador: ", /*#__PURE__*/React.createElement("span", {
    className: "text-brand"
  }, editData.avaliador)), Object.keys(editData.schedule || {}).length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 italic"
  }, "Nenhum horário registado.") : Object.keys(editData.schedule).map(day => /*#__PURE__*/React.createElement("div", {
    key: day,
    className: "bg-slate-50 dark:bg-[#121813] border border-slate-200 dark:border-white/5 rounded-lg p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-2 pb-2 border-b border-slate-200 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300"
  }, day), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const newSchedule = {
        ...editData.schedule
      };
      delete newSchedule[day];
      setEditData({
        ...editData,
        schedule: newSchedule
      });
    },
    className: "text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
  }, "Remover Dia")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5"
  }, editData.schedule[day].map(time => /*#__PURE__*/React.createElement("span", {
    key: time,
    className: "flex items-center gap-1 bg-white dark:bg-black/20 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 dark:border-white/10 shadow-sm"
  }, time, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const newSchedule = {
        ...editData.schedule
      };
      newSchedule[day] = newSchedule[day].filter(t => t !== time);
      if (newSchedule[day].length === 0) delete newSchedule[day];
      setEditData({
        ...editData,
        schedule: newSchedule
      });
    },
    className: "text-slate-400 hover:text-red-500 transition-colors ml-1"
  }, /*#__PURE__*/React.createElement(X, {
    size: 12
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex flex-col sm:flex-row gap-3 sm:justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditModalOpen(false),
    className: "w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: handleSaveEdit,
    className: "w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-brand hover:bg-brand-hover text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center shadow-md"
  }, "Salvar Alterações")))))), document.body), deleteModalOpen && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "relative z-[9999]",
    "aria-labelledby": "modal-title",
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-10 w-screen overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-full items-center justify-center p-4 text-center sm:p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-fade-in flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(AlertTriangle, {
    size: 18,
    className: "text-red-500"
  }), " Apagar Registo"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDeleteModalOpen(false),
    className: "flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"
  }, /*#__PURE__*/React.createElement(X, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center"
  }, "Tens a certeza de que desejas apagar permanentemente este registo?"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-red-500 font-bold uppercase tracking-widest mt-5 text-center"
  }, "Esta ação não pode ser desfeita.")), /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex flex-col sm:flex-row gap-3 sm:justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDeleteModalOpen(false),
    className: "w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: handleConfirmDelete,
    className: "w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center shadow-md"
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 16,
    className: "shrink-0 mr-2"
  }), " Sim, Apagar")))))), document.body), isResetModalOpen && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "relative z-[9999]",
    "aria-labelledby": "modal-title",
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-10 w-screen overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-full items-center justify-center p-4 text-center sm:p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-fade-in flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(AlertTriangle, {
    size: 18,
    className: "text-red-500"
  }), " ", viewMode === 'agendamentos' ? 'Limpar Agendamentos' : viewMode === 'reports' ? 'Limpar Reports' : 'Limpar Rotinas'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsResetModalOpen(false),
    className: "flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"
  }, /*#__PURE__*/React.createElement(X, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-6"
  }, viewMode === 'agendamentos' ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center"
  }, "Tens a certeza de que desejas apagar todos os ", /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-800 dark:text-white"
  }, "agendamentos expirados e não classificados"), "?") : viewMode === 'reports' ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center"
  }, "Tens a certeza de que desejas apagar ", /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-800 dark:text-white"
  }, "TODOS os reports"), " da base de dados?") : /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center"
  }, "Tens a certeza de que desejas apagar ", /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-800 dark:text-white"
  }, "TODAS as rotinas"), " de todos os avaliadores?"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-red-500 font-bold uppercase tracking-widest mt-5 text-center"
  }, "Esta ação não pode ser desfeita.")), /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex flex-col sm:flex-row gap-3 sm:justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsResetModalOpen(false),
    className: "w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setIsResetModalOpen(false);
      if (viewMode === 'agendamentos') onClearExpired();else if (viewMode === 'reports') onClearReports();else onClearRoutines();
    },
    className: "w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 16,
    className: "shrink-0"
  }), " Confirmar")))))), document.body));
};
const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [toasts, setToasts] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    nickname: '',
    role: ''
  });
  const [identityHandle, setIdentityHandle] = useState('');
  const identityAlertRef = useRef(false);
  const identityShieldRef = useRef(null);
  if (!identityShieldRef.current) identityShieldRef.current = createForumIdentityShield();
  const identityShield = identityShieldRef.current;
  const [fullMembersList, setFullMembersList] = useState([]);
  const [formadosList, setFormadosList] = useState([]);
  const [authStatus, setAuthStatus] = useState('loading');
  const [currentTab, setCurrentTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const validTabs = ['agendamento', 'membros', 'formados', 'horarios', 'controles'];
    return validTabs.includes(tab) ? tab : 'agendamento';
  });
  const handleTabChange = tab => {
    setCurrentTab(tab);
    try {
      const url = new URL(window.location);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url);
    } catch (e) {
      console.warn("Segurança do navegador bloqueou a atualização do URL:", e);
    }
  };
  const [availabilities, setAvailabilities] = useState({});
  const [evaluatorWhatsapps, setEvaluatorWhatsapps] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState({
    subject: 'Aula/Avaliação',
    message: ''
  });
  const lockedIdentity = useMemo(() => {
    if (!identityHandle) return null;
    return identityShield.read(identityHandle);
  }, [identityHandle]);
  const trustedUser = useMemo(() => {
    if (lockedIdentity) return lockedIdentity;
    if (identityHandle || authStatus === 'complete') return {
      nickname: '',
      role: ''
    };
    return {
      nickname: currentUser.nickname || '',
      role: currentUser.role || ''
    };
  }, [authStatus, identityHandle, lockedIdentity, currentUser.nickname, currentUser.role]);
  useEffect(() => {
    let isMounted = true;
    const fetchSupabaseData = async () => {
      if (!supabaseClient) return;
      try {
        const {
          data: availData,
          error: availErr
        } = await supabaseClient.from('cfo_availabilities').select('*');
        if (!availErr && availData && isMounted) {
          const loadedAvail = {};
          const loadedWhats = {};
          availData.forEach(row => {
            loadedAvail[row.avaliador] = normalizeSchedule(row.schedule);
            if (row.whatsapp) loadedWhats[row.avaliador] = row.whatsapp;
          });
          setAvailabilities(loadedAvail);
          setEvaluatorWhatsapps(loadedWhats);
        }
        const {
          data: appData,
          error: appErr
        } = await supabaseClient.from('cfo_appointments').select('*');
        if (!appErr && appData && isMounted) setAppointments(appData);
        const {
          data: repData,
          error: repErr
        } = await supabaseClient.from('cfo_reports').select('*');
        if (!repErr && repData && isMounted) setReports(repData);
      } catch (err) {
        console.error("Falha ao puxar dados do Supabase:", err);
      }
    };
    fetchSupabaseData();
    if (!supabaseClient) return;
    const channel = supabaseClient.channel('public-db-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'cfo_availabilities'
    }, payload => {
      if (!isMounted) return;
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        setAvailabilities(prev => ({
          ...prev,
          [payload.new.avaliador]: normalizeSchedule(payload.new.schedule)
        }));
        if (payload.new.whatsapp) setEvaluatorWhatsapps(prev => ({
          ...prev,
          [payload.new.avaliador]: payload.new.whatsapp
        }));
      } else if (payload.eventType === 'DELETE') {
        setAvailabilities(prev => {
          const copy = {
            ...prev
          };
          delete copy[payload.old.avaliador];
          return copy;
        });
        setEvaluatorWhatsapps(prev => {
          const copy = {
            ...prev
          };
          delete copy[payload.old.avaliador];
          return copy;
        });
      }
    }).on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'cfo_appointments'
    }, payload => {
      if (!isMounted) return;
      if (payload.eventType === 'INSERT') setAppointments(prev => {
        if (prev.find(a => a.id === payload.new.id)) return prev;
        return [...prev, payload.new];
      });else if (payload.eventType === 'DELETE') setAppointments(prev => prev.filter(a => a.id !== payload.old.id));else if (payload.eventType === 'UPDATE') setAppointments(prev => prev.map(a => a.id === payload.new.id ? payload.new : a));
    }).on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'cfo_reports'
    }, payload => {
      if (!isMounted) return;
      if (payload.eventType === 'INSERT') setReports(prev => {
        if (prev.find(r => r.id === payload.new.id)) return prev;
        return [...prev, payload.new];
      });else if (payload.eventType === 'DELETE') setReports(prev => prev.filter(r => r.id !== payload.old.id));else if (payload.eventType === 'UPDATE') setReports(prev => prev.map(r => r.id === payload.new.id ? payload.new : r));
    }).subscribe();
    return () => {
      isMounted = false;
      supabaseClient.removeChannel(channel);
    };
  }, []);
  const updateAvailabilities = async (newAvail, avaliador, whatsappStr) => {
    const sanitizedSchedule = normalizeSchedule(newAvail?.[avaliador]);
    const sanitizedAvailabilities = {
      ...normalizeAvailabilityMap(newAvail),
      [avaliador]: sanitizedSchedule
    };
    setAvailabilities(sanitizedAvailabilities);
    if (whatsappStr !== undefined) setEvaluatorWhatsapps(prev => ({
      ...prev,
      [avaliador]: whatsappStr
    }));
    if (!supabaseClient) return;
    const currentWhatsapp = whatsappStr !== undefined ? whatsappStr : evaluatorWhatsapps[avaliador];
    const {
      error
    } = await supabaseClient.from('cfo_availabilities').upsert({
      avaliador: avaliador,
      schedule: sanitizedSchedule,
      whatsapp: currentWhatsapp || null
    }, {
      onConflict: 'avaliador'
    });
    if (error) addToast('error', 'Erro', 'Falha ao sincronizar rotina com o servidor.');
  };
  const removeAvailability = async avaliador => {
    setAvailabilities(prev => {
      const copy = {
        ...prev
      };
      delete copy[avaliador];
      return copy;
    });
    if (!supabaseClient) return;
    const {
      error
    } = await supabaseClient.from('cfo_availabilities').delete().eq('avaliador', avaliador);
    if (error) addToast('error', 'Erro', 'Falha ao apagar a rotina no servidor.');
  };
  const addAppointment = async app => {
    if (isBlockedForumIdentity(app?.aluno)) {
      addToast('error', 'Acesso negado', 'Não foi possível agendar sem login válido no fórum.');
      return false;
    }
    const addLocalAppointment = () => setAppointments(prev => prev.find(a => a.id === app.id) ? prev : [...prev, app]);
    if (!supabaseClient) {
      addLocalAppointment();
      return true;
    }
    const {
      error
    } = await supabaseClient.from('cfo_appointments').insert(app);
    if (error) {
      addToast('error', 'Erro', 'Falha ao sincronizar agendamento.');
      return false;
    }
    addLocalAppointment();
    return true;
  };
  const updateAppointment = async (appId, updates) => {
    setAppointments(prev => prev.map(a => a.id === appId ? {
      ...a,
      ...updates
    } : a));
    if (!supabaseClient) return;
    const {
      error
    } = await supabaseClient.from('cfo_appointments').update(updates).eq('id', appId);
    if (error) addToast('error', 'Erro', 'Falha ao atualizar o agendamento no servidor.');
  };
  const removeAppointment = async appId => {
    setAppointments(prev => prev.filter(app => app.id !== appId));
    if (!supabaseClient) return;
    const {
      error
    } = await supabaseClient.from('cfo_appointments').delete().eq('id', appId);
    if (error) addToast('error', 'Erro', 'Falha ao apagar o agendamento no servidor.');
  };
  const updateReport = async (reportId, updates) => {
    setReports(prev => prev.map(r => r.id === reportId ? {
      ...r,
      ...updates
    } : r));
    if (!supabaseClient) return;
    const {
      error
    } = await supabaseClient.from('cfo_reports').update(updates).eq('id', reportId);
    if (error) addToast('error', 'Erro', 'Falha ao atualizar o reporte no servidor.');
  };
  const deleteReport = async reportId => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    if (!supabaseClient) return;
    const {
      error
    } = await supabaseClient.from('cfo_reports').delete().eq('id', reportId);
    if (error) addToast('error', 'Erro', 'Falha ao apagar o reporte no servidor.');
  };
  const handleClearExpired = async () => {
    if (!supabaseClient) return;
    try {
      const expiredAppIds = appointments.filter(app => isTimeExpired(app.date, app.time) && (!app.status || app.status === 'agendado')).map(app => app.id);
      if (expiredAppIds.length > 0) {
        const {
          error: appErr
        } = await supabaseClient.from('cfo_appointments').delete().in('id', expiredAppIds);
        if (appErr) throw appErr;
        setAppointments(prev => prev.filter(app => !expiredAppIds.includes(app.id)));
        addToast('success', 'Limpeza Concluída', 'Agendamentos expirados não respondidos foram removidos.');
      } else {
        addToast('info', 'Aviso', 'Nenhum agendamento expirado pendente encontrado.');
      }
    } catch (error) {
      addToast('error', 'Erro', 'Falha ao limpar dados do servidor.');
    }
  };
  const handleClearAllRoutines = async () => {
    setAvailabilities({});
    if (!supabaseClient) return;
    await supabaseClient.from('cfo_availabilities').delete().neq('avaliador', 'dummy_never_match');
    addToast('success', 'Limpeza Concluída', 'Todas as rotinas foram apagadas da base de dados.');
  };
  const handleClearAllReports = async () => {
    setReports([]);
    if (!supabaseClient) return;
    await supabaseClient.from('cfo_reports').delete().neq('id', 'dummy_never_match');
    addToast('success', 'Limpeza Concluída', 'Todos os reports foram apagados da base de dados.');
  };
  const submitReport = async () => {
    const secureNickname = trustedUser.nickname ? trustedUser.nickname.trim() : '';
    if (isBlockedForumIdentity(secureNickname)) return addToast('error', 'Acesso negado', 'Inicia sessão no fórum com uma conta válida antes de enviar reportes.');
    if (!reportData.message.trim()) return addToast('error', 'Erro', 'Preencha a mensagem antes de enviar.');
    if (!supabaseClient) return;
    const newReport = {
      nickname: secureNickname,
      subject: reportData.subject,
      message: reportData.message,
      created_at: new Date().toISOString()
    };
    try {
      const {
        error
      } = await supabaseClient.from('cfo_reports').insert(newReport);
      if (error) addToast('error', 'Erro', 'Falha ao enviar o reporte.');else {
        addToast('success', 'Sucesso', 'Reporte enviado com sucesso. Obrigado!');
        setIsReportModalOpen(false);
        setReportData(prev => ({
          ...prev,
          message: ''
        }));
      }
    } catch (err) {
      addToast('error', 'Erro', 'Ocorreu um erro na base de dados.');
    }
  };
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  const addToast = (type, title, message) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, {
      id,
      type,
      title,
      message
    }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  useEffect(() => {
    if (authStatus !== 'complete') return;
    if (!identityHandle) {
      setAuthStatus('unauthorized');
      return;
    }
    if (!lockedIdentity) {
      setAuthStatus('unauthorized');
      return;
    }
    if (!identityShield.verify(identityHandle, currentUser)) {
      setCurrentUser(lockedIdentity);
      if (!identityAlertRef.current) {
        identityAlertRef.current = true;
        addToast('error', 'Proteção ativa', 'Tentativa de alteração manual do nickname detectada. Perfil oficial do fórum restaurado.');
      }
    }
  }, [authStatus, identityHandle, lockedIdentity, currentUser.nickname, currentUser.role]);
  const parseTSVGlobal = tsv => {
    let rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;
    for (let i = 0; i < tsv.length; i++) {
      let char = tsv[i],
        nextChar = tsv[i + 1];
      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          currentCell += '"';
          i++;
        } else if (char === '"') inQuotes = false;else currentCell += char;
      } else {
        if (char === '"' && currentCell.trim() === '') inQuotes = true;else if (char === '\t') {
          currentRow.push(currentCell);
          currentCell = '';
        } else if (char === '\n') {
          currentRow.push(currentCell);
          rows.push(currentRow);
          currentRow = [];
          currentCell = '';
        } else if (char === '\r') {
          if (nextChar !== '\n') currentCell += char;
        } else currentCell += char;
      }
    }
    if (currentCell !== '' || currentRow.length > 0) {
      currentRow.push(currentCell);
      rows.push(currentRow);
    }
    return rows;
  };
  const getForumUsername = async () => {
    const cleanNick = value => {
      if (!value) return '';
      let nick = normalizeForumIdentity(value);
      nick = nick.replace(/^@/, '').trim();
      nick = nick.replace(/^(ol[aá]|bem[-\s]?vindo(?:\(a\))?)\s*,?\s*/i, '').trim();
      if (nick.includes('\n')) nick = nick.split('\n')[0].trim();
      return nick;
    };
    const pushCandidate = (list, value) => {
      const nick = cleanNick(value);
      if (!isBlockedForumIdentity(nick)) list.push(nick);
    };
    const collectFromDom = (list, rootDocument) => {
      if (!rootDocument) return;
      const selectors = ['meta[name="xf-username"]', 'meta[name="current-user"]', '[data-current-user]', '.p-navgroup-link--user .p-navgroup-linkText', '.p-navgroup-link--user .username', '#elUserLink', '#elUserLink_menu strong', '.navTab.account .accountUsername', 'header [class*="user"] [class*="name"]', 'header a[href*="u="]', 'header a[href*="members/"]'];
      for (const selector of selectors) {
        const el = rootDocument.querySelector(selector);
        if (!el) continue;
        pushCandidate(list, el.getAttribute('content'));
        pushCandidate(list, el.getAttribute('data-current-user'));
        pushCandidate(list, el.getAttribute('data-username'));
        pushCandidate(list, el.textContent);
      }
    };
    const collectFromHtml = (list, html) => {
      if (!html || typeof html !== 'string') return;
      if (htmlForumSessionLooksLoggedOut(html)) return;

      // Prioridade: formato informado por voce
      const regexes = [/_userdata\["username"\]\s*=\s*"([^"]+)"/i, /_userdata\['username'\]\s*=\s*'([^']+)'/i, /_userdata\.username\s*=\s*"([^"]+)"/i, /_userdata\.username\s*=\s*'([^']+)'/i, /"username"\s*:\s*"([^"]+)"/i];
      for (const rx of regexes) {
        const match = html.match(rx);
        if (match && match[1]) {
          pushCandidate(list, match[1]);
          if (list.length > 0) return;
        }
      }
      try {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        collectFromDom(list, doc);
      } catch (error) {
        // ignora parse error
      }
    };
    const candidates = [];
    const forumGlobals = [window?._userdata, window?.XF?.config?.visitor, window?.IPB?.member, window?.currentUser, window?.Forum?.user].filter(Boolean);
    const currentPageLoggedOut = forumGlobals.some(forumSessionLooksLoggedOut);

    // 1) Globais da pagina atual
    if (!currentPageLoggedOut) {
      pushCandidate(candidates, window?.XF?.config?.visitor?.username);
      pushCandidate(candidates, window?.XF?.config?.visitor?.name);
      pushCandidate(candidates, window?.IPB?.member?.name);
      pushCandidate(candidates, window?._userdata?.username);
      pushCandidate(candidates, window?.currentUser?.username);
      pushCandidate(candidates, window?.Forum?.user?.name);
    }

    // 2) DOM da pagina atual
    if (!currentPageLoggedOut) collectFromDom(candidates, document);

    // 3) HTML bruto do forum (incluindo sua estrategia com /forum)
    for (const url of ['/forum', '/']) {
      try {
        const response = await fetch(url, {
          credentials: 'same-origin',
          cache: 'no-store'
        });
        if (!response.ok) continue;
        const html = await response.text();
        collectFromHtml(candidates, html);
        if (candidates.length > 0) break;
      } catch (error) {
        // tenta o proximo endpoint
      }
    }
    const uniqueCandidates = Array.from(new Set(candidates));
    return uniqueCandidates.find(candidate => !isBlockedForumIdentity(candidate)) || '';
  };
  useEffect(() => {
    const fetchFormados = async () => {
      try {
        const response = await fetch(MACRO_FORMADOS_URL);
        const text = await response.text();
        const data = parseTSVGlobal(text);
        let extractedFormados = [];
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const currentNick = row[6] ? row[6].toString().trim() : '';
          if (currentNick && currentNick.toLowerCase() !== 'nickname' && currentNick.toLowerCase() !== 'novo nickname' && currentNick.toLowerCase() !== 'nick atual') {
            extractedFormados.push({
              currentNickname: currentNick,
              dateObtained: row[7] ? row[7].toString().trim() : '',
              oldNickname: row[8] ? row[8].toString().trim() : '',
              status: row[9] ? row[9].toString().trim() : ''
            });
          }
        }
        setFormadosList(extractedFormados);
      } catch (error) {
        console.error("Falha ao carregar a lista de formados");
      }
    };
    fetchFormados();
  }, []);
  useEffect(() => {
    const authenticate = async () => {
      const forumNick = await getForumUsername();
      if (isBlockedForumIdentity(forumNick)) {
        setIdentityHandle('');
        setCurrentUser({
          nickname: '',
          role: ''
        });
        return setAuthStatus('unauthorized');
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
          if (row[0] && row[1] && row[0].trim() !== '' && row[0].toLowerCase() !== 'cargo') {
            extractedMembers.push({
              role: row[0].toString().trim(),
              nickname: row[1].toString().trim()
            });
          }
          if (row[1] && row[1].toString().trim().toLowerCase() === nickToSearch) {
            foundRole = row[0] ? row[0].toString().trim() : 'Avaliador';
            foundNick = row[1].toString().trim();
          }
        }
        const uniqueMembers = Array.from(new Map(extractedMembers.map(item => [item.nickname, item])).values());
        setFullMembersList(uniqueMembers);
        if (foundRole) {
          const handle = identityShield.lock(foundNick, foundRole);
          const safeUser = identityShield.read(handle) || {
            nickname: foundNick,
            role: foundRole
          };
          setIdentityHandle(handle);
          setCurrentUser(safeUser);
          identityAlertRef.current = false;
        } else {
          const handle = identityShield.lock(forumNick, 'Convidado');
          const safeUser = identityShield.read(handle) || {
            nickname: forumNick,
            role: 'Convidado'
          };
          setIdentityHandle(handle);
          setCurrentUser(safeUser);
          identityAlertRef.current = false;
        }
      } catch (error) {
        const handle = identityShield.lock(forumNick, 'Convidado');
        const safeUser = identityShield.read(handle) || {
          nickname: forumNick,
          role: 'Convidado'
        };
        setIdentityHandle(handle);
        setCurrentUser(safeUser);
        identityAlertRef.current = false;
      } finally {
        setAuthStatus('complete');
      }
    };
    authenticate();
  }, []);
  const isAvaliador = trustedUser.role !== 'Convidado' && trustedUser.role !== '';
  const normalizedUserRole = trustedUser.role ? trustedUser.role.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : '';
  const canViewHistory = ['fiscalizador', 'estagiario', 'conselheiro', 'vice-lider', 'lider', 'diretor', 'coordenador'].some(r => normalizedUserRole.includes(r));
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col min-h-screen w-full pb-10"
  }, /*#__PURE__*/React.createElement(ToastContainer, {
    toasts: toasts,
    removeToast: id => setToasts(prev => prev.filter(t => t.id !== id))
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 mt-2 md:mt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-[#121813] rounded-2xl border border-slate-200 dark:border-brand/50 border-t-4 border-t-brand p-4 sm:p-6 md:p-10 transition-colors shadow-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-6 mb-6 sm:mb-8 border-b border-slate-100 dark:border-brand/20 pb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 min-w-0"
  }, /*#__PURE__*/React.createElement(BrandHeader, null), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 w-full sm:w-auto justify-end min-w-0"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsReportModalOpen(true),
    className: "flex items-center justify-center gap-2 bg-slate-100 dark:bg-black/20 hover:bg-brand/10 hover:text-brand dark:hover:bg-brand/20 dark:hover:text-brand-light text-slate-500 rounded-full sm:rounded-lg w-10 h-10 sm:w-auto sm:px-3 sm:py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border border-slate-200 dark:border-brand/20 shrink-0"
  }, /*#__PURE__*/React.createElement(Flag, {
    size: 14,
    className: "shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, "Reportar")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
    className: "w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-black/20 text-slate-500 hover:text-brand transition-colors border border-slate-200 dark:border-brand/20 shrink-0"
  }, theme === 'light' ? /*#__PURE__*/React.createElement(Moon, {
    size: 18
  }) : /*#__PURE__*/React.createElement(Sun, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-right hidden sm:flex flex-col min-w-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-slate-800 dark:text-white truncate max-w-[120px]"
  }, trustedUser.nickname || 'Aguardando...'), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-widest text-brand"
  }, trustedUser.role || 'Visitante')), /*#__PURE__*/React.createElement("div", {
    className: "shrink-0"
  }, trustedUser.nickname && trustedUser.nickname !== 'Visitante' ? /*#__PURE__*/React.createElement("img", {
    src: `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${trustedUser.nickname}&direction=3&head_direction=3&gesture=sml&size=m&headonly=1`,
    className: "object-none object-center bg-slate-50 dark:bg-black/20 rounded-full w-10 h-10 border border-slate-200 dark:border-brand/30",
    alt: trustedUser.nickname,
    onError: e => e.target.style.display = 'none'
  }) : /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-slate-100 dark:bg-black/20 rounded-full border border-slate-200 dark:border-brand/20 overflow-hidden flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Users, {
    size: 16,
    className: "text-slate-400"
  })))))), authStatus === 'complete' && /*#__PURE__*/React.createElement("div", {
    className: "flex overflow-x-auto hide-scrollbar gap-2 sm:gap-4 border-b-2 border-slate-100 dark:border-white/5 pt-2 pb-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleTabChange('agendamento'),
    className: `shrink-0 whitespace-nowrap pb-3 px-3 sm:px-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors relative ${currentTab === 'agendamento' ? 'text-brand' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`
  }, "Agendamento", currentTab === 'agendamento' && /*#__PURE__*/React.createElement("span", {
    className: "absolute bottom-[-2px] left-0 w-full h-1 bg-brand rounded-t-md transition-all duration-300"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleTabChange('membros'),
    className: `shrink-0 whitespace-nowrap pb-3 px-3 sm:px-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors relative ${currentTab === 'membros' ? 'text-brand' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`
  }, "Listagem", currentTab === 'membros' && /*#__PURE__*/React.createElement("span", {
    className: "absolute bottom-[-2px] left-0 w-full h-1 bg-brand rounded-t-md transition-all duration-300"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleTabChange('formados'),
    className: `shrink-0 whitespace-nowrap pb-3 px-3 sm:px-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors relative ${currentTab === 'formados' ? 'text-brand' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`
  }, "Formados", currentTab === 'formados' && /*#__PURE__*/React.createElement("span", {
    className: "absolute bottom-[-2px] left-0 w-full h-1 bg-brand rounded-t-md transition-all duration-300"
  })), isAvaliador && /*#__PURE__*/React.createElement("button", {
    onClick: () => handleTabChange('horarios'),
    className: `shrink-0 whitespace-nowrap pb-3 px-3 sm:px-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors relative ${currentTab === 'horarios' ? 'text-brand' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`
  }, "Rotina Semanal", currentTab === 'horarios' && /*#__PURE__*/React.createElement("span", {
    className: "absolute bottom-[-2px] left-0 w-full h-1 bg-brand rounded-t-md transition-all duration-300"
  })), canViewHistory && /*#__PURE__*/React.createElement("button", {
    onClick: () => handleTabChange('controles'),
    className: `shrink-0 whitespace-nowrap pb-3 px-3 sm:px-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors relative ${currentTab === 'controles' ? 'text-brand' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`
  }, "Controles", currentTab === 'controles' && /*#__PURE__*/React.createElement("span", {
    className: "absolute bottom-[-2px] left-0 w-full h-1 bg-brand rounded-t-md transition-all duration-300"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "min-h-[300px] mt-4 sm:mt-6"
  }, authStatus === 'loading' ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs"
  }, "A carregar perfil...") : authStatus === 'unauthorized' ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center py-16 text-center space-y-4 animate-fade-in"
  }, /*#__PURE__*/React.createElement(AlertTriangle, {
    size: 64,
    className: "text-red-500 mb-2"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-2xl font-condensed font-bold uppercase text-slate-800 dark:text-white"
  }, "Acesso Negado"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto"
  }, "É estritamente obrigatório estar autenticado no fórum com uma conta válida. Sessões anônimas, convidado, visitante ou sem login são bloqueadas.")) : /*#__PURE__*/React.createElement(React.Fragment, null, currentTab === 'agendamento' && /*#__PURE__*/React.createElement(PaginaAgendamento, {
    currentUser: trustedUser,
    addToast: addToast,
    availabilities: availabilities,
    appointments: appointments,
    addAppointment: addAppointment,
    fullMembersList: fullMembersList,
    evaluatorWhatsapps: evaluatorWhatsapps
  }), currentTab === 'membros' && /*#__PURE__*/React.createElement(PaginaMembros, {
    membersList: fullMembersList,
    availabilities: availabilities,
    onBookClick: () => handleTabChange('agendamento')
  }), currentTab === 'formados' && /*#__PURE__*/React.createElement(PaginaFormados, {
    formadosList: formadosList
  }), currentTab === 'horarios' && isAvaliador && /*#__PURE__*/React.createElement(PaginaHorarios, {
    currentUser: trustedUser,
    addToast: addToast,
    availabilities: availabilities,
    updateAvailabilities: updateAvailabilities,
    appointments: appointments,
    updateAppointment: updateAppointment,
    evaluatorWhatsapps: evaluatorWhatsapps
  }), currentTab === 'controles' && canViewHistory && /*#__PURE__*/React.createElement(PaginaControles, {
    availabilities: availabilities,
    appointments: appointments,
    reports: reports,
    addToast: addToast,
    onClearExpired: handleClearExpired,
    onClearRoutines: handleClearAllRoutines,
    onClearReports: handleClearAllReports,
    currentUser: trustedUser,
    onUpdateAppointment: updateAppointment,
    onDeleteAppointment: removeAppointment,
    onUpdateReport: updateReport,
    onDeleteReport: deleteReport,
    onUpdateAvailability: updateAvailabilities,
    onDeleteAvailability: removeAvailability
  }))), authStatus === 'complete' && /*#__PURE__*/React.createElement("div", {
    className: "mt-8 pt-6 border-t border-slate-100 dark:border-brand/20 flex justify-center"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/f584-cfo-lista-de-checagem",
    className: "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand transition-colors"
  }, /*#__PURE__*/React.createElement(ExternalLink, {
    size: 14
  }), " Voltar ao Fórum CFO")), isReportModalOpen && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "relative z-[9999]",
    "aria-labelledby": "modal-title",
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-10 w-screen overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-full items-center justify-center p-4 text-center sm:p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative transform overflow-hidden rounded-xl bg-white dark:bg-[#151b17] border border-slate-200 dark:border-brand/30 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md w-full animate-fade-in flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-brand/20 flex justify-between items-center bg-slate-50 dark:bg-[#121813]"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-condensed font-bold uppercase text-slate-800 dark:text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Flag, {
    size: 18,
    className: "text-brand"
  }), " Novo Reporte"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsReportModalOpen(false),
    className: "flex items-center justify-center w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors bg-slate-100 dark:bg-white/5 rounded-full shrink-0"
  }, /*#__PURE__*/React.createElement(X, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block"
  }, "Seu Nickname"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: trustedUser.nickname || '',
    readOnly: true,
    className: "w-full h-10 px-3 bg-slate-100 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold outline-none text-slate-700 dark:text-white shadow-sm cursor-not-allowed"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-400"
  }, "Identificação vinculada ao fórum (bloqueada para segurança).")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block"
  }, "Assunto"), /*#__PURE__*/React.createElement("div", {
    className: "relative w-full"
  }, /*#__PURE__*/React.createElement("select", {
    value: reportData.subject,
    onChange: e => setReportData({
      ...reportData,
      subject: e.target.value
    }),
    className: "w-full h-10 px-3 pr-8 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm font-bold focus:border-brand focus:ring-1 focus:ring-brand outline-none text-slate-700 dark:text-white shadow-sm appearance-none cursor-pointer"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Aula/Avaliação"
  }, "Aula/Avaliação"), /*#__PURE__*/React.createElement("option", {
    value: "Site/Ferramenta"
  }, "Site/Ferramenta"), /*#__PURE__*/React.createElement("option", {
    value: "Sugestões/Melhorias"
  }, "Sugestões/Melhorias"), /*#__PURE__*/React.createElement("option", {
    value: "Erro/Bug"
  }, "Erro/Bug"), /*#__PURE__*/React.createElement("option", {
    value: "Dúvidas"
  }, "Dúvidas"), /*#__PURE__*/React.createElement("option", {
    value: "Reclamações"
  }, "Reclamações"), /*#__PURE__*/React.createElement("option", {
    value: "Outros"
  }, "Outros")))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block"
  }, "Mensagem"), /*#__PURE__*/React.createElement("textarea", {
    value: reportData.message,
    onChange: e => setReportData({
      ...reportData,
      message: e.target.value
    }),
    placeholder: "Descreva detalhadamente a situação...",
    rows: "4",
    className: "w-full p-3 bg-slate-50 dark:bg-[#121813] border border-slate-300 dark:border-brand/30 rounded-lg text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none text-slate-700 dark:text-white shadow-sm resize-none custom-scrollbar"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-t border-slate-100 dark:border-brand/20 bg-slate-50 dark:bg-[#121813] flex flex-col sm:flex-row gap-3 sm:justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsReportModalOpen(false),
    className: "w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: submitReport,
    className: "w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-brand hover:bg-brand-hover text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
  }, /*#__PURE__*/React.createElement(CheckCircle2, {
    size: 16,
    className: "shrink-0"
  }), " Enviar")))))), document.body))));
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));
