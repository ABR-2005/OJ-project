import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode, language }) => {
  return (
    <div className="border rounded shadow">
      <Editor
        height="400px"
        language={language === "cpp" ? "cpp" : language}
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
        defaultValue="// Write your code here"
      />
    </div>
  );
};

export default CodeEditor;
