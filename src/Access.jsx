import { useState } from "react";
import { ACCESS_TOKEN } from "./config.js";

const C = {
  b2: "#2E72B8", b2l: "#E8F1FB",
  txt: "#1A2332", muted: "#6B7A90",
  bg: "#F2F4F8", card: "#FFFFFF", border: "#E0E5EE",
  oblig: "#C0392B", obligl: "#FDECEA",
};

export default function Access({ onGranted }) {
  const [value, setValue] = useState("");
  const [error, setError]   = useState(false);
  const [shake, setShake]   = useState(false);

  const handleSubmit = () => {
    if (value.trim() === ACCESS_TOKEN) {
      onGranted();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
    if (error) setError(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Outfit', system-ui, sans-serif", padding: 20,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-5px)}
          80%{transform:translateX(5px)}
        }
        .shake { animation: shake .45s ease; }
      `}</style>

      <div className={shake ? "shake" : ""}
        style={{
          background: C.card, borderRadius: 18, padding: "36px 32px 32px",
          maxWidth: 360, width: "100%",
          boxShadow: "0 8px 40px rgba(46,114,184,.15), 0 2px 8px rgba(0,0,0,.06)",
          border: `1.5px solid ${C.border}`,
        }}>

        {/* Logo / icono */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: `linear-gradient(135deg, #142A48 0%, ${C.b2} 100%)`,
            margin: "0 auto 14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26,
          }}>⛨</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.txt }}>ACSA · Atención Primaria</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
            Seguimiento de Acreditación
          </div>
        </div>

        {/* Campo */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted,
            textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 6 }}>
            Clave de acceso
          </label>
          <input
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false); }}
            onKeyDown={handleKey}
            placeholder="Introduce la clave…"
            autoFocus
            style={{
              width: "100%", padding: "11px 14px",
              border: `1.5px solid ${error ? C.oblig : C.border}`,
              borderRadius: 10, fontSize: 14, fontFamily: "'DM Mono', monospace",
              outline: "none", background: error ? C.obligl : "#fff",
              color: C.txt, transition: "border-color .15s, background .15s",
              letterSpacing: ".1em",
            }}
          />
          {error && (
            <div style={{ fontSize: 11, color: C.oblig, marginTop: 5, fontWeight: 600 }}>
              Clave incorrecta. Inténtalo de nuevo.
            </div>
          )}
        </div>

        {/* Botón */}
        <button onClick={handleSubmit}
          style={{
            width: "100%", padding: "12px", borderRadius: 10, border: "none",
            background: `linear-gradient(135deg, #142A48 0%, ${C.b2} 100%)`,
            color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", letterSpacing: ".04em",
            boxShadow: "0 4px 14px rgba(46,114,184,.35)",
          }}>
          Acceder →
        </button>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 10,
          color: C.muted, lineHeight: 1.6 }}>
          Uso interno · Hospital Universitario Costa del Sol<br/>
          Servicio de Radiodiagnóstico · SAS
        </div>
      </div>
    </div>
  );
}
