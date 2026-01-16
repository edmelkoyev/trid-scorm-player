import { launchPlayer } from "./player/PlayerBootstrap";

async function startSCO() {
  const attemptId = "attempt123";
  const scoUrl = "sco/index.html";

  const context = await launchPlayer(`/scorm/api/crs123/sco456`, () => {});

  // Optional: programmatically commit or finish later
  // await context.commit();
  // await context.finish();
}

startSCO();
