import React from "react";
import Logo from "../../assets/Hcoll_blanco.png";
import { styles } from "../styles/maseratiStyles";

export default function DoneScreen() {
    return (
        <div style={styles.page}>
            <style>{styles.responsiveCss}</style>

            <div style={styles.bgGlowA} />
            <div style={styles.bgGlowB} />
            <div className="msr-noise" style={styles.noise} />

            <div className="container-fluid py-4 px-3">
                <div className="text-center mb-3">
                    <img alt={"Logo HCollection"} src={Logo} style={styles.img} />
                    <div className="msr-sub" style={styles.brandSub}>
                        Gracias por su visita
                    </div>
                </div>

                <div className="card border-0 shadow-lg" style={styles.card}>
                    <div className="card-body p-3 p-md-5 text-center">
                        <i className="bi bi-check2-circle" style={{ fontSize: 42, color: "#FFDF73" }} />
                        <h3 className="mt-3 mb-2" style={{ letterSpacing: "0.06em", color: "#FFDF73" }}>
                            Respuesta enviada
                        </h3>
                        <p className="text-white-50 mb-0">
                            Apreciamos su tiempo. Su opinión nos ayuda a mejorar la experiencia.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-3 text-white-50" style={{ fontSize: 11, letterSpacing: "0.12em" }}>
                    Powered by Gibra Company
                </div>
            </div>
        </div>
    );
}
