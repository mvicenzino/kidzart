/**
 * Kidzart MCP Server
 * 
 * This server implements the Model Context Protocol (MCP) to provide
 * tools for monitoring and fixing the Kidzart application.
 * 
 * Features:
 * - Monitor build errors
 * - Check file changes
 * - Provide context about the app structure
 * - Suggest fixes for common issues
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);
const APP_ROOT = '/Users/michaelvicenzino/Documents/GitHub/kidzart';

// Create server instance
const server = new Server(
    {
        name: 'kidzart-mcp',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
            resources: {},
        },
    }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'check_build',
                description: 'Run npm build and check for errors',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'get_errors',
                description: 'Get current build/runtime errors from the dev server',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'list_components',
                description: 'List all React components in the app',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'get_component',
                description: 'Get the source code of a specific component',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Component name (e.g., "Navbar", "ArtCard")',
                        },
                    },
                    required: ['name'],
                },
            },
            {
                name: 'check_env',
                description: 'Check if environment variables are configured',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'get_artwork_count',
                description: 'Get the number of artworks in the gallery',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'suggest_fix',
                description: 'Get suggested fixes for a specific error',
                inputSchema: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'The error message to analyze',
                        },
                    },
                    required: ['error'],
                },
            },
        ],
    };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
        case 'check_build': {
            try {
                const { stdout, stderr } = await execAsync('npm run build', { cwd: APP_ROOT });
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Build successful!\n\nOutput:\n${stdout}`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Build failed!\n\nErrors:\n${error.stderr || error.message}`,
                        },
                    ],
                };
            }
        }

        case 'get_errors': {
            // Check for common error patterns in recent build output
            try {
                const { stdout } = await execAsync('npm run build 2>&1 | head -100', {
                    cwd: APP_ROOT,
                    shell: true
                });
                const hasErrors = stdout.includes('error') || stdout.includes('Error');
                return {
                    content: [
                        {
                            type: 'text',
                            text: hasErrors
                                ? `Errors found:\n${stdout}`
                                : 'No errors detected in build output.',
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error checking: ${error.message}`,
                        },
                    ],
                };
            }
        }

        case 'list_components': {
            try {
                const componentsDir = path.join(APP_ROOT, 'src/components');
                const files = await fs.readdir(componentsDir);
                const components = files.filter(f => f.endsWith('.jsx') || f.endsWith('.tsx'));
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Components:\n${components.map(c => `- ${c}`).join('\n')}`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error listing components: ${error.message}`,
                        },
                    ],
                };
            }
        }

        case 'get_component': {
            try {
                const componentPath = path.join(APP_ROOT, 'src/components', `${args.name}.jsx`);
                const content = await fs.readFile(componentPath, 'utf-8');
                return {
                    content: [
                        {
                            type: 'text',
                            text: content,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error reading component: ${error.message}`,
                        },
                    ],
                };
            }
        }

        case 'check_env': {
            try {
                const envPath = path.join(APP_ROOT, '.env.local');
                const content = await fs.readFile(envPath, 'utf-8');
                const hasClerk = content.includes('VITE_CLERK_PUBLISHABLE_KEY=pk_');
                const hasSupabase = content.includes('VITE_SUPABASE_URL');

                return {
                    content: [
                        {
                            type: 'text',
                            text: `Environment Status:
- Clerk: ${hasClerk ? '✅ Configured' : '❌ Not configured'}
- Supabase: ${hasSupabase ? '✅ Configured' : '❌ Not configured'}`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No .env.local file found. Environment not configured.',
                        },
                    ],
                };
            }
        }

        case 'get_artwork_count': {
            try {
                const mockDataPath = path.join(APP_ROOT, 'src/data/mockData.js');
                const content = await fs.readFile(mockDataPath, 'utf-8');
                const matches = content.match(/id:\s*\d+/g);
                const count = matches ? matches.length : 0;

                return {
                    content: [
                        {
                            type: 'text',
                            text: `Gallery contains ${count} artworks.`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error counting artworks: ${error.message}`,
                        },
                    ],
                };
            }
        }

        case 'suggest_fix': {
            const error = args.error.toLowerCase();
            let suggestion = 'No specific fix available for this error.';

            if (error.includes('clerk') || error.includes('publishable')) {
                suggestion = `Clerk Error Fix:
1. Check .env.local has VITE_CLERK_PUBLISHABLE_KEY
2. Verify the key starts with pk_test_ or pk_live_
3. Restart the dev server after changing env vars
4. Ensure ClerkProvider wraps your app in main.jsx`;
            } else if (error.includes('supabase') || error.includes('database')) {
                suggestion = `Supabase Error Fix:
1. Check .env.local has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
2. Run database/schema.sql in Supabase SQL Editor
3. Check RLS policies are configured correctly`;
            } else if (error.includes('import') || error.includes('module')) {
                suggestion = `Import Error Fix:
1. Check the import path is correct
2. Ensure the file exists at the specified path
3. Run npm install if a package is missing`;
            } else if (error.includes('undefined') || error.includes('null')) {
                suggestion = `Null/Undefined Error Fix:
1. Add null checks: value?.property
2. Provide default values: value || defaultValue
3. Check if data is being passed as props correctly`;
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: suggestion,
                    },
                ],
            };
        }

        default:
            return {
                content: [
                    {
                        type: 'text',
                        text: `Unknown tool: ${name}`,
                    },
                ],
            };
    }
});

// Define resources (app context)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: 'kidzart://structure',
                name: 'App Structure',
                description: 'Overview of the Kidzart app structure',
                mimeType: 'text/plain',
            },
            {
                uri: 'kidzart://taxonomy',
                name: 'Art Taxonomy',
                description: 'Categories and filters available for artwork',
                mimeType: 'text/plain',
            },
        ],
    };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (uri === 'kidzart://structure') {
        return {
            contents: [
                {
                    uri,
                    mimeType: 'text/plain',
                    text: `Kidzart App Structure:

src/
├── components/
│   ├── Navbar.jsx      - Navigation with Clerk auth
│   ├── ArtCard.jsx     - Individual artwork cards
│   ├── ArtModal.jsx    - Expanded view with donate/print
│   └── FilterBar.jsx   - Gallery filtering
├── data/
│   └── mockData.js     - Artwork data + taxonomy
├── lib/
│   └── database.js     - Supabase client
├── App.jsx             - Main app component
├── main.jsx            - Entry with Clerk provider
└── index.css           - Global styles

Key Features:
- Gallery with filtering by age, medium, theme
- Highlights section for featured artwork
- Donate to education fund
- Order prints in multiple sizes
- Download 4K digital prints
- Clerk authentication
- Supabase PostgreSQL database`,
                },
            ],
        };
    }

    if (uri === 'kidzart://taxonomy') {
        return {
            contents: [
                {
                    uri,
                    mimeType: 'text/plain',
                    text: `Kidzart Art Taxonomy:

Age Groups:
- toddler: 2-3 years
- preschool: 4-5 years
- early-elementary: 6-7 years
- elementary: 8-9 years
- tween: 10-12 years

Mediums:
- crayon, markers, watercolor, colored-pencils
- digital, mixed-media, finger-paint

Themes:
- animals, nature, family, fantasy, space
- vehicles, abstract, food, ocean, buildings

Styles:
- realistic, abstract, cartoon, expressionist

Categories:
- Drawings, Paintings, Crafts`,
                },
            ],
        };
    }

    throw new Error(`Unknown resource: ${uri}`);
});

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Kidzart MCP Server running...');
}

main().catch(console.error);
