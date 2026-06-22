import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>ft_transcendence Public API Docs</title>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui.css">
                <style>
                    html {
                        box-sizing: border-box;
                        overflow: -moz-scrollbars-vertical;
                        overflow-y: scroll;
                    }
                    *, *:before, *:after {
                        box-sizing: inherit;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                </style>
            </head>
            <body>
                <div id="swagger-ui"></div>
                <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui-bundle.js"></script>
                <script>
                    window.onload = () => {
                        SwaggerUIBundle({
                            url: '/openapi.yaml',
                            dom_id: '#swagger-ui',
                            presets: [
                                SwaggerUIBundle.presets.apis,
                                SwaggerUIBundle.presets.managed,
                            ],
                            layout: 'BaseLayout',
                            defaultModelsExpandDepth: 1,
                            deepLinking: true,
                        });
                    }
                </script>
            </body>
            </html>
        `;

        return new NextResponse(html, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    } catch (error) {
        console.error('Failed to load API documentation:', error);
        return NextResponse.json(
            { error: 'Failed to load API documentation' },
            { status: 500 }
        );
    }
}
