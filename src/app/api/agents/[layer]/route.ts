import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { REASONING_PRESETS, DECISION_ALERTS } from '@/lib/mock-data'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

const PRIME_SYSTEM_PROMPT = `
You are ARTHAM PRIME™ — the sovereign Economic Reasoning Engine.
Your task is to analyze the user's economic query and generate a step-by-step Directed Acyclic Causal Graph (DAG) demonstrating how the event ripples through the physical economy of India to macroeconomic indicators.

You MUST respond ONLY with a valid JSON object matching this TypeScript structure:
{
  "nodes": [
    {
      "id": "string (e.g. n1, n2)",
      "label": "short name of causal event/step",
      "change": "quantitative impact description (e.g. +14% shipping costs)",
      "confidence": number (between 50 and 99),
      "evidence": "brief reference to a physical signal or source (e.g. Drewry Index, FASTag tolls)",
      "agents": ["FlowAgent", "TradeAgent", "RiskAgent", "MacroAgent", "AgriAgent", "InfrastructureAgent", "MobilityAgent", "ClimateAgent", "MarketAgent", "CapitalAgent"] (array of 1-3 participating agents),
      "status": "done"
    }
  ],
  "connections": [
    { "from": "node_id_1", "to": "node_id_2" }
  ]
}

Ensure the nodes are connected sequentially in a logical causal path. Output absolute valid JSON and nothing else.
`

const DECISION_SYSTEM_PROMPT = `
You are DECISION CENTER™ — the policy advisory engine for ARTHAM OS.
Generate 2 persona-specific strategic recommendations for: {PERSONA} (either RBI, Railway, Agriculture, or Investor).

You MUST respond ONLY with a valid JSON array matching this TypeScript structure:
[
  {
    "id": "string",
    "title": "high impact title",
    "metric": "indicator value (e.g. Food Inflation Forecast: +4.8% CPI Offset)",
    "description": "brief issue context",
    "recommendation": "strategic policy or investment action",
    "confidence": number (50-99),
    "impact": "HIGH" | "MED" | "LOW",
    "expectedOutcome": "result description"
  }
]
`

export async function POST(req: NextRequest, { params }: { params: Promise<{ layer: string }> }) {
  const { layer } = await params
  const body = await req.json()
  const { message, persona } = body

  // Check if API Key exists, if not use mock fallbacks immediately to prevent failure
  if (!process.env.GEMINI_API_KEY) {
    return handleFallback(layer, message, persona)
  }

  try {
    if (layer === 'prime') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `${PRIME_SYSTEM_PROMPT}\n\nUser Query: "${message}"`,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
      const text = response.text || ''
      const data = JSON.parse(text)
      return NextResponse.json({ graph: data, cached: false })
    }

    if (layer === 'decision_center') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `${DECISION_SYSTEM_PROMPT.replace('{PERSONA}', persona || 'RBI')}\n\nContext Signal: "${message}"`,
        config: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      })
      const text = response.text || ''
      const data = JSON.parse(text)
      return NextResponse.json({ alerts: data, cached: false })
    }

    // Default basic orchestrator brief
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are ARTHAM OS. Provide a brief 100-word macro status brief based on: ${message}`,
      config: { temperature: 0.4 }
    })
    return NextResponse.json({ text: response.text || '', cached: false })

  } catch (err) {
    console.error(`Gemini generation error for layer ${layer}:`, err)
    return handleFallback(layer, message, persona)
  }
}

function handleFallback(layer: string, message: string, persona?: string) {
  if (layer === 'prime') {
    const lower = (message || '').toLowerCase()
    let graphKey = 'index_drop'
    if (lower.includes('red sea') || lower.includes('fertilizer') || lower.includes('tomato')) {
      graphKey = 'redsea'
    } else if (lower.includes('monsoon') || lower.includes('rain') || lower.includes('inflation')) {
      graphKey = 'monsoon'
    } else if (lower.includes('bottleneck') || lower.includes('state') || lower.includes('delays')) {
      graphKey = 'bottleneck'
    }
    return NextResponse.json({ graph: REASONING_PRESETS[graphKey], cached: true })
  }

  if (layer === 'decision_center') {
    const personaKey = (persona || 'rbi').toLowerCase()
    return NextResponse.json({ alerts: DECISION_ALERTS[personaKey] || DECISION_ALERTS.rbi, cached: true })
  }

  return NextResponse.json({
    text: `[Cached Brief] Macro indicators stable. FreightGDP index tracking at 73.4. Port congestions under stress at Mundra (+78%) and Vizag (+92%). Suggest positioning riles for container turnaround.`,
    cached: true
  })
}
