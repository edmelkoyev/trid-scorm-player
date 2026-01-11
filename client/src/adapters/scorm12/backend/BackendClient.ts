export class BackendClient {
  private cmiUrl: string;

  constructor(cmiUrl: string) {
    this.cmiUrl = cmiUrl
  }

  async saveCMI(cmi: Record<string, string>) {
    await fetch(this.cmiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cmi)
    });
  }
}
