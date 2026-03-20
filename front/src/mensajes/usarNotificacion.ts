import { useState, useCallback, useRef, useEffect } from "react";

interface Notificacion {
  tipo: "success" | "error" | "info";
  texto: string;
}

export function usarNotificacion() {
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null);
  const temporizadorRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (temporizadorRef.current) {
        clearTimeout(temporizadorRef.current);
      }
    };
  }, []);

  const mostrar = useCallback(
    (tipo: "success" | "error" | "info", texto: string, duracionMs = 6000) => {
      console.log("🔔 Mostrando notificación:", tipo, texto, duracionMs);
      // Limpiar temporizador anterior si existe
      if (temporizadorRef.current) {
        clearTimeout(temporizadorRef.current);
      }

      // Mostrar el nuevo mensaje
      setNotificacion({ tipo, texto });

      // Configurar nuevo temporizador
      temporizadorRef.current = setTimeout(() => {
        console.log("⏱️ Limpiando notificación");
        setNotificacion(null);
        temporizadorRef.current = null;
      }, duracionMs);
    },
    []
  );

  const mostrarExito = useCallback(
    (texto: string, duracionMs = 6000) => mostrar("success", texto, duracionMs),
    [mostrar]
  );

  const mostrarError = useCallback(
    (texto: string, duracionMs = 6000) => mostrar("error", texto, duracionMs),
    [mostrar]
  );

  const mostrarInfo = useCallback(
    (texto: string, duracionMs = 6000) => mostrar("info", texto, duracionMs),
    [mostrar]
  );

  const limpiar = useCallback(() => {
    if (temporizadorRef.current) {
      clearTimeout(temporizadorRef.current);
      temporizadorRef.current = null;
    }
    setNotificacion(null);
  }, []);

  return {
    notificacion,
    mostrar,
    mostrarExito,
    mostrarError,
    mostrarInfo,
    limpiar,
  };
}
