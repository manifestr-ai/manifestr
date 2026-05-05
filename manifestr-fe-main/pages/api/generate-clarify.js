export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { projectData, tool, uploadedFiles = [], mode } = req.body

    // Build file context if files were uploaded
    let fileContext = ''
    if (uploadedFiles && uploadedFiles.length > 0) {
        fileContext = `\n\nUPLOADED FILES CONTEXT:\n`
        uploadedFiles.forEach((file, index) => {
            fileContext += `File ${index + 1}: ${file.name || 'Unknown'} (Type: ${file.type || 'Unknown'})\n`
            if (file.url) {
                fileContext += `URL: ${file.url}\n`
            }
        })
        fileContext += `\nThe user has uploaded ${uploadedFiles.length} file(s). Analyze these files and incorporate their content/context into your brief generation. For images, describe what they contain and how they should inform the document structure and content.\n`
    }

    // Include enriched context from sidebar
    let contextSidebarInfo = ''
    if (projectData.enrichedContext) {
        contextSidebarInfo = `\n\nUSER-PROVIDED CONTEXT FROM SIDEBAR:\n${projectData.enrichedContext}\n\nThis context is CRITICAL - it contains the user's specific requirements. Make sure ALL of these requirements are reflected in the final brief.\n`
    }

    const systemPrompt = `
    You are an expert strategic consultant and content architect. 
    Your goal is to take sparse or detailed user input and transform it into a professional, comprehensive project brief.
    
    The user is creating a: ${tool?.title || 'Document'} (${tool?.outputType || 'Project'})
    Mode: ${mode || 'Unknown'}
    ${fileContext}${contextSidebarInfo}
    
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

    // Build voice context if available
    let voiceContext = ''
    if (projectData.voiceTranscript) {
        voiceContext = `\n\nVOICE TRANSCRIPT (talk-to-me mode):\n"${projectData.voiceTranscript}"\n`
        
        if (projectData.voiceExtractedData) {
            voiceContext += `\nALREADY EXTRACTED INFORMATION from voice:\n${JSON.stringify(projectData.voiceExtractedData, null, 2)}\n`
            voiceContext += `\nIMPORTANT: Use the already extracted information above as the PRIMARY source. The voice transcript is provided for additional context only. DO NOT re-extract or override the already extracted fields.`
        } else {
            voiceContext += `\nParse this natural speech and extract all relevant project details. Pay special attention to verbal cues about objectives, audience, deliverables, and constraints.`
        }
    }

    const userPrompt = `
    User Input Context: ${JSON.stringify(projectData)}
    
    ${uploadedFiles.length > 0 ? `IMPORTANT: The user uploaded ${uploadedFiles.length} file(s). These files should heavily influence the brief. Analyze what these files likely contain and tailor the brief accordingly.` : ''}
    
    ${projectData.enrichedContext ? `CRITICAL CONTEXT: The user provided specific requirements in the sidebar. These MUST be incorporated into the brief:\n${projectData.enrichedContext}` : ''}
    ${voiceContext}
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
