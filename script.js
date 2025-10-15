document.getElementById('grabber-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const urlInput = document.getElementById('youtube-url');
  const url = urlInput.value.trim();
  const videoId = extractVideoId(url);
  const resultDiv = document.getElementById('thumbnail-results');
  if (!videoId) {
    resultDiv.innerHTML = '<div><strong style="color:#d10025">Invalid YouTube URL. Please check and try again.</strong></div>';
    return;
  }
  const sizes = [
    { key: 'maxresdefault', label: 'Max Resolution' },
    { key: 'sddefault', label: 'Standard Definition' },
    { key: 'hqdefault', label: 'High Quality' },
    { key: 'mqdefault', label: 'Medium Quality' },
    { key: 'default', label: 'Default' }
  ];
  let html = '';
  sizes.forEach(size => {
    const imgUrl = `https://img.youtube.com/vi/${videoId}/${size.key}.jpg`;
    html += `<div>
      <img src="${imgUrl}" alt="YouTube thumbnail ${size.label}" loading="lazy">
      <div>
        <a href="${imgUrl}" download="youtube-thumbnail-${size.key}.jpg">Download (${size.label})</a>
      </div>
    </div>`;
  });
  resultDiv.innerHTML = html;
});

function extractVideoId(url) {
  // Handles various YouTube URL formats
  // https://www.youtube.com/watch?v=VIDEOID
  // https://youtu.be/VIDEOID
  // https://www.youtube.com/embed/VIDEOID
  // https://www.youtube.com/watch?v=VIDEOID&ab_channel=Name
  const regex = /(?:v=|\/embed\/|youtu\.be\/|\/v\/|\/watch\?v=|\/watch\?.+&v=)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  if (match && match[1]) return match[1];
  // Also handles short URLs like youtu.be/VIDEOID
  const shortRegex = /youtu\.be\/([A-Za-z0-9_-]{11})/;
  const shortMatch = url.match(shortRegex);
  if (shortMatch && shortMatch[1]) return shortMatch[1];
  // Try to extract from standard URL
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }
  } catch (e) {}
  return null;
}
