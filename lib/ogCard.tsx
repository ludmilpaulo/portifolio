type OgCardProps = {
  kicker: string;
  title: string;
  subtitle: string;
  detail: string;
  imageSrc?: string | null;
};

export function OgCard({ kicker, title, subtitle, detail, imageSrc }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "linear-gradient(135deg, #075985 0%, #0093E9 58%, #22d3ee 100%)",
        color: "white",
        padding: 64,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, paddingRight: imageSrc ? 40 : 0 }}>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, fontWeight: 700 }}>{kicker}</div>
        <div style={{ display: "flex", fontSize: title.length > 42 ? 48 : 60, fontWeight: 700, marginTop: 20, lineHeight: 1.1 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 22 }}>{subtitle}</div>
        <div style={{ display: "flex", fontSize: 22, marginTop: 28, opacity: 0.92 }}>{detail}</div>
      </div>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          width={420}
          height={420}
          style={{ width: 420, height: 420, objectFit: "cover", borderRadius: 28, border: "6px solid rgba(255,255,255,0.85)" }}
        />
      ) : null}
    </div>
  );
}
