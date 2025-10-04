import { createRoot } from 'react-dom/client';

function PressRelease({ releases }) {
  return (
    <>
      {releases.map((release, index) => (
        <div key={index} className="press-release-item">
          <div
            className="press-release-title"
            dangerouslySetInnerHTML={{ __html: release.titleHTML }}
          />
          <div
            className="press-release-info"
            dangerouslySetInnerHTML={{ __html: release.infoHTML }}
          />
          <div>
            {release.linkURL && (
              <a href={release.linkURL} className="press-release-button">
                Download
              </a>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export default function decorate(block) {
  if (block.dataset.decorated) {
    return;
  }
  block.dataset.decorated = 'true';
  block.classList.add('press-release');

  // Skip the first row, which is often a header in AEM tables.
  const releaseRows = [...block.children].slice(1);

  const releasesData = releaseRows.map((row) => {
    const [titleCell, infoCell, linkCell] = [...row.children];
    return {
      titleHTML: titleCell?.innerHTML || '',
      infoHTML: infoCell?.innerHTML || '',
      linkURL: linkCell?.querySelector('a')?.href || '',
    };
  });

  block.innerHTML = '';
  const root = createRoot(block);
  root.render(<PressRelease releases={releasesData} />);
}
