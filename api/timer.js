let timer = {
  duration: null,   // seconds
  startTime: null   // timestamp
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const { action, duration } = req.body;

    // SET duration (but do NOT start)
    if (action === "set") {
      timer.duration = duration;
      timer.startTime = null;
      return res.json({ ok: true });
    }

    // START contest
    if (action === "start") {
      if (!timer.duration) {
        return res.status(400).json({ error: "Duration not set" });
      }
      timer.startTime = Date.now();
      return res.json({ ok: true });
    }
  }

  // GET remaining time
  if (req.method === "GET") {
    if (!timer.duration) {
      return res.json({ state: "idle" });
    }

    if (!timer.startTime) {
      return res.json({
        state: "ready",
        duration: timer.duration
      });
    }

    const elapsed = Date.now() - timer.startTime;
    const remaining = Math.max(
      0,
      timer.duration * 1000 - elapsed
    );

    return res.json({
      state: "running",
      remaining
    });
  }

  res.status(405).end();
}
