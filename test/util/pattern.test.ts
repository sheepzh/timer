import { extractHostname, isBrowserUrl, isHomepage, isIpAndPort, isValidHost } from "../../src/util/pattern"

test('browser url', () => {
    // chrome
    expect(isBrowserUrl('chrome://settings/')).toBeTruthy()
    expect(isBrowserUrl('chrome-extension://hkjmfadlepammjmjiihpongliebpcnba/static/app.html#/data/report')).toBeTruthy()
    // firefox
    expect(isBrowserUrl('about:addons')).toBeTruthy()
    // edge
    expect(isBrowserUrl('edge://extensions/')).toBeTruthy()
    expect(isBrowserUrl('https://www.jss.com.cn/')).toBeFalsy()
})

test('ip and port', () => {
    expect(isIpAndPort('222.222.22.01')).toBeFalsy()
    expect(isIpAndPort('222.222.22.100')).toBeTruthy()
    expect(isIpAndPort('222.222.22.1:1234')).toBeTruthy()
    // 256 is invalid
    expect(isIpAndPort('222.222.22.256')).toBeFalsy()
    expect(isIpAndPort('222.222.22')).toBeFalsy()
    expect(isIpAndPort('222.222.22.2:65535')).toBeTruthy()
    // 65536 is invalid port
    expect(isIpAndPort('222.222.22.2:65536')).toBeFalsy()
})

test('merge host origin', () => {
    expect(isValidHost('wwdad.basd.com.111:12345')).toBeTruthy()
    expect(isValidHost('wwdad.basd.com.a111a:12345')).toBeTruthy()
    expect(isValidHost('wwdad.basd.**:12345')).toBeFalsy()
    expect(isValidHost('wwdad.basd.**:65536')).toBeFalsy()
    expect(isValidHost('wwdad.basd.*.*')).toBeTruthy()
    expect(isValidHost('wwdad.basd..*')).toBeFalsy()
    expect(isValidHost('wwdad*.*')).toBeFalsy()
    expect(isValidHost('wwdad.*.*')).toBeTruthy()
})

test("url", () => {
    expect(extractHostname('https://www.baidu.com?1231=123')).toEqual({ host: 'www.baidu.com', protocol: 'https' })
    expect(extractHostname('http://localhost:8087?1231=123')).toEqual({ host: 'localhost:8087', protocol: 'http' })
    expect(extractHostname('http://localhost:8087/')).toEqual({ host: 'localhost:8087', protocol: 'http' })
    expect(extractHostname('http://localhost:8087/?123=123')).toEqual({ host: 'localhost:8087', protocol: 'http' })
    expect(extractHostname('localhost:8087/?123=123')).toEqual({ host: 'localhost:8087', protocol: '' })
})

test("homepage", () => {
    expect(isHomepage("http://baidu.com")).toBeTruthy()
    expect(isHomepage("http://baidu.com/")).toBeTruthy()
    expect(isHomepage("https://baidu.com/")).toBeTruthy()
    expect(isHomepage("baidu.com/")).toBeTruthy()

    expect(isHomepage("baidu.com/a")).toBeFalsy()
    expect(isHomepage("https://baidu.com/a")).toBeFalsy()
    expect(isHomepage("https://baidu.com/a?a=2")).toBeFalsy()
    expect(isHomepage("https://baidu.com?a=2")).toBeFalsy()
})