import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Bell,
  Check,
  Info,
  AlertTriangle,
  XCircle,
  CheckCheck,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getNotificationApi from "@/features/notification/hook/getNotificationApi";
import { NotificationType } from "@/generated/prisma/enums";
import markAsReadApi from "@/features/notification/hook/markAsReadApi";
import markAllAsReadService from "@/features/notification/service/markAllAsReadService";

// ==========================================
// 1. Tipos e Interfaces (Dominio)
// ==========================================

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO String
  isRead: boolean;
}

// ==========================================
// 2. Utilidades (Formateo de fechas nativo)
// ==========================================
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
  if (diffInSeconds < 3600)
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  if (diffInSeconds < 86400)
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
};

// ==========================================
// 3. Datos de Ejemplo (Mocks)
// ==========================================
const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    type: "ACTION_PROG",
    title: "Despliegue exitoso",
    message: "La aplicación ha sido desplegada correctamente en producción.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // Hace 5 min
    isRead: false,
  },
  {
    id: "2",
    type: "ACTION_PROG",
    title: "Uso de CPU elevado",
    message: "El servidor principal está alcanzando el 90% de capacidad.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Hace 2 horas
    isRead: false,
  },
  {
    id: "3",
    type: "ACTION_PROG",
    title: "Nuevo inicio de sesión",
    message: "Se detectó un inicio de sesión desde una nueva IP (192.168.1.1).",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Hace 1 día
    isRead: true,
  },
  {
    id: "4",
    type: "ACTION_PROG",
    title: "Fallo en la base de datos",
    message: "La conexión de réplica ha fallado. Revisar logs.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // Hace 2 días
    isRead: true,
  },
];

// ==========================================
// 4. Hook de Lógica de Negocio
// ==========================================
function useNotifications(initialData: AppNotification[]) {
  const [notifications, setNotifications] =
    useState<AppNotification[]>(initialData);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev
        .map((n) => (n.id === id ? { ...n, isRead: true } : n))
        .filter((n) => n.id !== id),
    );
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}

// ==========================================
// 5. Hook de UI (Click Outside)
// ==========================================
function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
// ==========================================
// 6. Componentes de UI
// ==========================================

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  const iconProps = { className: "size-4" };
  switch (type) {
    case "ACTION_PROG":
      return <Check className={`text-emerald-500 ${iconProps.className}`} />;
    case "BUDGET_WARNING":
      return (
        <AlertTriangle className={`text-amber-500 ${iconProps.className}`} />
      );
    case "GOAL_ACHIEVED":
      return <XCircle className={`text-rose-500 ${iconProps.className}`} />;
    case "SYSTEM":
      return <XCircle className={`text-rose-500 ${iconProps.className}`} />;
    case "RECURRING_DUE":
    default:
      return <Info className={`text-blue-500 ${iconProps.className}`} />;
  }
};

export default function NotificationCenter() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationApi,
    staleTime: 20,
  });
  const markAsReadMutation = useMutation({
    mutationFn: markAsReadApi,
    onSuccess: () => {
      // ⚡ Invalida la query: hace que useQuery vuelva a pedir los datos a la API
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
  const markAllAsRead = () => {
    markAllAsReadService();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };
  useClickOutside(containerRef, () => setIsOpen(false));
  // Manejo de la tecla Escape para a11y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* TRIGGER (Tu botón mejorado) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notificaciones. Tienes ${notificationsData?.unreadCount} sin leer.`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-all hover:bg-secondary/80 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="size-[18px]" />
        {notificationsData && notificationsData?.unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-primary px-[5px] text-[10px] font-bold text-primary-foreground shadow-sm ring-2 ring-background animate-in zoom-in">
            {notificationsData?.unreadCount > 99
              ? "99+"
              : notificationsData?.unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN PANEL */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Panel de notificaciones"
          className="absolute right-0 top-12 z-50 w-80 md:w-96 rounded-xl border border-border bg-background p-1 shadow-lg animate-in fade-in slide-in-from-top-2"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
            <h3 className="font-semibold text-foreground">Notificaciones</h3>
            {notificationsData && notificationsData.unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="group flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none"
              >
                <CheckCheck className="size-3.5 group-hover:text-primary" />
                Marcar leídas
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="flex max-h-[400px] flex-col overflow-y-auto overscroll-contain py-1">
            {notificationsData?.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
                <Bell className="mb-2 size-8 opacity-20" />
                <p className="text-sm font-medium">No tienes notificaciones</p>
                <p className="text-xs">Te avisaremos cuando haya novedades.</p>
              </div>
            ) : (
              notificationsData?.items.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsReadMutation.mutate(notification.id)}
                  className={`relative flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50 focus:bg-muted/50 focus:outline-none ${
                    !notification.isRead ? "bg-muted/20" : ""
                  }`}
                >
                  {/* Icono de estado */}
                  <div className="mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-background p-1.5 shadow-sm border border-border/50">
                    <NotificationIcon type={notification.type} />
                  </div>

                  {/* Contenido */}
                  <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-sm font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {notification.title}
                      </p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatTimeAgo(String(notification.createdAt))}
                      </span>
                    </div>
                    <p
                      className={`line-clamp-2 text-xs ${!notification.isRead ? "text-muted-foreground" : "text-muted-foreground/70"}`}
                    >
                      {notification.message}
                    </p>
                  </div>

                  {/* Dot de No Leído */}
                  {!notification.isRead && (
                    <span className="absolute right-3 top-4 size-2 rounded-full bg-primary" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* FOOTER */}
          {notificationsData && notificationsData.items.length > 0 && (
            <div className="border-t border-border/50 p-2">
              <button className="w-full rounded-md px-3 py-2 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none">
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
