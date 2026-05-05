export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { transcript } = req.body

  if (!transcript || transcript.trim().length === 0) {
    return res.status(400).json({ message: 'Transcript is required' })
  }

  const systemPrompt = `You are an expert at extracting structured project information from voice transcripts.

Analyze the following voice transcript and extract these specific fields:
- documentType: Type of document mentioned (pitch deck, presentation, report, etc.)
- documentName: A suggested professional name for the document
- projectName: The name of the project/product/company
- websiteUrl: Any website URL mentioned
- supportingLinks: Any other links or resources mentioned
- deadlines: Any timeline or deadline mentioned
- purpose: The main purpose/goal of the project
- keyMessage: The core message or value proposition
- audience: Target audience mentioned
- keyImpact: Expected impact or results

Return ONLY a JSON object with these fields. If a field is not mentioned in the transcript, set it to null.
Be intelligent about inferring information - for example, if someone says "we help teams be 3x more productive", that's the keyImpact.

Example output format:
{
  "documentType": "Pitch Deck",
  "documentName": "AI Productivity Platform Series A Pitch",
  "projectName": "AI-powered productivity platform",
  "websiteUrl": null,
  "supportingLinks": null,
  "deadlines": "next Friday",
  "purpose": "Raise $5 million in Series A funding",
  "keyMessage": "Help teams automate repetitive tasks",
  "audience": "Series A investors",
  "keyImpact": "3x productivity increase"
}`

  const userPrompt = `Voice transcript to analyze:\n\n"${transcript}"\n\nExtract the structured information as JSON.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent extraction
        response_format: { type: "json_object" }
      })
    })

    const data = await response.json()

    if (!data.choices || !data.choices[0]) {
      console.error('OpenAI API error:', data)
      return res.status(500).json({ message: 'Failed to analyze transcript' })
    }

    const content = data.choices[0].message.content

    let extractedData
    try {
      extractedData = JSON.parse(content)
    } catch (e) {
      console.error('Failed to parse AI response:', content)
      return res.status(500).json({ message: 'Failed to parse extracted data' })
    }

    // Return the extracted structured data
    res.status(200).json(extractedData)

  } catch (error) {
    console.error('Error analyzing transcript:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
