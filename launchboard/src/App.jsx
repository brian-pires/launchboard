import { useState, useEffect, useRef } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfo3X3llKNdf7nMsWIMNnHtkPUYV4U3aQ",
  authDomain: "launchboard-susana.firebaseapp.com",
  projectId: "launchboard-susana",
  storageBucket: "launchboard-susana.firebasestorage.app",
  messagingSenderId: "20555687764",
  appId: "1:20555687764:web:03bc9f3916cadad5858ac1"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const DEFAULT_PHASES = [
  { id: "ponto_partida", label: "Ponto de Partida", color: "#9B59B6" },
  { id: "config_base", label: "Configurações Base", color: "#2980B9" },
  { id: "captacao", label: "Fase de Captação", color: "#1ABC9C" },
  { id: "aquecimento", label: "Fase de Aquecimento", color: "#E67E22" },
  { id: "lembrete", label: "Fase de Lembrete", color: "#D4AC0D" },
  { id: "carrinho", label: "Fase de Carrinho Aberto", color: "#E74C3C" },
  { id: "downsell", label: "Fase de Downsell", color: "#7F8C8D" },
  { id: "config_extra", label: "Configurações Extra", color: "#6C5CE7" },
];

const PHASE_COLORS = ["#9B59B6","#2980B9","#1ABC9C","#E67E22","#E74C3C","#6C5CE7","#D4AC0D","#E91E8C","#00B894","#0984E3"];

const INITIAL_TASKS = [
  { id:"t1",phase:"ponto_partida",title:"Definir o produto a vender",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t2",phase:"ponto_partida",title:"Definir o nome do evento",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t3",phase:"ponto_partida",title:"Definir a promessa do evento",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t4",phase:"ponto_partida",title:"Definir a duração do evento",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t5",phase:"ponto_partida",title:"Definir as datas do evento",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t6",phase:"ponto_partida",title:"Definir o orçamento total a investir em publicidade",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t7",phase:"ponto_partida",title:"Definir plataforma para construir a página de Captura e Venda",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t8",phase:"ponto_partida",title:"Definir a plataforma de E-mail Marketing",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t9",phase:"ponto_partida",title:"Definir onde se vai transmitir a aula ao vivo",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t10",phase:"ponto_partida",title:"Criar uma comunidade no WhatsApp",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t11",phase:"ponto_partida",title:"Construir a LP de Captura de Leads",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t12",phase:"ponto_partida",title:"Construir a página de obrigado",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t13",phase:"ponto_partida",title:"Definir em que plataforma vender o produto",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t14",phase:"ponto_partida",title:"Definir e fazer a automação de e-mails",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t15",phase:"ponto_partida",title:"Criar lista/tag específica para este lançamento no software de E-mail Marketing",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t16",phase:"ponto_partida",title:"Definir quais as fases do lançamento",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t17",phase:"ponto_partida",title:"Definir a duração de cada fase",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t18",phase:"ponto_partida",title:"Definir quais plataformas de tráfego vamos utilizar",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t19",phase:"ponto_partida",title:"Definir orçamento na fase de Captação",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t20",phase:"ponto_partida",title:"Definir orçamento na fase de Aquecimento",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t21",phase:"ponto_partida",title:"Definir orçamento na fase de Lembrete",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t22",phase:"ponto_partida",title:"Definir orçamento na fase de Carrinho Aberto",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t23",phase:"ponto_partida",title:"Definir orçamento na fase de Downsell (se aplicável)",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t24",phase:"ponto_partida",title:"Definir quanto investir em cada plataforma em cada fase",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t25",phase:"ponto_partida",title:"Definir timings e conteúdos dos e-mails por fase",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t26",phase:"ponto_partida",title:"Definir timings e conteúdos da comunidade WhatsApp por fase",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t27",phase:"ponto_partida",title:"Definir calendário de conteúdos orgânicos por fase",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t28",phase:"config_base",title:"Criar o Gestor de Negócios no Meta",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t29",phase:"config_base",title:"Adicionar as informações do negócio",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t30",phase:"config_base",title:"Criar a conta de anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t31",phase:"config_base",title:"Adicionar um método de pagamento",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t32",phase:"config_base",title:"Configurar dados de Faturação para os anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t33",phase:"config_base",title:"Criar o Pixel",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t34",phase:"config_base",title:"Adicionar a Página Comercial do Facebook",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t35",phase:"config_base",title:"Adicionar o perfil do Instagram",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t36",phase:"config_base",title:"Adicionar a conta do WhatsApp Business",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t37",phase:"config_base",title:"Adicionar as pessoas ao Gestor de Negócios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t38",phase:"config_base",title:"Adicionar os ativos respetivos a cada pessoa",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t39",phase:"config_base",title:"Criar pasta na Biblioteca Multimédia e sub-pastas por fase",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t40",phase:"captacao",title:"Instalar o Pixel na Página de Captura",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t41",phase:"captacao",title:"Instalar o Pixel na Página de Obrigado",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t42",phase:"captacao",title:"Configurar o evento 'Lead' do pixel na página de Obrigado",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t43",phase:"captacao",title:"Instalar a tag do GA4 na página de Captura",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t44",phase:"captacao",title:"Instalar a tag do GA4 na página de Obrigado",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t45",phase:"captacao",title:"Configurar o evento 'Lead' do GA4 na página de Obrigado",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t46",phase:"captacao",title:"Quantos anúncios em formato de imagem vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t47",phase:"captacao",title:"Quantos anúncios em formato carrossel vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t48",phase:"captacao",title:"Quantos anúncios em formato vídeo vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t49",phase:"captacao",title:"Que dimensões devem ter cada 1 destes anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t50",phase:"captacao",title:"Procurar sugestões que anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t51",phase:"captacao",title:"Definir quantas campanhas vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t52",phase:"captacao",title:"Definir quanto vamos investir em cada uma das campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t53",phase:"captacao",title:"Definir que estrutura de orçamento vamos ter em cada campanha",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t54",phase:"captacao",title:"Definir que públicos vamos utilizar em cada uma das campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t55",phase:"captacao",title:"Definir os posicionamentos onde anúncios vão aparecer",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t56",phase:"captacao",title:"Criar os públicos em falta",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t57",phase:"captacao",title:"Adicionar os anúncios à Biblioteca Multimédia",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t58",phase:"captacao",title:"Definir a Nomenclatura de Campanhas, Conjuntos de Anúncios e Anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t59",phase:"captacao",title:"Escrever os copys para cada anúncio",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t60",phase:"captacao",title:"Escrever os títulos para cada anúncio",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t61",phase:"captacao",title:"Criar as campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t62",phase:"captacao",title:"Criar as colunas personalizadas para análise de métricas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t63",phase:"captacao",title:"Definir os períodos em que vamos analisar e otimizar as campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t64",phase:"aquecimento",title:"Quantos anúncios em formato de imagem vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t65",phase:"aquecimento",title:"Quantos anúncios em formato vídeo vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t66",phase:"aquecimento",title:"Que dimensões devem ter cada 1 destes anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t67",phase:"aquecimento",title:"Procurar sugestões que anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t68",phase:"aquecimento",title:"Definir quantas campanhas vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t69",phase:"aquecimento",title:"Definir quanto vamos investir em cada uma das campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t70",phase:"aquecimento",title:"Definir que estrutura de orçamento vamos ter em cada campanha",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t71",phase:"aquecimento",title:"Definir a frequência diária que queremos dos anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t72",phase:"aquecimento",title:"Definir que públicos vamos utilizar em cada uma das campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t73",phase:"aquecimento",title:"Definir os posicionamentos onde anúncios vão aparecer",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t74",phase:"aquecimento",title:"Criar os públicos em falta",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t75",phase:"aquecimento",title:"Adicionar os anúncios à Biblioteca Multimédia",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t76",phase:"aquecimento",title:"Definir a Nomenclatura de Campanhas, Conjuntos de Anúncios e Anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t77",phase:"aquecimento",title:"Escrever os copys para cada anúncio",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t78",phase:"aquecimento",title:"Escrever os títulos para cada anúncio",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t79",phase:"aquecimento",title:"Criar as campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t80",phase:"lembrete",title:"Quantos anúncios em formato de imagem vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t81",phase:"lembrete",title:"Quantos anúncios em formato vídeo vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t82",phase:"lembrete",title:"Que dimensões devem ter cada 1 destes anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t83",phase:"lembrete",title:"Procurar sugestões que anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t84",phase:"lembrete",title:"Definir quantas campanhas vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t85",phase:"lembrete",title:"Definir quanto vamos investir em cada uma das campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t86",phase:"lembrete",title:"Definir que estrutura de orçamento vamos ter em cada campanha",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t87",phase:"lembrete",title:"Definir a frequência diária que queremos dos anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t88",phase:"lembrete",title:"Definir que públicos vamos utilizar em cada uma das campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t89",phase:"lembrete",title:"Definir os posicionamentos onde anúncios vão aparecer",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t90",phase:"lembrete",title:"Criar os públicos em falta",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t91",phase:"lembrete",title:"Adicionar os anúncios à Biblioteca Multimédia",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t92",phase:"lembrete",title:"Definir a Nomenclatura de Campanhas, Conjuntos de Anúncios e Anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t93",phase:"lembrete",title:"Escrever os copys para cada anúncio",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t94",phase:"lembrete",title:"Escrever os títulos para cada anúncio",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t95",phase:"lembrete",title:"Criar as campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t96",phase:"carrinho",title:"Instalar o Pixel na Página de Vendas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t97",phase:"carrinho",title:"Instalar a tag do GA4 na página de Vendas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t98",phase:"carrinho",title:"Configurar o evento 'InitiateCheckout'",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t99",phase:"carrinho",title:"Configurar o evento 'Purchase'",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t100",phase:"carrinho",title:"Quantos anúncios em formato de imagem vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t101",phase:"carrinho",title:"Quantos anúncios em formato carrossel vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t102",phase:"carrinho",title:"Quantos anúncios em formato vídeo vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t103",phase:"carrinho",title:"Que dimensões devem ter cada 1 destes anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t104",phase:"carrinho",title:"Procurar sugestões que anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t105",phase:"carrinho",title:"Definir quantas campanhas vamos ter",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t106",phase:"carrinho",title:"Definir quanto vamos investir em cada uma das campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t107",phase:"carrinho",title:"Definir que estrutura de orçamento vamos ter em cada campanha",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t108",phase:"carrinho",title:"Definir que públicos vamos utilizar em cada uma das campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t109",phase:"carrinho",title:"Definir os posicionamentos onde anúncios vão aparecer",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t110",phase:"carrinho",title:"Criar os públicos em falta",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t111",phase:"carrinho",title:"Adicionar os anúncios à Biblioteca Multimédia",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t112",phase:"carrinho",title:"Definir a Nomenclatura de Campanhas, Conjuntos de Anúncios e Anúncios",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t113",phase:"carrinho",title:"Escrever os copys para cada anúncio",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t114",phase:"carrinho",title:"Escrever os títulos para cada anúncio",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t115",phase:"carrinho",title:"Criar as campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t116",phase:"carrinho",title:"Definir os períodos em que vamos analisar e otimizar as campanhas",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t117",phase:"downsell",title:"Definir se existe fase de Downsell",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t118",phase:"downsell",title:"Definir o produto de Downsell",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t119",phase:"downsell",title:"Configurar página e automação de Downsell",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t120",phase:"config_extra",title:"Definir UTMs",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t121",phase:"config_extra",title:"Criar um documento com todos os links",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t122",phase:"config_extra",title:"Criar questionário de pesquisa para as leads",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t123",phase:"config_extra",title:"Criar base de dados",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t124",phase:"config_extra",title:"Criar automações para os UTMs caírem na base de dados",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t125",phase:"config_extra",title:"Criar automações para as respostas à Pesquisa caírem na base de dados",done:false,assignee:"",deadline:"",comments:[] },
  { id:"t126",phase:"config_extra",title:"Criar Dashboard para análise de Captação em tempo real",done:false,assignee:"",deadline:"",comments:[] },
];

const AVATAR_COLORS = ["#6C5CE7","#00B894","#E17055","#0984E3","#FDCB6E","#A29BFE","#E91E8C","#00CEC9"];
const INITIAL_MEMBERS = [
  { id:"m1", name:"Tu (Gestor)", color:AVATAR_COLORS[0] },
  { id:"m2", name:"Cliente",     color:AVATAR_COLORS[1] },
];

function getInitials(name) { return name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2); }
function formatDateFull(d) { if(!d) return ""; const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; }
function daysUntil(d) { if(!d) return null; return Math.round((new Date(d)-new Date(new Date().toDateString()))/(1000*60*60*24)); }
function isOverdue(d,done) { if(!d||done) return false; return daysUntil(d)<0; }
const urgencyLabel = (days,done) => {
  if(done) return null;
  if(days<0) return { text:`${Math.abs(days)}d atraso`, color:"#E74C3C", bg:"#FDECEA" };
  if(days===0) return { text:"Hoje!", color:"#E74C3C", bg:"#FDECEA" };
  if(days===1) return { text:"Amanhã", color:"#E67E22", bg:"#FEF5EC" };
  if(days<=5) return { text:`${days}d`, color:"#D4AC0D", bg:"#FEFDF0" };
  return null;
};

export default function App() {
  const [tasks,   setTasks]   = useState(INITIAL_TASKS);
  const [phases,  setPhases]  = useState(DEFAULT_PHASES);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [loaded,  setLoaded]  = useState(false);
  const [view,    setView]    = useState("dashboard");
  const [openTaskId, setOpenTaskId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [filter, setFilter]   = useState("all");
  const [saving, setSaving]   = useState(false);
  const [addingTaskPhase, setAddingTaskPhase] = useState(null);
  const [newTaskTitle, setNewTaskTitle]       = useState("");
  const [showAddPhase, setShowAddPhase]       = useState(false);
  const [newPhaseName, setNewPhaseName]       = useState("");
  const [newPhaseColor, setNewPhaseColor]     = useState(PHASE_COLORS[0]);
  const [confirmDeletePhase, setConfirmDeletePhase] = useState(null);
  const [showAddMember, setShowAddMember]     = useState(false);
  const [newMemberName, setNewMemberName]     = useState("");
  const commentRef = useRef(null);
  const saveTimer  = useRef(null);

  // ── Firestore listener ─────────────────────────
  useEffect(() => {
    const ref = doc(db, "launchboard", "state");
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.tasks)   setTasks(data.tasks);
        if (data.phases)  setPhases(data.phases);
        if (data.members) setMembers(data.members);
      }
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  // ── Save to Firestore (debounced) ──────────────
  function persist(newTasks, newPhases, newMembers) {
    setSaving(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await setDoc(doc(db, "launchboard", "state"), {
          tasks:   newTasks   ?? tasks,
          phases:  newPhases  ?? phases,
          members: newMembers ?? members,
        });
      } catch(e) { console.error(e); }
      setSaving(false);
    }, 600);
  }

  function updateTasks(t)   { setTasks(t);   persist(t, null, null); }
  function updatePhases(p)  { setPhases(p);  persist(null, p, null); }
  function updateMembers(m) { setMembers(m); persist(null, null, m); }

  // ── Task ops ───────────────────────────────────
  function toggleDone(id) {
    const u = tasks.map(t=>t.id===id?{...t,done:!t.done}:t);
    updateTasks(u);
  }
  function setField(id,field,value) {
    const u = tasks.map(t=>t.id===id?{...t,[field]:value}:t);
    updateTasks(u);
  }
  function addComment(taskId) {
    if(!newComment.trim()) return;
    const c={id:Date.now(),text:newComment.trim(),author:"Tu",time:new Date().toISOString()};
    const u=tasks.map(t=>t.id===taskId?{...t,comments:[...t.comments,c]}:t);
    updateTasks(u);
    setNewComment("");
  }
  function deleteTask(id) {
    updateTasks(tasks.filter(t=>t.id!==id));
    if(openTaskId===id) setOpenTaskId(null);
  }
  function addTask(phaseId) {
    if(!newTaskTitle.trim()) return;
    const nt={id:"t"+Date.now(),phase:phaseId,title:newTaskTitle.trim(),done:false,assignees:[],deadline:"",comments:[]};
    updateTasks([...tasks,nt]);
    setNewTaskTitle("");
    setAddingTaskPhase(null);
  }

  // ── Phase ops ──────────────────────────────────
  function addPhase() {
    if(!newPhaseName.trim()) return;
    updatePhases([...phases,{id:"phase_"+Date.now(),label:newPhaseName.trim(),color:newPhaseColor}]);
    setNewPhaseName(""); setShowAddPhase(false);
  }
  function deletePhase(id) {
    updatePhases(phases.filter(p=>p.id!==id));
    updateTasks(tasks.filter(t=>t.phase!==id));
    if(view===id) setView("dashboard");
    setConfirmDeletePhase(null);
  }

  // ── Member ops ─────────────────────────────────
  function addMember() {
    if(!newMemberName.trim()) return;
    updateMembers([...members,{id:"m"+Date.now(),name:newMemberName.trim(),color:AVATAR_COLORS[members.length%AVATAR_COLORS.length]}]);
    setNewMemberName(""); setShowAddMember(false);
  }

  // ── Computed ───────────────────────────────────
  const totalDone    = tasks.filter(t=>t.done).length;
  const progress     = tasks.length>0?Math.round((totalDone/tasks.length)*100):0;
  const doneByPhase  = pid=>tasks.filter(t=>t.phase===pid&&t.done).length;
  const totalByPhase = pid=>tasks.filter(t=>t.phase===pid).length;
  const activePhase  = phases.find(p=>p.id===view);
  const phaseOf      = pid=>phases.find(p=>p.id===pid);

  const openTask = openTaskId ? tasks.find(t=>t.id===openTaskId)||null : null;

  const urgentTasks = tasks
    .filter(t=>!t.done&&t.deadline)
    .map(t=>({...t,days:daysUntil(t.deadline)}))
    .filter(t=>t.days<=7)
    .sort((a,b)=>a.days-b.days)
    .slice(0,12);

  const phaseTasks = activePhase ? tasks.filter(t=>{
    if(t.phase!==view) return false;
    if(filter==="done") return t.done;
    if(filter==="pending") return !t.done;
    return true;
  }) : [];

  // ── Loading screen ─────────────────────────────
  if (!loaded) return (
    <div style={{display:"flex",height:"100vh",alignItems:"center",justifyContent:"center",
      background:"#0F1923",flexDirection:"column",gap:16}}>
      <div style={{width:40,height:40,background:"linear-gradient(135deg,#6C5CE7,#00B894)",
        borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🚀</div>
      <div style={{color:"#ffffff60",fontSize:14}}>A carregar o LaunchBoard...</div>
    </div>
  );

  // ── Task card ──────────────────────────────────
  function TaskCard({ task, showPhase=false }) {
    const ph=phaseOf(task.phase);
    const days=task.deadline?daysUntil(task.deadline):null;
    const urg=days!==null?urgencyLabel(days,task.done):null;
    const overdue=isOverdue(task.deadline,task.done);
    const assignees=(task.assignees||[]).map(id=>members.find(m=>m.id===id)).filter(Boolean);
    return (
      <div onClick={()=>setOpenTaskId(task.id)}
        style={{background:"#fff",border:`1px solid ${task.done?"#E8F8F5":overdue?"#FDECEA":"#E8EAF0"}`,
          borderLeft:`3px solid ${task.done?"#00B894":overdue?"#E74C3C":(ph?.color||"#ccc")}`,
          borderRadius:10,padding:"12px 14px",marginBottom:7,cursor:"pointer",
          display:"flex",alignItems:"center",gap:12,opacity:task.done?0.6:1,transition:"box-shadow 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 12px #00000012"}
        onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
        <div onClick={e=>{e.stopPropagation();toggleDone(task.id);}}
          style={{width:20,height:20,borderRadius:6,border:`2px solid ${task.done?"#00B894":"#D0D5DD"}`,
            background:task.done?"#00B894":"#fff",display:"flex",alignItems:"center",justifyContent:"center",
            flexShrink:0,cursor:"pointer"}}>
          {task.done&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:500,color:task.done?"#8890A0":"#1A2233",
            textDecoration:task.done?"line-through":"none",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
            {task.title}
          </div>
          {showPhase&&ph&&<span style={{fontSize:10,color:ph.color,fontWeight:600}}>{ph.label}</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
          {task.comments.length>0&&<span style={{fontSize:11,color:"#B0B8C8"}}>💬{task.comments.length}</span>}
          {urg&&<span style={{fontSize:11,fontWeight:700,color:urg.color,background:urg.bg,padding:"2px 7px",borderRadius:99}}>{urg.text}</span>}
          <div style={{display:"flex"}}>
            {assignees.map((m,i)=>(
              <div key={m.id} style={{width:24,height:24,borderRadius:"50%",background:m.color,display:"flex",
                alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff",
                marginLeft:i>0?-6:0,border:"2px solid #fff"}}>{getInitials(m.name)}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────
  function Dashboard() {
    return (
      <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
          {[
            {label:"Progresso Geral",value:`${progress}%`,sub:`${totalDone} de ${tasks.length} tarefas`,color:"#6C5CE7",icon:"🚀"},
            {label:"Atrasadas",value:tasks.filter(t=>isOverdue(t.deadline,t.done)).length,sub:"tarefas em atraso",color:"#E74C3C",icon:"⚠️"},
            {label:"Esta semana",value:tasks.filter(t=>!t.done&&t.deadline&&daysUntil(t.deadline)>=0&&daysUntil(t.deadline)<=7).length,sub:"prazos nos próx. 7 dias",color:"#E67E22",icon:"📅"},
            {label:"Sem prazo",value:tasks.filter(t=>!t.done&&!t.deadline).length,sub:"tarefas por agendar",color:"#8890A0",icon:"🕐"},
          ].map((s,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:14,padding:"18px 20px",border:"1px solid #E8EAF0",boxShadow:"0 1px 4px #0000000A"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{fontSize:11,fontWeight:600,color:"#8890A0",textTransform:"uppercase",letterSpacing:0.8}}>{s.label}</div>
                <span style={{fontSize:20}}>{s.icon}</span>
              </div>
              <div style={{fontSize:28,fontWeight:800,color:s.color,lineHeight:1.2,marginTop:8}}>{s.value}</div>
              <div style={{fontSize:12,color:"#B0B8C8",marginTop:4}}>{s.sub}</div>
              {i===0&&<div style={{height:4,background:"#F0F1F5",borderRadius:99,marginTop:10}}>
                <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#6C5CE7,#00B894)",borderRadius:99,transition:"width 0.5s"}}/>
              </div>}
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#0F1923",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
              🔥 Tarefas Urgentes & Próximas
              <span style={{fontSize:11,color:"#8890A0",fontWeight:400}}>próximos 7 dias</span>
            </div>
            {urgentTasks.length===0?(
              <div style={{background:"#fff",borderRadius:12,padding:"32px",textAlign:"center",border:"1px solid #E8EAF0"}}>
                <div style={{fontSize:28,marginBottom:8}}>✨</div>
                <div style={{color:"#B0B8C8",fontSize:13}}>Sem tarefas urgentes.<br/>Adiciona datas limite às tarefas!</div>
              </div>
            ):urgentTasks.map(t=><TaskCard key={t.id} task={t} showPhase/>)}
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#0F1923",marginBottom:14}}>📊 Progresso por Fase</div>
            <div style={{background:"#fff",borderRadius:14,padding:"18px 20px",border:"1px solid #E8EAF0"}}>
              {phases.map(p=>{
                const done=doneByPhase(p.id),total=totalByPhase(p.id),pct=total>0?Math.round((done/total)*100):0;
                return (
                  <div key={p.id} onClick={()=>setView(p.id)} style={{marginBottom:14,cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.opacity="0.7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:12,fontWeight:500,color:"#1A2233"}}>{p.label}</span>
                      <span style={{fontSize:12,color:"#8890A0"}}>{done}/{total}</span>
                    </div>
                    <div style={{height:6,background:"#F0F1F5",borderRadius:99}}>
                      <div style={{height:"100%",width:`${pct}%`,background:p.color,borderRadius:99,transition:"width 0.4s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Phase view ─────────────────────────────────
  function PhaseView() {
    return (
      <div style={{flex:1,overflowY:"auto",padding:"20px 28px"}}>
        {phaseTasks.map(t=>(
          <div key={t.id} style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{flex:1}}><TaskCard task={t}/></div>
            <button onClick={()=>deleteTask(t.id)}
              style={{background:"none",border:"none",cursor:"pointer",color:"#D0D5DD",fontSize:16,padding:"0 4px",lineHeight:1}}
              onMouseEnter={e=>e.currentTarget.style.color="#E74C3C"}
              onMouseLeave={e=>e.currentTarget.style.color="#D0D5DD"}>×</button>
          </div>
        ))}
        {addingTaskPhase===view?(
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <input autoFocus value={newTaskTitle} onChange={e=>setNewTaskTitle(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")addTask(view);if(e.key==="Escape")setAddingTaskPhase(null);}}
              placeholder="Nome da nova tarefa..."
              style={{flex:1,padding:"9px 12px",border:`2px solid ${activePhase.color}`,borderRadius:8,fontSize:13,outline:"none"}}/>
            <button onClick={()=>addTask(view)} style={{background:activePhase.color,border:"none",borderRadius:8,padding:"0 16px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Adicionar</button>
            <button onClick={()=>{setAddingTaskPhase(null);setNewTaskTitle("");}} style={{background:"#F0F1F5",border:"none",borderRadius:8,padding:"0 12px",color:"#8890A0",fontSize:13,cursor:"pointer"}}>Cancelar</button>
          </div>
        ):(
          <button onClick={()=>setAddingTaskPhase(view)}
            style={{display:"flex",alignItems:"center",gap:8,marginTop:6,padding:"9px 14px",background:"#F7F8FC",
              border:`1px dashed ${activePhase.color}60`,borderRadius:8,color:activePhase.color,
              fontSize:13,fontWeight:500,cursor:"pointer",width:"100%"}}>
            <span style={{fontSize:18,lineHeight:1}}>+</span> Adicionar tarefa
          </button>
        )}
      </div>
    );
  }

  // ── Task panel ─────────────────────────────────
  function TaskPanel() {
    if(!openTask) return null;
    const ph=phaseOf(openTask.phase);
    const assignees = openTask.assignees || [];
    const [mentionQuery, setMentionQuery] = useState("");
    const [showMentions, setShowMentions] = useState(false);
    const [mentionPos, setMentionPos] = useState(0);

    function toggleAssignee(memberId) {
      const current = openTask.assignees || [];
      const updated = current.includes(memberId)
        ? current.filter(id=>id!==memberId)
        : [...current, memberId];
      setField(openTask.id, "assignees", updated);
    }

    function handleCommentChange(e) {
      const val = e.target.value;
      setNewComment(val);
      const cursorPos = e.target.selectionStart;
      const textBefore = val.slice(0, cursorPos);
      const atIndex = textBefore.lastIndexOf("@");
      if(atIndex !== -1 && !textBefore.slice(atIndex).includes(" ")) {
        setMentionQuery(textBefore.slice(atIndex+1).toLowerCase());
        setMentionPos(atIndex);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    }

    function insertMention(member) {
      const before = newComment.slice(0, mentionPos);
      const after = newComment.slice(mentionPos + mentionQuery.length + 1);
      setNewComment(`${before}@${member.name} ${after}`);
      setShowMentions(false);
    }

    const filteredMembers = members.filter(m=>
      m.name.toLowerCase().includes(mentionQuery)
    );

    function renderCommentText(text) {
      const parts = text.split(/(@\w[\w\s]*)/g);
      return parts.map((part,i)=> {
        const m = members.find(m=>`@${m.name}`===part.trim()||text.includes(`@${m.name}`));
        if(part.startsWith("@")) {
          const mentioned = members.find(m=>part.trim()===`@${m.name}`);
          if(mentioned) return <span key={i} style={{color:mentioned.color,fontWeight:700}}>{part}</span>;
        }
        return <span key={i}>{part}</span>;
      });
    }

    return (
      <div style={{position:"fixed",inset:0,background:"#00000040",zIndex:100,display:"flex",justifyContent:"flex-end"}}
        onClick={()=>setOpenTaskId(null)}>
        <div style={{width:420,background:"#fff",height:"100%",display:"flex",flexDirection:"column",
          boxShadow:"-4px 0 30px #00000020",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>

          {/* Header */}
          <div style={{padding:"20px 24px 16px",borderBottom:"1px solid #E8EAF0",display:"flex",alignItems:"flex-start",gap:12}}>
            <div onClick={()=>toggleDone(openTask.id)}
              style={{width:22,height:22,marginTop:2,borderRadius:6,border:`2px solid ${openTask.done?"#00B894":"#D0D5DD"}`,
                background:openTask.done?"#00B894":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>
              {openTask.done&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:700,color:"#0F1923",lineHeight:1.4}}>{openTask.title}</div>
              {ph&&<span style={{background:ph.color+"20",color:ph.color,fontSize:10,fontWeight:600,
                padding:"2px 8px",borderRadius:99,marginTop:4,display:"inline-block"}}>{ph.label}</span>}
            </div>
            <button onClick={()=>setOpenTaskId(null)} style={{background:"none",border:"none",fontSize:20,color:"#B0B8C8",cursor:"pointer",lineHeight:1}}>×</button>
          </div>

          {/* Assignees — multi-select */}
          <div style={{padding:"16px 24px",borderBottom:"1px solid #F0F1F5"}}>
            <div style={{fontSize:11,fontWeight:600,color:"#8890A0",textTransform:"uppercase",letterSpacing:0.8,marginBottom:10}}>Atribuído a</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {members.map(m=>{
                const selected = assignees.includes(m.id);
                return (
                  <button key={m.id} onClick={()=>toggleAssignee(m.id)}
                    style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:20,
                      border:`1px solid ${selected?m.color:"#E8EAF0"}`,
                      background:selected?m.color+"20":"#fff",
                      color:selected?m.color:"#4A5568",fontSize:12,cursor:"pointer",
                      fontWeight:selected?600:400,transition:"all 0.15s"}}>
                    <div style={{width:16,height:16,borderRadius:"50%",background:m.color,display:"flex",
                      alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"#fff"}}>{getInitials(m.name)}</div>
                    {m.name}
                    {selected&&<span style={{fontSize:12}}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deadline */}
          <div style={{padding:"16px 24px",borderBottom:"1px solid #F0F1F5"}}>
            <div style={{fontSize:11,fontWeight:600,color:"#8890A0",textTransform:"uppercase",letterSpacing:0.8,marginBottom:10}}>Data limite</div>
            <input type="date" value={openTask.deadline} onChange={e=>setField(openTask.id,"deadline",e.target.value)}
              style={{padding:"8px 12px",border:"1px solid #E8EAF0",borderRadius:8,fontSize:13,
                color:"#1A2233",outline:"none",width:"100%",boxSizing:"border-box",cursor:"pointer"}}/>
            {openTask.deadline&&(()=>{
              const days=daysUntil(openTask.deadline),urg=urgencyLabel(days,openTask.done);
              return <div style={{marginTop:6,fontSize:12,color:urg?urg.color:"#00B894",fontWeight:600}}>
                {urg?`⚠️ ${urg.text} — `:"✓ "}{formatDateFull(openTask.deadline)}
              </div>;
            })()}
          </div>

          {/* Comments */}
          <div style={{padding:"16px 24px",flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
            <div style={{fontSize:11,fontWeight:600,color:"#8890A0",textTransform:"uppercase",letterSpacing:0.8,marginBottom:12}}>
              Comentários ({openTask.comments.length})
            </div>
            <div style={{flex:1,overflowY:"auto",marginBottom:12}}>
              {openTask.comments.length===0&&<div style={{color:"#C0C8D8",fontSize:13,textAlign:"center",marginTop:20}}>Sem comentários ainda.</div>}
              {openTask.comments.map(c=>(
                <div key={c.id} style={{marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:"#6C5CE7",display:"flex",
                      alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{getInitials(c.author)}</div>
                    <span style={{fontSize:12,fontWeight:600,color:"#1A2233"}}>{c.author}</span>
                    <span style={{fontSize:11,color:"#B0B8C8"}}>{new Date(c.time).toLocaleDateString("pt-PT",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                  <div style={{marginLeft:32,background:"#F7F8FC",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#4A5568",lineHeight:1.5}}>
                    {renderCommentText(c.text)}
                  </div>
                </div>
              ))}
            </div>

            {/* Comment input with @mention */}
            <div style={{position:"relative"}}>
              {showMentions && filteredMembers.length>0 && (
                <div style={{position:"absolute",bottom:"100%",left:0,right:0,background:"#fff",
                  border:"1px solid #E8EAF0",borderRadius:8,boxShadow:"0 4px 16px #00000015",
                  marginBottom:4,zIndex:10,overflow:"hidden"}}>
                  {filteredMembers.map(m=>(
                    <div key={m.id} onClick={()=>insertMention(m)}
                      style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",cursor:"pointer",transition:"background 0.1s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#F7F8FC"}
                      onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:m.color,display:"flex",
                        alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>{getInitials(m.name)}</div>
                      <span style={{fontSize:13,color:"#1A2233",fontWeight:500}}>{m.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                <div style={{flex:1,position:"relative"}}>
                  <textarea
                    ref={commentRef}
                    value={newComment}
                    onChange={handleCommentChange}
                    onKeyDown={e=>{
                      if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();addComment(openTask.id);}
                      if(e.key==="Escape") setShowMentions(false);
                    }}
                    placeholder="Escreve um comentário... (usa @ para mencionar alguém)"
                    rows={2}
                    style={{width:"100%",padding:"9px 12px",border:"1px solid #E8EAF0",borderRadius:8,
                      fontSize:13,outline:"none",color:"#1A2233",resize:"none",boxSizing:"border-box",
                      fontFamily:"inherit",lineHeight:1.5}}
                  />
                  <div style={{fontSize:10,color:"#C0C8D8",marginTop:2}}>Enter para enviar · Shift+Enter para nova linha</div>
                </div>
                <button onClick={()=>addComment(openTask.id)}
                  style={{background:"#6C5CE7",border:"none",borderRadius:8,padding:"10px 14px",
                    color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",flexShrink:0,marginBottom:16}}>→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",height:"100vh",background:"#F7F8FC",overflow:"hidden"}}>
      {/* SIDEBAR */}
      <div style={{width:252,background:"#0F1923",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"22px 18px 16px",borderBottom:"1px solid #ffffff10"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:32,height:32,background:"linear-gradient(135deg,#6C5CE7,#00B894)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🚀</div>
            <div>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,letterSpacing:"-0.3px"}}>LaunchBoard</div>
              <div style={{color:"#ffffff50",fontSize:11}}>Gestão de Lançamento</div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{color:"#ffffff60",fontSize:11}}>Progresso geral</span>
            <span style={{color:"#00B894",fontSize:11,fontWeight:700}}>{progress}%</span>
          </div>
          <div style={{height:4,background:"#ffffff15",borderRadius:99}}>
            <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#6C5CE7,#00B894)",borderRadius:99,transition:"width 0.5s"}}/>
          </div>
          <div style={{color:"#ffffff30",fontSize:10,marginTop:4}}>{totalDone}/{tasks.length} concluídas</div>
        </div>
        <div style={{padding:"10px 10px 4px"}}>
          <button onClick={()=>setView("dashboard")}
            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:8,
              border:"none",cursor:"pointer",background:view==="dashboard"?"#6C5CE720":"transparent"}}>
            <span style={{fontSize:14}}>🏠</span>
            <span style={{color:view==="dashboard"?"#fff":"#ffffff70",fontSize:12,fontWeight:view==="dashboard"?600:400}}>Dashboard</span>
          </button>
        </div>
        <div style={{padding:"4px 10px",flex:1,overflowY:"auto"}}>
          <div style={{color:"#ffffff25",fontSize:10,fontWeight:600,letterSpacing:1,padding:"4px 10px 6px",textTransform:"uppercase"}}>Fases</div>
          {phases.map(p=>{
            const done=doneByPhase(p.id),total=totalByPhase(p.id),pct=total>0?Math.round((done/total)*100):0,isActive=p.id===view;
            return (
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:4,marginBottom:1}}>
                <button onClick={()=>setView(p.id)}
                  style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,border:"none",cursor:"pointer",background:isActive?p.color+"22":"transparent"}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:p.color,flexShrink:0,opacity:isActive?1:0.5}}/>
                  <div style={{flex:1,textAlign:"left"}}>
                    <div style={{color:isActive?"#fff":"#ffffff65",fontSize:12,fontWeight:isActive?600:400,lineHeight:1.3}}>{p.label}</div>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                      <div style={{flex:1,height:2,background:"#ffffff10",borderRadius:99}}>
                        <div style={{height:"100%",width:`${pct}%`,background:p.color,borderRadius:99}}/>
                      </div>
                      <span style={{color:"#ffffff35",fontSize:10}}>{done}/{total}</span>
                    </div>
                  </div>
                </button>
                <button onClick={()=>setConfirmDeletePhase(p)}
                  style={{background:"none",border:"none",cursor:"pointer",color:"#ffffff20",fontSize:14,padding:"2px 4px",lineHeight:1,flexShrink:0}}
                  onMouseEnter={e=>e.currentTarget.style.color="#E74C3C"}
                  onMouseLeave={e=>e.currentTarget.style.color="#ffffff20"}>×</button>
              </div>
            );
          })}
          <button onClick={()=>setShowAddPhase(true)}
            style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",background:"none",
              border:"1px dashed #ffffff20",borderRadius:8,color:"#ffffff40",fontSize:12,cursor:"pointer",width:"100%",marginTop:6}}>
            <span style={{fontSize:16,lineHeight:1}}>+</span> Nova fase
          </button>
        </div>
        <div style={{padding:"10px 10px 18px",borderTop:"1px solid #ffffff10"}}>
          <div style={{color:"#ffffff25",fontSize:10,fontWeight:600,letterSpacing:1,padding:"4px 10px 8px",textTransform:"uppercase"}}>Equipa</div>
          {members.map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 10px"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff",flexShrink:0}}>{getInitials(m.name)}</div>
              <span style={{color:"#ffffff65",fontSize:12}}>{m.name}</span>
            </div>
          ))}
          {showAddMember?(
            <div style={{padding:"6px 10px",display:"flex",gap:6}}>
              <input value={newMemberName} onChange={e=>setNewMemberName(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter")addMember();if(e.key==="Escape")setShowAddMember(false);}}
                placeholder="Nome..." autoFocus
                style={{flex:1,background:"#ffffff15",border:"none",borderRadius:6,padding:"5px 8px",color:"#fff",fontSize:12,outline:"none"}}/>
              <button onClick={addMember} style={{background:"#6C5CE7",border:"none",borderRadius:6,padding:"5px 9px",color:"#fff",fontSize:11,cursor:"pointer"}}>+</button>
            </div>
          ):(
            <button onClick={()=>setShowAddMember(true)}
              style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",background:"none",border:"none",color:"#ffffff30",fontSize:12,cursor:"pointer"}}>
              <span style={{fontSize:16,lineHeight:1}}>+</span> Adicionar pessoa
            </button>
          )}
        </div>
        <div style={{padding:"8px 18px",borderTop:"1px solid #ffffff08",fontSize:10,color:saving?"#6C5CE7":"#ffffff25",textAlign:"center"}}>
          {saving?"💾 A guardar...":"✓ Sincronizado"}
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:"#fff",borderBottom:"1px solid #E8EAF0",padding:"14px 28px",display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
          {view==="dashboard"?(
            <><span style={{fontSize:18}}>🏠</span><h1 style={{margin:0,fontSize:17,fontWeight:700,color:"#0F1923"}}>Dashboard</h1></>
          ):(
            <>
              <div style={{width:10,height:10,borderRadius:"50%",background:activePhase?.color}}/>
              <h1 style={{margin:0,fontSize:17,fontWeight:700,color:"#0F1923"}}>{activePhase?.label}</h1>
              <div style={{background:activePhase?.color+"20",color:activePhase?.color,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99}}>
                {doneByPhase(view)}/{totalByPhase(view)} feitas
              </div>
              <div style={{flex:1}}/>
              <div style={{display:"flex",background:"#F0F1F5",borderRadius:8,padding:3,gap:2}}>
                {[["all","Todas"],["pending","Por fazer"],["done","Concluídas"]].map(([val,lbl])=>(
                  <button key={val} onClick={()=>setFilter(val)}
                    style={{padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:500,
                      background:filter===val?"#fff":"transparent",color:filter===val?"#0F1923":"#8890A0",
                      boxShadow:filter===val?"0 1px 3px #00000015":"none"}}>
                    {lbl}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {view==="dashboard"?<Dashboard/>:<PhaseView/>}
      </div>

      <TaskPanel/>

      {/* Add phase modal */}
      {showAddPhase&&(
        <div style={{position:"fixed",inset:0,background:"#00000050",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAddPhase(false)}>
          <div style={{background:"#fff",borderRadius:16,padding:"28px",width:360,boxShadow:"0 20px 60px #00000030"}} onClick={e=>e.stopPropagation()}>
            <h3 style={{margin:"0 0 20px",fontSize:16,fontWeight:700,color:"#0F1923"}}>Nova Fase</h3>
            <input value={newPhaseName} onChange={e=>setNewPhaseName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addPhase()}
              placeholder="Nome da fase..." autoFocus
              style={{width:"100%",padding:"10px 12px",border:"1px solid #E8EAF0",borderRadius:8,fontSize:14,outline:"none",color:"#1A2233",boxSizing:"border-box",marginBottom:16}}/>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:600,color:"#8890A0",marginBottom:8}}>Cor</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {PHASE_COLORS.map(c=>(
                  <div key={c} onClick={()=>setNewPhaseColor(c)}
                    style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:`3px solid ${newPhaseColor===c?"#0F1923":"transparent"}`}}/>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={addPhase} style={{flex:1,background:newPhaseColor,border:"none",borderRadius:8,padding:"10px",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>Criar Fase</button>
              <button onClick={()=>setShowAddPhase(false)} style={{background:"#F0F1F5",border:"none",borderRadius:8,padding:"10px 16px",color:"#8890A0",fontSize:14,cursor:"pointer"}}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete phase */}
      {confirmDeletePhase&&(
        <div style={{position:"fixed",inset:0,background:"#00000050",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setConfirmDeletePhase(null)}>
          <div style={{background:"#fff",borderRadius:16,padding:"28px",width:360,boxShadow:"0 20px 60px #00000030"}} onClick={e=>e.stopPropagation()}>
            <h3 style={{margin:"0 0 10px",fontSize:16,fontWeight:700,color:"#0F1923"}}>Eliminar fase?</h3>
            <p style={{margin:"0 0 20px",fontSize:13,color:"#8890A0",lineHeight:1.5}}>
              Vais eliminar <strong style={{color:"#0F1923"}}>{confirmDeletePhase.label}</strong> e todas as suas tarefas ({totalByPhase(confirmDeletePhase.id)}). Esta ação não pode ser desfeita.
            </p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>deletePhase(confirmDeletePhase.id)} style={{flex:1,background:"#E74C3C",border:"none",borderRadius:8,padding:"10px",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>Eliminar</button>
              <button onClick={()=>setConfirmDeletePhase(null)} style={{background:"#F0F1F5",border:"none",borderRadius:8,padding:"10px 16px",color:"#8890A0",fontSize:14,cursor:"pointer"}}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
