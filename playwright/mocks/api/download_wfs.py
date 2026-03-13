import base64
import json
import time

from playwright.sync_api import Route


def handle_download_wfs(route: Route) -> None:
    # Parse the POST body to get the uuid
    request = route.request
    uuid = 'default_uuid'
    if request.post_data:
        post_data = json.loads(request.post_data)
        uuid = post_data['inputs']['uuid']

    csv_file_path = f'mocks/mock_data/download_service/{uuid}.csv'
    # Read the CSV file content
    with open(csv_file_path, 'rb') as f:
        csv_content = f.read()

    sse_response = get_sse_response(uuid, csv_content)

    # Fulfill the route with SSE response
    route.fulfill(
        status=200,
        headers={
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
        body=sse_response,
    )


def get_sse_response(uuid: str, data: bytes) -> str:
    """
    Generates a formatted Server-Sent Events (SSE) response string for a WFS CSV download.

    The function encodes the provided raw CSV data to Base64, splits it into chunks, and
    constructs an SSE stream containing connection status updates and sequential file data events.

    Args:
        uuid (str): The unique identifier for the download request.
        data (bytes): The raw CSV file content.

    Returns:
        str: A string formatted as an SSE stream, including connection events, file chunks and download completion status.
    """

    # Encode data to base64
    csv_base64 = base64.b64encode(data).decode('utf-8')

    # Split base64 data into chunks (similar to real API behavior)
    chunk_size = 16000  # Approximate chunk size
    chunks = [
        csv_base64[i : i + chunk_size]
        for i in range(0, len(csv_base64), chunk_size)
    ]

    # Build SSE response
    sse_response = ''
    total_bytes = 0

    # Connection established event
    sse_response += 'event:connection-established\n'
    sse_response += f'data:{json.dumps({"message": f"Starting WFS download for UUID: {uuid}", "status": "connected", "timestamp": int(time.time() * 1000)})}\n\n'

    # WFS request ready event
    sse_response += 'event:wfs-request-ready\n'
    sse_response += f'data:{json.dumps({"message": "Connecting to WFS server...", "timestamp": int(time.time() * 1000)})}\n\n'

    # Download started event
    sse_response += 'event:download-started\n'
    sse_response += f'data:{json.dumps({"message": "WFS server responded, starting data stream...", "timestamp": int(time.time() * 1000)})}\n\n'

    # File chunks
    for idx, chunk in enumerate(chunks, start=1):
        chunk_bytes = len(chunk)
        total_bytes += chunk_bytes

        is_final = idx == len(chunks)

        chunk_data = {
            'totalBytes': total_bytes,
            'timestamp': int(time.time() * 1000),
            'data': chunk,
            'chunkNumber': idx,
            'chunkSize': chunk_bytes,
        }

        if is_final:
            chunk_data['final'] = True

        sse_response += 'event:file-chunk\n'
        sse_response += f'data:{json.dumps(chunk_data)}\n'
        sse_response += f'id:{idx}\n\n'

    # Download complete event
    filename = f'{uuid}.csv'
    sse_response += 'event:download-complete\n'
    sse_response += f'data:{json.dumps({"totalChunks": len(chunks), "filename": filename, "message": "WFS data download completed successfully", "totalBytes": total_bytes})}\n\n'
    return sse_response
