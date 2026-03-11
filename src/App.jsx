import { useState, useMemo, useEffect } from "react";
import Access from "./Access.jsx";
import { SESSION_HOURS } from "./config.js";

// ─── COLORES CORPORATIVOS ACSA ────────────────────────────────────────────────
const C = {
  b1:"#E8621A", b1l:"#FEF0E8",
  b2:"#2E72B8", b2l:"#E8F1FB",
  b3:"#892D75", b3l:"#F5E8F2",
  gi:"#1A6B3C", gil:"#E8F5EE",
  gii:"#0D5C94", giil:"#E3F0FA",
  giii:"#7A3085", giiil:"#F3E8F7",
  oblig:"#C0392B", obligl:"#FDECEA",
  ap:"#006B54", apl:"#E6F4F0",
  txt:"#1A2332", muted:"#6B7A90",
  bg:"#F2F4F8", card:"#FFFFFF", border:"#E0E5EE",
};

const BLOQUES = [
  { id:0, nombre:"Panel",           icon:"◉", color:C.b2,  light:C.b2l },
  { id:1, nombre:"Gestión",         icon:"⚙", color:C.b1,  light:C.b1l },
  { id:2, nombre:"Atención",        icon:"♥", color:C.b2,  light:C.b2l },
  { id:3, nombre:"Seguridad",       icon:"⛨", color:C.b3,  light:C.b3l },
];
const BLOQUE_FULL = ["","Gestión de la Unidad","Atención centrada en el paciente","Seguridad"];

const CRITERIOS = [
  { id:1, bloque:1, nombre:"Liderazgo y organización de la unidad" },
  { id:2, bloque:1, nombre:"Gestión por procesos asistenciales" },
  { id:3, bloque:2, nombre:"Derechos del paciente y continuidad asistencial" },
  { id:4, bloque:2, nombre:"Calidad científico-técnica" },
  { id:5, bloque:3, nombre:"Seguridad del paciente" },
  { id:6, bloque:3, nombre:"Soporte" },
];

const ES = [
  // C1
  {id:"ES5_01.01",c:1,g:1,o:false,ap:false,t:"La unidad tiene definido su modelo de gobierno clínico."},
  {id:"ES5_01.02",c:1,g:1,o:true, ap:false,t:"La unidad evalúa periódicamente los objetivos pactados con su institución e implica a los profesionales en su consecución."},
  {id:"ES5_01.03",c:1,g:1,o:true, ap:false,t:"La unidad dispone de un cuadro de mando que le aporta la información necesaria para la toma de decisiones."},
  {id:"ES5_01.04",c:1,g:1,o:true, ap:false,t:"La unidad cumple los objetivos presupuestarios pactados con la institución."},
  {id:"ES5_01.05",c:1,g:1,o:false,ap:false,t:"La unidad dispone de un sistema de gestión documental."},
  {id:"ES5_01.06",c:1,g:1,o:false,ap:false,t:"La unidad ha elaborado un plan de calidad."},
  {id:"ES5_01.07",c:1,g:2,o:false,ap:false,t:"La unidad lleva a cabo auditorías internas para comprobar el grado de cumplimiento de su plan de calidad."},
  {id:"ES5_01.08",c:1,g:2,o:false,ap:false,t:"La unidad elabora y difunde una memoria anual de actividades."},
  {id:"ES5_01.09",c:1,g:3,o:false,ap:false,t:"La unidad compara sus resultados con los de otras unidades y/o con los considerados mejores del sector (benchmarking)."},
  {id:"ES5_01.10",c:1,g:1,o:true, ap:false,t:"La unidad ha definido las funciones y responsabilidades de los puestos de trabajo."},
  {id:"ES5_01.11",c:1,g:2,o:false,ap:false,t:"La Dirección de la unidad gestiona sus recursos humanos de la forma más eficaz posible."},
  {id:"ES5_01.12",c:1,g:1,o:false,ap:false,t:"La unidad elabora un plan de formación en función de las necesidades formativas de los profesionales y de sus objetivos estratégicos."},
  {id:"ES5_01.13",c:1,g:1,o:true, ap:false,t:"La unidad explora y analiza la satisfacción percibida por sus pacientes, familiares y/o cuidadores."},
  {id:"ES5_01.14",c:1,g:1,o:true, ap:false,t:"La unidad utiliza las reclamaciones como fuente de información para la mejora de su organización y funcionamiento."},
  {id:"ES5_01.15",c:1,g:2,o:false,ap:false,t:"La unidad adopta un papel de captación activa de las sugerencias realizadas por los pacientes, familiares y/o cuidadores."},
  {id:"ES5_01.16",c:1,g:2,o:false,ap:false,t:"La unidad utiliza el clima laboral como un elemento de desarrollo organizativo."},
  {id:"ES5_01.17",c:1,g:3,o:false,ap:false,t:"La unidad analiza la satisfacción percibida por sus clientes internos e implanta mejoras."},
  // C2
  {id:"ES5_02.01",c:2,g:1,o:true, ap:true, apn:"En A.P. se implantarán al menos 3 procesos asistenciales.", t:"La unidad tiene implantada la gestión por procesos asistenciales."},
  {id:"ES5_02.02",c:2,g:1,o:false,ap:false,t:"La unidad cumple los indicadores de los procesos asistenciales implantados y establece nuevos objetivos."},
  {id:"ES5_02.03",c:2,g:2,o:false,ap:false,t:"La unidad selecciona el tratamiento farmacológico y/o quirúrgico de los procesos asistenciales y evalúa la adhesión de los profesionales."},
  {id:"ES5_02.04",c:2,g:2,o:false,ap:false,t:"La unidad mejora la eficiencia de sus procesos asistenciales."},
  {id:"ES5_02.05",c:2,g:3,o:false,ap:false,t:"La unidad tiene en cuenta la experiencia del paciente en la mejora de los procesos asistenciales."},
  // C3
  {id:"ES5_03.01",c:3,g:1,o:false,ap:false,t:"La unidad planifica e implementa acciones que promueven la mejora de la humanización de la asistencia sanitaria."},
  {id:"ES5_03.02",c:3,g:1,o:true, ap:false,t:"La unidad respeta la intimidad del paciente y la confidencialidad de su información clínica y personal a lo largo de todo el proceso de atención."},
  {id:"ES5_03.03",c:3,g:1,o:true, ap:false,t:"La unidad informa a los pacientes de todos los aspectos relacionados con su problema de salud."},
  {id:"ES5_03.04",c:3,g:1,o:true, ap:false,t:"La unidad utiliza el formulario de consentimiento informado ante intervenciones con criterios intrínsecos de riesgo."},
  {id:"ES5_03.05",c:3,g:1,o:true, ap:false,t:"La unidad garantiza el cumplimiento de la voluntad vital anticipada del paciente."},
  {id:"ES5_03.06",c:3,g:3,o:false,ap:false,t:"La unidad utiliza herramientas de ayuda a la toma de decisiones para potenciar la autonomía del paciente."},
  {id:"ES5_03.07",c:3,g:1,o:true, ap:false,t:"La unidad garantiza la resolución de los conflictos éticos surgidos en el proceso de atención sanitaria."},
  {id:"ES5_03.08",c:3,g:1,o:true, ap:false,t:"La unidad lleva a cabo acciones que mejoran la accesibilidad de los pacientes, familiares y/o cuidadores a sus servicios."},
  {id:"ES5_03.09",c:3,g:1,o:false,ap:true, apn:"En A.P.: se cumplen los tiempos de respuesta de consulta médica y consulta telefónica definidos por la propia unidad.", t:"La unidad cumple los tiempos de respuesta de los procesos incluidos en su cartera de servicios y establece nuevos objetivos."},
  {id:"ES5_03.10",c:3,g:1,o:true, ap:false,t:"La unidad garantiza la existencia de una historia de salud única por paciente."},
  {id:"ES5_03.11",c:3,g:1,o:false,ap:false,t:"La unidad evalúa periódicamente el nivel de calidad y cumplimentación de las historias de salud."},
  {id:"ES5_03.12",c:3,g:1,o:true, ap:false,t:"La unidad establece un plan asistencial adecuado a las necesidades del paciente."},
  {id:"ES5_03.13",c:3,g:1,o:false,ap:false,t:"La unidad facilita el acceso a los recursos de apoyo necesarios para el paciente y/o su cuidador."},
  {id:"ES5_03.14",c:3,g:1,o:false,ap:false,t:"La unidad identifica a los pacientes que tienen un mayor riesgo de incumplimiento de su plan asistencial."},
  {id:"ES5_03.15",c:3,g:1,o:false,ap:false,t:"La unidad dispone de información sobre las desprogramaciones y suspensiones de actividad programada y adopta medidas para disminuirlas."},
  {id:"ES5_03.16",c:3,g:2,o:false,ap:false,t:"La unidad ha definido y consensuado con otras unidades los criterios de derivación de los pacientes."},
  {id:"ES5_03.17",c:3,g:2,o:false,ap:false,t:"La unidad realiza interconsultas a otras unidades para garantizar la continuidad del proceso asistencial del paciente."},
  // C4
  {id:"ES5_04.01",c:4,g:1,o:false,ap:false,t:"La unidad garantiza una atención sanitaria de calidad mediante prácticas basadas en la evidencia."},
  {id:"ES5_04.02",c:4,g:2,o:false,ap:false,t:"La unidad evalúa el nivel de adherencia de los profesionales a las recomendaciones sobre la práctica clínica implantadas."},
  {id:"ES5_04.03",c:4,g:1,o:false,ap:false,t:"Los profesionales de la unidad colaboran en los Comités y Comisiones de la institución y aplican sus recomendaciones, decisiones y protocolos."},
  {id:"ES5_04.04",c:4,g:2,o:false,ap:false,t:"La unidad realiza actividades de prevención primaria y secundaria basadas en la mejor evidencia disponible."},
  {id:"ES5_04.05",c:4,g:1,o:false,ap:false,t:"La unidad realiza actividades de prevención terciaria basadas en la mejor evidencia disponible."},
  {id:"ES5_04.06",c:4,g:1,o:true, ap:false,t:"La unidad realiza un abordaje específico del dolor."},
  {id:"ES5_04.07",c:4,g:2,o:false,ap:false,t:"La unidad desarrolla líneas propias de investigación o en colaboración con otros servicios."},
  {id:"ES5_04.08",c:4,g:3,o:false,ap:false,t:"La unidad dispone de proyectos de investigación o innovación financiados y avalados por agencias externas."},
  {id:"ES5_04.09",c:4,g:3,o:false,ap:false,t:"La unidad forma parte de grupos de investigación con proyectos integrados en redes temáticas, proyectos internacionales y/o grupos coordinados."},
  {id:"ES5_04.10",c:4,g:2,o:false,ap:false,t:"La unidad publica los resultados de su actividad investigadora en revistas científicas con factor de impacto."},
  // C5
  {id:"ES5_05.01",c:5,g:1,o:true, ap:false,t:"La unidad realiza una gestión proactiva de los riesgos para la seguridad del paciente."},
  {id:"ES5_05.02",c:5,g:1,o:true, ap:false,t:"La unidad realiza una gestión reactiva de los riesgos para la seguridad del paciente."},
  {id:"ES5_05.03",c:5,g:1,o:false,ap:false,t:"La unidad analiza los riesgos e incidentes relacionados con la seguridad del paciente y pone en marcha actuaciones para prevenir su nueva aparición."},
  {id:"ES5_05.04",c:5,g:2,o:false,ap:false,t:"La unidad desarrolla estrategias de actuación ante la ocurrencia de eventos adversos graves."},
  {id:"ES5_05.05",c:5,g:1,o:true, ap:false,t:"La unidad tiene implantado un procedimiento de identificación inequívoca del paciente y de las muestras para pruebas diagnósticas."},
  {id:"ES5_05.06",c:5,g:1,o:true, ap:false,t:"La unidad tiene incorporadas buenas prácticas para prevenir y controlar las infecciones asociadas a la asistencia sanitaria."},
  {id:"ES5_05.07",c:5,g:1,o:true, ap:false,t:"La unidad tiene implantado un procedimiento para garantizar las condiciones de conservación de los medicamentos y productos sanitarios."},
  {id:"ES5_05.08",c:5,g:1,o:true, ap:false,t:"La unidad almacena los medicamentos y productos sanitarios en condiciones óptimas para evitar riesgos en la seguridad del paciente."},
  {id:"ES5_05.09",c:5,g:1,o:false,ap:true, apn:"En A.P.: se aplica un procedimiento para la revisión de tratamientos farmacológicos en pacientes crónicos y polimedicados.", t:"La unidad garantiza la adecuación de los tratamientos farmacológicos, especialmente en pacientes de riesgo."},
  {id:"ES5_05.10",c:5,g:1,o:true, ap:false,t:"La unidad garantiza la correcta preparación y administración de los medicamentos."},
  {id:"ES5_05.11",c:5,g:1,o:false,ap:false,t:"La unidad incorpora otras buenas prácticas para prevenir incidentes de seguridad del paciente."},
  {id:"ES5_05.12",c:5,g:2,o:false,ap:false,t:"La unidad cumple los indicadores de seguridad del paciente."},
  {id:"ES5_05.13",c:5,g:3,o:false,ap:false,t:"La unidad promueve la implicación de los pacientes y de la ciudadanía en la prevención de riesgos asociados a sus procesos de atención."},
  // C6
  {id:"ES5_06.01",c:6,g:1,o:true, ap:false,t:"La unidad conoce el estado de las condiciones de mantenimiento y seguridad de las instalaciones que utiliza para realizar su actividad asistencial."},
  {id:"ES5_06.02",c:6,g:1,o:true, ap:false,t:"La unidad garantiza la utilización segura del equipamiento electromédico que utilizan sus profesionales."},
  {id:"ES5_06.03",c:6,g:1,o:false,ap:false,t:"La unidad garantiza la accesibilidad física de los pacientes y familiares."},
  {id:"ES5_06.04",c:6,g:1,o:false,ap:false,t:"La unidad garantiza el correcto estado y seguridad de su almacén y de su contenido."},
  {id:"ES5_06.05",c:6,g:2,o:false,ap:false,t:"La unidad conoce los criterios de calidad de los servicios que le prestan apoyo y comunica las desviaciones detectadas."},
  {id:"ES5_06.06",c:6,g:1,o:true, ap:false,t:"La unidad conoce los riesgos que pueden afectar a los profesionales en cada puesto de trabajo."},
  {id:"ES5_06.07",c:6,g:1,o:true, ap:false,t:"La unidad participa en el mantenimiento de la salud y seguridad de sus profesionales."},
  {id:"ES5_06.08",c:6,g:1,o:true, ap:false,t:"La unidad tiene establecidas las medidas de seguridad ante emergencias y son conocidas por los profesionales."},
  {id:"ES5_06.09",c:6,g:1,o:true, ap:false,t:"La unidad tiene establecidos los procedimientos para la correcta gestión de los residuos generados y para la actuación ante derrames o vertidos de productos tóxicos."},
  {id:"ES5_06.10",c:6,g:2,o:false,ap:false,t:"La unidad contribuye al compromiso de minimización de la generación de residuos de su institución."},
  {id:"ES5_06.11",c:6,g:3,o:false,ap:false,t:"La unidad implanta los procedimientos para el control de los principales impactos ambientales de acuerdo a la política ambiental de su institución."},
  {id:"ES5_06.12",c:6,g:2,o:false,ap:false,t:"Se define y mantiene una estrategia dirigida al mantenimiento y mejora de la estructura, funcionalidad, instalaciones y equipamiento de la unidad."},
  {id:"ES5_06.13",c:6,g:1,o:false,ap:false,t:"La unidad tiene definida la forma de actuar en caso de caída de sus sistemas de información."},
  {id:"ES5_06.14",c:6,g:1,o:true, ap:true, apn:"En A.P.: se dispone de mecanismos para informar sobre el derecho de acceso, rectificación, supresión, oposición, limitación y portabilidad de datos.", t:"La unidad adopta medidas para garantizar la protección de los datos de carácter personal conforme a lo establecido en la normativa vigente."},
];

// ── LÓGICA ────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "acsa_estados_v1";

function calcStats(est) {
  const gi=ES.filter(e=>e.g===1), gii=ES.filter(e=>e.g===2), giii=ES.filter(e=>e.g===3);
  const oblig=ES.filter(e=>e.o), apArr=ES.filter(e=>e.ap);
  const cum=arr=>arr.filter(e=>est[e.id]==="cumple").length;
  const pct=(n,d)=>d===0?0:Math.round(n/d*100);
  const giC=cum(gi),giiC=cum(gii),giiiC=cum(giii),obligC=cum(oblig);
  const giP=pct(giC,gi.length),giiP=pct(giiC,gii.length),giiiP=pct(giiiC,giii.length);
  const obligAll=obligC===oblig.length;
  let nivel="Sin certificar";
  if(obligAll){
    if(giP>=100&&giiP>=100&&giiiP>40) nivel="Excelente";
    else if(giP>=100&&giiP>40) nivel="Óptimo";
    else if(giP>70) nivel="Avanzado";
  }
  return{gi,gii,giii,oblig,apArr,giC,giiC,giiiC,obligC,
         giP,giiP,giiiP,obligAll,nivel,
         total:ES.length,totalC:cum(ES),apC:cum(apArr)};
}
function critS(cid,est){
  const arr=ES.filter(e=>e.c===cid);
  const cum=arr.filter(e=>est[e.id]==="cumple").length;
  const noc=arr.filter(e=>est[e.id]==="no_cumple").length;
  return{cum,noc,pend:arr.length-cum-noc,total:arr.length,pct:Math.round(cum/arr.length*100)};
}
function bloqS(bid,est){
  const ids=CRITERIOS.filter(c=>c.bloque===bid).map(c=>c.id);
  const arr=ES.filter(e=>ids.includes(e.c));
  const cum=arr.filter(e=>est[e.id]==="cumple").length;
  const noc=arr.filter(e=>est[e.id]==="no_cumple").length;
  return{cum,noc,pend:arr.length-cum-noc,total:arr.length,pct:Math.round(cum/arr.length*100)};
}
const CYCLE={pendiente:"cumple",cumple:"no_cumple",no_cumple:"pendiente"};
const ST={
  cumple:   {bg:C.gil,  color:C.gi,   border:"#57C47C",icon:"✓"},
  no_cumple:{bg:C.obligl,color:C.oblig,border:"#E57373",icon:"✗"},
  pendiente:{bg:"#F7F8FA",color:"#9AA3B2",border:C.border,icon:"○"},
};

// ── MICRO COMPONENTES ─────────────────────────────────────────────────────────
function Gauge({v,size=72,sw=7,color,bg=C.border}){
  const r=(size-sw*2)/2,circ=2*Math.PI*r,dash=Math.max(0,v/100)*circ;
  return(
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",display:"block"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{transition:"stroke-dasharray .45s ease"}}/>
    </svg>
  );
}
function GCard({v,color,light,label,sub}){
  return(
    <div style={{background:C.card,borderRadius:12,padding:"12px 8px",
      boxShadow:"0 1px 5px rgba(0,0,0,.07)",textAlign:"center",
      border:`1.5px solid ${light}`,flex:1}}>
      <div style={{position:"relative",width:72,margin:"0 auto 5px"}}>
        <Gauge v={v} color={color} bg={light}/>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:14,fontWeight:800,color,fontFamily:"'DM Mono',monospace"}}>{v}%</span>
        </div>
      </div>
      <div style={{fontSize:10,fontWeight:700,color,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</div>
      {sub&&<div style={{fontSize:10,color:C.muted,marginTop:1}}>{sub}</div>}
    </div>
  );
}
function Bar({v,color,h=6}){
  return(
    <div style={{background:C.border,borderRadius:99,height:h,overflow:"hidden",flex:1}}>
      <div style={{background:color,height:"100%",width:`${Math.max(0,v)}%`,borderRadius:99,transition:"width .4s ease"}}/>
    </div>
  );
}
function NivelChip({nivel}){
  const m={
    "Avanzado":{bg:"#FFF5DC",color:"#A06000",border:"#F0C040",ico:"▲"},
    "Óptimo":{bg:C.gil,color:C.gi,border:"#57C47C",ico:"✦"},
    "Excelente":{bg:"#F3EDFC",color:"#6B25C0",border:"#A67DE6",ico:"★"},
    "Sin certificar":{bg:"#F2F4F8",color:C.muted,border:C.border,ico:"○"},
  };
  const s=m[nivel]||m["Sin certificar"];
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:5,
      background:s.bg,color:s.color,border:`2px solid ${s.border}`,
      borderRadius:20,padding:"5px 14px",fontWeight:700,fontSize:13,
      fontFamily:"'DM Mono',monospace",letterSpacing:".04em"}}>
      {s.ico} {nivel}
    </span>
  );
}
function Oblig(){
  return <span style={{fontSize:9,fontWeight:900,letterSpacing:".1em",
    background:C.obligl,color:C.oblig,border:`1.5px solid ${C.oblig}88`,
    borderRadius:4,padding:"2px 6px",textTransform:"uppercase",whiteSpace:"nowrap"}}>★ OBLIGATORIO</span>;
}
function APBadge(){
  return <span style={{fontSize:9,fontWeight:900,letterSpacing:".08em",
    background:C.apl,color:C.ap,border:`1.5px solid ${C.ap}88`,
    borderRadius:4,padding:"2px 6px",textTransform:"uppercase",whiteSpace:"nowrap"}}>⌂ A. PRIMARIA</span>;
}
function GBadge({g}){
  const m={1:{bg:C.gil,c:C.gi,l:"G·I"},2:{bg:C.giil,c:C.gii,l:"G·II"},3:{bg:C.giiil,c:C.giii,l:"G·III"}};
  const s=m[g];
  return <span style={{fontSize:9,fontWeight:800,letterSpacing:".06em",
    background:s.bg,color:s.c,borderRadius:4,padding:"2px 6px",
    border:`1px solid ${s.c}33`,fontFamily:"'DM Mono',monospace"}}>{s.l}</span>;
}
function ERow({e,estado,onToggle}){
  const est=estado||"pendiente", s=ST[est];
  return(
    <div onClick={()=>onToggle(e.id)}
      style={{display:"flex",gap:10,padding:"11px 13px",borderRadius:10,
        cursor:"pointer",border:`1.5px solid ${s.border}`,background:s.bg,
        transition:"border-color .1s",userSelect:"none"}}>
      <div style={{fontSize:18,color:s.color,fontWeight:900,minWidth:20,
        lineHeight:1.35,fontFamily:"'DM Mono',monospace",marginTop:1}}>{s.icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,color:C.txt,lineHeight:1.55}}>{e.t}</div>
        {e.ap&&e.apn&&(
          <div style={{marginTop:6,fontSize:11,color:C.ap,background:C.apl,
            borderRadius:6,padding:"5px 9px",border:`1px solid ${C.ap}33`,
            lineHeight:1.5,display:"flex",gap:5}}>
            <span>⌂</span><span>{e.apn}</span>
          </div>
        )}
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6,alignItems:"center"}}>
          <span style={{fontSize:9,color:"#B0B8C8",fontFamily:"'DM Mono',monospace",
            background:"#F2F4F8",padding:"2px 6px",borderRadius:4}}>{e.id}</span>
          <GBadge g={e.g}/>
          {e.o&&<Oblig/>}
          {e.ap&&<APBadge/>}
        </div>
      </div>
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  // ── Autenticación ──
  const [auth, setAuth] = useState(() => {
    try {
      const saved = sessionStorage.getItem("acsa_auth");
      if (!saved) return false;
      const { ts } = JSON.parse(saved);
      if (SESSION_HOURS > 0 && Date.now() - ts > SESSION_HOURS * 3600000) return false;
      return true;
    } catch { return false; }
  });

  const handleGranted = () => {
    sessionStorage.setItem("acsa_auth", JSON.stringify({ ts: Date.now() }));
    setAuth(true);
  };

  // ── Estado estándares (persistido) ──
  const [est, setEst] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(est)); } catch {}
  }, [est]);

  // ── UI state ──
  const [tab,    setTab]    = useState(0);
  const [fG,     setFG]     = useState(0);
  const [fAP,    setFAP]    = useState(false);
  const [fOb,    setFOb]    = useState(false);
  const [q,      setQ]      = useState("");
  const [openC,  setOpenC]  = useState(null);

  const stats = useMemo(() => calcStats(est), [est]);
  const toggle = id => setEst(p => ({ ...p, [id]: CYCLE[p[id]||"pendiente"] }));
  const markAll = (arr, v) => setEst(p => { const n={...p}; arr.forEach(e=>{n[e.id]=v;}); return n; });

  const applyFilters = arr => {
    let r = arr;
    if (fG)  r = r.filter(e => e.g === fG);
    if (fAP) r = r.filter(e => e.ap);
    if (fOb) r = r.filter(e => e.o);
    if (q.trim()) { const lq=q.toLowerCase(); r=r.filter(e=>e.t.toLowerCase().includes(lq)||e.id.toLowerCase().includes(lq)); }
    return r;
  };

  if (!auth) return <Access onGranted={handleGranted} />;

  // ── PANEL RESUMEN ─────────────────────────────────────────────────────────
  const PanelResumen = () => (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Hero */}
      <div style={{borderRadius:14,background:"linear-gradient(135deg,#142A48 0%,#2E72B8 100%)",padding:"20px 18px",color:"#fff"}}>
        <div style={{fontSize:10,opacity:.6,textTransform:"uppercase",letterSpacing:".15em",marginBottom:8}}>
          Unidades · Atención Primaria · ACSA
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontSize:11,opacity:.75,marginBottom:5}}>Nivel de certificación</div>
            <NivelChip nivel={stats.nivel}/>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:36,fontWeight:900,lineHeight:1,fontFamily:"'DM Mono',monospace"}}>
              {Math.round(stats.totalC/stats.total*100)}%
            </div>
            <div style={{fontSize:11,opacity:.6}}>{stats.totalC}/{stats.total} estándares</div>
          </div>
        </div>
        <div style={{marginTop:14,background:"rgba(255,255,255,.18)",borderRadius:99,height:8,overflow:"hidden"}}>
          <div style={{background:"#57E8A0",height:"100%",borderRadius:99,
            width:`${Math.round(stats.totalC/stats.total*100)}%`,transition:"width .5s ease"}}/>
        </div>
      </div>
      {/* Alerta obligatorios */}
      {!stats.obligAll&&(
        <div style={{background:"#FFF8E1",border:`1.5px solid #F6C84C`,borderRadius:10,
          padding:"11px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:18,lineHeight:1.2}}>⚠️</span>
          <div>
            <div style={{fontWeight:700,color:"#7A4F00",fontSize:13}}>Obligatorios: {stats.obligC}/{stats.oblig.length} cumplidos</div>
            <div style={{fontSize:11,color:"#9A6500",marginTop:2}}>Condición previa a cualquier nivel de certificación.</div>
          </div>
        </div>
      )}
      {/* Gauges */}
      <div style={{display:"flex",gap:10}}>
        <GCard v={stats.giP}   color={C.gi}   light={C.gil}   label="Grupo I"   sub={`${stats.giC}/${stats.gi.length}`}/>
        <GCard v={stats.giiP}  color={C.gii}  light={C.giil}  label="Grupo II"  sub={`${stats.giiC}/${stats.gii.length}`}/>
        <GCard v={stats.giiiP} color={C.giii} light={C.giiil} label="Grupo III" sub={`${stats.giiiC}/${stats.giii.length}`}/>
      </div>
      {/* Umbrales */}
      <div style={{background:C.card,borderRadius:12,padding:"14px 16px",boxShadow:"0 1px 5px rgba(0,0,0,.07)"}}>
        <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>
          Umbrales de certificación
        </div>
        {[
          {label:"Avanzado",color:"#A06000",reqs:[{t:"Obligatorios 100%",ok:stats.obligAll},{t:"Grupo I > 70%",ok:stats.obligAll&&stats.giP>70}]},
          {label:"Óptimo",color:C.gi,reqs:[{t:"Grupo I = 100%",ok:stats.giP>=100},{t:"Grupo II > 40%",ok:stats.giiP>40}]},
          {label:"Excelente",color:"#6B25C0",reqs:[{t:"Grupo I = 100%",ok:stats.giP>=100},{t:"Grupo II = 100%",ok:stats.giiP>=100},{t:"Grupo III > 40%",ok:stats.giiiP>40}]},
        ].map(n=>(
          <div key={n.label} style={{marginBottom:11}}>
            <div style={{fontSize:12,fontWeight:700,color:n.color,marginBottom:4}}>{n.label}</div>
            {n.reqs.map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                <span style={{fontSize:13,lineHeight:1,color:r.ok?C.gi:"#D0D5E0"}}>{r.ok?"✓":"○"}</span>
                <span style={{fontSize:12,color:r.ok?C.gi:C.muted}}>{r.t}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* A.P. específicos */}
      <div style={{background:C.apl,border:`1.5px solid ${C.ap}33`,borderRadius:12,padding:"13px 15px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:11,fontWeight:700,color:C.ap,textTransform:"uppercase",letterSpacing:".08em"}}>
            ⌂ Específicos A. Primaria
          </div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:800,color:C.ap}}>
            {stats.apC}/{stats.apArr.length}
          </div>
        </div>
        <Bar v={Math.round(stats.apC/stats.apArr.length*100)} color={C.ap}/>
        <div style={{fontSize:11,color:C.ap,opacity:.7,marginTop:6}}>
          Estándares con elementos evaluables propios de A.P.
        </div>
      </div>
      {/* Bloques */}
      <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:-5}}>
        Por bloque
      </div>
      {[1,2,3].map(bid=>{
        const bl=BLOQUES.find(b=>b.id===bid), bs=bloqS(bid,est);
        return(
          <div key={bid} onClick={()=>setTab(bid)}
            style={{background:C.card,borderRadius:12,padding:"13px 15px",
              boxShadow:"0 1px 5px rgba(0,0,0,.07)",cursor:"pointer",borderLeft:`4px solid ${bl.color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div>
                <div style={{fontSize:10,color:bl.color,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em"}}>Bloque {bid}</div>
                <div style={{fontSize:13,fontWeight:600,color:C.txt}}>{BLOQUE_FULL[bid]}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:900,color:bl.color,fontFamily:"'DM Mono',monospace",lineHeight:1}}>{bs.pct}%</div>
                <div style={{fontSize:10,color:C.muted}}>{bs.cum}/{bs.total}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <Bar v={bs.pct} color={bl.color}/>
              <div style={{display:"flex",gap:6,fontSize:10,minWidth:70}}>
                <span style={{color:C.gi}}>✓{bs.cum}</span>
                <span style={{color:C.oblig}}>✗{bs.noc}</span>
                <span style={{color:C.muted}}>○{bs.pend}</span>
              </div>
            </div>
          </div>
        );
      })}
      {/* Resetear todo */}
      <button onClick={()=>{if(window.confirm("¿Resetear todos los estados a Pendiente?")) setEst({});}}
        style={{padding:"10px",borderRadius:10,border:`1.5px solid ${C.border}`,
          background:C.card,color:C.muted,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
        ↺ Resetear todo el seguimiento
      </button>
    </div>
  );

  // ── PANEL BLOQUE ──────────────────────────────────────────────────────────
  const PanelBloque = ({ bid }) => {
    const bl=BLOQUES.find(b=>b.id===bid);
    const crits=CRITERIOS.filter(c=>c.bloque===bid);
    const allE=ES.filter(e=>crits.some(c=>c.id===e.c));
    const filtered=applyFilters(allE);
    const bs=bloqS(bid,est);
    return(
      <div>
        <div style={{borderRadius:12,background:`linear-gradient(135deg,${bl.color} 0%,${bl.color}BB 100%)`,
          padding:"15px 16px",marginBottom:14,color:"#fff"}}>
          <div style={{fontSize:10,opacity:.75,textTransform:"uppercase",letterSpacing:".12em",marginBottom:3}}>Bloque {bid}</div>
          <div style={{fontSize:16,fontWeight:800,marginBottom:10}}>{BLOQUE_FULL[bid]}</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",fontSize:12}}>
            <span style={{background:"rgba(255,255,255,.2)",borderRadius:6,padding:"3px 9px",fontWeight:600}}>✓ {bs.cum} cumplen</span>
            <span style={{background:"rgba(255,255,255,.2)",borderRadius:6,padding:"3px 9px",fontWeight:600}}>✗ {bs.noc} no cumplen</span>
            <span style={{background:"rgba(255,255,255,.25)",borderRadius:6,padding:"3px 9px",fontWeight:700}}>{bs.pct}%</span>
          </div>
        </div>
        {/* Filtros */}
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar estándar…"
            style={{flex:"1 1 140px",padding:"7px 10px",border:`1.5px solid ${C.border}`,
              borderRadius:8,fontSize:12,fontFamily:"inherit",outline:"none",background:"#fff"}}/>
          <select value={fG} onChange={e=>setFG(+e.target.value)}
            style={{padding:"7px 8px",border:`1.5px solid ${C.border}`,borderRadius:8,
              fontSize:12,fontFamily:"inherit",background:"#fff",color:C.txt}}>
            <option value={0}>Todos los grupos</option>
            <option value={1}>Grupo I</option>
            <option value={2}>Grupo II</option>
            <option value={3}>Grupo III</option>
          </select>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          <button onClick={()=>setFOb(p=>!p)}
            style={{flex:1,padding:"6px 8px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",
              border:`1.5px solid ${fOb?C.oblig:C.border}`,background:fOb?C.obligl:"#fff",color:fOb?C.oblig:C.muted}}>
            ★ Solo obligatorios
          </button>
          <button onClick={()=>setFAP(p=>!p)}
            style={{flex:1,padding:"6px 8px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",
              border:`1.5px solid ${fAP?C.ap:C.border}`,background:fAP?C.apl:"#fff",color:fAP?C.ap:C.muted}}>
            ⌂ Solo A. Primaria
          </button>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          <button onClick={()=>markAll(filtered,"cumple")}
            style={{flex:1,padding:"7px",borderRadius:8,border:`1.5px solid #57C47C`,
              background:C.gil,color:C.gi,fontWeight:700,fontSize:11,cursor:"pointer"}}>
            Marcar vista ✓
          </button>
          <button onClick={()=>markAll(filtered,"pendiente")}
            style={{flex:1,padding:"7px",borderRadius:8,border:`1.5px solid ${C.border}`,
              background:"#F2F4F8",color:C.muted,fontWeight:700,fontSize:11,cursor:"pointer"}}>
            Resetear vista ○
          </button>
        </div>
        {/* Criterios acordeón */}
        {crits.map(crit=>{
          const critFiltered=filtered.filter(e=>e.c===crit.id);
          const hasFilter=fG||fAP||fOb||q.trim();
          if(critFiltered.length===0&&hasFilter) return null;
          const cs=critS(crit.id,est);
          const isOpen=openC===crit.id;
          const listToShow=hasFilter ? critFiltered : ES.filter(e=>e.c===crit.id);
          return(
            <div key={crit.id} style={{marginBottom:8}}>
              <div onClick={()=>setOpenC(isOpen?null:crit.id)}
                style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"10px 14px",borderRadius:10,cursor:"pointer",
                  background:`${bl.color}12`,border:`1.5px solid ${bl.color}2A`}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:10,color:bl.color,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em"}}>Criterio {crit.id}</div>
                  <div style={{fontSize:13,fontWeight:600,color:C.txt,marginTop:1,
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{crit.nombre}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:18,fontWeight:900,color:bl.color,fontFamily:"'DM Mono',monospace",lineHeight:1}}>{cs.pct}%</div>
                    <div style={{fontSize:9,color:C.muted}}>{cs.cum}/{cs.total}</div>
                  </div>
                  <span style={{color:bl.color,fontSize:11}}>{isOpen?"▲":"▼"}</span>
                </div>
              </div>
              {isOpen&&(
                <div style={{paddingTop:6,display:"flex",flexDirection:"column",gap:6}}>
                  {listToShow.map(e=><ERow key={e.id} e={e} estado={est[e.id]} onToggle={toggle}/>)}
                  {listToShow.length===0&&(
                    <div style={{textAlign:"center",padding:14,color:C.muted,fontSize:12}}>Sin estándares con los filtros activos.</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ── LAYOUT PRINCIPAL ──────────────────────────────────────────────────────
  return (
    <div style={{fontFamily:"'Outfit',system-ui,sans-serif",background:C.bg,minHeight:"100vh",maxWidth:520,margin:"0 auto"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:0}
        input:focus{border-color:#2E72B8!important;box-shadow:0 0 0 3px #2E72B822}
      `}</style>

      {/* TOPBAR */}
      <div style={{background:C.card,borderBottom:`1.5px solid ${C.border}`,
        position:"sticky",top:0,zIndex:200,boxShadow:"0 1px 6px rgba(0,0,0,.06)"}}>
        <div style={{padding:"10px 14px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:14,fontWeight:900,color:C.txt,lineHeight:1.2}}>ACSA · Atención Primaria</div>
            <div style={{fontSize:10,color:C.muted}}>Seguimiento de Acreditación · 76 estándares</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            {!stats.obligAll&&<span style={{fontSize:14}} title="Obligatorios pendientes">⚠️</span>}
            <div style={{background:`${C.b2}18`,color:C.b2,border:`1.5px solid ${C.b2}44`,
              borderRadius:20,padding:"3px 11px",fontSize:12,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>
              {stats.totalC}/{stats.total}
            </div>
          </div>
        </div>
        {/* Pestañas */}
        <div style={{display:"flex",padding:"6px 8px 0",gap:0,overflowX:"auto"}}>
          {BLOQUES.map(bl=>{
            const active=tab===bl.id;
            const bs=bl.id===0?null:bloqS(bl.id,est);
            return(
              <button key={bl.id}
                onClick={()=>{setTab(bl.id);setOpenC(null);setQ("");setFG(0);setFAP(false);setFOb(false);}}
                style={{flexShrink:0,padding:"7px 11px",background:"none",border:"none",cursor:"pointer",
                  fontFamily:"inherit",borderBottom:`2.5px solid ${active?bl.color:"transparent"}`,
                  color:active?bl.color:C.muted,fontWeight:active?700:500,fontSize:12,transition:"all .18s",borderRadius:"4px 4px 0 0"}}>
                <span style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:bl.id===0?12:11}}>{bl.icon}</span>
                  <span>{bl.nombre}</span>
                  {bs&&<span style={{fontSize:9,fontFamily:"'DM Mono',monospace",fontWeight:700,
                    background:active?`${bl.color}20`:"#F2F4F8",color:active?bl.color:C.muted,
                    borderRadius:10,padding:"1px 5px"}}>{bs.pct}%</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{padding:"14px 12px 60px"}}>
        {tab===0&&<PanelResumen/>}
        {tab>0&&<PanelBloque bid={tab}/>}
      </div>

      {/* BARRA INFERIOR */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        maxWidth:520,width:"100%",background:C.card,borderTop:`1.5px solid ${C.border}`,
        padding:"7px 16px",display:"flex",gap:14,justifyContent:"center",zIndex:100,
        boxShadow:"0 -2px 10px rgba(0,0,0,.06)"}}>
        {[{i:"○",c:C.muted,l:"Pendiente"},{i:"✓",c:C.gi,l:"Cumple"},{i:"✗",c:C.oblig,l:"No cumple"}].map(x=>(
          <div key={x.l} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:x.c,fontWeight:600}}>
            <span style={{fontSize:13}}>{x.i}</span>{x.l}
          </div>
        ))}
        <div style={{fontSize:10,color:C.muted,alignSelf:"center"}}>· toca para cambiar</div>
      </div>
    </div>
  );
}
