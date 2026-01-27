import { normalizeCmi } from "../cmi/CmiNormalizer";
import { PlayerContext } from "./PlayerContext";

/**
 * Launches a SCORM 1.2 SCO using the Simplified Player.
 * - Fetches POST call to /LMSInitialize backend 
 * - Fetches CMI from backend
 * - Normalizes CMI
 * - Creates PlayerContext (state, timing, backend, API)
 * - Exposes window.API for SCO
 *
 * @param cmiBaseUrl SCORM API URL
 * @param updateProgress callback to trigger on possible progress changes
 */
export async function launchPlayer(cmiBaseUrl: string, updateProgress: (finished: boolean) => void) {
  try {
    // 1 fetch POST to /LMSInitialize
    const initRes = await fetch(`${cmiBaseUrl}/LMSInitialize`, {method: "POST"});
    if (!initRes.ok) throw new Error("Failed to post LMSInitialize");

    const initResText = await initRes.text();
    if (initResText.trim() !== "true") {
      throw new Error("LMSInitialize returned unexpected response: " + initResText);
    }

    // 2 Fetch CMI JSON from backend
    const res = await fetch(`${cmiBaseUrl}/data-elements`);
    if (!res.ok) throw new Error("Failed to fetch CMI from backend");

    const cmiPack = await res.json();
    const rawCmi = normalizeCmi(cmiPack.elements);

    // 3 Initialize PlayerContext (state, timing, backend, API)
    const context = new PlayerContext(rawCmi, cmiBaseUrl, updateProgress);

    window.console.log("Player context setup successfully. window.API is ready for SCO.");

    return context; // Optional: return context for further programmatic use
  } catch (error) {
    window.console.error("Failed to launch SCO:", error);
    throw error;
  }
}
