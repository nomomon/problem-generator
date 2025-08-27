"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";

export type ProblemDetails = {
  name?: string;
  assets?: string[];
  difficulty?: "easy" | "medium" | "hard" | null;
  topics?: string[];
  // New source fields
  sourceId?: number;
  sourceName?: string;
  sourceEditionYear?: number | null;
  sourceEditionExtra?: string | null;
};

interface ProblemDetailsFormProps {
  details: ProblemDetails;
  onDetailsChange: (details: ProblemDetails) => void;
  className?: string;
  noCard?: boolean;
}

export function ProblemDetailsForm({
  details,
  onDetailsChange,
  className = "",
}: ProblemDetailsFormProps) {
  const [sources, setSources] = useState<Array<{ id: number; name: string }>>(
    [],
  );
  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    details.sourceId ? String(details.sourceId) : "",
  );
  const [newSourceNameLocal, setNewSourceNameLocal] = useState(
    details.sourceName || "",
  );
  const [newTopic, setNewTopic] = useState("");
  const [newAsset, setNewAsset] = useState("");

  const handleNameChange = (value: string) => {
    onDetailsChange({ ...details, name: value || undefined });
  };

  const handleDifficultyChange = (value: string) => {
    const difficulty =
      value === "none" ? null : (value as "easy" | "medium" | "hard");
    onDetailsChange({ ...details, difficulty });
  };

  const addTopic = () => {
    if (newTopic.trim() && !details.topics?.includes(newTopic.trim())) {
      const updatedTopics = [...(details.topics || []), newTopic.trim()];
      onDetailsChange({ ...details, topics: updatedTopics });
      setNewTopic("");
    }
  };

  const removeTopic = (topicToRemove: string) => {
    const updatedTopics =
      details.topics?.filter((topic) => topic !== topicToRemove) || [];
    onDetailsChange({
      ...details,
      topics: updatedTopics.length ? updatedTopics : undefined,
    });
  };

  const addAsset = () => {
    if (newAsset.trim() && !details.assets?.includes(newAsset.trim())) {
      const updatedAssets = [...(details.assets || []), newAsset.trim()];
      onDetailsChange({ ...details, assets: updatedAssets });
      setNewAsset("");
    }
  };

  // Fetch sources for dropdown
  useEffect(() => {
    let cancelled = false;
    const fetchSources = async () => {
      try {
        const res = await fetch("/api/sources");
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) setSources(json.sources || []);
      } catch (e) {
        // ignore
      }
    };

    fetchSources();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle selection or creation of source
  const handleSelectSource = (value: string) => {
    if (value === "" || value === "__none__") {
      // cleared selection
      setSelectedSourceId("");
      onDetailsChange({
        ...details,
        sourceId: undefined,
        sourceName: undefined,
        sourceEditionYear: undefined,
        sourceEditionExtra: undefined,
      });
      setNewSourceNameLocal("");
      return;
    }

    setSelectedSourceId(value);
    const id = Number(value);
    const source = sources.find((s) => s.id === id);
    onDetailsChange({
      ...details,
      sourceId: id,
      sourceName: undefined,
    });
    setNewSourceNameLocal("");
  };

  const handleNewSourceName = (value: string) => {
    setNewSourceNameLocal(value);
    if (value.trim()) {
      // using a new source; clear selected id
      setSelectedSourceId("");
      onDetailsChange({
        ...details,
        sourceId: undefined,
        sourceName: value.trim(),
      });
    } else {
      onDetailsChange({ ...details, sourceName: undefined });
    }
  };

  const handleEditionYearChange = (value: string) => {
    const year = value === "" ? undefined : Number(value);
    onDetailsChange({ ...details, sourceEditionYear: year });
  };

  const handleEditionExtraChange = (value: string) => {
    onDetailsChange({ ...details, sourceEditionExtra: value || undefined });
  };

  const removeAsset = (assetToRemove: string) => {
    const updatedAssets =
      details.assets?.filter((asset) => asset !== assetToRemove) || [];
    onDetailsChange({
      ...details,
      assets: updatedAssets.length ? updatedAssets : undefined,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Problem Name */}
      <div className="space-y-2">
        <Label htmlFor="problem-name">Problem Name</Label>
        <Input
          id="problem-name"
          placeholder="Enter a descriptive name for the problem"
          value={details.name || ""}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty Level</Label>
        <Select
          value={details.difficulty || "none"}
          onValueChange={handleDifficultyChange}
        >
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="Select difficulty level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No difficulty set</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Topics */}
      <div className="space-y-2">
        <Label>Topics</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a topic..."
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTopic();
              }
            }}
          />
          <Button type="button" onClick={addTopic} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {details.topics && details.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {details.topics.map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {topic}
                <button
                  type="button"
                  onClick={() => removeTopic(topic)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Assets */}
      <div className="space-y-2">
        <Label>Assets (URLs)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add an asset URL..."
            value={newAsset}
            onChange={(e) => setNewAsset(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAsset();
              }
            }}
          />
          <Button type="button" onClick={addAsset} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {details.assets && details.assets.length > 0 && (
          <div className="space-y-2 mt-2">
            {details.assets.map((asset, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-muted rounded-md"
              >
                <span className="flex-1 text-sm font-mono truncate">
                  {asset}
                </span>
                <button
                  type="button"
                  onClick={() => removeAsset(asset)}
                  className="hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Source */}
        <div className="space-y-2">
          <Label>Source</Label>
          <div className="flex gap-2">
            <Select value={selectedSourceId} onValueChange={handleSelectSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select a source or add new" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Or add new source (e.g. IMO)"
              value={newSourceNameLocal}
              onChange={(e) => handleNewSourceName(e.target.value)}
            />
          </div>

          {(selectedSourceId || newSourceNameLocal) && (
            <div className="space-y-2 mt-2">
              <Label>Edition (optional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Year (e.g. 2020)"
                  type="number"
                  value={details.sourceEditionYear ?? ""}
                  onChange={(e) => handleEditionYearChange(e.target.value)}
                />
                <Input
                  placeholder="Extra info (Round 2, Fall Session)"
                  value={details.sourceEditionExtra || ""}
                  onChange={(e) => handleEditionExtraChange(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
