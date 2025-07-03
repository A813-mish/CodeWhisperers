import { useState } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState('');

  async function reviewCode() {
    try {
      // safely handle import.meta.env
      // @ts-ignore if using TypeScript or to silence JS editors
      const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;
      const response = await axios.post(
        `${serverUrl}/ai/get-review`,
        { code }
      );
      setReview(response.data.review || response.data);
    } catch (error) {
      setReview("Error fetching review: " + error.message);
    }
  }

  return (
    <main className="app">
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
              width: "100%",
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
