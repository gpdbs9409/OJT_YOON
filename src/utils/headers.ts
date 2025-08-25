const fakeUseragent = require('fake-useragent');

class HeadersGenerator {
  /**
   * 랜덤 User-Agent 생성
   * @returns {string} 랜덤 User-Agent
   */
  static getRandomUserAgent(): string {
    try {
      return fakeUseragent.random;
    } catch (error) {
      // fake-useragent 실패 시 기본 User-Agent 사용
      const fallbackAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ];
      const randomIndex = Math.floor(Math.random() * fallbackAgents.length);
      return fallbackAgents[randomIndex]!;
    }
  }

  /**
   * 랜덤 Accept 헤더 생성
   * @returns {string} 랜덤 Accept 헤더
   */
  static getRandomAccept(): string {
    const acceptHeaders = [
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    ];
    const randomIndex = Math.floor(Math.random() * acceptHeaders.length);
    return acceptHeaders[randomIndex]!;
  }

  /**
   * 랜덤 Accept-Language 헤더 생성
   * @returns {string} 랜덤 Accept-Language 헤더
   */
  static getRandomAcceptLanguage(): string {
    const languages = [
      'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'en-US,en;q=0.9,ko;q=0.8',
      'ko,en-US;q=0.9,en;q=0.8',
      'en-GB,en;q=0.9,ko;q=0.8',
      'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3'
    ];
    const randomIndex = Math.floor(Math.random() * languages.length);
    return languages[randomIndex]!;
  }

  /**
   * 랜덤 Accept-Encoding 헤더 생성
   * @returns {string} 랜덤 Accept-Encoding 헤더
   */
  static getRandomAcceptEncoding(): string {
    const encodings = [
      'gzip, deflate, br',
      'gzip, deflate',
      'gzip, deflate, br, zstd',
      'gzip, deflate, br, compress',
      'gzip, deflate, br, identity'
    ];
    const randomIndex = Math.floor(Math.random() * encodings.length);
    return encodings[randomIndex]!;
  }

  /**
   * 랜덤 Referer 헤더 생성 (선택적)
   * @returns {string|null} 랜덤 Referer 헤더 또는 null
   */
  static getRandomReferer(): string | null {
    // 30% 확률로 Referer 헤더 추가
    if (Math.random() < 0.3) {
      const referers = [
        'https://www.google.com/',
        'https://www.naver.com/',
        'https://www.daum.net/',
        'https://www.bing.com/',
        'https://www.yahoo.com/',
        null
      ];
      const randomIndex = Math.floor(Math.random() * referers.length);
      return referers[randomIndex]!;
    }
    return null;
  }

  /**
   * 크롤링용 랜덤 헤더 생성
   * @param options 추가 옵션
   * @returns 랜덤 헤더 객체
   */
  static generateCrawlingHeaders(options: { overrideHeaders?: Record<string, string> } = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': this.getRandomUserAgent(),
      'Accept': this.getRandomAccept(),
      'Accept-Language': this.getRandomAcceptLanguage(),
      'Accept-Encoding': this.getRandomAcceptEncoding(),
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1'
    };

    // Referer 헤더 추가 (선택적)
    const referer = this.getRandomReferer();
    if (referer) {
      headers['Referer'] = referer;
    }

    // 추가 옵션으로 헤더 오버라이드
    if (options.overrideHeaders) {
      Object.assign(headers, options.overrideHeaders);
    }

    return headers;
  }

  /**
   * 특정 브라우저 타입의 헤더 생성
   * @param browserType 브라우저 타입 ('chrome', 'firefox', 'safari', 'edge')
   * @returns 해당 브라우저 스타일의 헤더
   */
  static generateBrowserSpecificHeaders(browserType: string = 'chrome'): Record<string, string> {
    const baseHeaders = this.generateCrawlingHeaders();
    
    switch (browserType.toLowerCase()) {
      case 'firefox':
        baseHeaders['User-Agent'] = fakeUseragent.firefox || baseHeaders['User-Agent'];
        baseHeaders['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
        delete baseHeaders['Sec-Ch-Ua'];
        delete baseHeaders['Sec-Ch-Ua-Mobile'];
        delete baseHeaders['Sec-Ch-Ua-Platform'];
        break;
        
      case 'safari':
        baseHeaders['User-Agent'] = fakeUseragent.safari || baseHeaders['User-Agent'];
        baseHeaders['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
        delete baseHeaders['Sec-Ch-Ua'];
        delete baseHeaders['Sec-Ch-Ua-Mobile'];
        delete baseHeaders['Sec-Ch-Ua-Platform'];
        break;
        
      case 'edge':
        baseHeaders['User-Agent'] = fakeUseragent.edge || baseHeaders['User-Agent'];
        break;
        
      default: // chrome
        baseHeaders['User-Agent'] = fakeUseragent.chrome || baseHeaders['User-Agent'];
        break;
    }
    
    return baseHeaders;
  }
}

module.exports = { HeadersGenerator };
