const express = require("express");
const bodyParser = require("body-parser");
const { PythonShell } = require("python-shell");

const app = express();

// Set up body parsing middleware
app.use(bodyParser.json());

// Configure the path to your Python installation
PythonShell.defaultOptions = { pythonPath: "path/to/python" };

// Define API endpoint for text summarization
app.post("/summarize", (req, res) => {
  // Get input text and sentence count from request body
  const { text, sentenceCount } = req.body;

  // Tokenize sentences using NLTK in Python
  PythonShell.runString(
    `
    import nltk
    nltk.download('punkt')
    tokens = nltk.sent_tokenize('${text}')
    print(tokens[:${sentenceCount}])
  `,
    null,
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal server error");
      } else {
        // Construct summary from NLTK output
        const summary = results[0]
          .replace(/'/g, "")
          .replace(/[\[\]]/g, "")
          .trim();
        res.json({ summary });
      }
    }
  );
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Define API endpoint
const API_URL = "http://localhost:3000/summarize";

// Define input text and sentence count
const text =
  "This is a sentence. This is another sentence. This is a third sentence.";
const sentenceCount = 2;
