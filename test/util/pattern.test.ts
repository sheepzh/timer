import { extractHostname, isBrowserUrl, isIpAndPort, isValidMergeOriginHost } from "../../src/util/pattern"

test('browser url', () => {
    // chrome
    expect(isBrowserUrl('chrome://settings/')).toBeTruthy()
    expect(isBrowserUrl('chrome-extension://hkjmfadlepammjmjiihpongliebpcnba/static/app.html#/data/report')).toBeTruthy()
    // firefox
    expect(isBrowserUrl('about:addons')).toBeTruthy()
    // edge
    expect(isBrowserUrl('edge://extensions/')).toBeTruthy()
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

test('merge domain origin', () => {
    expect(isValidMergeOriginHost('wwdad.basd.com.111:12345')).toBeTruthy()
    expect(isValidMergeOriginHost('wwdad.basd.com.a111a:12345')).toBeTruthy()
    expect(isValidMergeOriginHost('wwdad.basd.**:12345')).toBeFalsy()
    expect(isValidMergeOriginHost('wwdad.basd.**:65536')).toBeFalsy()
    expect(isValidMergeOriginHost('wwdad.basd.*.*')).toBeTruthy()
    expect(isValidMergeOriginHost('wwdad.basd..*')).toBeFalsy()
    expect(isValidMergeOriginHost('wwdad*.*')).toBeFalsy()
    expect(isValidMergeOriginHost('wwdad.*.*')).toBeTruthy()
})

test("url", () => {
    expect(extractHostname('https://www.baidu.com?1231=123')).toEqual('www.baidu.com')
})