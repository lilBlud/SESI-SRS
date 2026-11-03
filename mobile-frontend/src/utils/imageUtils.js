/**
 * Utility to download an image from a URL or base64 data URI to the user's device.
 * Fetches the image as a blob to bypass cross-origin download restrictions.
 */
export async function saveImage(url, filename) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Network error');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || 'sesi-post.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Failed to download image:', err);
    alert('Failed to save image automatically. You may need to right-click (or long-press) the image and save it manually.');
  }
}

