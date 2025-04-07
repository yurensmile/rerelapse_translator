"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RiTranslate2, RiFileCopyLine } from "react-icons/ri";

export function TranslatorBox() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to translate");
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source_text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Translation failed");
      }

      setTranslatedText(data.data.text);
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate text");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyText = async () => {
    if (!translatedText) return;
    
    try {
      await navigator.clipboard.writeText(translatedText);
      toast.success("Text copied to clipboard");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy text");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 bg-card rounded-xl shadow-lg p-6 border border-primary/20 backdrop-blur-sm bg-background/95">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Normal Language
            </h2>
          </div>
          <Textarea
            placeholder="Enter text to translate..."
            className="flex-1 min-h-[200px] resize-none bg-background/50 border-2 rounded-lg shadow-inner transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-lg"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary/90 to-primary/60 bg-clip-text text-transparent">
              Relapse
            </h2>
          </div>
          <div className="relative flex-1">
            <Textarea
              readOnly
              className="w-full h-full min-h-[200px] resize-none bg-background/50 border-2 rounded-lg shadow-inner transition-all duration-200"
              value={translatedText}
              placeholder="Translation will appear here..."
            />
            {translatedText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyText}
                className="absolute bottom-2 right-2 text-muted-foreground hover:text-primary bg-background/80 backdrop-blur-sm border border-primary/20 shadow-lg transition-all duration-200 hover:shadow-primary/20"
              >
                <RiFileCopyLine className="mr-2" size={16} />
                Copy
              </Button>
            )}
          </div>
        </div>

        <div className="md:col-span-2 flex justify-center mt-4">
          <Button 
            onClick={handleTranslate} 
            disabled={isTranslating}
            className="min-w-[200px] bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 hover:shadow-primary/30"
            size="lg"
          >
            <RiTranslate2 className="mr-2" size={20} />
            {isTranslating ? "Translating..." : "Translate"}
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-6 text-center italic">
        Disclaimer: This AI-powered tool is provided solely for entertainment and creative purposes and is not guaranteed to be accurate. For critical needs, please consult professional translators.
      </p>
    </div>
  );
} 