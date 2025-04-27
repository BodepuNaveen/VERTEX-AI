export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Pre-flight request handled
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const inputText = req.body.text;

  const vertexAPIKey = 'AIzaSyDXLJtX8FMcMb6x-Te_om49b6ZShM4-IPA'; // Your Vertex AI API Key

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=' + vertexAPIKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: "Summarize this customer service conversation in a few lines:\n\n" + inputText,
      temperature: 0.2,
      maxOutputTokens: 512,
      topP: 1,
      topK: 40
    })
  });

  const data = await response.json();

  if (data.candidates && data.candidates.length > 0) {
    const summary = data.candidates[0].output;
    res.status(200).json({ summary });
  } else {
    res.status(500).json({ error: 'Summary generation failed' });
  }
}
