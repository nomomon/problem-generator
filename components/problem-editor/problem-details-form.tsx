"use client";

import { useState } from "react";
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
      </div>
    </div>
  );
}
