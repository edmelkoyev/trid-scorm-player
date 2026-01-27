import { launchPlayer } from "./PlayerBootstrap";
import { normalizeCmi } from "../cmi/CmiNormalizer";
import { PlayerContext } from "./PlayerContext";

// Mock dependencies
jest.mock("../cmi/CmiNormalizer");
jest.mock("./PlayerContext");

// Helper to create a resolved Response
const mockFetch = (ok: boolean, body: string | object) => {
  const text = typeof body === "string" ? () => Promise.resolve(body) : () => Promise.resolve(JSON.stringify(body));
  const json = typeof body === "object" ? () => Promise.resolve(body) : () => Promise.reject("Not JSON");
  return { ok, text, json } as Response;
};

describe("launchPlayer", () => {
  const cmiBaseUrl = "https://trid.test.com/scorm/api/ctx";
  const mockUpdateProgress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("should successfully initialize, fetch CMI, normalize, and create PlayerContext", async () => {
    // Arrange
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(mockFetch(true, "true")) // LMSInitialize Ok
      .mockResolvedValueOnce(mockFetch(true, { elements: { "cmi.core.student_id": "123" } })); // data-elements Ok

    const mockNormalizedCmi = { "cmi._version": "3.4", "cmi.core.student_id": "123" };
    (normalizeCmi as jest.Mock).mockReturnValue(mockNormalizedCmi);

    // Act
    const context = await launchPlayer(cmiBaseUrl, mockUpdateProgress);

    // Assert
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(1, `${cmiBaseUrl}/LMSInitialize`, { method: "POST" });
    expect(global.fetch).toHaveBeenNthCalledWith(2, `${cmiBaseUrl}/data-elements`);

    expect(normalizeCmi).toHaveBeenCalledWith({ "cmi.core.student_id": "123" });
    expect(PlayerContext).toHaveBeenCalledWith(mockNormalizedCmi, cmiBaseUrl, mockUpdateProgress);
    expect(context).toBeInstanceOf(PlayerContext);
  });

  it("should throw error if LMSInitialize POST fails", async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockFetch(false, "Internal Server Error"));

    // Act & Assert
    await expect(launchPlayer(cmiBaseUrl, mockUpdateProgress)).rejects.toThrow(
      "Failed to post LMSInitialize"
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`${cmiBaseUrl}/LMSInitialize`, { method: "POST" });
    expect(normalizeCmi).not.toHaveBeenCalled();
    expect(PlayerContext).not.toHaveBeenCalled();
  });

  it("should throw error if LMSInitialize returns unexpected response", async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockFetch(true, "false"));

    // Act & Assert
    await expect(launchPlayer(cmiBaseUrl, mockUpdateProgress)).rejects.toThrow(
      "LMSInitialize returned unexpected response: false"
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`${cmiBaseUrl}/LMSInitialize`, { method: "POST" });
    expect(normalizeCmi).not.toHaveBeenCalled();
    expect(PlayerContext).not.toHaveBeenCalled();
  });

  it("should throw error if fetching CMI fails", async () => {
    // Arrange
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(mockFetch(true, "true")) // LMSInitialize OK
      .mockResolvedValueOnce(mockFetch(false, "Not Found")); // data-elements fails

    // Act & Assert
    await expect(launchPlayer(cmiBaseUrl, mockUpdateProgress)).rejects.toThrow(
      "Failed to fetch CMI from backend"
    );
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(normalizeCmi).not.toHaveBeenCalled();
    expect(PlayerContext).not.toHaveBeenCalled();
  });

  it("should propagate errors from normalizeCmi or PlayerContext", async () => {
    // Arrange
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(mockFetch(true, "true"))
      .mockResolvedValueOnce(mockFetch(true, { elements: {} }));

    const errorMessage = "Normalization failed";
    (normalizeCmi as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    // Act & Assert
    await expect(launchPlayer(cmiBaseUrl, mockUpdateProgress)).rejects.toThrow(errorMessage);
    expect(PlayerContext).not.toHaveBeenCalled();
  });
});