import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineKey } from "react-icons/ai";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosClient from "../../../api/axiosClient";
import PrimaryButton from "../../../component/Buttons/PrimaryButton";
import SettingHeader from "../../../component/settingHeader/SettingHeader";
import { Logger } from "../../../utils/Logger";
import type { ApiKeyType } from "../../../types/ApiKey.types";

const formatDate = (value?: string | null, neverText?: string) => {
  if (!value) return neverText || "Never";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const maskKey = (value?: string | null, hiddenText?: string) => {
  if (!value) return hiddenText || "Hidden";
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}···${value.slice(-4)}`;
};

const ApiKeys = () => {
  const { t } = useTranslation();
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
      t("success.keyCopied");
    } catch (error) {
      Logger("Unable to copy API key", error);
      toast.error(t("apiKeys.unableToCopyKey"));
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
      toast.error(t("apiKeys.unableToLoadApiKeys"));
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleRevoke = async (apiKeyId: number) => {
    if (!window.confirm(t("apiKeys.revokeWarning"))) {
      return;
    }

    try {
      setRevokingKeyId(apiKeyId);
      await axiosClient.patch(`/api-keys/${apiKeyId}/revoke`);
      setApiKeys((prev) => prev.filter((key) => key.id !== apiKeyId));
      toast.success(t("success.apiKeyRevoked"));
    } catch (error) {
      Logger("Failed to revoke API key", error);
      toast.error(t("apiKeys.unableToRevokeKey"));
    } finally {
      setRevokingKeyId(null);
    }
  };

  const handleGenerate = async () => {
    if (label.trim() === "") {
      toast.error(t("apiKeys.labelEmpty"));
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
      toast.success(t("apiKeys.keyCreated"));
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
      <SettingHeader title={t("apiKeys.title")} />

      <div className="border border-borderColor rounded-[10px] p-6 mb-6 space-y-5">
        <div className="flex gap-3 items-start">
          <div className="text-2xl text-primary">
            <AiOutlineKey />
          </div>
          <div>
            <h2 className="text-[22px] font-semibold">
              {t("apiKeys.createNewKey")}
            </h2>
            <p className="text-sm text-white-400">{t("apiKeys.description")}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-body">
            {t("apiKeys.keyLabel")}
          </label>
          <input
            className="w-full rounded-[10px] border border-borderColor px-4 py-3 text-body outline-none focus:border-primary"
            placeholder={t("apiKeys.keyLabelPlaceholder")}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
        </div>

        <PrimaryButton
          title={
            isGenerating
              ? t("apiKeys.generatingKey")
              : t("apiKeys.generateButton")
          }
          onClick={handleGenerate}
          disabled={isGenerating}
        />

        {recentKey && (
          <div className="border border-primary rounded-[10px] bg-[#1f2937]/40 p-4 space-y-3">
            <p className="text-xs text-gray-400">{t("apiKeys.viewWarning")}</p>
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
                {t("common.copy")}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border border-borderColor rounded-[10px] p-6 space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[22px] font-semibold">{t("apiKeys.yourKeys")}</h2>
          <p className="text-sm text-gray-400">
            {t("apiKeys.revokeDescription")}
          </p>
        </div>

        {isFetching ? (
          <p className="text-sm text-gray-400">{t("apiKeys.loadingKeys")}</p>
        ) : apiKeys.length === 0 ? (
          <p className="text-sm text-gray-400">{t("noData.noApiKeys")}</p>
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
                        {key.name || key.apiKeyName || t("noData.untitledKey")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("apiKeys.created")} {formatDate(key.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wide rounded-full px-3 py-1 ${
                        key.isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {key.isActive
                        ? t("apiKeys.active")
                        : t("apiKeys.revoked")}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-[220px] flex-1">
                      <p className="text-[11px] text-gray-400">
                        {t("apiKeys.key")}
                      </p>
                      <p className="text-sm font-mono">{maskKey(key.key)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[11px] text-gray-400">
                        {t("apiKeys.lastUsed")}:{" "}
                        {key.lastUsedAt
                          ? formatDate(key.lastUsedAt, t("common.never"))
                          : `${t("common.never")} used`}
                      </p>
                      {key.key && (
                        <button
                          type="button"
                          className="flex cursor-pointer items-center gap-2 rounded-full border border-borderColor px-3 py-1 text-sm"
                          onClick={() => handleCopy(key.key!, key.id)}
                        >
                          <FaCopy />
                          {t("common.copy")}
                        </button>
                      )}
                      <button
                        type="button"
                        className="rounded-full border border-red-500/70 px-3 py-1 text-sm text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleRevoke(key.id)}
                        disabled={revokingKeyId === key.id}
                      >
                        {revokingKeyId === key.id
                          ? t("apiKeys.revoking")
                          : t("apiKeys.revoke")}
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
