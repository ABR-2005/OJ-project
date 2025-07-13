import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const languageOptions = [
  { label: "C++", value: "cpp" },
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
];

const CodeEditor = ({ code, setCode }) => {
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");

  const getDefaultCode = (lang) => {
    switch (lang) {
      case 'python':
        return '# Start coding...';
      case 'javascript':
        return '// Start coding...';
      case 'java':
        return '// Start coding...';
      case 'cpp':
      default:
        return '// Start coding...';
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    // Update code to language-appropriate default if it's the generic default
    if (code === '// Start coding...' || code === '# Start coding...') {
      setCode(getDefaultCode(newLang));
    }
  };
  
  const handleThemeToggle = () => setTheme(theme === "vs-dark" ? "light" : "vs-dark");

  return (
    <div className="mb-4">
      {/* 🔽 Language & Theme Toolbar */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-200 font-medium">
            Language:
          </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="p-1 rounded border"
          >
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleThemeToggle}
          className="bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700"
        >
          Toggle {theme === "vs-dark" ? "Light" : "Dark"}
        </button>
      </div>

      {/* 🧠 Monaco Code Editor */}
      <Editor
        height="400px"
        language={language}
        theme={theme}
        value={code}
        defaultValue={getDefaultCode(language)}
        onChange={(value) => setCode(value)}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;
