import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);

  const [review, setReview] = useState('');

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
    console.log("Using server:", SERVER_URL);

    if (!SERVER_URL) {
      console.error("SERVER_URL is undefined. Did you forget to prefix with VITE_ and restart the dev server?");
      setReview("Error: SERVER_URL is undefined.");
      return;
    }

    try {
      const response = await axios.post(
        `${SERVER_URL}/ai/get-review`,
        { code }
      );

      // Ensure the response is Markdown-friendly
      const reviewText = response.data.review || response.data;
      // If your backend does not wrap in code block, wrap it here:
      const wrappedReview = `\`\`\`markdown
${reviewText}
\`\`\``;

      setReview(wrappedReview);

    } catch (error) {
      console.error("Error fetching review:", error);
      setReview("Error: Could not fetch review.");
    }
  }

  return (
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
              border: "1px solid #ddd",
              borderRadius: "5px",
              height: "100%",
              width: "100%"
            }}
          />
        </div>
        <div onClick={reviewCode} className="review">
          Review
        </div>
      </div>
      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review}
        </Markdown>
      </div>
    </main>
  );
}

export default App;
