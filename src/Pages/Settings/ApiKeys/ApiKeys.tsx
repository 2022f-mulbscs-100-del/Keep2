import { useEffect, useState } from "react";
import { AiOutlineKey } from "react-icons/ai";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosClient from "../../../api/axiosClient";
import PrimaryButton from "../../../component/Buttons/PrimaryButton";
import SettingHeader from "../../../component/settingHeader/SettingHeader";
import { Logger } from "../../../utils/Logger";
import type { ApiKeyType } from "../../../types/ApiKey.types";

const formatDate = (value?: string | null) => {
  if (!value) return "Never";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const maskKey = (value?: string | null) => {
  if (!value) return "Hidden";
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}···${value.slice(-4)}`;
};

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyType[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [revokingKeyId, setRevokingKeyId] = useState<number | null>(null);
  const [label, setLabel] = useState("");
  const [recentKey, setRecentKey] = useState<string | null>(null);

  const handleCopy = async (value: string, apiKeyId?: number) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);

      if (apiKeyId) {
        await axiosClient
          .patch(`/api-keys/${apiKeyId}/last-used`)
          .then((res) => {
            const lastUsedAt = res.data?.lastUsedAt;
            if (!lastUsedAt) return;
            setApiKeys((prev) =>
              prev.map((key) =>
                key.id === apiKeyId ? { ...key, lastUsedAt } : key,
              ),
            );
            Logger("API key usage updated");
          })
          .catch((error) => {
            Logger("Failed to update API key usage", error);
          });
      }

      toast.success("Key copied to clipboard");
    } catch (error) {
      Logger("Unable to copy API key", error);
      toast.error("Unable to copy the key. Try again manually.");
    }
  };

  const fetchApiKeys = async () => {
    try {
      setIsFetching(true);
      const res = await axiosClient.get("/api-keys");
      const entries: ApiKeyType[] = (res.data?.apiKeys || []).map(
        (item: ApiKeyType) => ({
          ...item,
          name: item.name ?? item.apiKeyName ?? null,
        }),
      );
      setApiKeys(entries);
    } catch (error) {
      Logger("Failed to load API keys", error);
      toast.error("Unable to load API keys right now");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleRevoke = async (apiKeyId: number) => {
    if (!window.confirm("Revoke this API key? This action cannot be undone.")) {
      return;
    }

    try {
      setRevokingKeyId(apiKeyId);
      await axiosClient.patch(`/api-keys/${apiKeyId}/revoke`);
      setApiKeys((prev) => prev.filter((key) => key.id !== apiKeyId));
      toast.success("API key revoked");
    } catch (error) {
      Logger("Failed to revoke API key", error);
      toast.error("Unable to revoke this API key right now");
    } finally {
      setRevokingKeyId(null);
    }
  };

  const handleGenerate = async () => {
    if (label.trim() === "") {
      toast.error("Please give the key a label so you can identify it later");
      return;
    }

    try {
      setIsGenerating(true);
      const res = await axiosClient.post("/generateApiKey", {
        name: label.trim(),
      });

      const payload = res.data;
      if (!payload) {
        throw new Error("Unexpected response from the server");
      }

      const generatedKey = payload?.key ?? payload?.secret ?? payload?.value;
      if (!generatedKey) {
        throw new Error("API key value missing in the response");
      }

      setRecentKey(generatedKey);
      setApiKeys((prev) => {
        const normalized: ApiKeyType = {
          ...payload,
          name: payload.name ?? payload.apiKeyName ?? null,
        };
        const deduped = prev.filter((key) => key.id !== normalized.id);
        return [normalized, ...deduped];
      });
      setLabel("");
      toast.success(
        "New API key created. Copy it now because it won’t be shown again.",
      );
    } catch (error: unknown) {
      Logger("API key generation failed", error);
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create an API key right now";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-10">
      <SettingHeader title="API Keys" />

      <div className="border border-borderColor rounded-[10px] p-6 mb-6 space-y-5">
        <div className="flex gap-3 items-start">
          <div className="text-2xl text-primary">
            <AiOutlineKey />
          </div>
          <div>
            <h2 className="text-[22px] font-semibold">Create a new key</h2>
            <p className="text-sm text-white-400">
              Use API keys to read or write notes without going through the web
              app. Treat keys like passwords and avoid sharing them in public
              places.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-body">Key label</label>
          <input
            className="w-full rounded-[10px] border border-borderColor px-4 py-3 text-body outline-none focus:border-primary"
            placeholder="e.g. automation-service"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
        </div>

        <PrimaryButton
          title={isGenerating ? "Generating key…" : "Generate API key"}
          onClick={handleGenerate}
          disabled={isGenerating}
        />

        {recentKey && (
          <div className="border border-primary rounded-[10px] bg-[#1f2937]/40 p-4 space-y-3">
            <p className="text-xs text-gray-400">
              This is the only time you will see this key. Copy it now.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <code className="w-full overflow-hidden text-sm font-mono text-primary break-all">
                {recentKey}
              </code>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-primary px-3 py-1 text-sm"
                onClick={() => handleCopy(recentKey)}
              >
                <FaCopy />
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border border-borderColor rounded-[10px] p-6 space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[22px] font-semibold">Your keys</h2>
          <p className="text-sm text-gray-400">
            Revoke keys when they are no longer needed or if you suspect they
            were leaked.
          </p>
        </div>

        {isFetching ? (
          <p className="text-sm text-gray-400">Loading keys…</p>
        ) : apiKeys.length === 0 ? (
          <p className="text-sm text-gray-400">
            You haven’t generated any API keys yet.
          </p>
        ) : (
          <div>
            <div className="flex flex-col gap-4 h-[300px] overflow-y-auto pr-1 customScrollBar">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="border border-borderColor rounded-[10px] p-4 space-y-3"
                >
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-body font-semibold">
                        {key.name || key.apiKeyName || "Untitled key"}
                      </p>
                      <p className="text-xs text-gray-400">
                        Created {formatDate(key.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wide rounded-full px-3 py-1 ${
                        key.isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {key.isActive ? "Active" : "Revoked"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-[220px] flex-1">
                      <p className="text-[11px] text-gray-400">Key</p>
                      <p className="text-sm font-mono">{maskKey(key.key)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[11px] text-gray-400">
                        Last used:{" "}
                        {key.lastUsedAt
                          ? formatDate(key.lastUsedAt)
                          : "Never used"}
                      </p>
                      {key.key && (
                        <button
                          type="button"
                          className="flex cursor-pointer items-center gap-2 rounded-full border border-borderColor px-3 py-1 text-sm"
                          onClick={() => handleCopy(key.key!, key.id)}
                        >
                          <FaCopy />
                          Copy
                        </button>
                      )}
                      <button
                        type="button"
                        className="rounded-full border border-red-500/70 px-3 py-1 text-sm text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleRevoke(key.id)}
                        disabled={revokingKeyId === key.id}
                      >
                        {revokingKeyId === key.id ? "Revoking..." : "Revoke"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeys;
