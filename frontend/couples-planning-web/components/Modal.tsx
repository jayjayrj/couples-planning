"use client";

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: "32px",
          borderRadius: "16px",
          width: "520px",
          maxWidth: "90%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        {children}
      </div>
    </div>
  );
}