import React from "react";
import { CheckCircle2, Info, AlertCircle } from "lucide-react";

function Toast({ message, type = "info", onClose }) {
  if (!message) return null;

  return (
    <div className={`toast-notification toast-${type}`}>
      {type === "success" && <CheckCircle2 size={18} className="toast-icon" />}
      {type === "info" && <Info size={18} className="toast-icon" />}
      {type === "error" && <AlertCircle size={18} className="toast-icon" />}
      <span className="toast-message">{message}</span>
    </div>
  );
}

export default Toast;
