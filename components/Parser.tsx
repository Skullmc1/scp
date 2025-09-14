import React from 'react';

export interface SCPData {
  itemNumber: string;
  name: string;
  objectClass: string;
  description: string;
  containment: string;
  image?: string;
  additionalInfo?: string;
}

export interface ErrorResponse {
  error: string;
}

interface ParserProps {
  scpIdentifier: string;
  onDataFetched: (data: SCPData | ErrorResponse) => void;
  onError: (error: string) => void;
}

const Parser: React.FC<ParserProps> = ({ scpIdentifier, onDataFetched, onError }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasFetched, setHasFetched] = React.useState(false);

  React.useEffect(() => {
    if (!scpIdentifier || hasFetched) {
      return;
    }

    const fetchSCPData = async () => {
      setIsLoading(true);
      setHasFetched(true);

      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
          const errorMessage = "API key not found.";
          console.error(errorMessage);
          onError(errorMessage);
          return;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Provide a detailed summary of SCP-${scpIdentifier} in JSON format. If the scp number is less than 1000 but still has 4 digits, ignore the first zero. Example SCP-0096 is SCP-096 (shy guy). The JSON object MUST contain ALL of the following exact fields. If a value is unavailable or the SCP is not found, use an empty string for the value.
- itemNumber: "SCP-${scpIdentifier}"
- name: string (e.g., "The official name")
- objectClass: string (e.g., "Safe", "Euclid", "Keter")
- description: string (a detailed description)
- containment: string (containment procedures)
- additionalInfo: string (any additional relevant information, or "" if not found)

Ensure the response is ONLY the JSON object, with no other text, conversational fillers, or markdown outside of the JSON. If the SCP does not exist, provide an error JSON object with the field 'error' and a descriptive string value.
`
              }]
            }],
            generationConfig: {
              responseMimeType: "application/json",
            }
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Response Error:", response.status, errorText);
          throw new Error(`API request failed with status ${response.status}. See console for details.`);
        }

        const jsonResponse = await response.json();
        const scpContent = jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!scpContent) {
          throw new Error("Invalid response format from API. No content part found.");
        }

        let data;
        try {
          data = JSON.parse(scpContent);
        } catch (parseError) {
          throw new Error(`Failed to parse JSON from API response. Raw content: ${scpContent}`);
        }

        if (data.error) {
            onDataFetched(data as ErrorResponse);
        } else {
            const processedData: SCPData = {
                itemNumber: data.itemNumber || `SCP-${scpIdentifier}`,
                name: data.name || "Designation Unknown",
                objectClass: data.objectClass || "Unassigned",
                description: data.description || "No description available.",
                containment: data.containment || "Containment procedures not found.",
                additionalInfo: data.additionalInfo || ""
            };

            onDataFetched(processedData);
        }

      } catch (error) {
        const errorMessage = `Failed to retrieve data for SCP-${scpIdentifier}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMessage);
        onError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSCPData();
  }, [scpIdentifier, hasFetched, onDataFetched, onError]);

  return (
    <div className="hidden">    </div>
  );
};

export default Parser;