import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build the NYC Open Data API URL
    const baseUrl = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json';
    const params = new URLSearchParams();
    
    // Forward query parameters
    for (const [key, value] of searchParams.entries()) {
      params.append(key, value);
    }
    
    // Set default limit if not provided
    if (!params.has('$limit')) {
      params.append('$limit', '1000');
    }
    
    // Set default ordering
    if (!params.has('$order')) {
      params.append('$order', 'created_date DESC');
    }
    
    const apiUrl = `${baseUrl}?${params.toString()}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'X-App-Token': process.env.NYC_OPEN_DATA_TOKEN || '', // Optional API token
      },
    });
    
    if (!response.ok) {
      throw new Error(`NYC Open Data API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching NYC complaints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NYC complaints data' },
      { status: 500 }
    );
  }
}
