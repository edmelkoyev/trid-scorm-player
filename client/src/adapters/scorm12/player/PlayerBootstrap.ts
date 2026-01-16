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
 * @param cmiBaseUrl SCORM API URL
 * @param updateProgress callback to trigger on possible progress changes
 */
export async function launchPlayer(cmiBaseUrl: string, updateProgress: () => void) {
  try {
    // 1️⃣ Fetch CMI JSON from backend
    const res = await fetch(`${cmiBaseUrl}/data-elements`);
    if (!res.ok) throw new Error("Failed to fetch CMI from backend");

    const cmiPack = await res.json();
    const rawCmi = normalizeCmi(cmiPack.elements);

    // 2️⃣ Initialize PlayerContext (state, timing, backend, API)
    const context = new PlayerContext(rawCmi, cmiBaseUrl, updateProgress);

    console.log("Player context setup successfully. window.API is ready for SCO.");

    return context; // Optional: return context for further programmatic use
  } catch (error) {
    console.error("Failed to launch SCO:", error);
    throw error;
  }
}
