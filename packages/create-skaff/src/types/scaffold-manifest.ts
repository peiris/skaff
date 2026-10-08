export type ManifestStackEntry = { name: string; role: string; url: string };

export type ManifestTreeNode = { name: string; purpose?: string; children?: ManifestTreeNode[] };

export type ManifestChoice = { label: string; value: string };

export type ManifestScript = { command: string; purpose: string };

export type ManifestNextStep = { title: string; detail: string };

export type ManifestAuthProvider = { id: string; label: string; console: string; envPrefix: string };

export type ScaffoldManifest = {
  name: string;
  version: string;
  packageManager: { name: string; run: string; dlx: string; exec: string };
  choices: ManifestChoice[];
  stack: ManifestStackEntry[];
  tree: ManifestTreeNode[];
  scripts: ManifestScript[];
  nextSteps: ManifestNextStep[];
  auth: { providers: ManifestAuthProvider[] } | null;
};
