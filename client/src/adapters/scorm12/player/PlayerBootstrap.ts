import { normalizeCmi } from "../cmi/CmiNormalizer";
import { PlayerContext } from "./PlayerContext";

/**
 * Launches a SCORM 1.2 SCO using the Simplified Player.
 * - Fetches CMI from backend
 * - Normalizes CMI
 * - Creates PlayerContext (state, timing, backend, API)
 * - Exposes window.API for SCO
 * - Loads SCO iframe
 *
 * @param scoUrl URL of the SCO launch HTML
 * @param attemptId ID of the attempt for backend CMI
 */
export async function launchPlayer(scoUrl: string, attemptId: string) {
  try {
    const cmiUrl = `/api/scorm/cmi/${attemptId}`;
    // 1️⃣ Fetch CMI JSON from backend
    const res = await fetch(cmiUrl);
    if (!res.ok) throw new Error("Failed to fetch CMI from backend");

    const rawCmi = normalizeCmi(await res.json());

    console.log("EDW02: normalizeCmi rawCmi")
    console.log(JSON.stringify(rawCmi))

    // 2️⃣ Initialize PlayerContext (state, timing, backend, API)
    const context = new PlayerContext(rawCmi, cmiUrl);

    // 3️⃣ Load SCO iframe AFTER window.API is available
    // const iframe = document.createElement("iframe");
    // iframe.src = scoUrl;
    // iframe.width = "100%";
    // iframe.height = "100%";
    // iframe.id = "scoFrame";
    // iframe.setAttribute("frameborder", "0");

    // document.body.appendChild(iframe);

    console.log("Player context setup successfully. window.API is ready for SCO.");

    return context; // Optional: return context for further programmatic use
  } catch (error) {
    console.error("Failed to launch SCO:", error);
    throw error;
  }
}
