import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

describe('Performance Testing', () => {
  it('meets performance benchmarks', async () => {
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {
      logLevel: 'info',
      output: 'json',
      port: chrome.port
    };

    const results = await lighthouse('http://localhost:3000', options);
    expect(results.lhr.categories.performance.score).toBeGreaterThan(0.9);
    
    await chrome.kill();
  });
}); 