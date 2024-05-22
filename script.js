const dataFile = 'sawtooth.dat';
const apiURL = 'https://en.wikipedia.org/w/api.php';
const apiRequest = {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: ''
};
const contentDiv = document.getElementById('content');
const fallbackButton = document.getElementById('fallbackButton');


async function fetchData(useWikipediaAPI = false) {
  try {
    const response = await fetch(dataFile);
    const mediawikiText = await response.text();

    if (useWikipediaAPI) {
      const params = new URLSearchParams({
        action: 'parse',
        format: 'json',
        contentmodel: 'wikitext',
        text: mediawikiText,
        prop: 'text|modules|jsconfigvars|parsewarnings|displaytitle|categories|limitreportdata',
        origin: '*'
      });
      apiRequest.body = params.toString();
      const apiResponse = await fetch(apiURL, apiRequest);
      const data = await apiResponse.json();

      if (data.parse.parsewarnings) {
        console.warn('MediaWiki parse warnings:', data.parse.parsewarnings);
      }
      if (data.parse.limitreportdata) {
        console.warn('MediaWiki Limit Reports:', data.parse.limitreportdata);
      }
      if (data.parse.displaytitle) {
        document.title = data.parse.displaytitle;
      }
      contentDiv.innerHTML = data.parse.text['*'];

      if (data.parse.modules) {
        data.parse.modules.forEach(module => {
          if (module.type === 'text/css') {
            const styleElement = document.createElement('style');
            styleElement.textContent = module.content;
            document.head.appendChild(styleElement);
          } else if (module.type === 'application/javascript') {
            const scriptElement = document.createElement('script');
            scriptElement.textContent = module.content;
            document.body.appendChild(scriptElement);
          }
        });
      }
    } else {
      contentDiv.innerHTML = parseMediaWikiText(mediawikiText);
    }
  } catch (error) {
    console.error('Error fetching or parsing content:', error);
  }
}

fallbackButton.addEventListener('click', () => fetchData(true));

fetchData();
