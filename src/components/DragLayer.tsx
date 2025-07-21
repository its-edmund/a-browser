export default function DragLayer() {
  return (
    <div
      className="top-0 left-0 w-full h-8 fixed" /* height = grab zone */
      style={{
        WebkitAppRegion: "drag", // ← lets user drag
        pointerEvents: "none", // clicks pass through
      }}
    />
  );
}
