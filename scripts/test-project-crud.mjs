import fs from "node:fs";

const base = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  const comp = await fetch(`${base}/api/graphql?type=competences`).then((r) => r.json());
  if (!comp?.success || !Array.isArray(comp?.data) || comp.data.length === 0) {
    throw new Error("No competences available from backend");
  }

  const toolId = comp.data[0].id;
  const imgPath = "public/avatar/lud.jpeg";
  if (!fs.existsSync(imgPath)) throw new Error(`Missing image file: ${imgPath}`);

  const buf = fs.readFileSync(imgPath);
  const blob = new Blob([buf], { type: "image/jpeg" });

  const form = new FormData();
  form.append("type", "create-project");
  form.append("title", `CRUD Test Project ${Date.now()}`);
  form.append("description", "Created via automated test");
  form.append("status", "live");
  form.append("url", "https://example.com");
  form.append("githubUrl", "https://github.com/example/repo");
  form.append("showInSlider", "true");
  form.append("tools", String(toolId));
  form.append("image", blob, "lud.jpeg");

  const created = await fetch(`${base}/api/graphql`, { method: "POST", body: form }).then((r) => r.json());
  if (!created?.success) throw new Error(`Create failed: ${created?.error || "unknown error"}`);
  console.log("[OK] created project", created.data?.id);

  const updateForm = new FormData();
  updateForm.append("type", "update-project");
  updateForm.append("id", String(created.data.id));
  updateForm.append("title", `${created.data.title} (updated)`);
  updateForm.append("tools", String(toolId));

  const updated = await fetch(`${base}/api/graphql`, { method: "POST", body: updateForm }).then((r) => r.json());
  if (!updated?.success) throw new Error(`Update failed: ${updated?.error || "unknown error"}`);
  console.log("[OK] updated project", updated.data?.id);

  const deleted = await fetch(`${base}/api/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "delete-project", data: { id: created.data.id } }),
  }).then((r) => r.json());

  if (!deleted?.success) throw new Error(`Delete failed: ${deleted?.error || "unknown error"}`);
  console.log("[OK] deleted project", created.data.id);
}

main().catch((e) => {
  console.error("[FAIL]", e);
  process.exit(1);
});

