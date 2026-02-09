export const styles = {
    page: {
        minHeight: "100vh",
        width: "100vw",
        background: "#000814",
        color: "white",
        position: "relative",
        overflowX: "hidden",
        fontFamily:
            'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    },
    img: {
        maxWidth: "100%",
        height: "auto",
        maxHeight: "200px",   // ajusta según tu diseño
        margin: "0 auto",
        display: "block",
        objectFit: "contain"
    },
    bgGlowA: {
        position: "absolute",
        inset: 0,
        background:
            "radial-gradient(800px 400px at 15% 10%, rgba(21, 75, 155, 0.32), transparent 60%)",
        pointerEvents: "none",
    },
    bgGlowB: {
        position: "absolute",
        inset: 0,
        background:
            "radial-gradient(900px 500px at 85% 85%, rgba(11, 37, 69, 0.42), transparent 65%)",
        pointerEvents: "none",
    },
    noise: {
        position: "absolute",
        inset: 0,
        opacity: 0.02,
        backgroundImage:
            "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
        pointerEvents: "none",
    },
    card: {
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        borderRadius: 18,
    },
    brandTitle: {
        fontSize: 24,
        letterSpacing: "0.22em",
        fontWeight: 650,
        fontFamily: "Georgia, 'Times New Roman', Times, serif",
    },
    brandSub: {
        marginTop: 4,
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.60)",
    },
    label: {
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontSize: 11,
        color: "rgba(255,255,255,0.78)",
    },
    labelMuted: {
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontSize: 11,
        color: "rgba(255,255,255,0.60)",
    },
    textarea: {
        background: "rgba(0,0,0,0.25)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        boxShadow: "none",
    },
    divider: {
        height: 1,
        background: "rgba(255,255,255,0.08)",
        marginTop: 16,
    },
    submit: {
        borderRadius: 14,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 750,
    },

    // email (dark)
    inputDark: {
        background: "rgba(0,0,0,0.25)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        boxShadow: "none",
    },
    atBadge: {
        padding: "0 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        background: "rgba(0,0,0,0.25)",
        color: "white",
        fontWeight: 800,
        userSelect: "none",
        minWidth: 44,
    },
    selectDark: {
        backgroundColor: "rgba(0,0,0,0.25)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        boxShadow: "none",
        outline: "none",
        cursor: "pointer",
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        paddingRight: 34,
        minWidth: 170,
    },

    responsiveCss: `
    .msr-choice-grid{
      display:grid;
      grid-template-columns: repeat(2, minmax(0,1fr));
      gap:10px;
    }
    @media (min-width: 576px){
      .msr-choice-grid{ grid-template-columns: repeat(3, minmax(0,1fr)); }
    }

    @media (max-width: 576px){
      .msr-noise{ display:none !important; }
      .msr-title{ letter-spacing: 0.16em !important; font-size: 22px !important; }
      .msr-sub{ letter-spacing: 0.10em !important; font-size: 10px !important; }
      .msr-label{ letter-spacing: 0.05em !important; font-size: 11px !important; }
      .msr-label-muted{ letter-spacing: 0.05em !important; font-size: 11px !important; }
    }

    .form-control:focus, .form-select:focus{
      box-shadow: none !important;
      outline: none !important;
    }
  `,
};
