export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { projectData, tool } = req.body

    const systemPrompt = `
    You are an expert strategic consultant and content architect. 
    Your goal is to take sparse or detailed user input and transform it into a professional, comprehensive project brief.
    
    The user is creating a: ${tool?.title || 'Document'} (${tool?.outputType || 'Project'})
    
    Output must be a VALID JSON object with the following fields:
    - documentName (Creative, professional title)
    - projectBrandName (Inferred or polished)
    - websiteUrl
    - primaryObjective (Clear, actionable business goal)
    - primaryAudience (Specific segment)
    - keyMessage (The core value proposition - single sentence)
    - think (What should the audience think?)
    - feel (What should the audience feel?)
    - do (What action should the audience take?)
    - successDefinition (KPIs or clear success markers)
    - structure (Recommended structure, e.g., "Narrative Flow", "Data-First")
    - tone (Adjectives describing the voice, e.g., "Professional, Bold")
    - dependencies (Teams or resources needed)
    - approvers (Roles likely to approve)
    - deliverables (What exactly is being made)
    - timeline (Realistic timeline if none provided)
    - budget (Estimated or "TBD")

    If the user provided specific input for a field, refine it but strictly keep the intent. 
    If a field is missing, INTELLIGENTLY IMPROVISE based on the context of the tool and other inputs.
    Do NOT output markdown code blocks. Just the raw JSON string.
  `

    const userPrompt = `
    User Input Context: ${JSON.stringify(projectData)}
  `

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
                temperature: 0.7,
            })
        })

        const data = await response.json()

        if (!data.choices || !data.choices[0]) {
            return res.status(500).json({ message: 'Failed to generate content' })
        }

        const content = data.choices[0].message.content

        // Attempt to parse JSON (handle potential markdown wrapping)
        let parsedContent;
        try {
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedContent = JSON.parse(cleanContent);
        } catch (e) {
            return res.status(500).json({ message: 'Failed to generate valid JSON' });
        }

        res.status(200).json(parsedContent)

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
